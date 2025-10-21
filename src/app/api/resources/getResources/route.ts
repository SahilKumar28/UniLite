import dbConnect from "@/lib/dbConnect";
import resourceModel from "@/models/Resource";
import userModel from "@/models/User";

export async function GET(request: Request) {
    await dbConnect()

    try {

        const { searchParams } = new URL(request.url)
        const requiredTopic = searchParams.get("requiredTopic")
        const no = searchParams.get("no")
        const userId = searchParams.get('userId')

        const user = await userModel.findById(userId)

        if (!requiredTopic) {
            return Response.json({
                success: false,
                message: 'Topic field is missing'
            }, { status: 200 })
        }

        const requiredTopicDoc = await resourceModel.findOne({ topic: requiredTopic, semester: no })

        if (!requiredTopicDoc) {
            return Response.json({
                success: false,
                message: 'No resources found'
            }, { status: 200 })
        }

        let actionsDoneInPast: number[] = []
        if (user) {

            requiredTopicDoc.links.map((resource, i) => {

                let pushedIndex = user.pushed.findIndex(
                    item =>
                        item.resourceDocId.toString() === requiredTopicDoc._id.toString() &&
                        item.resourceId.toString() === resource._id.toString()
                )
                let value = 0

                if (pushedIndex !== -1) value = 1

                else {
                    let pulledIndex = user.pulled.findIndex(
                        item =>
                            item.resourceDocId.toString() === requiredTopicDoc._id.toString() &&
                            item.resourceId.toString() === resource._id.toString()
                    )

                    if (pulledIndex !== -1) value = -1
                }


                actionsDoneInPast.push(value)
            })

        }
        console.log(actionsDoneInPast)




        return Response.json({
            success: true,
            message: 'Resources fetched successfully',
            requiredTopicDoc,
            actionsDoneInPast
        }, { status: 200 })

    } catch (error) {

        return Response.json({
            success: false,
            message: 'Ambigious problem with fetching the resources'
        }, { status: 404 })

    }
}