const fs = require('fs');
const path = require("path");
const {pathFiles} = require("./paths")

// Función para obtener nombres de archivos en una carpeta
const  getFiles = (type) => {
    return new Promise((resolve, reject) => {
        fs.readdir(pathFiles(type), (err, files) => {
            if (err) {
                return reject(err);
            }
            
            // Filtrar solo los archivos (no directorios)
            const fileNames = files.filter(file => {
                const filePath = path.join(pathFiles(type), file);
                return fs.statSync(filePath).isFile();
            });

            resolve(fileNames);
        });
    });
}


module.exports = {
    getFiles
}


