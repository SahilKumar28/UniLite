import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import resourceModel from "@/models/Resource";
import userModel from "@/models/User";

export async function rearrangeResources(resourceDocId: string) {
    await dbConnect();
    console.log('started rearranging resources')
    const resourceDoc = await resourceModel.findById(resourceDocId);
    if (!resourceDoc) return { status: false, message: "Resource not found" };

    if (resourceDoc.links.length <= 5) {
        return { status: false, message: "<= 50 resources" };
    }

    console.log('reached 0')


    const currDate = new Date();
    let resourcesOlderThan2Days = 0;
    let allResourcesIds: string[] = []
    let resourcesYoungerThan2Days: string[] = []

    resourceDoc.links.forEach((r) => {
        const diff = currDate.getTime() - new Date(r.createdAt).getTime();
        if (diff > 2 * 60 * 1000) resourcesOlderThan2Days++;
        else resourcesYoungerThan2Days.push(r._id)

        allResourcesIds.push(r._id.toString())
    });


    console.log('reached 1')
    console.log(resourcesOlderThan2Days)
    if (resourcesOlderThan2Days <= 5) {
        return { status: false, message: "<= 50 docs older than 2 days" };
    }

    const resourcesToBeRemoved = resourcesOlderThan2Days - 5;


    const aggResult = await resourceModel.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(resourceDocId) }
        },
        { $unwind: "$links" },
        {
            $match: {
                "links.createdAt": {
                    $lt: new Date(Date.now() - 2 * 60 * 1000)
                }
            }
        },
        {
            $addFields: {
                pushedCount: { $size: "$links.pushedBy" },
                pulledCount: { $size: "$links.pulledBy" },
                score: {
                    $cond: {
                        if: { $eq: [{ $add: ["$pushedCount", "$pulledCount"] }, 0] },
                        then: 0,
                        else: {
                            $multiply: [
                                {
                                    $divide: [
                                        {
                                            $add: [
                                                { $multiply: [0.5, "$pushedCount"] },
                                                { $multiply: [0.5, "$pulledCount"] }
                                            ]
                                        },
                                        { $add: ["$pushedCount", "$pulledCount"] }
                                    ]
                                },
                                100
                            ]
                        }
                    }
                }
            }
        },
        { $sort: { score: 1 } },
        { $skip: resourcesToBeRemoved },
        { $sort: { score: -1 } },
        {
            $group: {
                _id: "$_id",
                topic: { $first: "$topic" },
                semester: { $first: "$semester" },
                sortedLinks: {
                    $push: {
                        _id: "$links._id",
                        link: "$links.link",
                        description: "$links.description",
                        contributedBy: "$links.contributedBy",
                        pushedBy: "$links.pushedBy",
                        pulledBy: "$links.pulledBy",
                    }
                }
            }
        }
    ]);

    if (!aggResult.length) {
        return { status: false, message: "No aggregation result" };
    }
    console.log('reached2')

    const remainingResourceIds = aggResult[0].sortedLinks.map((obj) => obj._id.toString())

    const deletedResourceIds = allResourcesIds.filter((id) => !remainingResourceIds.includes(id) && !resourcesYoungerThan2Days.includes(id))

    console.log(JSON.stringify(aggResult, null, 2))

    await resourceModel.updateOne(
        { _id: resourceDocId },
        {
            $pull: {
                links: { _id: { $in: deletedResourceIds } }
            }
        }
    )

    console.log(1)
    await userModel.updateMany(
        {},
        {
            $pull: {
                pushed: { resourceId: { $in: deletedResourceIds } },
                pulled: { resourceId: { $in: deletedResourceIds } },
                contributed: { resourceId: { $in: deletedResourceIds } },
            }
        }
    );

    return { status: true, output: aggResult };
}
