var models = require('../models/models.js');

var statistics = {
  quizes: 0,
  comments: 0,
  commentsUnpublished: 0,
  commentedQuizes: 0
};

var errors = [];

exports.calculate = function (req, res, next) {

  models.Quiz.count()
  .then(function (numQuizes) { // número de preguntas
    statistics.quizes = numQuizes;
    return models.Comment.count();
  })
  .then(function (numComments) { // número de comentarios
    statistics.comments = numComments;
    return models.Comment.countUnpublished();
  })
  .then(function (numUnpublished) { // número de comentarios sin publicar
    statistics.commentsUnpublished = numUnpublished;
    return models.Comment.countCommentedQuizes();
  })
  .then(function (numCommented) { // número de preguntas con comentario
    statistics.commentedQuizes = numCommented;
  })
  .catch(function (err) { errors.push(err); })
  .finally(function () {
    next();
  });
};

// GET /quizes/statistics
exports.index = function(req, res) {
  res.render('quizes/statistics', { statistics: statistics, errors: errors });
};
