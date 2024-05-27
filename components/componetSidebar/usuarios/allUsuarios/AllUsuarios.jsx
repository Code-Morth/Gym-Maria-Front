import React, { useState, useEffect } from 'react';
import  db  from '@/app/Firebase-conexion/credenciales';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import './style.css'; // 

const AllUsuarios = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'usuarios');
        const q = query(usersCollection, orderBy('nombre_completo'));

        const querySnapshot = await getDocs(q);
        const userData = [];
        querySnapshot.forEach((doc) => {
          userData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(userData);
      } catch (error) {
        console.error('Error al obtener usuarios: ', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'usuarios', id));
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error al eliminar el usuario: ', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'usuarios', editingUser.id), editingUser);
      setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
      setEditingUser(null);
    } catch (error) {
      console.error('Error al actualizar el usuario: ', error);
    }
  };

  return (
    <div className="table-container">
      <h1>Usuarios</h1>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>Nombre Completo</th>
            <th>Primer Apellido</th>
            <th>Segundo Apellido</th>
            <th>Correo Electrónico</th>
            <th>Fecha de Inicio</th>
            <th>Fecha Final</th>
            <th>Horario de Entrada</th>
            <th>Horario de Salida</th>
            <th>Número de Carnet</th>
            <th>Dirección</th>
            <th>Contraseña</th>
            <th>Rol de Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              {editingUser && editingUser.id === user.id ? (
                <>
                  <td><input value={editingUser.nombre_completo} onChange={(e) => setEditingUser({ ...editingUser, nombre_completo: e.target.value })} /></td>
                  <td><input value={editingUser.p_apellido} onChange={(e) => setEditingUser({ ...editingUser, p_apellido: e.target.value })} /></td>
                  <td><input value={editingUser.s_apellido} onChange={(e) => setEditingUser({ ...editingUser, s_apellido: e.target.value })} /></td>
                  <td><input value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} /></td>
                  <td><input value={editingUser.fecha_inicio} onChange={(e) => setEditingUser({ ...editingUser, fecha_inicio: e.target.value })} /></td>
                  <td><input value={editingUser.fecha_final} onChange={(e) => setEditingUser({ ...editingUser, fecha_final: e.target.value })} /></td>
                  <td><input value={editingUser.horario_entrada} onChange={(e) => setEditingUser({ ...editingUser, horario_entrada: e.target.value })} /></td>
                  <td><input value={editingUser.horario_salida} onChange={(e) => setEditingUser({ ...editingUser, horario_salida: e.target.value })} /></td>
                  <td><input value={editingUser.ci} onChange={(e) => setEditingUser({ ...editingUser, ci: e.target.value })} /></td>
                  <td><input value={editingUser.direccion} onChange={(e) => setEditingUser({ ...editingUser, direccion: e.target.value })} /></td>
                  <td><input value={editingUser.contrasena} onChange={(e) => setEditingUser({ ...editingUser, contrasena: e.target.value })} /></td>
                  <td><input value={editingUser.rol} onChange={(e) => setEditingUser({ ...editingUser, rol: e.target.value })} /></td>
                  <td>
                    <button className="edit-button" onClick={handleSave}>Guardar</button>
                    <button className="delete-button" onClick={() => setEditingUser(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.nombre_completo}</td>
                  <td>{user.p_apellido}</td>
                  <td>{user.s_apellido}</td>
                  <td>{user.email}</td>
                  <td>{user.fecha_inicio}</td>
                  <td>{user.fecha_final}</td>
                  <td>{user.horario_entrada}</td>
                  <td>{user.horario_salida}</td>
                  <td>{user.ci}</td>
                  <td>{user.direccion}</td>
                  <td>{user.contrasena}</td>
                  <td>{user.rol}</td>
                  <td>
                    <button className="edit-button" onClick={() => handleEdit(user)}>Editar</button>
                    <button className="delete-button" onClick={() => handleDelete(user.id)}>Eliminar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsuarios;
