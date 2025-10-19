import { sendVerificationEmail } from "@/components/sendEmail";
import { redis } from "@/lib/connectRedis";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()

        if (!username || !email || !password) return Response.json({
            success: false,
            message: "Mandatary fields missing"
        }, { status: 200 })

        const existedUser = await userModel.findOne({ email })

        if (existedUser) return Response.json({
            success: false,
            message: "Email already exists"
        }, { status: 200 })

        const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000

        const emailSent = await sendVerificationEmail(username, String(otp), email)

        if (!emailSent) return Response.json({
            success: false,
            message: "Email not sent"
        }, { status: 200 })

        const expiry = Date.now() + (5 * 60 * 1000)
    
        await redis.set(`otp:${email}`, otp, {ex : 300})


        return Response.json({
            success: true,
            message: "Email sent successfully"
        }, { status: 200 })


    } catch (error) {
        return Response.json({
            success: false,
            message: "Ambigious problem with sending an email"
        }, { status: 404 })
    }

}