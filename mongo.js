const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}
if(process.argv.length == 4){
  console.log('give number')
  process.exit(1);
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.nvxkh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
  name: name,
  number: number,
  id: Math.floor(Math.random() * 100)
})

if(process.argv.length == 5){
  contact.save().then((response) => {
    console.log('contact saved!')
    mongoose.connection.close()
  })
}
else{
  console.log('Phonebook:')
  Contact.find({}).then(result=> {
    result.forEach(contact => {
      console.log(`${contact.name} ${contact.number}`)
    })
    mongoose.connection.close()
  })
}

