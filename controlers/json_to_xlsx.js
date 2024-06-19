const XLSX = require('xlsx');
const { pathFile} = require("../helpers/paths");

const convertJsonToXlsx = async(data, fileName) => {
    
    outputFilePath = pathFile("resultsxlsx", `/${fileName}.xlsx`);

    // Crea un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();

    // Convierte los datos JSON a una hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Agrega la hoja de cálculo al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);

    // Escribe el libro de trabajo a un archivo
    await XLSX.writeFile(workbook, outputFilePath);

    console.log(`Archivo de resultados creado: ${fileName}`);
    };

module.exports = {
    convertJsonToXlsx
}