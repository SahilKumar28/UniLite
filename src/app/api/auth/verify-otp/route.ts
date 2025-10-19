import { redis } from "@/lib/connectRedis";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import bcrypt from 'bcryptjs'


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { otp, email, username, password, semester } = await request.json()

        if (!otp || !email || !username || !password  || !semester) return Response.json({
            success: false,
            message: "Mandatary fields missing"
        }, { status: 200 })

        const storedOtp = await redis.get(`otp:${email}`)

        if (!storedOtp) return Response.json({
            success: false,
            message: "Otp has expired"
        }, { status: 200 })

        

        if (storedOtp !== Number(otp) ) return Response.json({
            success: false,
            message: "Invalid OTP"
        }, { status: 200 })


        
        const hashedPassword = await bcrypt.hash(password, 8)
        
        
        
        const newUser = new userModel({
            username: username,
            email,
            password: hashedPassword,
            semester,
            refreshToken: "",
            contributed: [],
            pushed: [],
            pulled: [],
            cart: []
        })
        
        
        await newUser.save()

        return Response.json({
            success: true,
            message: "User saved successfully"
        }, { status: 200 })

    } catch (error) {
        return Response.json({
            success: false,
            message: "Ambigious problem with verifying the otp"
        }, { status: 404 })
    }
}