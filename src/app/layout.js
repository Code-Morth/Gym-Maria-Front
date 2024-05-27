
import { Inter } from 'next/font/google';
import './globals.css';
import './login.css'; // Importamos los estilos globales de login
import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'sistema del gym',
  description: 'Sistema web del gimnasio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={inter.className}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" />
      </head>
      <body>
        <Sidebar/>
        {children}
      </body>
    </html>
  );
}
