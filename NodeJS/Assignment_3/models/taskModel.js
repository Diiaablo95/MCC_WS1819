const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TaskSchema = new Schema({
    id: Schema.Types.ObjectId,
    name: {type: String, required: [true, "Name must be specified for a task."]},
    created_date: {type: Date, default: Date.now},
    status: {type: String, enum: ["pending", "ongoing", "completed"], default: "pending"}
});

// Export the model
module.exports = mongoose.model('Task', TaskSchema);