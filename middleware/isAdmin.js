/**
 * Checks if user is admin
 */

 const AdminManager = require("./../utils/AdminManager");
 const adminManager = new AdminManager("./routes/data/admin.json");

isAdmin = async function(req, res, next) {
  const userIsAdmin = await adminManager.isAdmin();
  if (userIsAdmin.admin) {
    return next();
  }
  res.status(403);
  res.json({
    error: -1,
    descripcion: `ruta ${req.path} metodo ${req.method} no autorizada`, 
  })
};

module.exports = isAdmin;