import { BASEPATH_API_SISFOH, PASSWORD_API, USER_API } from "../constants.mjs";

export const setUrlParams = (dni='', params={
    usuario:USER_API,
    password:PASSWORD_API,
    sw:'D',
    ubigeo:'120701'
}) => {
    const curl=`${BASEPATH_API_SISFOH}?txtusuario=${params.usuario}&txtcon=${params.password}&txttag=&txtnro_doc=${dni}&txtsw=${params.sw}&txtubigeo=${params.ubigeo}`
    return curl
}