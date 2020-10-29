
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcrypt')
const reqString = {
    type:String,
    required:false
}
const bnameSchema = new mongoose.Schema({
    firstName: reqString,
    lastName: reqString
})

const propertySchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    bname: [bnameSchema],
    prop_type: {type: String, default: ''},
    address: { type: String, default: '' },
    price: {type : String, default: ''},
    image: { type: String, default:'' },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker', required:false },
    active: { type: Boolean, default: true },
    push_token: { type: String, default: '' },
    archived: { type: Boolean, default: false },
    last_login: { type: Date },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() }
})


propertySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Property', propertySchema);

