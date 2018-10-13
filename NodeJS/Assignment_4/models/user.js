const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {type: String, required: true, trim: true, unique: true},
    username: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true}
})

module.exports = mongoose.model('UserSchema', UserSchema)