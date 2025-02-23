1exports.errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Error interno del servidor",
      mensaje: err.message || "Algo salió mal",
    });
  };