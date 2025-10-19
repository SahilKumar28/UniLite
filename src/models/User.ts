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
    semester: {
        type: String,
        enum: ['1', '2', '3', '4', '5', '6', '7', '8'],
        default: '0'
    },
    refreshToken: {
        type: String
    },

    contributed: [mongoose.Schema.Types.ObjectId],

    pushed: [mongoose.Schema.Types.ObjectId],

    pulled: [mongoose.Schema.Types.ObjectId],

    cart: [mongoose.Schema.Types.ObjectId]
})

const userModel = mongoose.models.User || mongoose.model("User", userSchema)

export default userModel