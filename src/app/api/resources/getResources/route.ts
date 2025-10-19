import dbConnect from "@/lib/dbConnect";
import resourceModel from "@/models/Resource";

export async function GET(request: Request) {
    await dbConnect()

    try {

        const { searchParams } = new URL(request.url)
        const requiredTopic = searchParams.get("requiredTopic")
        const no = searchParams.get("no")


        if (!requiredTopic) {
            return Response.json({
                success: false,
                message: 'Topic field is missing'
            }, { status: 200 })
        }

        const requiredTopicResources = await resourceModel.find({ topic: requiredTopic, semester: no })

        if (!requiredTopicResources) {
            return Response.json({
                success: false,
                message: 'No resources found'
            }, { status: 200 })
        }

        return Response.json({
            success: true,
            message: 'Resources fetched successfully',
            resources: requiredTopicResources
        }, { status: 200 })

    } catch (error) {

        return Response.json({
            success: false,
            message: 'Ambigious problem with fetching the resources'
        }, { status: 404 })

    }
}