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
        const requiredTopicDoc = await resourceModel.findOne({ topic: requiredTopic, semester: no })

        console.log(requiredTopicDoc)

        if (!requiredTopicDoc) {
            return Response.json({
                success: false,
                message: 'No resources found'
            }, { status: 200 })
        }


        return Response.json({
            success: true,
            message: 'Resources fetched successfully',
            requiredTopicDoc
        }, { status: 200 })

    } catch (error) {

        return Response.json({
            success: false,
            message: 'Ambigious problem with fetching the resources'
        }, { status: 404 })

    }
}