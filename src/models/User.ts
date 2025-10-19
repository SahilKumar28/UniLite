import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    },

    pushed: [String],

    pulled: [String],

    cart: [String]
})

const userModel = mongoose.models.User || mongoose.model("User", userSchema)

export default userModel