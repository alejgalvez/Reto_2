var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

// Cargar datos de películas
var peliculasDataPath = path.join(__dirname, '..', 'data', 'peliculas.json');

// Cargar usuarios desde data/usuarios.json
var usersDataPath = path.join(__dirname, '..', 'data', 'usuarios.json');
var usersData = { usuarios: [] };
try {
  usersData = JSON.parse(fs.readFileSync(usersDataPath, 'utf8'));
} catch (err) {
  console.error('No se pudo cargar data/usuarios.json:', err.message);
  usersData = {
    usuarios: [
      { username: 'usuario', password: '1234' },
      { username: 'usuario2', password: '5678', peliculasIds: [1, 3, 5] }
    ]
  };
}

// Middleware sencillo de autenticación basado en cookie
function requireAuth(req, res, next) {
  if (req.cookies && req.cookies.isLoggedIn === 'true') {
    return next();
  }
  res.redirect('/login');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Lumina - Streaming' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Iniciar Sesión - Lumina', error: null });
});

/* POST login page - handle form submission */
router.post('/login', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  var user = usersData.usuarios.find(function(u) {
    return u.username === username && u.password === password;
  });

  if (user) {
    // Guardamos estado de login en una cookie sencilla
    res.cookie('isLoggedIn', 'true', { httpOnly: true });
    res.cookie('username', user.username, { httpOnly: true });
    return res.redirect('/collection');
  }

  // Credenciales incorrectas
  res.render('login', {
    title: 'Iniciar Sesión - Lumina',
    error: 'Usuario o contraseña incorrectos'
  });
});

/* GET collection page (protegida). */
router.get('/collection', requireAuth, function(req, res, next) {
  var peliculasData = { peliculas: [] };

  try {
    peliculasData = JSON.parse(fs.readFileSync(peliculasDataPath, 'utf8'));
  } catch (err) {
    console.error('No se pudo cargar data/peliculas.json:', err.message);
  }

  var username = req.cookies.username;
  var user = usersData.usuarios.find(function(u) {
    return u.username === username;
  });

  var peliculas = peliculasData.peliculas || [];

  // Si el usuario tiene peliculasIds definidos, filtramos por esos ids.
  // Si no tiene, ve todas las películas.
  if (user && Array.isArray(user.peliculasIds) && user.peliculasIds.length > 0) {
    peliculas = peliculas.filter(function(p) {
      return user.peliculasIds.indexOf(p.id) !== -1;
    });
  }

  res.render('collection', {
    title: 'Mi colección - Lumina',
    peliculas: peliculas
  });
});

/* GET movie detail page (protegida). */
router.get('/collection/:id', requireAuth, function(req, res, next) {
  var peliculasData = { peliculas: [] };

  try {
    peliculasData = JSON.parse(fs.readFileSync(peliculasDataPath, 'utf8'));
  } catch (err) {
    console.error('No se pudo cargar data/peliculas.json:', err.message);
  }

  var id = parseInt(req.params.id, 10);
  var pelicula = (peliculasData.peliculas || []).find(function(p) {
    return p.id === id;
  });

  if (!pelicula) {
    return res.status(404).render('error', {
      message: 'Película no encontrada',
      error: {}
    });
  }

  res.render('detail', {
    title: pelicula.titulo + ' - Lumina',
    pelicula: pelicula
  });
});

/* GET logout - cerrar sesión */
router.get('/logout', function(req, res, next) {
  res.clearCookie('isLoggedIn');
  res.clearCookie('username');
  res.redirect('/');
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
