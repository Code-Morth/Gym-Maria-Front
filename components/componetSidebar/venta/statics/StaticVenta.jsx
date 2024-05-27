import React, { useEffect, useState } from 'react';
import { Chart as ChartJS } from 'chart.js/auto'; // Importa la librería moderna de Chart.js
import { collection, getDocs } from 'firebase/firestore';
import db from '@/app/Firebase-conexion/credenciales';
import './style.css'; // 

const StaticVenta = () => {
  const [ventas, setVentas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [chartInstance, setChartInstance] = useState(null); // Estado para guardar la instancia del gráfico

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

  const handleFechaInicioChange = (event) => {
    const fecha = event.target.value;
    setFechaInicio(new Date(fecha));
  };

  const handleFechaFinChange = (event) => {
    const fecha = event.target.value;
    setFechaFin(new Date(fecha));
  };

  useEffect(() => {
    if (!ventas.length) return;

    const productosVendidos = {};

    ventas.forEach(venta => {
      if (!venta.productos) return;
      venta.productos.forEach(producto => {
        if (productosVendidos[producto.nombre_producto]) {
          productosVendidos[producto.nombre_producto] += producto.cantidad;
        } else {
          productosVendidos[producto.nombre_producto] = producto.cantidad;
        }
      });
    });

    const labels = Object.keys(productosVendidos);
    const data = Object.values(productosVendidos);

    const ctx = document.getElementById('chart');
    if (chartInstance) {
      chartInstance.destroy(); // Destruye el gráfico existente si existe
    }
    setChartInstance(new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Productos más vendidos',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }));
  }, [ventas]);

  return (
    <div className='statistics-container'>
      <div className='datepicker-container'>
        <label htmlFor="fechaInicio" className="label">Fecha de Inicio:</label>
        <input type="date" id="fechaInicio" className="input" onChange={handleFechaInicioChange} />
        <label htmlFor="fechaFin" className="label">Fecha Fin:</label>
        <input type="date" id="fechaFin" className="input" onChange={handleFechaFinChange} />
      </div>
      <div className='chart-container'>
        <canvas id="chart"></canvas>
      </div>
    </div>
  );
};

export default StaticVenta;
