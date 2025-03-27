const express = require('express')
const app = express();
const PORT = 8080;
const cors = require('cors');
const knex = require('knex')(require('../knexfile.js')["development"])
app.use(cors())

// const movies = [
//     {title: 'Mean Girls'},
//     {title: 'Hackers'},
//     {title: 'The Grey'},
//     {title: 'Sunshine'},
//     {title: 'Ex Machina'},
//   ];

app.get('/', (req, res) =>{
    res.status(200).send("Application up and running.")
})

app.get('/movies', (req, res) => {
  knex('movies')
    .select('*')
    .then(data => res.json(data))
})

app.listen(PORT, () => console.log(`Express server is listening on ${PORT}.`))