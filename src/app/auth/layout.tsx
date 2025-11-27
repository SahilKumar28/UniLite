'use client'
import { AuthContext } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Children, useContext } from "react"

const layout = ({ children }: { children: React.ReactNode }) => {

    const router = useRouter()
    const { user, loading } = useContext(AuthContext)
    if (user) {
        router.push(`/semester/${user.semester}`)
    }

    return (
        <>{children}</>
    )
}

export default layout