import mongoose, { Mongoose } from "mongoose"

const resourceSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true,
        min: [1, 'Semester field can not be less than 1'],
        max: [8, 'Semester field can not be greater than 8']
    },
    topic: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    contributedBy: {
        type: mongoose.Schema.Types.ObjectId
    },

    pushedBy: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    pulledBy: {
        type: [mongoose.Schema.Types.ObjectId],
    },
})

resourceSchema.index({ semester: 1, topic: 1 })

const resourceModel = (mongoose.models.Resource) || mongoose.model("Resource", resourceSchema)

export default resourceModel