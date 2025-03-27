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
    fetch("http://localhost:8081/movies")
      .then((res) => res.json())
      .then((movies) => setMovies(movies))
      .catch((err) => console.log(err));
  }, []);
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

  const toggleWatched = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8081/movies/${id}/watched`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ watched: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update watched status");
      }

      const updatedMovie = await response.json();

      // Update state with the new watched status
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === updatedMovie.id ? updatedMovie : movie
        )
      );
    } catch (error) {
      console.error("Error updating watched status:", error);
      alert("Failed to update watched status.");
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
             <p className="movie-title">{movie.title}</p>

            {/* Watched Toggle Container */}
            <div className="toggle-container">
              <label className="toggle-label">Watched?</label>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={movie.watched}
                  onChange={() => toggleWatched(movie.id, movie.watched)}
                />
                <span className="slider round"></span>
              </label>
            </div>

            <button className="delete-button" onClick={() => handleDeleteMovie(movie.id)}>
              Delete
            </button>
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
