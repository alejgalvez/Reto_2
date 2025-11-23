var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lumina - Streaming' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Iniciar Sesión - Lumina' });
});

/* POST login page - handle form submission */
router.post('/login', function(req, res, next) {
  // Aquí se podría validar las credenciales
  // Por ahora, simplemente redirigimos a la página principal
  res.redirect('/');
});

/* GET collection page. */
router.get('/collection', function(req, res, next) {
  res.render('collection', { title: 'Mi colección - Lumina' });
});

/* GET support page. */
router.get('/support', function(req, res, next) {
  res.render('support', { title: 'Soporte - Lumina' });
});

/* POST support page - handle form submission */
router.post('/support', function(req, res, next) {
  // Aquí se podría procesar el mensaje de soporte
  // Por ahora, simplemente redirigimos a la página principal
  res.redirect('/');
});

module.exports = router;
