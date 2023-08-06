import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { TELEGRAM_BOT_TOKEN } from './constants.mjs';
import { getSisfohDataByDni } from './scrapping.mjs';

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
bot.start((ctx) => ctx.reply('Bienvenido a Mis Consulta de SISFOH'));
bot.help((ctx) => ctx.replyWithHTML(`Para consultar información de SISFOH ingrese <code> /sisfoh <b>DNI</b> </code>`));
bot.command('sisfoh', async (ctx) => {
    try{

        console.log('contexto ',ctx)
        const text=ctx.update.message.text;
        const args=text.split(' ');
        if(args.length!==2){
            return ctx.reply('Ingrese un numero de DNI valido');
        }
        const dni=args[1];
        if(dni.length!==8){
            return ctx.reply('El número de DNI debe ser de 8 dígitos');
        }
        ctx.reply('Consultando datos...');
        const data=await getSisfohDataByDni(dni)
        if(!data){
            return ctx.reply('No se encontró información para ese DNI');
        }
        let message = `
        ✅ <b>Apellido Paterno:</b> ${data.apellidoPaterno}
    
    ✅ <b>Apellido Materno:</b> ${data.apellidoMaterno}
    
    ✅ <b>Nombre:</b> ${data.nombres}
    
    ✅ <b>DNI:</b> ${dni}
    
    ✅ <b>Fecha Vigencia Inicial:</b> ${data.fechaVigenciaInicial}
    
    ✅ <b>Fecha Vigencia Final:</b> ${data.fechaVigenciaFinal}
    
    ✅ <b>Estado Vigencia:</b> ${data.estadoVigencia}
      
    ✅ <b>Clasificación Socioeconómica:</b> ${data.clasificacionSocioeconomica}
    
    ✅ <b>Familiares:</b>
    <b> DNI || Apellido Paterno || Apellido Materno || Nombres || Fecha Nacimiento </b>
    ${
        data.familiares.map((val)=>(`📌 ${val.dni} <b>||</b> ${val.apellidoPaterno} <b>||</b> ${val.apellidoMaterno} <b>||</b> ${val.nombres} <b>||</b> ${val.fechaNacimiento} `)).join('\n')
    }`
        return ctx.replyWithHTML(message);
    }catch(e){
        console.log('error en el comando sisfoh',e)
        ctx.reply('Servicio no disponible por el momento, consultar con el administrador.');
    }
  // Explicit usage
 //await ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  //await ctx.leaveChat();
});
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));