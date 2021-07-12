const { request, response, json } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()
const Contact = require('./models/mongo')
const PORT = process.env.PORT

morgan.token('json', (req, res) => {
  return JSON.stringify(req.body)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name == 'ValidationError'){
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :res[content-length] - :response-time ms :json'))
app.use(cors())

app.delete('/api/persons/:id', (request, response) => {
  Contact.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const person = request.body
  const contact = new Contact({
    name: person.name,
    number: person.number,
    id: Math.floor(Math.random() * 1000)
  })
  contact
    .save()
    .then((saved) => {
      response.json(saved)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const contact = {
    name: body.name,
    number: body.number
  }
  Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
    .then((updatedContact) => {
      response.json(updatedContact)
    })
    .catch((error) => next(error))
})

app.get('/api/persons', (request, response) => {
  Contact.find({}).then((contacts) => response.json(contacts))
})
app.get('/info', (request, response) => {
  Contact.find({}).then((contacts) =>
    response.send(`Phonebook has ${contacts.length} people<br/> ${new Date()}`)
  )
})
app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then((contact) => {
      response.json(contact)
    })
    .catch((error) => next(error))
})

app.listen(PORT, () => {
  console.log(`Server up on port: ${PORT}`)
})

app.use(errorHandler)
