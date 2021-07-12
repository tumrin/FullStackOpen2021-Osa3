const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const url = process.env.MONGODB_URI

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const contactSchema = new mongoose.Schema({
  name: {type:String, required:true, unique:true, minlength: 3},
  number: {type:String, required:true, unique:true, minlength: 8},
})
contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.__v
    delete returnedObject._id
  }
})

const Contact = mongoose.model('Contact', contactSchema)

module.exports = mongoose.model('Contact', contactSchema)
