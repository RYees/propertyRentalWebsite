
const mongoose = require('mongoose');


const RoleSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permissions' }],
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() }
})

// methods

// attributes

module.exports = mongoose.model('Roles', RoleSchema);
