import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [movie, setMovie] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/movies`)
    .then(res => res.json())
    .then(movie => setMovie(movie))
  }, [])

  return (
    <>
      <h1>Movie List</h1>
      {(movie.map((movie, index) => <p key={index}>{movie.title}</p>))}
    </>
  )
}

export default App
