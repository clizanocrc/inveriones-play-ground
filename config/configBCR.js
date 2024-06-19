
//#region Primera Etapa

const configExcludBCR = {
    omisiones : [
        {
            encabezados : {
                start : "BCR VALORES PUESTO DE BOLSA",
                end : "MARIA EUGENIA ACUNA DELGADO"
            }
        },
        {
            piepagina: {
                start : "Usuario: BCR\\AccesoSvr_SIBNet_Doc",
                end : "San José Pavas 300 mts al Sur de Plaza Mayor Torre Cordillera Piso 12"
            }
        },
        {
            flotantes: [{
                coors : {
                    start : "Estados *",
                    end : "Valores pignorados por solicitud judicial o para garantizar un crédito -pignoración por embargo judicial o pignoración por garantía crediticia"
                },
                coors : {
                    start : "Correo electrónico:",
                    end : "ASESORIA"
                }
            }]
        },
        {
            secciones: [{
                coors : {
                    start : "RESUMEN VALORADO DE LA CARTERA DEL INVERSIONISTA",
                    end : "-2 Monto invertido en Reporto más el margen acumulado a la fecha"
                },
                coors : {
                    start : "MOVIMIENTOS DEL MES VALORES ICLEA",
                    end : "------------------ Última línea ------------------"
                }
            }]
        }        
    ],

}

const configEncabezadoBCR = [
        {
            section : "idPuestoBolsa",
            Lin : "0",
            Col : "0"
        },
        {
            section : "Fecha",
            Lin : "3",
            Col : "0"
        },
        {
            section : "Cliente",
            Lin : "5",
            Col : "1"
        }
        
    ]

    const configDataBCR = [
        {
            section: "participaciones",
            start: "Moneda: USD   Dólar Americano - Participaciones",
            end: "Total USD   - Participaciones",
            datastart: "ISIN",
            dataend: "Total por emisor",
            datacolIsin: "0",
            datacolInteres: "11",
            datacolValor: "13"
        },    
        {
            section: "bonos",
            start: "Moneda: USD   Dólar Americano - Bonos Tasas Fijas",
            end: "Total USD   - Bonos Tasas Fijas",
            datastart: "ISIN",
            dataend: "Total por emisor",
            datacolIsin: "0",
            datacolInteres: "11",
            datacolValor: "13"
        },
        {
            section: "acciones",
            start: "Moneda: USD   Dólar Americano - Acciones",
            end: "Total USD   - Acciones",
            datastart: "ISIN",
            dataend: "Total por emisor",
            datacolIsin: "0",
            datacolInteres: "11",
            datacolValor: "13"
        },

    ];

//#endregion Primera Etapa


//#region Segunda Etapa
    const rango = [
        {
            start: "0",
            end: "Estados *",
        }
    ]
    const coorsdb = [
        {
            datacolIsin: "0",
            datacolInteres: "11",
            datacolValor: "13",
            datacolCuenta: "1"
        }
    ]

    const keys = [
        "CRBCRSFL0011",
        "CRBCRSFL0029",
        "CRFGSFIL0014",
        "CRFGSFIL0030",
        "CRPSFI0L0076",
        "CRVISTAL0014",
        "CRPRSFIL0019",
        "CRPRSFIH0023",
        "CRG0000B20J9",
        "US0378331005",
        "US05964H1059",
        "USP3699PGK77",
        "USP3699PGH49",
        "PAL3520618W1",
        "PAL352061MD5",
        "CRPSFI0L0076",
        "CRG0000B20J9",
        "USP3579EAY34",
        "USU0029TAA89",
    ]



//#endregion Segunda Etapa

module.exports = {
    configExcludBCR,
    configEncabezadoBCR,
    configDataBCR,
    rango,
    coorsdb,
    keys
}