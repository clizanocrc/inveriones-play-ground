const fs = require('fs');
const pdf = require('pdf-parse');
const pdf2table = require('pdf2table');
const XLSX = require('xlsx');

const {getFiles} = require("../helpers/getFiles");
const { pathFile} = require("../helpers/paths");

//COMMENT : Convertir archivo PDF a XLSX

const pdf_To_Xlsx = async () => {

    try {
        // Verifica Archivos en la Carpeta
        const files = await getFiles("PDF")
        for (const element of files) { 
            // Leer el archivo PDF
            const elementosNombre = element.split(".")
            nombre = `/${elementosNombre[0]}.XLSX`
            const xlsxPath = pathFile("XLSX", nombre)
            let dataBuffer = fs.readFileSync(pathFile("PDF", element));
    
            // Función para convertir una matriz de datos en una hoja de cálculo
            const convertArrayToSheet = async (data) => {
                const worksheet = XLSX.utils.aoa_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Tabla');
                await XLSX.writeFile(workbook, xlsxPath);
            };
    
            // Función para parsear PDF a tabla
            const parseTable = (dataBuffer) => {
                return new Promise((resolve, reject) => {
                    pdf2table.parse(dataBuffer, (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                });
            };
            // Usar pdf-parse para leer el PDF
            await pdf(dataBuffer);
            // Usar pdf2table para extraer tablas del texto del PDF
            const rows = await parseTable(dataBuffer);
            // Convertir las filas extraídas a una hoja de cálculo
            await convertArrayToSheet(rows);
        }
        return {
            "ok": true,
            "msg": "Terminado PDF a Excel"
        };

    } catch (error) {
        return {
            "ok": false,
            "msg": "Error al procesar el PDF a Excel",
            "error": error
        };
    }
};


//COMMENT : Exportaciones finales
module.exports = {
    pdf_To_Xlsx,
    };
