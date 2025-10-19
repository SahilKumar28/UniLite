'use client'

import { Button } from '@/components/ui/button'
import { AuthContext } from '@/contexts/AuthContext'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'

const semesters = ['1', '2', '3', '4', '5', '6', '7', '8']

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
}

const page = () => {

 
  const router = useRouter()

  const {user, loading} = useContext(AuthContext)

  return (
    <div className=" bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-screen m-1 border rounded-2xl mt-0">
        <>
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 550, scale: 1 }}
            transition={{ duration: 3.5 }}
            className='flex justify-center items-center  mt-5 '
          >
            <span>The Undisputed Art Of Being A University Student {user ? "true" : "false"}</span>
          </motion.div>

          <motion.div
            variants={container}
            initial='hidden'
            animate='visible'
            className='flex flex-col justify-center items-center gap-3 mt-20'
          >
            {semesters.map((el) => (
              <motion.div
                onClick={() => router.push(`/semester/${el}`)}
                variants={item}
                key={el}
              >
                <Button className='w-3xl'>
                  Semester{el}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </>
    </div>
  )
}

export default page