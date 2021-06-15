const { request, response, json } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = Process.env.PORT || 3001
app.use(express.json())
morgan.token('json', (req, res) => {return JSON.stringify(req.body)})

//app.use(express.static('build'))
app.use(morgan(':method :url :res[content-length] - :response-time ms :json'))
app.use(cors())

let persons = 
    [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
    ]

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
    
})
app.post('/api/persons', (request, response) => {
  const id = Math.floor(Math.random() * 1000)
  const person = request.body
  person.id = id
  if(!person.name || !person.number){
    response.status(400).json({error:'both name and number required'})
  }
  else if(persons.some(p => person.name === p.name)){
    response.status(400).json({error:'name must be unique'})
  }
  else{
    persons.push(person)
    response.json(person)
  }
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/info', (request, response) => {
    response.send(`Phonebook has ${persons.length} people<br/> ${new Date()}`)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id == id)
    person?response.json(person):response.status(404).json({error:'person not found'})
})


app.listen(PORT, ()=>{
    console.log(`Server up on port: ${PORT}`)
})