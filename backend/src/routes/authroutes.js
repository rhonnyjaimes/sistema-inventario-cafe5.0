const express = require("express");
const { registrar } = require("../controllers/authcontroller");

const router = express.Router();

router.post("/registro", registrar);

module.exports = router;
