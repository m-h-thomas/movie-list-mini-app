const express = require('express')
const app = express();
const PORT = 8081;
const cors = require('cors');
const knex = require('knex')(require('../knexfile.js')["development"])


app.use(cors())
app.use(express.json())


app.get('/', (req, res) =>{
    res.status(200).send("Application up and running.")
})

app.get('/movies', (req, res) => {
  knex('movies')
    .select('*')
    .then(data => res.json(data))
    .catch((err) => {
      console.error("Error fetching movies:", err);
      res.status(500).json({ error: "Failed to fetch movies" });
    });
})

app.post("/movies", async (req, res) => {
  const { title } = req.body;
  console.log("Received request body:", req.body);

  if (!title) {
    console.log("Title is missing in request.");
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const newMovie = await knex("movies").insert({ title }).returning("*");
    console.log("Inserted movie:", newMovie);

    res.status(201).json(newMovie[0]);
  } catch (err) {
    console.error("Error adding movie:", err);
    res.status(500).json({ error: "Failed to add movie" });
  }
});

app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMovie = await knex("movies").where({ id }).del();
    if (deletedMovie) {
      res.status(200).json({ message: "Movie deleted successfully" });
    } else {
      res.status(404).json({ error: "Movie not found" });
    }
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).json({ error: "Failed to delete movie" });
  }
});

app.patch("/movies/:id/watched", async (req, res) => {
  const { id } = req.params;
  const { watched } = req.body; // Expecting { watched: true/false }

  try {
    const updatedMovie = await knex("movies")
      .where({ id })
      .update({ watched })
      .returning("*");

    if (!updatedMovie.length) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(updatedMovie[0]); // Return the updated movie
  } catch (err) {
    console.error("Error updating watched status:", err);
    res.status(500).json({ error: "Failed to update movie status" });
  }
});


app.listen(PORT, () => console.log(`Express server is listening on ${PORT}.`))