/**
 * Checks if user is admin
 */

const ADMIN = true;

isAdmin = function(req, res, next) {
  if (ADMIN) {
    return next();
  }
  res.status(403);
  res.json({
    error: -1,
    descripcion: `ruta ${req.path} metodo ${req.method} no autorizada`, 
  })
};

module.exports = isAdmin;