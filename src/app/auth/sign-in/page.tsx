'use client'
import RotatingGlobe from "@/components/globe"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import Link from "next/link"

const page = () => {


    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [tryingToSignIn, setTryingToSignIn] = useState(false)

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setTryingToSignIn(true)
        try {
            const response = await axios.post('/api/auth/sign-in', { email, password })
            toast(response.data.message)
            if (response.data.success) {
                // router.replace('/semester/1')
                window.location.href = '/semester/1';
            }
        } catch (error) {
            toast("Sorry, Problem with signing in")
        }
        finally {
            setTryingToSignIn(false)
            setEmail("")
            setPassword("")
        }
    }

    return (
        <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 h-screen w-screen flex text-white">
            <div className=" w-1/2 flex flex-col gap-10 justify-center items-center">


                <form onSubmit={(e) => handleSignIn(e)} className="w-full max-w-sm ">
                    <Card className="bg-white/10">
                        <CardHeader>
                            <CardTitle>Sign in to your account</CardTitle>
                            <CardDescription>
                                A step away from beautiful community.
                            </CardDescription>
                            <CardAction>
                                <Button variant="link">Sign in</Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        {/* <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a> */}
                                    </div>
                                    <Input id="password" type="password" placeholder="*******" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button type="submit" className="w-full">
                                {tryingToSignIn ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : "Sign in"}
                            </Button>
                        </CardFooter>
                        <div className="bg-white/10 text-white text-center" >
                            New to UniLite?{" "}
                            <Link href="/auth/sign-up" className="text-blue-500 underline">
                                Sign-up
                            </Link>
                        </div>
                    </Card>

                </form>

            </div>
            <div className=" w-1/2">
                <RotatingGlobe />
            </div>
        </div>
    )
}

export default page