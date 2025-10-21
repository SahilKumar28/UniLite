'use client'
import { AuthContext } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useContext } from "react"

const layout =  () => {

    const router = useRouter()
    const { user, loading } = useContext(AuthContext)
    if (user) {
        router.push(`/semester/${user.semester}`)
    }

    return (
        <>

        </>
    )
}

export default layout