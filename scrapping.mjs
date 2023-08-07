import { launch } from "puppeteer";
import { setUrlParams } from "./utils/setUrlParams.mjs";
export const getSisfohDataByDni=async (dni='')=>{
    try{

        // Launch the browser and open a new blank page
        const browser = await launch({
          headless:'new'
        });
        const page = await browser.newPage();
      
        // Navigate the page to a URL
        const curl=setUrlParams(dni)
        await page.goto(curl);
      
        // Set screen size
        await page.setViewport({width: 1080, height: 1500});
        // Type into search box
        //await page.type('.search-box__input', 'automate beyond recorder');
        const $tables=await page.$$('table');
        if(($tables.length<7)){
            console.log('no se encontraron las tablas necesarias')
            return null;
        }
       const $tableDatosBasicos=$tables[4]
       const $tableDatosFamiliares=$tables[8]
       const $tableDatosClasificacion=$tables[6]
       const [$trsDatosBasicos,$trsFamiliares,$trsDatosClasificacion]=await Promise.all([$tableDatosBasicos.$$('tr'),$tableDatosFamiliares.$$('tr'),$tableDatosClasificacion.$$('tr')])
       console.log(' table Datos Clasificacion ',$tableDatosBasicos)
        console.log(' table Datos Clasificacion string ',JSON.stringify($tableDatosBasicos))
       // GET APELLIDO PATERNO
        const $trApellidoPaterno=$trsDatosBasicos[4]
        const $tdsPaterno=await $trApellidoPaterno.$$('td')
        const apellidoPaterno = await $tdsPaterno[1].evaluate(node => node.textContent);
        console.log('apellidoPaterno ',apellidoPaterno)
        // !GET APELLIDO PATERNO
        // GET APELLIDO MATERNO
        const $trApellidoMaterno=$trsDatosBasicos[5]
        const $tdsMaterno=await $trApellidoMaterno.$$('td')
        const apellidoMaterno = await $tdsMaterno[1].evaluate(node => node.textContent);
        console.log('apellidoMaterno ',apellidoMaterno)
        
        // !GET APELLIDO MATERNO
        // GET NOMBRES
        const $trNombres=$trsDatosBasicos[7]
        const $tdsNombres=await $trNombres.$$('td')
        const nombres = await $tdsNombres[1].evaluate(node => node.textContent);
        console.log('nombres ',nombres)
        // !GET NOMBRES
        
        // FECHA VIGENCIA INICIAL 
        console.log(' table Datos Clasificacion ',$tableDatosClasificacion)
        console.log(' table Datos Clasificacion string ',JSON.stringify($tableDatosClasificacion))
        const $trFechaVigenciaInicial=$trsDatosClasificacion[1]
        const $tdsFechaVigenciaInicial = await $trFechaVigenciaInicial.$$('td')
        const fechaVigenciaInicial=await $tdsFechaVigenciaInicial[1].evaluate(node => node.textContent);
        console.log('fechaVigenciaInicial ',fechaVigenciaInicial)
        // !FECHA VIGENCIA INICIAL    
        // FECHA VIGENCIA FINAL
        
        const $trFechaVigenciaFinal=$trsDatosClasificacion[2]
        const $tdFechaVigenciaFinal = await $trFechaVigenciaFinal.$$('td')
        const fechaVigenciaFinal = await $tdFechaVigenciaFinal[1].evaluate(node => node.textContent);
        console.log('fechaVigenciaFinal ',fechaVigenciaFinal)
        // !FECHA VIGENCIA FINAL    
        // ESTADO VIGENCIA 
        const $trEstadoVigencia=$trsDatosClasificacion[3]
        const $tdEstadoVigencia = await $trEstadoVigencia.$$('td')
        const estadoVigencia = await $tdEstadoVigencia[1].evaluate(node => node.textContent);
        console.log('estadoVigencia ',estadoVigencia)
        // !ESTADO VIGENCIA    
        // CLASIFICACION SOCIOECONOMICA 
        const $trClasificacionSocioeconomica=$trsDatosClasificacion[4]
        const $tdClasificacionSocioeconomica = await $trClasificacionSocioeconomica.$$('td')
        const clasificacionSocioeconomica = await $tdClasificacionSocioeconomica[1].evaluate(node => node.textContent);
        console.log('clasificacionSocioeconomica ',clasificacionSocioeconomica)
        // !CLASIFICACION SOCIOECONOMICA
        // DATOS FAMILIARES
        console.log('trs familiares ',$trsFamiliares)
        if($trsFamiliares.length<3){
          return null
        }
        $trsFamiliares.splice(0, 2);
        console.log(' trs familiares ',$trsFamiliares)
        const familiares =await Promise.all($trsFamiliares.map(async (val)=>{
          const $columns=await val.$$('td')
          const [dni,apellidoPaterno,apellidoMaterno,nombres,fechaNacimiento]=await Promise.all([$columns[1].evaluate(node => node.textContent),
          $columns[2].evaluate(node => node.textContent),
          $columns[3].evaluate(node => node.textContent),
          $columns[5].evaluate(node => node.textContent),
          $columns[7].evaluate(node => node.textContent)
          ])
          console.log('dni ',dni)
          console.log('apellidoPaterno ',apellidoPaterno)
          console.log('apellidoMaterno ',apellidoMaterno)
          console.log('nombres ',nombres)
          console.log('fechaNacimiento ',fechaNacimiento)
          return {
              dni,
              apellidoMaterno,
              apellidoPaterno,
              nombres,
              fechaNacimiento
          }
        }))
        
        // !DATOS FAMILIARES
        
        await browser.close();
        return{
          apellidoPaterno,
          apellidoMaterno,
          nombres,
          fechaVigenciaInicial,
          fechaVigenciaFinal,
          estadoVigencia,
          clasificacionSocioeconomica,
          familiares
        }
    }catch(e){
        console.log('error ',e)
        return null
    }
}