
const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  
    //_id: mongoose.Schema.Types.ObjectId,
    
    text: { type: String, default: '' },
    archived: { type: Boolean, default: false },
    last_login: { type: Date },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() }
})

// methods


module.exports = mongoose.model('Notification',  notificationSchema);
