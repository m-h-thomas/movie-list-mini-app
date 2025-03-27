import { useEffect, useState } from 'react'
import './App.css'

function App() {

  //Set movie in state
  const [movie, setMovie] = useState([]);
  const [search, setSearch] = useState("");

  //Fetch movie list from database
  useEffect(() => {
    fetch(`http://localhost:8080/movies`)
    .then(res => res.json())
    .then(movie => setMovie(movie))
  }, [])

  //Handle search
  const filteredMovies = movie.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
)

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

      {(filteredMovies.map((movie, index) => <p key={index}>{movie.title}</p>))}

    </>
  )
}

export default App
