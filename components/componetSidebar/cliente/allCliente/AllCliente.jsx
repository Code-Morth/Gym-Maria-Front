import React, { useEffect, useState } from 'react';
import db from '@/app/Firebase-conexion/credenciales'; // Importa la instancia de Firebase Firestore
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './style.css';

const AllCliente = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCliente, setEditingCliente] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const clientesCollection = collection(db, 'clientes');
        const clientesSnapshot = await getDocs(clientesCollection);
        const clientesList = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClientes(clientesList);
      } catch (error) {
        console.error('Error al obtener los clientes: ', error);
      }
    };

    fetchClientes();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const isMembresiaExpirada = (cliente) => {
    const fechaRegistro = new Date(cliente.fecha_registro);
    const duracionMembresia = cliente.duracion; // Suponiendo que esto es la duración de la membresía en días
    const fechaVencimiento = new Date(fechaRegistro.getTime() + duracionMembresia * 24 * 60 * 60 * 1000); // Calcula la fecha de vencimiento sumando la duración en milisegundos
    const fechaActual = new Date();
    return fechaActual > fechaVencimiento; // Si la fecha actual es posterior a la fecha de vencimiento, la membresía ha expirado
  };

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'clientes', id));
      setClientes(clientes.filter(cliente => cliente.id !== id));
    } catch (error) {
      console.error('Error al eliminar el cliente: ', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'clientes', editingCliente.id), editingCliente);
      setClientes(clientes.map(cliente => (cliente.id === editingCliente.id ? editingCliente : cliente)));
      setEditingCliente(null);
    } catch (error) {
      console.error('Error al actualizar el cliente: ', error);
    }
  };

  return (
    <div className="table-container">
      <div>
        <h1>Clientes Activos</h1>
        <input
          type="text"
          placeholder="Buscar cliente"
          value={searchTerm}
          onChange={handleSearchChange}
          className="form-input"
          style={{ width: 'calc(80% - 16px)', marginBottom: '20px' }}
        />
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Primer Apellido</th>
              <th>Segundo Apellido</th>
              <th>Email</th>
              <th>Membresía</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Fecha de Registro</th>
              <th>Estado de Membresía</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.filter(cliente => !isMembresiaExpirada(cliente)).map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.primerApellido}</td>
                <td>{cliente.segundoApellido}</td>
                <td>{cliente.email}</td>
                <td>{cliente.membresia}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.direccion}</td>
                <td>{cliente.fecha_registro}</td>
                <td>Activo</td>
                <td>
                  <button onClick={() => handleEdit(cliente)}>Editar</button>
                  <button onClick={() => handleDelete(cliente.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h1>Clientes Expirados</h1>
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Primer Apellido</th>
              <th>Segundo Apellido</th>
              <th>Email</th>
              <th>Membresía</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Fecha de Registro</th>
              <th>Estado de Membresía</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.filter(cliente => isMembresiaExpirada(cliente)).map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.primerApellido}</td>
                <td>{cliente.segundoApellido}</td>
                <td>{cliente.email}</td>
                <td>{cliente.membresia}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.direccion}</td>
                <td>{cliente.fecha_registro}</td>
                <td>Expirado</td>
                <td>
                  <button onClick={() => handleEdit(cliente)}>Editar</button>
                  <button onClick={() => handleDelete(cliente.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllCliente;
