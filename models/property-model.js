
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcrypt')
const reqString = {
    type:String,
    required:true
  }
  const priceSchema = new mongoose.Schema({
    amount: reqString,
    type: reqString
  })
  const hcontentSchema = new mongoose.Schema({
    bedrooms: reqString,
    bathrooms: reqString,
    no_of_floors: reqString,
    amenities: {type: String, default: ''}
  })
  const addressSchema = new mongoose.Schema({
    sub_city:reqString,
    city:reqString,
    area:reqString,
    coordinates:{type: String, default: ''}
})
const propertySchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    prop_type: {type: String, default: ''},
    address: [addressSchema],
    price: [priceSchema],
    image: { type: String, default:'' },
    prop_contents:[hcontentSchema],
    notes: { type: String, default:'' },
    area_in_m2: { type: String, required:true },
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

