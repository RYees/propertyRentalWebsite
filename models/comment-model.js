const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const commentSchema = new mongoose.Schema({
    //_id: mongoose.Schema.Types.ObjectId,
    bro_comment: { type: String, default: '' },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },
    created_at: { type: Date }
})

// methods
commentSchema.plugin(mongoosePaginate);
// attributes

module.exports = mongoose.model('Comment', commentSchema);
