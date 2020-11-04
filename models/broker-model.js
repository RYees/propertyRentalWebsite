
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcrypt')
const reqString = {
  type: String,
  required: true
}
const bnameSchema = new mongoose.Schema({
  firstName: reqString,
  lastName: reqString
})
const addressSchema = new mongoose.Schema({
  sub_city: reqString,
  city: reqString,
  area: reqString
})
const brokerSchema = new mongoose.Schema({

  //_id: mongoose.Schema.Types.ObjectId,
  bname: [bnameSchema],
  username: { type: String, default: '' },
  email: { type: String, unique: true, trim: true, lowercase: true, required: true},
  phone: { type: String, default: '' },
  address: [addressSchema],
  photo: { type: String, default: '' },
  company: { type: String, default: '' },
  about: { type: String, default: '' },
  rating: { type: String, default: '' },
  favorites: { type: String, default: '' },
  password: { type: String, required: true, minlength: 8, maxlength: 128 },
  password_changed_at: { type: Date },
  active: { type: Boolean, default: false },
  push_token: { type: String, default: '' },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' }],
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permissions' }],
  archived: { type: Boolean, default: false },
  last_login: { type: Date },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() }
})


brokerSchema.pre('save', function preSave(next) {
  let model = this

  model.hashPasswd(model.password, (err, hash) => {
    model.password = hash
    next()
  })
})


brokerSchema.method({
  verifyPassword(passwd) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(passwd, this.password, (err, isMatch) => {
        if (err) {
          return reject(err)
        }

        resolve(isMatch)
      })
    })
  },
  hashPasswd(passwd, cb) {
    let createHash = (err, hash) => {
      if (err) {
        return cb(err)
      }

      cb(null, hash)
    }

    let generateSalt = (err, salt) => {
      if (err) {
        return cb(err)
      }

      // Hash the password using the generated salt
      bcrypt.hash(passwd, salt, createHash)
    }

    // Generate a salt factor
    bcrypt.genSalt(12, generateSalt)
  }
})


// plugins
brokerSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Broker', brokerSchema);
