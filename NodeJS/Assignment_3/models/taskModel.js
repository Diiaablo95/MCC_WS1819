const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TaskSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, auto: true},
    name: String,
    created_date: Date,
    status: String
});

// Export the model
module.exports = mongoose.model('Task', TaskSchema);