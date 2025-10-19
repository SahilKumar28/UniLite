'use client'
import RotatingGlobe from "@/components/globe"
import { InputOtp } from "@/components/verifyOtp"
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
import axios from "axios"
import { toast } from "sonner"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const page = () => {

    const [showOtpInput, setShowOtpInput] = useState(false)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [otp, setOtp] = useState("")
    const [semester, setSemester] = useState("")

    const [tryingToSignUp, setTryingToSignUp] = useState(false)
    const [tryingToVerifyOtp, setTryingToVerifyOtp] = useState(false)

    const router = useRouter()

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setTryingToSignUp(true)
            const response = await axios.post("/api/auth/sign-up", { username, email, password })
            if (response.data.success) {

                setShowOtpInput(true)

                setTimeout(() => {
                    setShowOtpInput(false)
                }, 60000)
            }
            toast(response.data.message)
        } catch (error) {
            toast("Sorry, some problems with signing up")
        }
        finally {
            setTryingToSignUp(false)
        }

    }

    const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setTryingToVerifyOtp(true)
        try {
            const response = await axios.post("/api/auth/verify-otp", { otp, username, email, password, semester })

            if (response.data.success) {
                router.replace(`/auth/sign-in`)
            }
            else {
                toast(response.data.message)
            }

        } catch (error) {
            toast("Sorry, some problems with verifying otp")
        }
        finally {
            setTryingToVerifyOtp(false)
        }
    }

    return (
        <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 h-screen w-screen flex text-white">
            <div className=" w-1/2 flex flex-col gap-10 justify-center items-center">


                <form onSubmit={(e) => handleSignUp(e)} className="w-full max-w-sm">
                    <Card className=" bg-white/10">
                        <CardHeader>
                            <CardTitle>Create An account</CardTitle>
                            <CardDescription>
                                Contribute, and get the most out of contributions.
                            </CardDescription>
                            <CardAction>
                                <Button variant="link">Sign Up</Button>
                            </CardAction>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Usernmae</Label>
                                    <Input
                                        id="username"
                                        type="username"
                                        placeholder="SahilK"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
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
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="*******"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Semester</Label>
                                    <Input
                                        id="semester"
                                        type="semester"
                                        value={semester}
                                        onChange={(e) => setSemester(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button type="submit" className="w-full" disabled={showOtpInput}>
                                {tryingToSignUp ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : "SignUp"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>

                {showOtpInput && (
                    <form onSubmit={(e) => handleVerifyOtp(e)}>
                        <div className="p-4 text-white rounded-lg">
                            <InputOTP
                                maxLength={4}
                                value={otp}
                                onChange={(value) => setOtp(value)}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                </InputOTPGroup>
                            </InputOTP>

                            <button
                                className="mt-4 px-4 py-2 text-center bg-blue-600 rounded hover:bg-blue-700"
                            >
                                {tryingToVerifyOtp ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : "Verify"}
                            </button>
                        </div>
                    </form>

                )}

            </div>
            <div className=" w-1/2">
                <RotatingGlobe />
            </div>
        </div >
    )
}

export default page