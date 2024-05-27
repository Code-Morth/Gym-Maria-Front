import React, { useState } from 'react';
import db from '@/app/Firebase-conexion/credenciales'; // Importa la instancia de Firebase Firestore
import { v4 as uuidv4 } from 'uuid'; // Importa la función uuidv4 para generar IDs únicos
import { collection, addDoc } from 'firebase/firestore';
import './style.css';

const AddProducto = () => {
  const [producto, setProducto] = useState({
    nombre_producto: '',
    stock: '',
    precio_unitario_venta: '',
    precio_de_compra: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const id = uuidv4();
      const fecha_ingreso = new Date().toISOString(); // Obtiene la fecha y hora actual en formato ISO

      // Referencia a la colección
      const productosCollection = collection(db, 'productos');

      // Guarda el producto en Firestore con el ID generado y la fecha de ingreso
      await addDoc(productosCollection, {
        id,
        ...producto,
        fecha_ingreso, // Añade el campo de fecha de ingreso
        nombre_usuario: 'Nombre del usuario' // Aquí puedes definir cómo obtener el nombre del usuario
      });

      alert('Producto registrado exitosamente!');
      
      setProducto({
        nombre_producto: '',
        stock: '',
        precio_unitario_venta: '',
        precio_de_compra: ''
      });
    } catch (error) {
      console.error('Error al registrar el producto: ', error);
    }
  };

  return (
    <div>
      <h2>Registro de Producto</h2>
      <form onSubmit={handleSubmit} className="form-container">
        {Object.keys(producto).map((key) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>{key.replace('_', ' ')}</label>
            <input type="text" name={key} value={producto[key]} onChange={handleChange} className="form-input" />
          </div>
        ))}
        <button type="submit" className="submit-button">Registrar Producto</button>
      </form>
    </div>
  );
};

export default AddProducto;
