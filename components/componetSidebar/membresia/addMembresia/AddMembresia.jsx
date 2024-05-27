import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import db from '@/app/Firebase-conexion/credenciales';
import './style.css'; // Asegúrate de importar el archivo CSS con los estilos

const AddMembresia = () => {
  const [formData, setFormData] = useState({
    Nombre: '',
    Descripcion: '',
    Precio: '',
    Duracion: '',
    Permisos: '', // Nuevo campo para permisos
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'addMembresia'), formData);
      alert('Membresía agregada exitosamente');
      clearForm();
    } catch (error) {
      console.error('Error al agregar la membresía: ', error);
      alert('Error al agregar la membresía: ' + error.message);
    }
  };

  const clearForm = () => {
    setFormData({
      Nombre: '',
      Descripcion: '',
      Precio: '',
      Duracion: '',
      Permisos: '', // Limpiar también el campo de permisos
    });
  };

  return (
    <div>
      <h1>Agregar Membresía</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {Object.keys(formData).map((key) => (
          <div key={key} className="form-group">
            <label htmlFor={key} className="form-label">{key.replace('_', ' ')}</label>
            <input
              type={getFieldType(key)}
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" className="submit-button">Agregar Membresía</button>
        </div>
      </form>
    </div>
  );
};

const getFieldType = (key) => {
  if (key === 'Precio' || key === 'Duracion' || key === 'Permisos') return 'number';
  return 'text';
};

export default AddMembresia;
