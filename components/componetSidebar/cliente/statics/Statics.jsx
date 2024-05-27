import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import db from '@/app/Firebase-conexion/credenciales';
import { collection, getDocs } from 'firebase/firestore';
import './style.css'; 

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const Statics = () => {
  const [clientes, setClientes] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // Inicio del año actual
  const [endDate, setEndDate] = useState(new Date());

  // Función para transformar números de mes en nombres de mes
  const TransforMonts = (dateString) => {
    const dateNumber = parseInt(dateString) - 1;

    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const monthName = months[dateNumber];
    return monthName;
  };

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

  const filteredClientes = clientes.filter((cliente) => {
    const fechaRegistro = new Date(cliente.fecha_registro);
    return fechaRegistro >= startDate && fechaRegistro <= endDate;
  });

  const inscripcionesPorMes = {};

  filteredClientes.forEach((cliente) => {
    const month = TransforMonts(cliente.fecha_registro.slice(5, 7));
    if (inscripcionesPorMes[month]) {
      inscripcionesPorMes[month] += 1;
    } else {
      inscripcionesPorMes[month] = 1;
    }
  });

  const labels = Object.keys(inscripcionesPorMes);
  const data = Object.values(inscripcionesPorMes);

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Clientes inscritos por mes',
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
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="Fecha de inicio"
          className='date-picker'
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="Fecha de fin"
          className='date-picker'
        />
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
