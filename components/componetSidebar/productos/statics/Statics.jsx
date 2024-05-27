import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { collection, getDocs } from 'firebase/firestore';
import db from '@/app/Firebase-conexion/credenciales';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.css'; 

// Registrar todos los componentes necesarios de Chart.js
Chart.register(...registerables);

const Statics = () => {
  const [productos, setProductos] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1),
    endDate: new Date()
  });
  const [searchClicked, setSearchClicked] = useState(false); // Nuevo estado

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

  const handleDateChange = (date, type) => {
    setDateRange(prevDateRange => ({
      ...prevDateRange,
      [type]: date
    }));
  };

  const handleSearch = () => {
    setSearchClicked(true);
  };

  const filteredProductos = productos.filter((producto) => {
    const fechaIngreso = new Date(producto.fecha_ingreso);
    return (
      (!searchClicked || // Aplicar filtro solo si se ha hecho clic en el botón
      (fechaIngreso >= dateRange.startDate && fechaIngreso <= dateRange.endDate))
    );
  });

  const productosData = {};

  filteredProductos.forEach((producto) => {
    if (productosData[producto.nombre_producto]) {
      productosData[producto.nombre_producto] += parseInt(producto.stock);
    } else {
      productosData[producto.nombre_producto] = parseInt(producto.stock);
    }
  });

  const labels = Object.keys(productosData);
  const data = Object.values(productosData);

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Cantidad de Productos en Stock',
      data: data,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className='statistics-container'>
      <div className='datepicker-container'>
        <div>
          <label>Fecha de inicio:</label>
          <DatePicker
            selected={dateRange.startDate}
            onChange={(date) => handleDateChange(date, 'startDate')}
            selectsStart
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            dateFormat="yyyy-MM-dd"
            className='date-picker'
          />
        </div>
        <div>
          <label>Fecha de fin:</label>
          <DatePicker
            selected={dateRange.endDate}
            onChange={(date) => handleDateChange(date, 'endDate')}
            selectsEnd
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            minDate={dateRange.startDate}
            dateFormat="yyyy-MM-dd"
            className='date-picker'
          />
        </div>
        <button onClick={handleSearch} className='search-button'>Buscar</button> {/* Botón de búsqueda */}
      </div>
      <div className='chart-container'>
        <Bar
          data={chartData}
          options={options}
        />
      </div>
    </div>
  );
};

export default Statics;
