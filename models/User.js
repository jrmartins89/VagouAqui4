const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PreferencesSchema = new Schema({
    houseOrApartment: {
        type: String,
        enum: ["House", "Apartment"],
        default: "Apartment"
    },
    genderPreference: {
        type: String,
        enum: ["Men", "Women", "Any"],
        default: "Any"
    },
    acceptsPets: {
        type: Boolean,
        default: false
    },
    location: {
        type: String,
        default: ""
    },
    roommates: {
        type: String,
        enum: ["Alone", "With Roommates"],
        default: "Alone"
    },
    amenities: {
        type: String,
        default: ""
    },
    leaseLength: {
        type: String,
        default: ""
    },
    budget: {
        type: String,
        default: ""
    },
    securityDeposit: {
        type: String,
        default: ""
    },
    wheelchairAccessible: {
        type: Boolean,
        default: false
    },
    noiseLevel: {
        type: String,
        enum: ["Quiet", "Social"],
        default: "Quiet"
    }
    // Add more preference fields as needed
});

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    preferences: PreferencesSchema // Embed the preferences schema
});

module.exports = User = mongoose.model("users", UserSchema);