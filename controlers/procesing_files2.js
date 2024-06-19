const {extractHeader} = require("../helpers/extractHeader");
const {extractElements} = require("../helpers/extractElements");
const {configDataBCR} = require("../config/configBCR");
const fs = require('fs');
const pdf = require('pdf-parse');
const pdf2table = require('pdf2table');
const XLSX = require('xlsx');
const regexCodes = /\b[A-Z0-9]{10,12}\b/;
const regexTransmitter = /Emisor:/;

//COMMENT : Convertir archivo PDF a XLSX

const pdf_To_Xlsx = async (pdfName, xlsxName) => {
    const pdfPath = pathFile("PDF", pdfName);
    const xlsxPath = pathFile("XLSX", xlsxName);

    // Leer el archivo PDF
    let dataBuffer = fs.readFileSync(pdfPath);

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

    try {
        // Usar pdf-parse para leer el PDF
        await pdf(dataBuffer);

        // Usar pdf2table para extraer tablas del texto del PDF
        const rows = await parseTable(dataBuffer);

        // Convertir las filas extraídas a una hoja de cálculo
        await convertArrayToSheet(rows);

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

//COMMENT : Convertir archivo XLSX a TXT
const xlsx_To_Txt  = async (xlsxName, txtName) => {

    const xlsxPath = pathFile("XLSX", xlsxName);
    const txtPath = pathFile("TXT", txtName);

    try {
        // Leer el archivo Excel
        const workbook = await XLSX.readFile(xlsxPath);

        // Obtener el nombre de la primera hoja
        const sheetName = await workbook.SheetNames[0];

        // Obtener la primera hoja
        const sheet = await workbook.Sheets[sheetName];

        // Convertir la hoja en un arreglo de objetos
        const jsonSheet = await XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Crear un flujo de escritura para el archivo de texto
        const writeStream = await fs.createWriteStream(txtPath);

        // Recorrer las filas y celdas y escribirlas en el archivo de texto
        jsonSheet.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellValue = cell || '';
                let inter = cellValue.replace(/[,\)]/g, "")
                                    .replace("(", "-")
                                    .replace(".", ",")
                                    .trim();
                writeStream.write(`${rowIndex }:${colIndex }|${inter}\n`);
            });
        });

        // Cerrar el flujo de escritura
        await writeStream.end();
        return {
            "ok" : true,
            "msg" : "Terminado Excel a TXT",
        };

    } catch (error) {
        return {
            "ok" : false,
            "msg" : "Error al procesor el Excel a TXT",
            error
        };
    }

}

//COMMENT : Convertir archivo XLSX a JSON
const xlsx_To_Json  = async (xlsxName, jsonName) => {
    const xlsxPath = pathFile("XLSX", xlsxName);
    const jsonPath = pathFile("JSON", jsonName);
    try {
        // Leer el archivo Excel
        const workbook = await XLSX.readFile(xlsxPath);
        // Obtener el nombre de la primera hoja
        const sheetName = await workbook.SheetNames[0];
        // Obtener la primera hoja
        const sheet = await workbook.Sheets[sheetName];
        // Convertir la hoja en un arreglo de objetos
        const jsonSheet = await XLSX.utils.sheet_to_json(sheet, { header: 1 });
        // Crear un arreglo para almacenar los datos
        let data = [];
        let dataEnd = [];
        let dataTmp = {}


        // Recorrer las filas y celdas y almacenar los datos en el arreglo
        jsonSheet.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                let inter = cell.replace(/[,\)]/g, "")
                                .replace("(", "-")
                                // .replace(".", ",")
                                .trim();
                dataTmp = {
                    "Lin" : `${rowIndex }`,
                    "Col" : `${colIndex }`,
                    "Value" : inter || "Sin Datos",
                }
                data.push(dataTmp);
            });
        });

        
        // Ordenar el array por el valor Lin, para recorrerlo ordenado por fila 
        const orderData = data.sort((a, b) => {
            return parseInt(a.Lin) - parseInt(b.Lin);
        });

        //Procesar el JSON solo la data
        let procesingData = []
        let extraction = []
        
        configDataBCR.forEach(itemPathern => {
            //Extraer las secciones según el archivo de configuración
            const range = extractElements(orderData, itemPathern.start, itemPathern.end, itemPathern.section)
            //Extraer las coordenadas (Filas) donde se encuentran los elementos de interes según las
            //expresiones regulares definidas
            const coors = range.filter(item => regexCodes.test(item.Value) || regexTransmitter.test(item.Value))
            
            //Recorrer las coordenadas para capturar los elementos de la sección extraída anteriormente
            coors.forEach(item => {
                    extraction = range.filter(item2 => 
                        (item2.Lin === item.Lin  && item2.Col === "0") ||
                        (item2.Lin === item.Lin && item2.Col === itemPathern.datacolInteres) ||
                        (item2.Lin === item.Lin && item2.Col === itemPathern.datacolValor) 
                    )
                    procesingData.push(extraction)
                }
            )
            
        });
        //Aplanar el arreglo
        const flatProcesingData = procesingData.flat()
        //Captura los encabezados
        const header = extractHeader(orderData) 
        const  [{ idPuestoBolsa }, { Fecha }, { Operacion }, { Cliente } ]= header
        //Armar la data final
        let Isin = ""
        let Intereses = 0
        let Valor = 0
        let Emisor = ""
        flatProcesingData.map(item2 => {
            if (regexTransmitter.test(item2.Value)){
                Emisor = item2.Value
            } else {
                if (item2.Col === "0") {Isin = item2.Value}
                if (item2.Col === "11") {Intereses = item2.Value}
                if (item2.Col === "13") {
                    Valor = item2.Value
                    dataEnd.push({
                        PuestoBolsa: idPuestoBolsa,
                        Operacion: Operacion,
                        Cliente: Cliente,
                        Fecha: Fecha,
                        Grupo : item2.Header,
                        Emisor,
                        Isin ,
                        Intereses ,
                        Valor ,
                    })
                    Isin = ""
                    Intereses = 0
                    Valor = 0
                }
            }
        })
        // Escribir los datos en un archivo JSON
        await fs.writeFileSync(jsonPath, JSON.stringify(dataEnd, null, 2), 'utf-8');

        return {
            "ok" : true,
            "msg" : "Terminado",
        };

    } catch (error) {
        console.log(error);
        return {
            "ok" : false,
            "msg" : "Error al pocesar el Excel a Json",
            error
        };
    }

}



//COMMENT : Exportaciones finales
module.exports = {
    pdf_To_Xlsx,
    xlsx_To_Json,
    xlsx_To_Txt,
    };

