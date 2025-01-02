//Importar modulo de server web
const express = require('express')
const cors = require('cors')

const app = express()

/* Middlewares */


const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method)
  console.log("Path: ", request.path)
  console.log("Body: ", request.body)
  console.log("---")
  next() //No enviar respuesta a cliente
}

//Para post
app.use(cors())
app.use(express.json())

//Mostrar vista estática (react)
app.use(express.static('dist'))

app.use(requestLogger)

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

//ENDPOINTS 

//GET
app.get('/', (request, response) => {
  response.send('<h1>hello world</h1>')
})

//ENDPOINT ESPECIFICO
app.get("/api/notes", (request, response) => {
  response.json(notes)
})

//GET BY ID
app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id)
  console.log(id)

  const note = notes.find(note => note.id === id)
  console.log(note)

  if(!note){
    response.status(404).json({'error': `Not found Note with id ${id}`})
  }

  response.json(note)
})

//DELETE
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id)

  notes = notes.filter(note => note.id !== id)
  
  //response.status(200).json({"New list: ": notes})
  response.status(204).end()
})

//POST (INSERTAR)
app.post('/api/notes', (request, response) => {

  const body = request.body

  //Verificar existencia de atributo content de JSON raw
  if(!body.content){
    return response.status(400).json(
      {error: "content missing"}
    )
  }

  //Crear nueva nota a agregar
  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

//Si la ruta solicitada no coincide con ninguna definida en el servidor, 
//Express continúa evaluando el siguiente middleware.

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server runninga on port ${PORT}`)
})