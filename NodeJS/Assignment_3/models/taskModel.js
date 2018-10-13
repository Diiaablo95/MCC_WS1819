const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TaskSchema = new Schema({
    name: {type: String, required: true},
    created_date: {type: Date, required: false, default: Date.now},
    status: {type: [String], enum : ["pending", "ongoing", "completed"], default: ["pending"]}
});

TaskSchema.set('toJSON', {
    virtuals: true
});
TaskSchema.set('toObject', {
    virtuals: true
});

// Export the model
module.exports = mongoose.model('Task', TaskSchema);