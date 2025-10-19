import mongoose from "mongoose"

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
    push: {
        type: Number,
        required: true,
        default: 0
    },
    pull: {
        type: Number,
        required: true,
        default: 0
    },
}) 

resourceSchema.index({ semester: 1, topic: 1 })

const resourceModel = (mongoose.models.Resource) || mongoose.model("Resource", resourceSchema)

export default resourceModel