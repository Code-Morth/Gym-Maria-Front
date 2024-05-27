import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import db from '@/app/Firebase-conexion/credenciales';
import './style.css'; // Importa tu archivo CSS

const AllVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const ventasCollection = collection(db, 'ventas');
        const ventasSnapshot = await getDocs(ventasCollection);
        const ventasList = ventasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVentas(ventasList);
      } catch (error) {
        console.error('Error al obtener las ventas: ', error);
      }
    };

    fetchVentas();
  }, []);

  const filtrarVentasPorFecha = () => {
    if (fechaInicio && fechaFin) {
      const ventasFiltradas = ventas.filter(venta => {
        if (venta.fecha) {
          const fechaVenta = venta.fecha.toDate(); // Convertir a objeto Date
          return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
        }
        return false; // Si no hay fecha definida, excluimos esta venta
      });
      return ventasFiltradas;
    }
    return ventas;
  };

  const handleFechaInicioChange = (event) => {
    const fecha = event.target.value;
    setFechaInicio(new Date(fecha));
  };

  const handleFechaFinChange = (event) => {
    const fecha = event.target.value;
    setFechaFin(new Date(fecha));
  };

  return (
    <div className="all-ventas-container">
      <h2 className="title">Lista de Ventas</h2>
      <div className="filtro-container">
        <label htmlFor="fechaInicio" className="label">Fecha de Inicio:</label>
        <input type="date" id="fechaInicio" className="input" onChange={handleFechaInicioChange} />
        <label htmlFor="fechaFin" className="label">Fecha Fin:</label>
        <input type="date" id="fechaFin" className="input" onChange={handleFechaFinChange} />
      </div>
      <div className="table-container">
        <table className="ventas-table">
          <thead>
            <tr>
              <th className="table-header">Productos</th>
              <th className="table-header">Precio Total</th>
              <th className="table-header">Fecha de Venta</th>
              <th className="table-header">Nombre del Cliente</th>
            </tr>
          </thead>
          <tbody>
            {filtrarVentasPorFecha().map(venta => (
              <tr key={venta.id} className="table-row">
                <td className="table-data">
                  <ul className="product-list">
                    {venta.productos && venta.productos.map(producto => (
                      <li key={producto.id} className="product-item">{producto.nombre_producto} - Cantidad: {producto.cantidad}</li>
                    ))}
                  </ul>
                </td>
                <td className="table-data">${typeof venta.precio_total === 'number' ? venta.precio_total.toFixed(2) : 'N/A'}</td>
                <td className="table-data">{venta.fecha && venta.fecha.toDate().toLocaleDateString()}</td> 
                <td className="table-data">{venta.nombre_cliente}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllVentas;
