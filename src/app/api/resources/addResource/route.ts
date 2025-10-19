import dbConnect from "@/lib/dbConnect"
import resourceModel from "@/models/Resource"
import userModel from "@/models/User"


export async function POST(request: Request) {


    await dbConnect()

    try {
        const { semester, topic, description, link, userId } = await request.json()

        if (!semester || !topic || !description || !link) {
            return Response.json({
                success: false,
                message: 'Mandatary fields missing'
            }, { status: 200 })
        }

        const newLink = {
            link,
            contributedBy: userId ? userId : undefined,
            pushed: [],
            description,
            pulled: []
        }
        const sameTopicExist = await resourceModel.findOne({ topic: topic })


        if (sameTopicExist) {
            sameTopicExist.links.push(newLink)
            await sameTopicExist.save()

            if(userId) {
                const user = await userModel.findById(userId)
                const addedResource = sameTopicExist.links[sameTopicExist.links.length-1]
                user.contributed.push( { resourceId: sameTopicExist._id, linkId: addedResource._id } )
                await user.save()
            }
        }

        else {
            const newResource = new resourceModel({
                semester,
                topic,
                description,
                links: [{
                    link,
                    contributedBy: userId ? userId : undefined,
                    pushed: [],
                    pulled: [],
                    description
                }]

            })

            await newResource.save()
            if (userId) {
                const user = await userModel.findById(userId)
                const addedResource = newResource.links[0]
                user.contributed.push({ resourceId: newResource._id, linkId: addedResource._id })
                await user.save()
            }
        }


        return Response.json({
            success: true,
            message: 'Resource added successfully'
        }, { status: 200 })

    } catch (error) {

        return Response.json({
            success: false,
            message: 'Ambigious problem with adding a resource'
        }, { status: 404 })

    }

}