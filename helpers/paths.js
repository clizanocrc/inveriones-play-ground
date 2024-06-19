const path = require("path");

const pathFileDefault = () => 
  path.join(__dirname, "../uploads/", "tipeFile", "file.pdf");

const pathFile = (tipeFile, name) =>
  path.join(__dirname, "../uploads/", tipeFile, name);


const pathFiles = (tipeFile) => path.join(__dirname , "../uploads/", tipeFile)

module.exports = {
  pathFileDefault,
  pathFile,
  pathFiles,
};
