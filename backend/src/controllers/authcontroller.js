const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");

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