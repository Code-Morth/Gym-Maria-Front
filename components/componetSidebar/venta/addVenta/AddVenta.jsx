import React, { useEffect, useState } from 'react';
import db from '@/app/Firebase-conexion/credenciales'; // Importa la instancia de Firebase Firestore
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import Select from 'react-select';
import './style.css';

const AddVenta = () => {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [nombreCliente, setNombreCliente] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [precioTotal, setPrecioTotal] = useState(0); // Definir precioTotal aquí
  const [mostrarFormularioCliente, setMostrarFormularioCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    PApellido: '',
    SApellido: '',
    direccion: '',
    email: '',
    telefono: '',
    ci: ''
  });

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

    fetchClientes();
    fetchProductos();
  }, []);

  useEffect(() => {
    // Calcular el precio total cada vez que cambie el carrito
    const total = carrito.reduce((acc, item) => acc + item.precioTotal, 0);
    setPrecioTotal(total);
  }, [carrito]);

  // Resto del código...

  const handleNombreClienteChange = (selectedOption) => {
    setNombreCliente(selectedOption ? selectedOption.value : '');
  };

  const handleAgregarProducto = (selectedOption) => {
    const selectedProductId = selectedOption ? selectedOption.value : '';
    const selectedProduct = productos.find(producto => producto.id === selectedProductId);
    if (selectedProduct) {
      const productoEnCarrito = carrito.find(producto => producto.id === selectedProductId);
      if (!productoEnCarrito) {
        const newProducto = { ...selectedProduct, cantidad: 1, precioTotal: selectedProduct.precio_unitario_venta };
        setCarrito([...carrito, newProducto]);
      }
    }
  };

  const handleCantidadChange = (event, productId) => {
    const newCantidad = parseInt(event.target.value);
    if (isNaN(newCantidad) || newCantidad <= 0) return;

    const selectedProduct = productos.find(producto => producto.id === productId);
    if (newCantidad <= selectedProduct.stock) {
      const newCarrito = carrito.map(item =>
        item.id === productId
          ? { ...item, cantidad: newCantidad, precioTotal: newCantidad * item.precio_unitario_venta }
          : item
      );
      setCarrito(newCarrito);
    }
  };

  const handleRemoverProducto = (productId) => {
    const newCarrito = carrito.filter(item => item.id !== productId);
    setCarrito(newCarrito);
  };

  const handleRegistrarClienteVenta = () => {
    setMostrarFormularioCliente(true);
  };

  const handleCancelarRegistroCliente = () => {
    setMostrarFormularioCliente(false);
  };

  const handleNuevoClienteChange = (event) => {
    const { name, value } = event.target;
    setNuevoCliente(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmitNuevoCliente = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'clientes'), nuevoCliente);
      console.log('Cliente registrado con ID: ', docRef.id);
      const newCliente = { ...nuevoCliente, id: docRef.id };
      setClientes(prevClientes => [...prevClientes, newCliente]);
      setNombreCliente(newCliente.nombre);
      setMostrarFormularioCliente(false);
    } catch (error) {
      console.error('Error al registrar el cliente: ', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const ventaData = {
        productos: carrito.map(item => ({ id: item.id, nombre_producto: item.nombre_producto, cantidad: item.cantidad })),
        precio_total: carrito.reduce((acc, item) => acc + item.precioTotal, 0),
        nombre_usuario: '', // Aquí podrías obtener el nombre de usuario actualmente logueado
        nombre_cliente: nombreCliente,
        fecha_venta: serverTimestamp() // Guardar la fecha actual del servidor
      };
  
      // Agregar la venta a la colección 'ventas'
      await addDoc(collection(db, 'ventas'), ventaData);
  
      alert('¡Venta realizada exitosamente!');
      console.log('Venta registrada exitosamente');
    } catch (error) {
      console.error('Error al registrar la venta: ', error);
    }
  };
  

  const clienteOptions = clientes.map(cliente => ({ value: cliente.nombre, label: cliente.nombre }));
  const productoOptions = productos.map(producto => ({ value: producto.id, label: producto.nombre_producto }));

  return (
    <div>
      <h2>Formulario de Venta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Cliente:</label>
          <Select
            value={clienteOptions.find(option => option.value === nombreCliente)}
            onChange={handleNombreClienteChange}
            options={clienteOptions}
            placeholder="Seleccione un cliente"
          />
          <button type="button" onClick={handleRegistrarClienteVenta}>Registrar Cliente de Venta</button>
        </div>
        <div>
          <label>Seleccione Productos:</label>
          <Select
            onChange={handleAgregarProducto}
            options={productoOptions}
            placeholder="Seleccione un producto"
          />
        </div>
        <div>
          <h3>Carrito de Compras</h3>
          <ul>
            {carrito.map((producto) => (
              <li key={producto.id}>
                {producto.nombre_producto} - ${Number(producto.precioTotal).toFixed(2)} -
                <input
                  type="number"
                  value={producto.cantidad}
                  onChange={(e) => handleCantidadChange(e, producto.id)}
                  min="1"
                  max={producto.stock}
                />
                <button type="button" onClick={() => handleRemoverProducto(producto.id)}>Remover</button>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit">Realizar Venta</button>
      </form>
      <div>
        <h3>Total: ${Number(precioTotal).toFixed(2)}</h3>
      </div>

      {mostrarFormularioCliente && (
        <div>
          <h2>Registrar Nuevo Cliente</h2>
          <form onSubmit={handleSubmitNuevoCliente}>
            <div>
              <label>Nombre:</label>
              <input type="text" name="nombre" value={nuevoCliente.nombre} onChange={handleNuevoClienteChange} />
            </div>
            <div>
              <label>Primer Apellido:</label>
              <input type="text" name="PApellido" value={nuevoCliente.PApellido} onChange={handleNuevoClienteChange} />
            </div>
            <div>
              <label>Segundo Apellido:</label>
              <input type="text" name="SApellido" value={nuevoCliente.SApellido} onChange={handleNuevoClienteChange} />
            </div>
            <div>
              <label>Dirección:</label>
              <input type="text" name="direccion" value={nuevoCliente.direccion} onChange={handleNuevoClienteChange} />
            </div>
            <div>
              <label>Email:</label>
              <input type="email" name="email" value={nuevoCliente.email} onChange={handleNuevoClienteChange} />
            </div>
            <div>
              <label>Teléfono:</label>
              <input type="text" name="telefono" value={nuevoCliente.telefono} onChange={handleNuevoClienteChange} />
            </div>
            <div>
              <label>Cédula de Identidad:</label>
              <input type="text" name="ci" value={nuevoCliente.ci} onChange={handleNuevoClienteChange} />
            </div>
            <button type="submit">Registrar Cliente</button>
            <button type="button" onClick={handleCancelarRegistroCliente}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddVenta;
