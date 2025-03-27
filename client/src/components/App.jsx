import { useEffect, useState } from 'react'
import './index.css'
import './App.css'

function App() {

  //Set movie in state
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [newMovie, setNewMovie] = useState("");

  //Fetch movie list from database
  useEffect(() => {
    fetch(`http://localhost:8081/movies`)
    .then(res => res.json())
    .then(movie => setMovies(movie))
  }, [])

  //Handle search
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
)

  // Handle form input change
  const handleInputChange = (e) => {
    setNewMovie(e.target.value);
  };

  // Handle form submission
  const handleAddMovie = async (e) => {
    e.preventDefault();

    if (!newMovie.trim()) {
      alert("Please enter a movie title.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newMovie }),
      });

      if (!response.ok) {
        throw new Error("Failed to add movie");
      }

      const addedMovie = await response.json();

      // Update state with new movie
      setMovies([...movies, addedMovie]);
      setNewMovie(""); // Clear input field
    } catch (error) {
      console.error("Error adding movie:", error);
      alert("Failed to add movie.");
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;

    try {
      const response = await fetch(`http://localhost:8081/movies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete movie");
      }

      // Update state by filtering out the deleted movie
      setMovies(movies.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete movie.");
    }
  };

  return (
    <>

      {/* Search bar */}
      <div className="search-input">
        <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </div>

      <h1>Movie List</h1>
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div key={movie.id} className="movie-item">
              <p>{movie.title}</p>
              <button className="delete-button" onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
            </div>
          ))
        ) : (
        <p>No movies found</p>
      )}

      {/* Add Movie Form */}
      <form onSubmit={handleAddMovie}>
        <input
          type="text"
          placeholder="Enter movie title"
          value={newMovie}
          onChange={handleInputChange}
        />
        <button type="submit">Add Movie</button>
      </form>

    </>
  )
}

export default App
