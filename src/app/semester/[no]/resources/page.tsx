'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Loader2, Plus, ThumbsDown, ThumbsUp } from 'lucide-react'
import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from '@/components/ui/switch'
import { useContext, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { toast } from "sonner"
import { useParams, useRouter } from 'next/navigation'
import { AuthContext } from '@/contexts/AuthContext'
import { rearrangeResources } from '@/components/rearrangeResources'

const page = () => {

  interface linkType {
    _id: string,
    description: string
    link: string
    pushedBy: string[]
    pulledBy: string[]
  }

  const [links, setLinks] = useState<linkType[]>([{ _id: '', description: 'Learn Binary Search In Depth', link: 'https://ui.shadcn.com/docs/components/alert', pushedBy: [], pulledBy: [] }])
  const [switchState, setSwitchState] = useState(Array(links.length).fill(false))
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")
  const [link, setLink] = useState("")
  const [addingResource, setAddingResource] = useState(false)
  const [fetchingResources, setFetchingResources] = useState(false)
  const [addingResourceMessage, setAddingResourceMessage] = useState("")
  const [requiredTopic, setRequiredTopic] = useState("")
  const [liked, setLiked] = useState(Array(links.length).fill(0))
  const [shownAddResourceSignedOutAlert, setshownAddResourceSignedOutAlert] = useState(false)
  const [resourceDocId, setResourceDocId] = useState("")


  const params = useParams()
  const router = useRouter()

  const { no } = params

  const { user, loading } = useContext(AuthContext)


  const handleToggle = (idx: number) => {
    setSwitchState((prev) => prev.map((val, i) => (i === idx ? !val : val)))
  }

  const handleLikedToggle = async (idx: number, updatedVal: number, action: string) => {

    const currentLink = links[idx]
    try {
      if (currentLink && user && action && resourceDocId)
        setLiked(
          (prev) => prev.map((val, i) => i === idx ? updatedVal : val)
        )

      setLinks(prev =>
        prev.map((val, i) => {
          if (i !== idx) return val; // leave other items unchanged

          // Make a shallow copy to avoid mutating state directly
          const newVal = { ...val, pushedBy: [...val.pushedBy], pulledBy: [...val.pulledBy] };

          switch (action) {
            case "pushUp":
              newVal.pushedBy.push("");
              break;
            case "pushDown":
              newVal.pushedBy.pop();
              break;
            case "pullUp":
              newVal.pulledBy.push("");
              break;
            case "pullDown":
              newVal.pulledBy.pop();
              break;
            case "pushUp&pullDown":
              newVal.pushedBy.push("");
              newVal.pulledBy.pop();
              break;
            case "pushDown&pullUp":
              newVal.pushedBy.pop();
              newVal.pulledBy.push("");
              break;
          }

          return newVal;
        })
      );



      const response = await axios.post("/api/resources/actionOnResource", { resourceId: currentLink._id, userId: user?._id, action, resourceDocId })
    } catch (error) {
      toast("The action can not be performed. Please try later")
    }

  }

  const handleAddResource = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!user && shownAddResourceSignedOutAlert === false) {
      setshownAddResourceSignedOutAlert(true)
      return
    }

    setAddingResource(true)
    try {
      const response = await axios.post("/api/resources/addResource", { semester: no, topic, description, link, userId: user?._id || "" })
      if (response.data.success) {
        toast(response.data.message)
        setTopic("")
        setDescription("")
        setLink("")
      }
      else setAddingResourceMessage(response.data.message)
    } catch (error) {
      setAddingResourceMessage("Ambigious problem with adding the resource")
    }
    finally {
      setAddingResource(false)
      setshownAddResourceSignedOutAlert(false)
    }
  }

  const handleFetchResource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFetchingResources(true)
    try {
      const response = await axios.get("/api/resources/getResources", {
        params: { requiredTopic, no, userId: user?._id },
      })
      if (!response.data.success && response.status === 200) {
        toast(response.data.message)
        return
      }
      setResourceDocId(response.data.requiredTopicDoc._id)
      const linkArray = response.data.requiredTopicDoc.links
      const actionsDoneInPast = response.data.actionsDoneInPast
      setLiked(actionsDoneInPast)
      setLinks(linkArray)
      setSwitchState(Array(linkArray.length).fill(false))
      if (response.data.success) {
        toast("Resources fetched successfully")
        setRequiredTopic("")
      }
    } catch (error) {
      toast("Ambigious problem while fetching the resource frontend")
    }
    finally {
      setFetchingResources(false)
    }

  }

  return (
    <div className="h-screen flex flex-col gap-20" >

      <motion.div className='flex gap-3 mt-10 mx-80'>
        <form onSubmit={handleFetchResource} className='flex w-full justify-between relative'>
          <Input
            placeholder='Enter the course name please...'
            value={requiredTopic}
            onChange={(e) => setRequiredTopic(e.target.value)}
          />
          <Button disabled={fetchingResources} className='absolute right-4 top-2 w-2 h-2'>{fetchingResources ? <Loader2 className='w-2 h-2 animate-spin' /> : 'Search'}</Button>
        </form>

        <DropdownMenu >
          <DropdownMenuTrigger>
            <Plus className='w-4 h-4 ' />
          </DropdownMenuTrigger>

          <DropdownMenuContent className='w-[30vw]'>
            <Card>
              <CardHeader>
                <CardTitle>Contribute A Resource</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddResource}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label>Topic</Label>
                      <Input
                        placeholder="Binary Search"
                        required
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="Best binary search intutive explaination"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Link</Label>
                      <Input
                        placeholder="www.youtube.com/binary-search"
                        required
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={addingResource}>
                      {addingResource ? <Loader2 className='animate-spin' /> : 'Contribue'}
                    </Button>


                    <AlertDialog open={shownAddResourceSignedOutAlert} onOpenChange={setshownAddResourceSignedOutAlert}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Take a second, dear?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Let others know it was you behind this gold...
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel onClick={() => {
                            router.replace("/auth/sign-in")
                          }}>Signin page, please</AlertDialogCancel>
                          <AlertDialogAction onClick={(e) => handleAddResource(e)}>I am selfless</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                </form>
              </CardContent>
              <CardFooter className='text-red-600 text-md'>
                {addingResourceMessage}
              </CardFooter>
            </Card>
          </DropdownMenuContent>

        </DropdownMenu>
      </motion.div>

      <div className='flex flex-wrap gap-20 justify-center items-center'>
        {links.map((obj, idx) => (
          <Alert className='w-[300px] flex justify-between relative' key={idx}>
            <AlertTitle>{obj.description}</AlertTitle>
            <Switch
              checked={switchState[idx]}
              onCheckedChange={() => handleToggle(idx)}
            />
            {switchState[idx] && (
              <motion.div
                className="absolute left-0 bottom-0 h-1 rounded-full bg-gradient-to-r from-green-300 via-green-400 to-green-500 shadow-lg"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 290, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                onAnimationComplete={() => {
                  window.open(obj.link, "_blank");
                  handleToggle(idx);
                }}
              />
            )}

            <div className="flex justify-center items-center gap-3 absolute right-0 top-12 bg-gray-800 rounded-full p-2 shadow-md">
              <Button
                onClick={() => {
                  if (liked[idx] === 0) handleLikedToggle(idx, 1, "pushUp")
                  else if (liked[idx] === 1) handleLikedToggle(idx, 0, "pushDown")
                  else if (liked[idx] === -1) handleLikedToggle(idx, 1, "pushUp&pullDown")
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 ${liked[idx] === 1 ? 'bg-green-600 text-white scale-105 shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-green-500 hover:text-white'
                  }`}
              >
                <ThumbsUp
                  className={`w-4 h-4 transition-transform duration-200 ${liked[idx] === 1 ? 'scale-125' : 'scale-100'
                    }`}
                />
                Push {links[idx].pushedBy.length}
              </Button>

              <Button
                onClick={() => {
                  if (liked[idx] === 0) handleLikedToggle(idx, -1, "pullUp")
                  else if (liked[idx] === 1) handleLikedToggle(idx, -1, "pushDown&pullUp")
                  else if (liked[idx] === -1) handleLikedToggle(idx, 0, "pullDown")
                }}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 ${liked[idx] === -1 ? 'bg-red-600 text-white scale-105 shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white'
                  }`}
              >
                <ThumbsDown
                  className={`w-4 h-4 transition-transform duration-200 ${liked[idx] === -1 ? 'scale-125' : 'scale-100'
                    }`}
                />
                Pull {links[idx].pulledBy.length}
              </Button>
            </div>

          </Alert>
        ))}
      </div>

    </div >
  )
}

export default page