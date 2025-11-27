import { rearrangeResources } from "@/components/rearrangeResources"
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

            if (userId) {
                const user = await userModel.findById(userId)
                const addedResource = sameTopicExist.links[sameTopicExist.links.length - 1]
                user.contributed.push({ resourceDocId: sameTopicExist._id, resourceId: addedResource._id })
                await user.save()
            }
            setImmediate(() => {
                rearrangeResources(sameTopicExist._id)
                    .then(res => console.log('✅ Rearranged successfully:', res))
                    .catch(err => console.error('❌ Rearrangement failed:', err))
            })
        }

        else {
            const newResourcesDoc = new resourceModel({
                semester,
                topic,
                description,
                links: [{
                    link,
                    contributedBy: userId ? userId : undefined,
                    pushedBy: [],
                    pulledBy: [],
                    description
                }]

            })

            await newResourcesDoc.save()
            if (userId) {
                const user = await userModel.findById(userId)
                const addedResource = newResourcesDoc.links[0]
                user.contributed.push({ resourceDocId: newResourcesDoc._id, resourceId: addedResource._id })
                await user.save()
            }
            setImmediate(() => {
                rearrangeResources(newResourcesDoc._id)
                    .then(res => console.log('✅ Rearranged successfully:', res))
                    .catch(err => console.error('❌ Rearrangement failed:', err))
            })
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