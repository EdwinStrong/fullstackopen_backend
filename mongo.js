const mongoose = require('mongoose')


//Para correrlo, usar: node mongo.js feb3fEqX7w1cVRgt

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

/* CONECTAR A MONGO DB */

// /noteApp para NO enviar datos a test
const url =
    `mongodb+srv://fullstack:${password}@cluster0.fn0xe.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

//Conectar a la BD
mongoose.connect(url)

/* DEFINIR ESQUEMA E DATOS A ENVIAR */

//Esquema para la nota (los campos que guardará en la tabla)
const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})
const Note = mongoose.model('Note', noteSchema)

//Crear una instancia usando el modelo del esquema
const note = new Note({
    content: 'HTML is easy',
    important: true,
})

/* GUARDAR OBJETO EN LA BASE DE DATOS 

note.save().then(result => {
  console.log('note saved!')
  mongoose.connection.close() //Cerrar conexión
})

*/

/* OBTENER OBJETOS DE LA BASE DE DATOS */

//Notas importantes
// Note.find({ important: true }).then(result => {

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})