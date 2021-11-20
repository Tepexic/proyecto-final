/**
 * El router base '/api/admin' implementará dos funcionalidades:
 * - GET: obtiene si el usuario es administrador o no
 * - POST: cambia el estado de administrador del usuario
 */

const AdminManager = require("./../containers/AdminManager");
const adminManager = new AdminManager("./routes/data/admin.json");

const express = require('express');
const { Router } = express;

const adminRouter = Router();

adminRouter.get('/', async (req, res) => {
  const isAdmin =  await adminManager.isAdmin();
  res.json(isAdmin);
});

adminRouter.post('/', async (req, res) => {
  const isAdmin = await adminManager.toggleAdmin();
  res.status(200).json(isAdmin);
});

module.exports = adminRouter;