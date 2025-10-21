'use client'

import axios from "axios"
import mongoose from "mongoose"
import { createContext, ReactNode, useEffect, useState } from "react"

interface User {
    _id: string,
    username: string,
    email: string,
    pushed: [string],
    pulled: [string],
    semester: number
}

interface AuthContextType {
    user: User | null,
    setUser: (user: User | null) => void,
    loading: boolean
}

interface props {
    children: ReactNode
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    loading: true
})

export const AuthProvider = ({ children }: props) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/api/auth/check')
                if (response.data.isSignedIn) setUser(response.data.user)
            } catch (error) {
                console.error("Auth check failed:", error);
                setUser(null);
            }
            finally{
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}