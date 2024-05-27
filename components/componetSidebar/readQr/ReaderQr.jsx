import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-scanner';
import db from '../../../src/app/Firebase-conexion/credenciales';
import { collection, getDocs, where, query } from 'firebase/firestore';

const ReaderQr = () => {
  const [delay, setDelay] = useState(100);
  const [result, setResult] = useState('No result');
  const [accessMessage, setAccessMessage] = useState('');

  const handleScan = async data => {
    if (data) {
      setResult(data.text || 'No result');
      if (data.text === 'No result') {
        setAccessMessage('Acceso denegado');
      } else {
        // Comparar los datos del código QR con los datos en la colección 'clientes'
        const clientesCollection = collection(db, 'clientes');
        const q = query(clientesCollection, where('nombre', '==', data.text)); // Suponiendo que estás comparando con el nombre del cliente
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setAccessMessage('Acceso permitido');
        } else {
          setAccessMessage('Acceso denegado');
        }
      }
    }
  };

  const handleError = err => {
    console.error(err);
  };

  // Esta función se ejecutará cada 5 segundos para restablecer el estado del resultado
  useEffect(() => {
    const timer = setTimeout(() => {
      setResult('No result');
    }, 3000); // Cambia 5000 a la cantidad de milisegundos que se dese para el intervalo de escaneo
    return () => clearTimeout(timer);
  }, [result]);

  const previewStyle = {
    height: 1000,
    width: 900,
  };

  return (
    <div>
      <QrReader
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
      <p>Resultado del escaneo: {result}</p>
      <p>{accessMessage}</p>
    </div>
  );
};

export default ReaderQr;
