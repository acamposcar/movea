#! /usr/bin/env node

// Usage
/*
      node populatedb <your mongodb url>
*/
// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const mongoose = require('mongoose');
const Movie = require('./models/movie');
const Category = require('./models/category');

const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const categories = [];
const movies = [];

function categoryCreate(name, cb) {
  const category = new Category({ name });

  category.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Category: ${category}`);
    categories.push(category);
    cb(null, category);
  });
}

function movieCreate(title, director, year, category, image, cb) {
  const moviedetail = {
    title,
    director,
    year,
    category,
  };
  if (image != false) moviedetail.image = image;

  const movie = new Movie(moviedetail);
  movie.save((err) => {
    if (err) {
      cb(err, null);
      return;
    }
    console.log(`New Movie: ${movie}`);
    movies.push(movie);
    cb(null, movie);
  });
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate('Action', callback);
      },
      function (callback) {
        categoryCreate('Comedy', callback);
      },
      function (callback) {
        categoryCreate('Drama', callback);
      },
      function (callback) {
        categoryCreate('Fantasy', callback);
      },
      function (callback) {
        categoryCreate('Horror', callback);
      },
      function (callback) {
        categoryCreate('Romance', callback);
      },
      function (callback) {
        categoryCreate('Thriller', callback);
      },
    ],
    // optional callback
    cb,
  );
}

function createMovies(cb) {
  async.parallel(
    [
      function (callback) {
        movieCreate('Pulp Fiction', 'Quentin Tarantino', '1994', [categories[6]], '', callback);
      },
      function (callback) {
        movieCreate('Forrest Gump', 'Robert Zemeckis', '1994', [categories[1], categories[2]], '', callback);
      },
      function (callback) {
        movieCreate('The Matrix', 'Lilly Wachowski', '1999', [categories[0], categories[3], categories[6]], '', callback);
      },
      function (callback) {
        movieCreate('The Lord of the Rings: The Fellowship of the Ring', 'Peter Jackson', '2001', [categories[0], categories[3]], '', callback);
      },
      function (callback) {
        movieCreate('Life Is Beautiful', 'Roberto Benigni', '1997', [categories[1], categories[2]], '', callback);
      },
      function (callback) {
        movieCreate('Fight Club', 'David Fincher', '1999', [categories[2], categories[6]], '', callback);
      },
      function (callback) {
        movieCreate('Gladiator', 'Ridley Scott', '2000', [categories[0], categories[2]], '', callback);
      },
    ],
    // optional callback
    cb,
  );
}

async.series(
  [createCategories, createMovies],
  // Optional callback
  (err, results) => {
    if (err) {
      console.log(`FINAL ERR: ${err}`);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  },
);
