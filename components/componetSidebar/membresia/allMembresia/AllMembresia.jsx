import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import db from '@/app/Firebase-conexion/credenciales';
import './style.css'; // Asegúrate de importar el archivo CSS con los estilos

const AllMembresia = () => {
  const [membresias, setMembresias] = useState([]);
  const [permisosFiltrados, setPermisosFiltrados] = useState([]);

  useEffect(() => {
    fetchMembresias();
  }, []);

  const fetchMembresias = async () => {
    try {
      const membresiasCollection = collection(db, 'addMembresia');
      const membresiasSnapshot = await getDocs(membresiasCollection);
      const membresiasList = membresiasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembresias(membresiasList);
      setPermisosFiltrados(membresiasList); // Inicialmente, mostrar todas las membresías
    } catch (error) {
      console.error("Error fetching membresias:", error);
    }
  };

  const handleDeleteMembresia = async (id) => {
    try {
      await deleteDoc(doc(db, 'addMembresia', id));
      fetchMembresias();
    } catch (error) {
      console.error("Error deleting membresia:", error);
    }
  };

  const handleToggleEstado = async (id, estado) => {
    try {
      await updateDoc(doc(db, 'addMembresia', id), {
        estado: estado === 'activa' ? 'inactiva' : 'activa'
      });
      fetchMembresias();
    } catch (error) {
      console.error("Error toggling estado:", error);
    }
  };

  const handleFiltrarPermisos = (cantidad) => {
    if (cantidad === 'todos') {
      setPermisosFiltrados(membresias); // Mostrar todas las membresías
    } else {
      const membresiasFiltradas = membresias.filter(membresia => membresia.Permisos === cantidad);
      setPermisosFiltrados(membresiasFiltradas);
    }
  };

  return (
    <div className="container">
      <h1>Membresías</h1>
      
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Permisos</th>
              <th>Duracion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {permisosFiltrados.map(membresia => (
              <tr key={membresia.id}>
                <td>{membresia.Nombre}</td>
                <td>{membresia.Descripcion}</td>
                <td>{membresia.Precio}</td>
                <td>{membresia.Permisos}</td>
                <td>{membresia.Duracion}</td>
                <td>
                  <button onClick={() => handleToggleEstado(membresia.id, membresia.estado)}>
                    {membresia.estado === 'activa' ? 'Desactivar' : 'Activar'}
                  </button>
                  <button onClick={() => handleDeleteMembresia(membresia.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllMembresia;
