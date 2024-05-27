import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '@/app/Firebase-conexion/credenciales';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userQuery = query(
        collection(db, 'usuarios'),
        where('username', '==', formData.username),
        where('contrasena', '==', formData.password)
      );
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        if (userData.rol === 'Administrador') {
          router.push(`/AdminView?username=${formData.username}`); // Redirige a AdminView con el nombre de usuario en la query string
        } else if (userData.rol === 'Trabajador') {
          router.push(`/WorkerView?username=${formData.username}`); // Redirige a WorkerView con el nombre de usuario en la query string
        } else {
          setError('Rol de usuario no reconocido.');
        }
      } else {
        setError('Usuario o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión: ', error);
      setError('Error al iniciar sesión: ' + error.message);
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="inputGroup">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="inputGroup">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="button">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
