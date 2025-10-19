import jwt from "jsonwebtoken"

export function generateAccessToken(userId: string, email: string) {
    return jwt.sign(
        { userId, email },
        process.env.ACCESS_TOKEN_SECRET!,
        { expiresIn: "15m" }
    )
}

export function generateRefreshToken(userId: string) {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "7d" }
    )
}



