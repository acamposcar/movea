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

function movieCreate(title, director, year, category, image, synopsis, cb) {
  const moviedetail = {
    title,
    director,
    year,
    category,
    image,
    synopsis,
  };

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
        movieCreate('Pulp Fiction', 'Quentin Tarantino', '1994', [categories[6]], 'https://image.posterlounge.es/images/l/1895909.jpg', "The film interweaves three tales: the first story focuses on Vincent Vega (John Travolta) and Jules Winnfield (Samuel L. Jackson), two hit men on duty for 'the big boss,' Marsellus Wallace (Ving Rhames), whose gorgeous wife, Mia (Uma Thurman), takes a liking to Vincent. In the second, a down-and-out pugilist (Bruce Willis), who is ordered to take a fall, decides that there’s more money in doing the opposite. The final chapter follows a pair of lovers (Amanda Plummer and Tim Roth) as they prepare to hold up a diner.", callback);
      },
      function (callback) {
        movieCreate('Forrest Gump', 'Robert Zemeckis', '1994', [categories[1], categories[2]], 'https://m.media-amazon.com/images/I/91++WV6FP4L._SL1500_.jpg', "Despite Forrest's (Tom Hanks) low IQ, he is not your average guy. Learning early on from his mother (Sally Field) that 'life is like a box of chocolates, you never know what you're gonna get', Gump, without trying, stumbles upon some exciting events. Meanwhile, as the remarkable parade of his life goes by, Forrest never forgets Jenny (Robin Wright), the girl he loved as a boy, who makes her own journey through the turbulence of the 1960s and 1970s that is far more troubled than the path Forrest happens upon.", callback);
      },
      function (callback) {
        movieCreate('The Matrix', 'Lilly Wachowski', '1999', [categories[0], categories[3], categories[6]], 'https://static.wikia.nocookie.net/doblaje/images/7/7a/Matrix.jpg/revision/latest?cb=20210703005220&path-prefix=es', "In the near future, Computer hacker Neo is contacted by underground freedom fighters who explain that reality as he understands it is actually a complex computer simulation called the Matrix. Created by a malevolent Artificial Intelligence, the Matrix hides the truth from humanity, allowing them to live a convincing, simulated life in 1999 while machines grow and harvest people to use as an ongoing energy source. The leader of the freedom fighters, Morpheus, believes Neo is 'The One' who will lead humanity to freedom and overthrow the machines. Together with Trinity, Neo and Morpheus fight against the machine's enslavement of humanity as Neo begins to believe and accept his role as 'The One'.", callback);
      },
      function (callback) {
        movieCreate('The Lord of the Rings: The Fellowship of the Ring', 'Peter Jackson', '2001', [categories[0], categories[3]], 'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg', "'One ring to rule them all, One ring to find them. One ring to bring them all and in the darkness bind them.' In this part of the trilogy, the young Hobbit Frodo Baggins inherits a ring; but this ring is no mere trinket. It is the One Ring, an instrument of absolute power that could allow Sauron, the dark Lord of Mordor, to rule Middle-earth and enslave its peoples. Frodo, together with a Fellowship that includes his loyal Hobbit friends, Humans, a Wizard, a Dwarf and an Elf, must take the One Ring across Middle-earth to Mount Doom, where it first was forged, and destroy it forever. Such a journey means venturing deep into territory manned by Sauron, where he is amassing his army of Orcs. And it is not only external evils that the Fellowship must combat, but also internal dissension and the corrupting influence of the One Ring itself. The course of future history is entwined with the fate of the Fellowship.", callback);
      },
      function (callback) {
        movieCreate('Life Is Beautiful', 'Roberto Benigni', '1997', [categories[1], categories[2]], 'https://m.media-amazon.com/images/I/71aTjWl7JkL._SL1113_.jpg', "Guido - a charming but bumbling waiter who's gifted with a colourful imagination and an irresistible sense of humour - has won the heart of the woman he loves and has created a beautiful life for his young family. But then, that life is threatened by World War II and Guido must rely on those very same strengths to save his beloved wife and son from an unthinkable fate.", callback);
      },
      function (callback) {
        movieCreate('Fight Club', 'David Fincher', '1999', [categories[2], categories[6]], 'https://3.bp.blogspot.com/-YWD5EgEKlOo/Wel0oZQQwjI/AAAAAAAAHVs/K5ll5R0Bbf8EE9oOb397RmecOwTxUb19wCLcBGAs/s1600/Fight%2BClub%2B-%2BEl%2Bclub%2Bde%2Bla%2Bpelea.jpg', 'A nameless disillusioned young urban male (Edward Norton) fights insomnia by attending disease support groups until he meets a kindred spirit -and soap salesman (Brad Pitt). Together they form Fight Club, where young men can exert their frustrations and angst upon one another.', callback);
      },
      function (callback) {
        movieCreate('Gladiator', 'Ridley Scott', '2000', [categories[0], categories[2]], 'https://m.media-amazon.com/images/I/91ATO4sRPVL._SL1500_.jpg', "Maximus (Crowe) is a brave and loyal military general to the Emperor Marcus Aurelius (Harris). His loyalty does not go unnoticed as the Emperor makes preparations for Maximus to succeed him after his death. But when the Emperor's son, Commodus (Phoenix) finds out, he kills his father and orders the death of Maximus. While he escapes, his wife and son are brutally murdered. He then ends up a slave in North Africa and is sold to become a gladiator. Trained by Proximo (Reed), a former gladiator himself, Maximus wins every battle and soon finds himself sent to Rome to take part in the Gladitorial Games. It is here that he plans to plot his vengeance and gain his freedom. While all this is going on, his past lover, the Emperor's daughter (Nielsen) works to restore democratic rule with the help of a civil-minded senator (Jacobi).", callback);
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
