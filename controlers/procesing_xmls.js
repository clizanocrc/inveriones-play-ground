
const fs = require('fs');
const XLSX = require('xlsx');
const { pathFile} = require("../helpers/paths");
const { getCurrentDateString} = require("../helpers/dates");
const {getFiles} = require("../helpers/getFiles");
const {extractHeader} = require("../helpers/extractHeader");
const {convertJsonToXlsx} = require("./json_to_xlsx")
const {coorsdb} = require("../config/configBCR");
const {sendMail} = require("./email");
const {deleteFileSync} = require("./deleteFile");

const regexCodes = /\b[A-Z0-9]{10,12}\b/;
const regexEmit = /Emisor:/;
const regexAccount = /Código de Cuenta:/;
const regexGroup = /(?=.*Moneda:)(?=.*\b( - Participaciones| - Bonos Tasas Fijas| - Acciones)\b)/;


//COMMENT : Convertir archivo XLSX a JSON, probando todo
const xlsx_To_Json  = async () => {
    const fileResult =`Inversiones_${getCurrentDateString()}` 
    const jsonPath = pathFile("JSON",  `${fileResult}.json`);
    try {
        // Verifica Archivos en la Carpeta
        const files = await getFiles("XLSX")
        let datos = []
        // Ciclo para cada uno de los archivos
        for (const element of files) {
            const elementosNombre = element.split(".")
            let Origen = `${elementosNombre[0]}`            
            const xlsxPath = pathFile("XLSX", element);
            console.log("Procesando archivo: ", Origen);
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
            let dataTmp = {}

            // Recorrer las filas y celdas y almacenar los datos en el arreglo
            jsonSheet.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    let inter = cell.replace(/[,\)]/g, "")
                                    .replace("(", "-")
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
            const range = orderData
            //Obtiene las coordenadas de los datos que cumplan con los requisitos
            const coors = range.filter(item => 
                regexCodes.test(item.Value) || 
                regexEmit.test(item.Value) || 
                regexGroup.test(item.Value) ||
                regexAccount.test(item.Value))
            //Extrae los datos que coincidan con las coordenadas seleccionadas
            coors.forEach(item => {
                    extraction = range.filter(item2 => 
                        (item2.Lin === item.Lin  && item2.Col === coorsdb[0].datacolIsin) ||
                        (item2.Lin === item.Lin && item2.Col === coorsdb[0].datacolInteres) ||
                        (item2.Lin === item.Lin && item2.Col === coorsdb[0].datacolValor) ||
                        (item2.Lin === item.Lin && item2.Col === coorsdb[0].datacolCuenta) 
                    )
                    procesingData.push(extraction)
                }
            )
            
            //Aplanar el arreglo
            const flatProcesingData = procesingData.flat()
            //Captura los encabezados
            const headerTMP = extractHeader(orderData) 
            //Evalúa si el encabezaedo del archivo es válido
            if(headerTMP.xok) {
                const header = headerTMP.header
                if (header.length < 3) {
                    throw new Error("Header no contiene los elementos esperados.");
                }            
                const  [{ idPuestoBolsa }, { Fecha }, { Cliente } ]= header
                //Armar la data final
                let Isin = "Sin ISIN"
                let Intereses = 0
                let Valor = 0
                let Emisor = "Sin Emisor"
                let Operacion = "Sin Operacion"
                let Grupo = "Sin Grupo"
                flatProcesingData.map(item2 => {
                    if (regexEmit.test(item2.Value)){
                        const descomp = item2.Value.split(":")
                        Emisor = descomp[1].trim()
                    } else if ( regexAccount.test(item2.Value) ) {
                        const OperacionLocate = flatProcesingData.filter(item3 =>
                            item3.Col === coorsdb[0].datacolCuenta && 
                            item3.Lin === item2.Lin
                        )
                        Operacion = OperacionLocate[0].Value
                    } else if( regexGroup.test(item2.Value) ){
                        const descomp = item2.Value.split("-")
                        Grupo = descomp[1].trim()
                    } else {
                        if (item2.Col === coorsdb[0].datacolIsin) {Isin = item2.Value}
                        if (item2.Col === coorsdb[0].datacolInteres) {Intereses = parseFloat(item2.Value)}
                        if (item2.Col === coorsdb[0].datacolValor) {
                            Valor = parseFloat(item2.Value)
                            //Verificar la integridad de los datos
                            if (regexCodes.test(Isin)) {
                                datos.push({
                                    Origen,
                                    idPuestoBolsa,
                                    Grupo,
                                    Operacion,
                                    Cliente,
                                    Fecha,
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
                    }
                })
            } else {
                console.log(headerTMP.msg, " ", Origen);
            }
            
        };
        // Escribir los datos en un archivo JSON
        await fs.writeFileSync(jsonPath, JSON.stringify(datos, null, 2), 'utf-8');
        await convertJsonToXlsx(datos, fileResult)
        await sendMail()
        const filesDelete = await getFiles("XLSX")
        for (const file of filesDelete) {
            const deleteFilexl = await deleteFileSync("XLSX" , file)
            console.log(deleteFilexl.msg);
        }
        const deleteFile = await deleteFileSync("JSON" , `${fileResult}.json`)
        console.log(deleteFile.msg);
        return {
            "ok" : true,
            "msg" : "Terminado",
            "registros" : datos.length,
            data: datos
        };

    } catch (error) {
        console.log(error);
        return {
            "ok" : false,
            "msg" : "Error al pocesar el Excel a Json",
            "registros" : 0,
            data: error
        };
    }
    

}


//COMMENT : Exportaciones finales
module.exports = {
    xlsx_To_Json
    };

