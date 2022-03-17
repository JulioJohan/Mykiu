//Importando dependencia para poder recibir email
import nodemailer from 'nodemailer'

//Datos para la confirmacion del registro
export const emailRegistro = async(datos) => {
//extrayendo llos datos
    const {email, nombre, token} = datos;
   //Obtenido de Mailtrap
    // TODO: Mover hacia las variables de entorno
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

   //   Informacion del Email

   const info  = await  transport.sendMail({
    //Informacion de quien lo envio   
    from:'"Mykiu -  Administrador de Proyecto" <cuentas@mykiu.com>',
       //Email del usuario
       to: email,
       subject: "Mykiu - Confirma tu cuenta",
       text: "Comprueba tu cuenta en Mykiu",
       html:`<p>Hola: ${nombre} Comprueba tu cuenta en Mykiu</p>
        <p>Tu cuenta ya casi esta lista, solo debes comprobarla en el siguiente enlace:
        <a href = "${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>       
       <p> Si tu no creaste esta cuente, puedes ignorar el mensaje </p>`
   })
}

//Datos para la confirmacion del registro
export const emailOlvidePassword = async(datos) => {
  //extrayendo llos datos
      const {email, nombre, token} = datos;
     //Obtenido de Mailtrap

      const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
        });
  
     //   Informacion del Email
  
     const info  = await  transport.sendMail({
      //Informacion de quien lo envio   
      from:'"Mykiu -  Administrador de Proyecto" <cuentas@mykiu.com>',
         //Email del usuario
         to: email,
         subject: "Mykiu - Restablece tu password en MyKiu",
         text: "Restablece tu password en MyKiu",
         html:`<p>Hola: ${nombre} has solicitado restablecer tu password en MyKiu </p>
          <p>Sigue el siguiente enlace para generar un nuevo password:
          <a href = "${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Password</a>       
         <p> Si tu no solicitaste este email, puedes ignorar el mensaje </p>
          `
     })
  }