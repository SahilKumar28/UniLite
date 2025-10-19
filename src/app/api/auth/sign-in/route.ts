import { generateAccessToken, generateRefreshToken } from "@/components/generateTokens";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    await dbConnect()

    try {
        const { email, password } = await request.json()

        if (!email || !password) return Response.json({
            success: false,
            message: "Mandatary fields missing"
        }, { status: 200 })

        const existedUser = await userModel.findOne({ email })

        if (!existedUser) return Response.json({
            success: false,
            message: "User does not exist"
        }, { status: 200 })

        const isPasswordCorrect = await bcrypt.compare(password, existedUser.password)

        if (!isPasswordCorrect) return Response.json({
            success: false,
            message: "Incorrect Password"
        }, { status: 200 })

        const accessToken = generateAccessToken(existedUser.id, existedUser.email)
        const refreshToken = generateRefreshToken(existedUser.id)

        existedUser.refreshToken = refreshToken

        existedUser.save()

        const options = {
            httpOnly: true,
            secure: true
        }

        const response = NextResponse.json({
            success: true,
            accessToken: accessToken,
            message: "Logged in successfully"
        }, { status: 200 })

        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response

    } catch (error) {
        return Response.json({
            success: false,
            message: "Ambigious problem with sending an email"
        }, { status: 404 })
    }
}