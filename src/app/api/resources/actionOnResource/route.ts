import resourceModel from "@/models/Resource"
import userModel from "@/models/User"
import { Types } from "mongoose"

export async function POST(request: Request) {

    interface itemType{
        resourceDocId: Types.ObjectId,
        resourceId: Types.ObjectId
    }

    try {
        const { resourceDocId, resourceId, userId, action } = await request.json()

        if (!resourceDocId) return Response.json({
            status: false,
            message: 'ResourceId is missing'
        }, { status: 200 })

        if (!userId) return Response.json({
            status: false,
            message: 'UserId is missing'
        }, { status: 200 })

        if (!resourceId) return Response.json({
            status: false,
            message: 'ResourceId is missing'
        }, { status: 200 })

        if (!action) return Response.json({
            status: false,
            message: 'Action is missing'
        }, { status: 200 })

        const user = await userModel.findById(userId)

        if (!user) return Response.json({
            status: false,
            message: 'User does not exist'
        }, { status: 200 })

        const userSemester = user.semester

        const resourceDoc = await resourceModel.findById(resourceDocId)

        const resourceSemester = resourceDoc.semester

        if (userSemester < resourceSemester) return Response.json({
            status: false,
            message: `Student of semester ${userSemester} can not perform any action on the resource of semester ${resourceSemester}`
        }, { status: 200 })


        const resource = resourceDoc.links.id(resourceId)

        console.log(action)
        if (action === 'pushUp') {
            resource.pushedBy.push(userId)
            user.pushed.push({ resourceDocId: resourceDoc._id, resourceId: resource._id })
        }

        else if (action === "pushDown") {
            const idx = resource.pushedBy.indexOf(userId)
            resource.pushedBy.splice(idx, 1)


            const idxUser = user.pushed.findIndex(
                item =>
                    item.resourceDocId.toString() === resourceDoc._id.toString() &&
                    item.resourceId.toString() === resource._id.toString()
            )

            user.pushed.splice(idxUser, 1)
        }

        else if (action === 'pullUp') {
            resource.pulledBy.push(userId)
            user.pulled.push({ resourceDocId: resourceDoc._id, resourceId: resource._id })
        }

        else if (action === "pullDown") {
            const idx = resource.pulledBy.indexOf(userId)
            resource.pulledBy.splice(idx, 1)

            const idxUser = user.pulled.findIndex(
                item =>
                    item.resourceDocId.toString() === resourceDoc._id.toString() &&
                    item.resourceId.toString() === resource._id.toString()
            )

            user.pulled.splice(idxUser, 1)
        }

        else if (action === "pushUp&pullDown") {
            resource.pushedBy.push(userId)
            user.pushed.push({ resourceDocId: resourceDoc._id, resourceId: resource._id })

            const idx = resource.pulledBy.indexOf(userId)
            resource.pulledBy.splice(idx, 1)

            const idxUser = user.pulled.findIndex(
                item =>
                    item.resourceDocId.toString() === resourceDoc._id.toString() &&
                    item.resourceId.toString() === resource._id.toString()
            )

            user.pulled.splice(idxUser, 1)
        }

        else if (action === "pushDown&pullUp") {
            const idx = resource.pushedBy.indexOf(userId)
            resource.pushedBy.splice(idx, 1)

            const idxUser = user.pushed.findIndex(
                item =>
                    item.resourceDocId.toString() === resourceDoc._id.toString() &&
                    item.resourceId.toString() === resource._id.toString()
            )

            user.pushed.splice(idxUser, 1)

            resource.pulledBy.push(userId)
            user.pulled.push({ resourceDocId: resourceDoc._id, resourceId: resource._id })
        }

        await user.save()
        await resourceDoc.save()

        return Response.json({
            status: true,
            message: 'Action performed successfully'
        }, { status: 200 })


    } catch (error) {

        return Response.json({
            status: false,
            message: 'Ambigious problem while pushing the resource'
        }, { status: 404 })

    }






}