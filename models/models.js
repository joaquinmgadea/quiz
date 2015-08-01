var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
  { dialect: protocol,
    protocol: protocol,
    port: port,
    host: host,
    storage: storage, // solo SQLite (.env)
    omitNull: true // solo Postgres
  }
);

// Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

// Importar definición de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

// Relación Quiz a Comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;      // exportar tabla Quiz
exports.Comment = Comment // exportar tabla Comment

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(...) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count) {
    if(count === 0) { // la tabla se inicializa sólo si está vacía
      Quiz.bulkCreate(
        [ { pregunta: 'Capital de Italia',                             respuesta: 'Roma',        tema: 'Humanidades' },
          { pregunta: 'Capital de Portugal',                           respuesta: 'Lisboa',      tema: 'Humanidades' },
          { pregunta: 'Autor de "Don Quijote de la Mancha"',           respuesta: 'Cervantes',   tema: 'Humanidades' },
          { pregunta: '¿Quién descubrió la ley de la gravedad?"',      respuesta: 'Newton',      tema: 'Ciencia' },
          { pregunta: '¿Quién formuló la teoría de la relatividad?',   respuesta: 'Einstein',    tema: 'Ciencia' },
          { pregunta: 'Molécula que contiene la información genética', respuesta: 'ADN',         tema: 'Ciencia' },
          { pregunta: 'Término coloquial del cubalibre',               respuesta: 'cubata',      tema: 'Ocio' },
          { pregunta: 'Robot amigo de C-3PO',                          respuesta: 'R2-D2',       tema: 'Ocio' },
          { pregunta: 'Especie de bar ubicado en la playa',            respuesta: 'chiringuito', tema: 'Ocio' },
          { pregunta: 'Fabricante del microprocesador 8088',           respuesta: 'Intel',       tema: 'Tecnología' },
          { pregunta: 'Diodo que emite luz',                           respuesta: 'Led',         tema: 'Tecnología' },
          { pregunta: 'Núcleo de un sistema operativo',                respuesta: 'kernel',      tema: 'Tecnología' },
          { pregunta: 'Perico de los ...',                             respuesta: 'palotes',     tema: 'Otro' },
          { pregunta: 'Fulano, ??? y Zutano',                          respuesta: 'Mengano',     tema: 'Otro' },
          { pregunta: 'Ciudad de origen de los Beatles',               respuesta: 'Liverpool',   tema: 'Otro' }
        ]
      )
      .then(function() { console.log('Base de datos inicializada') });
    };
  });
});
