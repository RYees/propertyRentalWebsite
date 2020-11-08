
const mongoose = require('mongoose');


const PermissionSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    guard_name: { type: String, default: 'API' },
    created_at: { type: Date ,default: new Date()},
    updated_at: { type: Date, default: new Date() }
})

// methods

// attributes

module.exports = mongoose.model('Permissions', PermissionSchema);
