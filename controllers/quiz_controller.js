var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if(quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId = ' + quizId)); }
    }
  ).catch(function(error)  { next(error); });
};

// GET /quizes?search=texto_a_buscar
exports.index = function(req, res) {
  if(req.query.search === undefined) { // no se ha pulsado Enviar
    models.Quiz.findAll().then( // muestra todo
      function(quizes) {
        res.render('quizes/index', { quizes: quizes });
      }
    ).catch(function(error) { next(error); })
  } else { // se ha pulsado Enviar
    search = req.query.search.replace(/\s/g,"%"); // cambia espacios por %
    models.Quiz.findAll({ where: ["pregunta like ?", '%' + search + '%'],
                          order: 'pregunta ASC' }).then(
      function(quizes) {
        res.render('quizes/index', { quizes: quizes });
      }
    ).catch(function(error) { next(error); })
  }
};

// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz })
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if(req.query.respuesta === req.quiz.respuesta) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado });
};

// GET /author
exports.author = function(req, res) {
  res.render('author');
};
