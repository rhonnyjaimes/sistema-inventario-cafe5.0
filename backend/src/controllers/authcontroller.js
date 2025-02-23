const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.login = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Validación de campos obligatorios
    if (!email || !contrasena) {
      return res.status(400).json({
        tipo: 'campos_vacios',
        msg: 'Email y contraseña son requeridos'
      });
    }

    // Buscar usuario en la base de datos
    const usuario = await Usuario.buscarPorEmail(email);
    
    // Validar existencia de usuario
    if (!usuario) {
      return res.status(401).json({
        tipo: 'credenciales_invalidas',
        msg: 'Correo o contraseña incorrectos'
      });
    }

    // Comparar contraseñas
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({
        tipo: 'credenciales_invalidas',
        msg: 'Correo o contraseña incorrectos'
      });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        nombre: usuario.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Respuesta exitosa
    res.json({
      success: true,
      msg: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      tipo: 'error_servidor',
      msg: 'Error en el servidor al procesar la solicitud',
      detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.registrar = async (req, res) => {
  const { nombre, email, contrasena, rol } = req.body;
  
  try {
    // Validación de campos obligatorios
    if (!nombre || !email || !contrasena || !rol) {
      return res.status(400).json({
        tipo: 'campos_vacios',
        msg: 'Todos los campos son obligatorios'
      });
    }

    // Validación de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        tipo: 'email_invalido',
        msg: 'Formato de email inválido'
      });
    }

    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({
        tipo: 'usuario_existente',
        msg: 'El correo electrónico ya está registrado'
      });
    }

    // Validar fortaleza de contraseña
    if (contrasena.length < 8) {
      return res.status(400).json({
        tipo: 'contrasena_debil',
        msg: 'La contraseña debe tener al menos 8 caracteres'
      });
    }

    // Crear usuario
    const id = await Usuario.crear(nombre, email, contrasena, rol);
    
    res.status(201).json({
      success: true,
      msg: 'Registro exitoso',
      id
    });

  } catch (error) {
    console.error('Error en registro:', error);
    
    // Manejo de diferentes tipos de errores
    const mensajeError = error.code === 'ER_DUP_ENTRY' 
      ? 'El correo electrónico ya está en uso' 
      : 'Error en el servidor al procesar la solicitud';

    res.status(500).json({
      tipo: 'error_servidor',
      msg: mensajeError,
      detalle: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};