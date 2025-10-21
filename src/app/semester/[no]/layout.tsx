'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useParams, useRouter } from "next/navigation";
import { motion } from 'framer-motion'
import { useContext, useEffect, useState } from "react";
import { calculateTime } from "@/components/calculateTime";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/contexts/AuthContext";




export default function innerLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    const params = useParams()

    const {user, loading} = useContext(AuthContext)

    const { no } = params

    const components: { title: string; href: string }[] = [
        {
            title: "Resources",
            href: `/semester/${no}/resources`,
        },
        {
            title: "Instructor Walkthrough",
            href: `/semester/${no}/instructorGuide`,
        },
        {
            title: 'Experiences',
            href: `/semester/${no}/experiences`
        },
        {
            title: loading ? '...' : user ? `Hey, ${user.username}` : 'Sign-in',
            href: '/auth/sign-in'
        }
    ]

    const messages = ["Freshie ho!!! 'GPA do not matter, do not matter' karte hoge..."]

    const router = useRouter()

    const [timeLeft, setTimeLeft] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [messageOpened, setMessageOpened] = useState(false)

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTime(Number(no)))
        }, 1000) // har second update

        return () => clearInterval(interval)
    }, [])

    return (
        <div className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-red-300 relative text-white h-screen m-1 border rounded-2xl flex flex-col justify-between`}>



            <motion.div
                className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8 bg-gray-800 text-white p-4 rounded-xl shadow-md mt-10"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <DropdownMenu onOpenChange={(open) => setMessageOpened(open)}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className={`${messageOpened ? 'bg-green-700' : 'bg-red-800'} px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors`}
                        >
                            Hey, listen! We got a message for you
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-4 bg-gray-900 text-white rounded-lg shadow-lg">
                        <span className="text-sm">{messages[Number(no) - 1]}</span>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Navigation Components */}
                <div
                    // optional animation can be added later
                    className="flex flex-wrap gap-4 sm:gap-6 justify-center"
                >
                    {components.map((cmp) => (
                        <div
                            key={cmp.href}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg shadow hover:shadow-lg cursor-pointer transition-all text-center"
                            onClick={() => router.push(cmp.href)}
                        >
                            {cmp.title}
                        </div>
                    ))}
                </div>
            </motion.div>

            {children}


            <motion.div className="flex flex-col items-center justify-center text-lg sm:text-xl font-mono gap-2 p-6 sm:p-8 rounded-2xl shadow-lg bg-gradient-to-br from-gray-800 via-gray-900 to-black  text-gray-100 border border-gray-700"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >

                <span className="text-3xl font-bold tracking-wide text-blue-400">
                    {timeLeft.years} <span className="text-gray-300 font-light">years</span>
                </span>

                <div className="flex gap-4 mt-2">
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-semibold text-pink-400">{timeLeft.days}</span>
                        <span className="text-xs uppercase text-gray-400">days</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-semibold text-green-400">{timeLeft.hours}</span>
                        <span className="text-xs uppercase text-gray-400">hrs</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-semibold text-yellow-400">{timeLeft.minutes}</span>
                        <span className="text-xs uppercase text-gray-400">mins</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-2xl font-semibold text-red-400">{timeLeft.seconds}</span>
                        <span className="text-xs uppercase text-gray-400">secs</span>
                    </div>
                </div>
            </motion.div>


        </div>
    )
}

