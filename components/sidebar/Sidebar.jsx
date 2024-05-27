// sidebar2
"use client";
import React, { useState } from "react";
import Link from "next/link";
import style from "./style.css";
import { useRouter } from "next/router";
import useSidebar from "../../hooks/useSidebar";
import useLocation from "../../hooks/useLocation";
import useLocationH from "../../hooks/useLocationH";

const Sidebar = () => {
  //Optimizar (proxima presentacion)
  const {
    usersOpen,
    sidebar1,
    sidebar2,
    sidebar3,
    sidebar4,
    sidebar5,
    sidebar6,
  } = useSidebar();
  

  const [workerView] = useLocation();
  const [home] = useLocationH();

  return (
    <>
      {!home && (
        <div className="sidebar">
          {!workerView && (
            <div className="menu">
              <h3 onClick={sidebar1}>Usuarios</h3>{" "}
              {/* Toggle del estado usersOpen */}
              {usersOpen === 1 && (
                <ul>
                  <Link href="/AdminView/Usuarios/AddUsers">Agregar Usuario</Link>
                  <Link href="/AdminView/Usuarios/allUsers">Todos los Usuarios</Link>
                </ul>
              )}
            </div>
          )}

          {/* se muestra para los dos ! */}
          <div className="menu">
            <h3 onClick={sidebar2}>Cliente</h3>
            {usersOpen === 2 && (
              <ul>
                <Link href="/AdminView/Cliente/AddCliente">Agregar Cliente</Link>
                <Link href="/AdminView/Cliente/AllCliente">Todos los Clientes</Link>
                {!workerView && (
                  <Link href="/AdminView/Cliente/statics">Estadísticas</Link>
                )}
              </ul>
            )}
          </div>

        
          {/* se muestra para los dos */}
            <div className="menu">
              <h3 onClick={sidebar3}>Productos</h3>
              {usersOpen === 3 && (
                <ul>
                  <Link href="/AdminView/Producto/addProducto">Agregar Producto</Link>
                  <Link href="/AdminView/Producto/allProducto">Todos los Productos</Link>
                  {!workerView && (
                  <Link href="/AdminView/Producto/statics">Estadísticas</Link>
                )}
                </ul>
              )}
            </div>
         

          {/* se muestra para los dos  */}
            <div className="menu">
              <h3 onClick={sidebar4}>Venta</h3>
              {usersOpen === 4 && (
                <ul>
                  <Link href="/AdminView/Ventas/AddVentas">Agregar Venta</Link>
                  <Link href="/AdminView/Ventas/allVentas">Todas las ventas</Link>
                  {!workerView && (
                  <Link href="/AdminView/Ventas/staticVenta">Estadísticas</Link>
                )}
                </ul>
              )}
            </div>
          
          {!workerView && (
            <div className="menu">
              <h3 onClick={sidebar5}>Membresia</h3>
              {usersOpen === 5 && (
                <ul>
                  <Link href="/AdminView/Membresias/addMembresia">Agregar Membresia</Link>
                  <Link href="/AdminView/Membresias/allMembresia">Todas las Membresias</Link>
                </ul>
              )}
            </div>
          )}

          {/* se muestra para los dos */}
            <div className="menu">
              <h3 onClick={sidebar6}>Contabilidad</h3>
              {usersOpen === 6 && (
                <ul>
                  <Link href="/AdminView/Contabilidad/addExpenses">Agregar gastos extras</Link>
                  {!workerView && (
                  <Link href="/AdminView/Contabilidad/sueldos">Sueldos</Link>
                )}
                {!workerView && (
                  <Link href="/">Ingresos / Egresos</Link>
                )}
                </ul>
              )}
            </div>

          {/* Se va mostrar para los dos */}
          <div className="menu">
            <ul className="menu">
               <Link href="/AdminView/ReadQr/read">Lector Qr</Link>
            </ul>
          </div>

          {/* Agrega más menús aquí */}
          <div className="logout">
            <Link href="/">Salir</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
