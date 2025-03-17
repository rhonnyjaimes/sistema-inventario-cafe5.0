Sistema de Inventario para CAFÉ 5.0

ENLACE DE GITHUB: https://github.com/rhonnyjaimes/sistema-inventario-cafe5.0/

VIDEO EXPLICATIVO DEL PROGRAMA: https://youtu.be/MX3vqO-JsC8

El presente informe detalla la instalación, funcionalidades y uso del sistema de inventario para CAFÉ 5.0 de José Ocanto,
diseñado para optimizar la gestión de materias primas, producción, empaquetado y distribución a nivel nacional.

Instalación del Sistema
Requisitos Previos:

•	Node.js y npm instalados.
•	PostgreSQL como base de datos.
•	React.js para el frontend.

Pasos de Instalación
1.	Clonar el repositorio del proyecto:
git clone https://github.com/rhonnyjaimes/sistema-inventario-cafe5.0.git
2.	Instalar dependencias del Backend:

cd backend
npm install

3.	Instalar dependencias del Frontend:

cd frontend
npm install

4.	Crear archivo .env en la carpeta backend y colocar los siguientes datos:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cafe5_inventario
JWT_SECRET=secreto_super_seguro

5.	Ejecutar XAMPP y configurar la base de datos MYSQL importando el archivo que está en el repositorio con el nombre de cafe5_inventario.sql:

6.	Ejecutar lo siguiente para ejecutar el programa:

-Ejecutar XAMPP e inicializar apache y mysql 
-Abrir el terminal de la carpeta de frontend y ejecutar el comando
 npm run dev
  
Luego abrir otro terminal aparte para la carpeta backend y ejecutar el comando npm run dev 
 
7.	Ya podemos abrir el navegador y acceder al programa a través del siguiente url http://localhost:5173/ 
