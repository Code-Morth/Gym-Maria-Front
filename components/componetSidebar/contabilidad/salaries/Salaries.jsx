import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';
import db from '@/app/Firebase-conexion/credenciales';

const Salaries = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [sueldos, setSueldos] = useState([]);
  const [sueldosPagados, setSueldosPagados] = useState([]);

  useEffect(() => {
    fetchUsuarios();
    fetchSueldos();
    fetchSueldosPagados();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const usuariosCollection = collection(db, 'usuarios');
      const usuariosSnapshot = await getDocs(usuariosCollection);
      const usuariosList = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsuarios(usuariosList);
      // Guardar los datos de usuarios en la colección sueldos
      for (const usuario of usuariosList) {
        await setDoc(doc(db, 'sueldos', usuario.id), usuario);
      }
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    }
  };

  const fetchSueldos = async () => {
    try {
      const sueldosCollection = collection(db, 'sueldos');
      const sueldosSnapshot = await getDocs(sueldosCollection);
      const sueldosList = sueldosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSueldos(sueldosList);
    } catch (error) {
      console.error("Error fetching sueldos:", error);
    }
  };

  const fetchSueldosPagados = async () => {
    try {
      const sueldosPagadosCollection = collection(db, 'sueldos_pagados');
      const sueldosPagadosSnapshot = await getDocs(sueldosPagadosCollection);
      const sueldosPagadosList = sueldosPagadosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSueldosPagados(sueldosPagadosList);
    } catch (error) {
      console.error("Error fetching sueldos pagados:", error);
    }
  };

  const pagarSueldo = async (sueldo) => {
    const nombre_usuario_que_pagó = prompt("Ingrese su nombre:");

    if (!nombre_usuario_que_pagó) {
      alert("El nombre es requerido para registrar el pago.");
      return;
    }

    const sueldoPagado = {
      ...sueldo,
      nombre_usuario_que_pagó,
      estado: 'pagado',
    };

    try {
      await addDoc(collection(db, 'sueldos_pagados'), sueldoPagado);
      await deleteDoc(doc(db, 'sueldos', sueldo.id));
      fetchSueldos();
      fetchSueldosPagados();
    } catch (error) {
      console.error("Error processing pago:", error);
    }
  };

  return (
    <div>
      <h1>Sueldos</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Final</th>
            <th>CI</th>
            <th>Sueldo</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {sueldos.map(sueldo => (
            <tr key={sueldo.id}>
              <td>{sueldo.nombre_completo}</td>
              <td>{new Date(sueldo.fecha_inicio).toLocaleDateString()}</td>
              <td>{new Date(sueldo.fecha_final).toLocaleDateString()}</td>
              <td>{sueldo.ci}</td>
              <td>{sueldo.sueldo}</td>
              <td>
                <button onClick={() => pagarSueldo(sueldo)}>Pagar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Sueldos Pagados</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Final</th>
            <th>CI</th>
            <th>Sueldo</th>
            <th>Pagado por</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {sueldosPagados.map(sueldo => (
            <tr key={sueldo.id}>
              <td>{sueldo.nombre_completo}</td>
              <td>{new Date(sueldo.fecha_inicio).toLocaleDateString()}</td>
              <td>{new Date(sueldo.fecha_final).toLocaleDateString()}</td>
              <td>{sueldo.ci}</td>
              <td>{sueldo.sueldo}</td>
              <td>{sueldo.nombre_usuario_que_pagó}</td>
              <td>{sueldo.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Salaries;
