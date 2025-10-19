'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'


const page = () => {

  const router = useRouter()

  return (
    <div className=" bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-screen m-1 border rounded-2xl mt-0">



        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white text-center">
              Centralizing Your Semester Experience
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.1 }}
            onAnimationComplete={() =>
              setTimeout(() => {
                router.replace("/semester")
              }, 1000)
            }
          >
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-500 text-center">
              UniLite
            </span>
          </motion.div>
        </div>

    </div>
  )
}

export default page