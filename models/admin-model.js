
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcryptjs')


const adminSchema = new mongoose.Schema({
  name: { type: String, default: '',required:true,unique: true},
  username: { type: String, default: '' ,required:true},
  email: { type: String, unique: true, trim: true, lowercase: true, required: true },
  password: { type: String, required: true, minlength: 8, maxlength: 128 },
  password_changed_at: { type: Date },
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Roles' }],
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permissions' }],
  fcm: { type: String, default: '' },
  last_login: { type: Date, default: new Date() },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() }
})


adminSchema.pre('save', function preSave(next) {
  let model = this
if(model.isModified('password')){
  model.hashPasswd(model.password, (err, hash) => {
    model.password = hash
    next()
  })
}
 else{
   next()
 }
})


adminSchema.method({
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

adminSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Admin', adminSchema);

