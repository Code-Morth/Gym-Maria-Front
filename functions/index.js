const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = functions.config().sendgrid.apikey;

sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendWelcomeEmail = functions.firestore.document('clientes/{clienteId}')
    .onCreate((snap, context) => {
        const data = snap.data();
        const msg = {
            to: data.email,
            from: 'tucorreo@example.com',
            subject: 'Bienvenido al Gimnasio Xander',
            html: `<h1>Hola ${data.nombre}</h1>
                   <p>Con el código QR podrás tener acceso al gimnasio, solo escanéalo en recepción.</p>`,
        };
        return sgMail.send(msg).then(() => {
            console.log('Correo enviado exitosamente a:', data.email);
        }).catch(error => {
            console.error('Error al enviar el correo:', error);
        });
    });
