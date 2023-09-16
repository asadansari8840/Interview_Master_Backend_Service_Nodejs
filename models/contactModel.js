import mongoose from "mongoose";
import validator from "validator";


const contactSchema = new mongoose.Schema({
    contactName: {
        type: String,
        required: [true, 'Contact name is required'],
    },
    mobileNo: {
        type: String,
        required: [true, 'Mobile no is required'],
        minLength: [8, 'Mobile no should be atleast 8 characters'],
        maxLength: [12, 'Mobile no cannot be more than 12 characters'],
    },
    spoc: {
        type: String,
        required: [true, 'Spoc is required'],
        default: 'Anonymous User',
    },
    email: {
        type: String,
        validate: [validator.isEmail, 'Please enter a valid email id'],
        required: [true, 'Email id is required'],
        unique: [true, 'Email already exists !'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


export default mongoose.model('Contacts', contactSchema);