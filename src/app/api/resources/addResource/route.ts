import dbConnect from "@/lib/dbConnect"
import resourceModel from "@/models/Resource"


export async function POST(request: Request) {

    
    await dbConnect()

    try {
        const { semester, topic, description, link } = await request.json()

        if (!semester || !topic || !description || !link) {
            return Response.json({
                success: false,
                message: 'Mandatary fields missing'
            }, { status: 200 })
        }

        const newResource = new resourceModel({
            semester,
            topic,
            description,
            link,
            push:0,
            pull:0
        })
       
        await newResource.save()
        

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