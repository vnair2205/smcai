const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firebaseUid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, trim: true },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;