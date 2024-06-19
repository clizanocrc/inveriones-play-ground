const nodemailer = require('nodemailer');
const path = require('path');


//COMMENT : Configurar el transporte
const transporter = nodemailer.createTransport({
    host: 'mail.server272.com',
    port: 465, // Ajusta el puerto si es diferente
    secure: true, // true para port 465, false para otros puertos
    auth: {
      user: 'desarrollo@sacipcr.com', // Tu usuario de correo
      pass: 'mafelica.2326' // Tu contraseña de correo
    }
  });

  
  //COMMENT : Opciones del Email a enviar, esto se debe recibir en un objeto
  const mailOptions = {
    from: 'desarrollo@sacipcr.com',
    to: 'carlos.lizano@sacipcr.com',
    // to: 'kaycrc@gmail.com',
    subject: 'Envío de correo de prueba',
    text: 'Enviando correo de Prueba con archivos adjuntos',
    html: '<span>Enviando correo de Prueba con archivos adjuntos</span>\n <h2>Por Carlos Lizano</h2>',
    attachments: [
        {
          filename: 'Inversiones_2024_06_19.xlsx', // Nombre del archivo adjunto
          path: path.join(__dirname, '../uploads/resultsxlsx/Inversiones_2024_06_19.xlsx') // Ruta del archivo adjunto
        }     
    ]
  };

  

  //COMMENT : Enviar Correo
const sendMail  = async () => {
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(`Error al enviar el correo: ${error}`);
      }
      console.log(`Correo enviado: ${info.response}`);
    });
}

module.exports = {
    sendMail
}

  
