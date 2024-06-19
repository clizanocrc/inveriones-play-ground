const {configEncabezadoBCR} = require("../config/configBCR");


const extractHeader = (array) => {

    try {
        let header = []
        configEncabezadoBCR.forEach(element => {
            let valor
            const locate = array.filter(item => 
                item.Lin === element.Lin &&
                item.Col === element.Col
            )
            if (locate) {
                if ( element.section === "Fecha") {
                    fechas = locate[0].Value.split(" al ")
                    valor = fechas[1].trim()
                } else {
                    valor = locate[0].Value  || ""
                }
                
            }
            header.push(   
                            {[element.section] : valor,}
                        )
        });
    
    
        return {
            xok : true,
            msg : "Archivo válido",
            header
        }
        
    } catch (error) {
        return {
            xok : false,
            msg : "Archivo inválido",
        }        
    }

}

module.exports = {
    extractHeader
}