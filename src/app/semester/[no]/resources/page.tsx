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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { toast } from "sonner"
import { useParams } from 'next/navigation'

const page = () => {


  const [links, setLinks] = useState([{ description: 'Learn Binary Search In Depth', href: 'https://ui.shadcn.com/docs/components/alert', push: '404', pull: '10' }])
  const [switchState, setSwitchState] = useState(Array(links.length).fill(false))
  const [semester, setSemester] = useState("")
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")
  const [link, setLink] = useState("")
  const [addingResource, setAddingResource] = useState(false)
  const [fetchingResources, setFetchingResources] = useState(false)
  const [addingResourceMessage, setAddingResourceMessage] = useState("")
  const [requiredTopic, setRequiredTopic] = useState("")
  const [liked, setLiked] = useState(Array(links.length).fill('0'))

  const params = useParams()
  const { no } = params


  const handleToggle = (idx: Number) => {
    setSwitchState((prev) => prev.map((val, i) => (i === idx ? !val : val)))
  }

  const handleLikedToggle = (idx: Number, updatedVal: String) => {
    setLiked((prev) => prev.map((val, i) => i === idx ? updatedVal : val))
  }

  const handleAddResource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setAddingResource(true)
    try {
      const response = await axios.post("/api/resources/addResource", { semester, topic, description, link })
      if (response.data.success) {
        toast(response.data.message)
        setSemester("")
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
    }
  }

  const handleFetchResource = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFetchingResources(true)
    try {
      const response = await axios.get("/api/resources/getResources", {
        params: { requiredTopic, no }
      })
      setLinks(response.data.resources)
      setSwitchState(Array(response.data.resources.length).fill(false))
      setLiked(Array(response.data.resources.length).fill('0'))
      if (response.data.success) {
        toast("Resources fetched successfully")
        setRequiredTopic("")
      }
      else toast(response.data.message)
    } catch (error) {
      toast("Ambigious problem while fetching the resource")
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
                      <Label>SemesterNo</Label>
                      <Input
                        placeholder="3"
                        required
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                      />
                    </div>
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
        {links.map((link, idx) => (
          <Alert className='w-[300px] flex justify-between relative' key={idx}>
            <AlertTitle>{link.description}</AlertTitle>
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
                  window.open(link.href, "_blank");
                  handleToggle(idx);
                }}
              />
            )}

            <div className="flex justify-center items-center gap-3 absolute right-0 top-12 bg-gray-800 rounded-full p-2 shadow-md">
              <Button
                onClick={() => handleLikedToggle(idx, '1')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 ${liked[idx] === '1' ? 'bg-green-600 text-white scale-105 shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-green-500 hover:text-white'
                  }`}
              >
                <ThumbsUp
                  className={`w-4 h-4 transition-transform duration-200 ${liked[idx] === '1' ? 'scale-125' : 'scale-100'
                    }`}
                />
                Push {links[idx].push}
              </Button>

              <Button
                onClick={() => handleLikedToggle(idx, '-1')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-all duration-200 ${liked[idx] === '-1' ? 'bg-red-600 text-white scale-105 shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white'
                  }`}
              >
                <ThumbsDown
                  className={`w-4 h-4 transition-transform duration-200 ${liked[idx] === '-1' ? 'scale-125' : 'scale-100'
                    }`}
                />
                Pull {links[idx].pull}
              </Button>
            </div>

          </Alert>
        ))}
      </div>

    </div >
  )
}

export default page