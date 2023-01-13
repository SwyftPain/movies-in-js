const express = require("express");
const router = express.Router();
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const movies = db.get("list");

// GET /movies - display list of movies
router.get("/", async (req, res) => {
  const email = req.query.email;
  const tst = await db.get(`users.${email}`);
  if (tst == null) {
    res.redirect("/login");
  } else {
    const movieList = await db.get(`${email}.list`);
    res.render("movies", { movieList, user: tst });
  }
});

// POST /movies - add a new movie to the list
router.post("/", async (req, res) => {
  const email = req.query.email;
  const tst = await db.get(`users.${email}`);
  if (tst == null) {
    res.redirect("/login");
  } else {
    if (tst.loggedin) {
      const movie = req.body.movie;
      const movieList = (await db.get(`${email}.list`)) || [];
      movieList.push({ name: movie, watched: false });
      db.set(`${email}.list`, movieList);
      res.redirect("/?email=" + email);
    } else {
      res.redirect("/login");
    }
  }
});

// POST /movies/:id/remove - remove a movie from the list
router.post("/:id/remove", async (req, res) => {
  const email = req.query.email;
  const tst = await db.get(`users.${email}`);
  if (tst == null) {
    res.redirect("/login");
  } else {
    if (tst.loggedin) {
      const id = req.params.id;
      const movieList = await db.get(`${email}.list`);
      movieList.splice(id, 1);
      db.set(`${email}.list`, movieList);
      res.redirect("/?email=" + email);
    } else {
      res.redirect("/login");
    }
  }
});

// POST /movies/:id/watched - mark a movie as watched
router.post("/:id/watched", async (req, res) => {
  const email = req.query.email;
  const tst = await db.get(`users.${email}`);
  if (tst == null) {
    res.redirect("/login");
  } else {
    if (tst.loggedin) {
      const id = req.params.id;
      const movieList = await db.get(`${email}.list`);
      if (!movieList[id].watched) {
        movieList[id].watched = true;
        db.set(`${email}.list`, movieList);
      }
      res.redirect("/?email=" + email);
    } else {
      res.redirect("/login");
    }
  }
});

// POST /movies/random - select a random movie from the list
router.post("/random", async (req, res) => {
  const email = req.query.email;
  const tst = await db.get(`users.${email}`);
  if (tst == null) {
    res.redirect("/login");
  } else {
    if (tst.loggedin) {
      const movieList = (await db.get(`${email}.list`)) || [];
      const unwatchedMovies = movieList.filter((movie) => !movie.watched);
      const randomIndex = Math.floor(Math.random() * unwatchedMovies.length);
      const randomMovie = unwatchedMovies[randomIndex].name;
      res.render("random", { randomMovie, user: tst });
    } else {
      res.redirect("/login");
    }
  }
});

module.exports = router;
