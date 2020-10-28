
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const bcrypt = require('bcrypt')
//const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');
const propertySchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    bname: {type: String, default: ''},
    prop_type: {type: String, default: ''},
    address: { type: String, default: '' },
    price: {type : String, default: ''},
    image: { type: String, default:'' },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker', required:true },
    active: { type: Boolean, default: true },
    push_token: { type: String, default: '' },
    archived: { type: Boolean, default: false },
    last_login: { type: Date },
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() }
})

// methods
//propertySchema.index({'$**': 'text'});
//propertySchema.plugin(mongoose_fuzzy_searching, {fields: ['bname']});

// plugins
propertySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Property', propertySchema);

//module.exports.fuzzySearch('Nodejs meetup').then(console.log).catch(console.error);