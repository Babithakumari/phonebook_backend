const express = require("express")
const app = express()

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
// parse JSON data to body property
app.use(express.json())

app.get("/", (request,response) => {
    response.send("Hello world")
})

app.get("/api/persons", (request,response) => {
    response.json(persons)
})

app.get("/info", (request,response) => {
    const output = `Phonebook has info for ${persons.length} people</br></br> ${new Date()}`
    response.send(output)
})

// get a single phonebook entry
app.get("/api/persons/:id", (request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id==id)

    if(person){
        response.send(person)
    }
    else{
        response.status(404).end()
    }
    
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

    const person = {
        id: generateId(),
        name: body.name,
        number:body.number
    }
    persons.concat(person)

    response.json(person)
})


const PORT  = 3001
app.listen(PORT, () => {
    console.log(`Server runninng on port ${PORT}`)
})
