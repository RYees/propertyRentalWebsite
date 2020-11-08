
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const reqString = {
  type: String,
  required: true
}
const priceSchema = new mongoose.Schema({
  amount: reqString,
  type: reqString
})
const hcontentSchema = new mongoose.Schema({
  bedrooms: reqString,
  bathrooms: reqString,
  no_of_floors: reqString,
  amenities: { type: String, default: '' }
})
const addressSchema = new mongoose.Schema({
  sub_city: reqString,
  city: reqString,
  area: reqString,
  coordinates: { type: String, default: '' }
})
const imageSchema = new mongoose.Schema({
  image1: reqString,
  image2: reqString,
  image3: reqString,
  })
const propertySchema = new mongoose.Schema({
  prop_type: { type: String, default: '' },
  address: [addressSchema],
  price: [priceSchema],
  image: [imageSchema],
  prop_contents: [hcontentSchema],
  notes: { type: String, default: '' },
  area_in_m2: { type: String, required: true },
  broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker', required: true },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: new Date() }
})


propertySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Property', propertySchema);

