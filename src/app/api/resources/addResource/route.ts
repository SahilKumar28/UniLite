import dbConnect from "@/lib/dbConnect"
import resourceModel from "@/models/Resource"
import userModel from "@/models/User"
import mongoose from "mongoose"


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

        console.log(userId)


        const newResource = new resourceModel({
            semester,
            topic,
            description,
            link,
            contributedBy: userId ? userId : undefined,
            pushed: [],
            pulled: []
        })
        

        await newResource.save()

        if(userId) {
            const user = await userModel.findById(userId)
            user.contributed.push(newResource._id)
            await user.save()
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