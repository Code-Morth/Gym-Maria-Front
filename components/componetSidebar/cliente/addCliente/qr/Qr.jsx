import React from 'react';
import { QRCode } from 'react-qr-code';

const Qr = ({ cliente }) => {
  // Generar el texto del código QR basado en los datos del cliente
  const qrText = JSON.stringify(cliente);

  return (
    <div>
      <h2>Código QR</h2>
      <QRCode value={qrText} />
    </div>
  );
};

export default Qr;
