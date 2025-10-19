import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request: Request) {
    await dbConnect()

    try {
        const cookieStore = await cookies()
        const refreshToken = cookieStore.get('refreshToken')?.value

        if (!refreshToken) return Response.json({
            success: false,
            isSignedIn: false,
            message: "No Refresh Token in cookies"
        }, { status: 200 })

        interface decodedToken {
            userId: string
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as decodedToken
        if (!refreshToken) return Response.json({
            success: false,
            isSignedIn: false,
            message: "Invalid Refresh Token"
        }, { status: 200 })

        const user = await userModel.findById(decoded.userId).select("-password -refreshToken")

        return Response.json({
            success: true,
            isSignedIn: true,
            user
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Ambigious problem with checking user's signed-in status"
        }, { status: 404 })
    }
}