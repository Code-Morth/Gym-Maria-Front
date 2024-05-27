import React, { useEffect, useState } from 'react';
import db from '@/app/Firebase-conexion/credenciales'; // Importa la instancia de Firebase Firestore
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Importa las funciones necesarias de Firebase
import './style.css';

const AllProducto = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProducto, setEditingProducto] = useState(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosCollection = collection(db, 'productos');
        const productosSnapshot = await getDocs(productosCollection);
        const productosList = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(productosList);
      } catch (error) {
        console.error('Error al obtener los productos: ', error);
      }
    };

    fetchProductos();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProductos = productos.filter((producto) =>
    Object.values(producto).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleEdit = (producto) => {
    setEditingProducto(producto);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'productos', id));
      setProductos(productos.filter(producto => producto.id !== id));
    } catch (error) {
      console.error('Error al eliminar el producto: ', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateDoc(doc(db, 'productos', editingProducto.id), editingProducto);
      setProductos(productos.map(producto => (producto.id === editingProducto.id ? editingProducto : producto)));
      setEditingProducto(null);
    } catch (error) {
      console.error('Error al actualizar el producto: ', error);
    }
  };

  return (
    <div className="table-container">
      <h1>Productos</h1>
      <input
        type="text"
        placeholder="Buscar producto"
        value={searchTerm}
        onChange={handleSearchChange}
        className="form-input"
        style={{ width: 'calc(80% - 16px)', marginBottom: '20px' }}
      />
      <table className="productos-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredProductos.map((producto) => (
            <tr key={producto.id}>
              {editingProducto && editingProducto.id === producto.id ? (
                <>
                  <td><input value={editingProducto.nombre} onChange={(e) => setEditingProducto({ ...editingProducto, nombre: e.target.value })} /></td>
                  <td><input value={editingProducto.precio} onChange={(e) => setEditingProducto({ ...editingProducto, precio: e.target.value })} /></td>
                  <td><input value={editingProducto.stock} onChange={(e) => setEditingProducto({ ...editingProducto, stock: e.target.value })} /></td>
                  <td>
                    <button className="save-button" onClick={handleSave}>Guardar</button>
                    <button className="cancel-button" onClick={() => setEditingProducto(null)}>Cancelar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{producto.nombre_producto}</td>
                  <td>{producto.precio_unitario_venta}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <button onClick={() => handleEdit(producto)} className="edit-button">Editar</button>
                    <button onClick={() => handleDelete(producto.id)} className="delete-button">Eliminar</button>
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

export default AllProducto;
