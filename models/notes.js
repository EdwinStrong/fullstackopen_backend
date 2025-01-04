const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

//Conexión a BD
const url = process.env.MONGODB_URI

//`mongodb+srv://fullstack:${password}@cluster0.fn0xe.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

console.log("connecting to ", url)

mongoose.connect(url)
    .then(result => {
        console.log("Connected to DB")
    }).catch(error => {
        console.log("Error connecting to MongoDB: ", error.message)
    })

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

//Quitar atributos de id y _v de esquema
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

//const Note = mongoose.model('Note', noteSchema)
module.exports = mongoose.model("Note", noteSchema)