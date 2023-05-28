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
app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
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
    // check if name is unique
    const name = persons.find(person => person.name===body.name)

    if(name){
        return response.status(400).json({
            error:"name must be unique"
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number:body.number
    }
    persons.concat(person)

    response.json(person)
})


const PORT  = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server runninng on port ${PORT}`)
})
