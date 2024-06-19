const { xlsx_To_Json} = require("./procesing_xmls");
const { pdf_To_Xlsx} = require("./procesing_pdf");


const serverStart  = async () => {
    console.log("Iniciando Proceso");
    const resultPdf = await pdf_To_Xlsx()
    console.log(resultPdf.msg);
    const resultJson = await xlsx_To_Json()
    console.log("Proceso ", resultJson.msg, "Registros Procesados: " + resultJson.registros );
}

module.exports = {
    serverStart
}
