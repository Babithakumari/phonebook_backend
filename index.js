require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())
const morgan = require("morgan")
const Person = require("./models/person.js")

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]
// create new token
morgan.token('data', function (req,res) {
    
    return JSON.stringify(req.body)

})

// serve static files
app.use(express.static('build'))

// configure morgan middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

// parse JSON data to body property
app.use(express.json())

app.get("/", (request,response) => {
    response.send("Hello world")
})

// get all entries
app.get("/api/persons", (request,response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get("/info", (request,response) => {
    const output = `Phonebook has info for ${persons.length} people</br></br> ${new Date()}`
    response.send(output)
})

// get a single phonebook entry
app.get("/api/persons/:id", (request,response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })

})

//delete a resource
app.delete('/api/persons/:id', (request,response,next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
   
})

const generateId = () => {
    const max = 5000
    const id = Math.floor(Math.random() * max)
    

    return id

}
// add a new resource
app.post("/api/persons",(request,response) =>{
    
    const body = request.body

    if(!body.name){
        return response.status(400).json({
            error:"name missing"
        })
    }
    if(!body.number){
        return response.status(400).json({
            error:"number missing"
        })
    }
    
    const person = new Person({
        id: generateId(),
        name: body.name,
        number:body.number
    })
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

    
})

// update an entry
app.put("/api/persons/:id", (request,response,next) => {
    const body = request.body

    const person = {
        "name": body.name,
        "number":body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, {new:true})
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request,response, next) => {
    console.log(error.message)
    //response.status(500).end()

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
      } 
    
      next(error)
}
app.use(errorHandler)

const PORT  = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server runninng on port ${PORT}`)
})
