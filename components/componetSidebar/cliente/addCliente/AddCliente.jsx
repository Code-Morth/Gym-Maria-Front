import React, { useState, useEffect } from 'react';
import db from '@/app/Firebase-conexion/credenciales';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import './style.css';
import Qr from './qr/Qr';

const AddCliente = () => {
  const [cliente, setCliente] = useState({
    nombre: '',
    p_apellido: '',
    s_apellido: '',
    email: '',
    membresia: '',
    telefono: '',
    direccion: ''
  });
  const [membresiasActivasOptions, setMembresiasActivasOptions] = useState([]);
  const [showQr, setShowQr] = useState(false);
  
  useEffect(() => {
    obtenerMembresiasActivas();
  }, []);

  const obtenerMembresiasActivas = async () => {
    try {
      const membresiasCollection = collection(db, 'addMembresia');
      const q = query(membresiasCollection, where('estado', '==', 'activa'));
      const membresiasSnapshot = await getDocs(q);
      const membresiasList = membresiasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembresiasActivasOptions(membresiasList);
    } catch (error) {
      console.error("Error obteniendo membresías activas:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const id = uuidv4();
      const fecha_registro = new Date().toISOString();
      const clientesCollection = collection(db, 'clientes');
  
      // Obtener el nombre de la membresía seleccionada
      const nombreMembresia = membresiasActivasOptions.find(option => option.id === cliente.membresia)?.Nombre || '';
  
      // Agregar el cliente con el nombre de la membresía 
      await addDoc(clientesCollection, {
        id,
        ...cliente,
        fecha_registro,
        membresia: nombreMembresia // Almacena el nombre de la membresía 
      });
      
      alert('Cliente registrado exitosamente!');
      setShowQr(true);
    } catch (error) {
      console.error('Error al registrar el cliente: ', error);
    }
  };

  return (
    <div>
      <h2>Registro de Cliente</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input type="text" name="nombre" value={cliente.nombre} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="p_apellido">Primer Apellido</label>
            <input type="text" name="p_apellido" value={cliente.p_apellido} onChange={handleChange} className="form-input" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="s_apellido">Segundo Apellido</label>
            <input type="text" name="s_apellido" value={cliente.s_apellido} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={cliente.email} onChange={handleChange} className="form-input" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input type="tel" name="telefono" value={cliente.telefono} onChange={handleChange} className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <input type="text" name="direccion" value={cliente.direccion} onChange={handleChange} className="form-input" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="membresia">Membresía</label>
            {membresiasActivasOptions.length > 0 ? (
              <select name="membresia" value={cliente.membresia} onChange={handleChange} className="form-select">
                <option value="">Seleccionar membresía</option>
                {membresiasActivasOptions.map(membresia => (
                  <option key={membresia.id} value={membresia.id}>
                    {membresia.Nombre} - {membresia.Descripcion}
                  </option>
                ))}
              </select>
            ) : (
              <input type="text" name="membresia" value={cliente.membresia} onChange={handleChange} className="form-input" />
            )}
          </div>
        </div>
        <button type="submit" className="submit-button">Registrar Cliente</button>
      </form>
      {showQr && <Qr cliente={cliente} />} {/* Mostrar el código QR si showQr es verdadero */}
    </div>
  );
};

export default AddCliente;
