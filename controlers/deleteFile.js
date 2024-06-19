

const fs = require('fs').promises;
const {pathFile} =  require("../helpers/paths.js")

// Función para eliminar un archivo de manera síncrona
const deleteFileSync = async  (root, fileName) => {
    const filePath = pathFile(root, `/${fileName}`);
  try {
    await  fs.unlink(filePath);
    return {
        xok : true,
        msg: `Archivo eliminado: ${fileName}`
    }

  } catch (err) {
    console.log(err);
    return {
        xok : false,
        msg: `Error al eliminar el archivo: ${fileName}`
    }    
  }
};

module.exports = {
    deleteFileSync
}