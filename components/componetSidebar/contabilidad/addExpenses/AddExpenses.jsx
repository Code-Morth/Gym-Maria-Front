import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import db from '@/app/Firebase-conexion/credenciales';
import './style.css'; // Importa tu archivo CSS

const AddExpenses = () => {
  const [descripcion, setDescripcion] = useState('');
  const [cantidad, setCantidad] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'addGastos'), {
        descripcion_gastos: descripcion,
        cantidad_gastos: cantidad,
        fecha_gastos: serverTimestamp() // Genera la fecha automáticamente en el servidor
      });
      console.log('Gasto registrado con ID: ', docRef.id);
      // Limpia los campos después de registrar el gasto
      setDescripcion('');
      setCantidad('');
      // Muestra un alert de "Gasto guardado"
      alert('Gasto guardado');
    } catch (error) {
      console.error('Error al agregar el gasto: ', error);
    }
  };

  return (
    <div className="add-expenses-container">
      <h2>Registrar Gastos</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <input
            type="text"
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cantidad">Cantidad:</label>
          <input
            type="number"
            id="cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-save">Guardar Gasto</button>
      </form>
    </div>
  );
};

export default AddExpenses;
