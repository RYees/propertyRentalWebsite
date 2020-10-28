
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcrypt')
//const Notification = require('./Notification-model.js').Notification;
const brokerSchema = new mongoose.Schema({
  
    //_id: mongoose.Schema.Types.ObjectId,
    bname:{type: String, default: '' },
    username: { type: String, default: '' },
    email: { type: String, unique: true, trim: true, lowercase: true, required: true},
    phone: { type: String, default: '' },
    address: {type: String, default: '' },
    photo: { type: String, default:'' },
    password: { type: String, required: true, minlength: 8, maxlength: 128},
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

// methods
/*
brokerSchema.post('save', function(doc) {
  var NewData = new Notification({
      broker_id: doc._id,
      text: "new Broker Registered"
  });

  NewData.save(function(err, notification_data) {
      // any error logging or other operations
  });
});/*/
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
