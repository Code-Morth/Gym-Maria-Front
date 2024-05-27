import React, { useState } from 'react';
import  db  from '@/app/Firebase-conexion/credenciales';
import { collection, addDoc } from 'firebase/firestore';
import './style.css';

const AddUsuarios = () => {
  const [formData, setFormData] = useState({
    username: '',
    nombre_completo: '',
    p_apellido: '',
    s_apellido: '',
    email: '',
    fecha_inicio: '',
    fecha_final: '',
    horario_entrada: '',
    horario_salida: '',
    ci: '',
    direccion: '',
    contrasena: '',
    sueldo: '',
    rol: 'Trabajador'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'usuarios'), formData);
      alert('Usuario agregado exitosamente');
      clearForm();
    } catch (error) {
      console.error('Error al agregar el usuario: ', error);
      alert('Error al agregar el usuario: ' + error.message);
    }
  };

  const clearForm = () => {
    setFormData({
      username: '',
      nombre_completo: '',
      p_apellido: '',
      s_apellido: '',
      email: '',
      fecha_inicio: '',
      fecha_final: '',
      horario_entrada: '',
      horario_salida: '',
      ci: '',
      direccion: '',
      contrasena: '',
      sueldo: '',
      rol: 'Trabajador'
    });
  };

  return (
    <div>
      <h1>Agregar Usuario</h1>
      <form onSubmit={handleSubmit} className="form-container">
        {Object.keys(formData).map((key) => (
          <div key={key} className="form-group">
            <label htmlFor={key}>{key.replace('_', ' ')}</label>
            {key !== 'rol' ? (
              <input
                type={getFieldType(key)}
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                className="form-input"
              />
            ) : (
              <select
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="Administrador">Administrador</option>
                <option value="Trabajador">Trabajador</option>
              </select>
            )}
          </div>
        ))}
        <div className="form-actions">
          <button type="submit" className="submit-button">Agregar Usuario</button>
        </div>
      </form>
    </div>
  );
};

const getFieldType = (key) => {
  if (key === 'fecha_inicio' || key === 'fecha_final') return 'date';
  if (key === 'horario_entrada' || key === 'horario_salida') return 'time';
  if (key === 'email') return 'email';
  if (key === 'contrasena') return 'password';
  if (key === 'sueldo') return 'number';
  return 'text';
};

export default AddUsuarios;
