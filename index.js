require('dotenv').config();

//Importar modulo de server web
const express = require('express')
const cors = require('cors')
const Note = require('./models/notes')

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

//ENDPOINTS 

//GET
app.get('/', (request, response) => {
  response.send('<h1>hello world</h1>')
})

//ENDPOINT ESPECIFICO
app.get("/api/notes", (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

//GET BY ID
app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if(note){
        response.json(note)
      }else{
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//DELETE
app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  //response.status(200).json({"New list: ": notes})
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
  const note = new Note( {
    content: body.content,
    important: Boolean(body.important) || false
  })

  note.save().then(savedNote => {
    response.json(note)
  })
})

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

//Si la ruta solicitada no coincide con ninguna definida en el servidor, 
//Express continúa evaluando el siguiente middleware.

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//SI error tiene un valor, se ejecuta en vez de unknown endpoint
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// este debe ser el último middleware cargado, ¡también todas las rutas deben ser registrada antes que esto!
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server runninga on port ${PORT}`)
})