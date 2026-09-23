import React, { useState } from 'react'
import { assets } from '../assets/assets'
import {motion} from 'motion/react'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const Result = () => {

  const [image, setImage] = useState(assets.sample_img_1)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  cons

  // Submit Handler
  const onSubmitHandler = async (e) => {

    e.preventDefault()

    if (!prompt) {
      alert("Please enter a prompt")
      return
    }

    try {

      setLoading(true)
      const generatedImage = await generateImage(prompt)
      if (generatedImage) {
        setImageLoading(true);
        setImage(`data:image/png;base64,${generatedImage}`)
      }
      setLoading(false)

      console.log("Generated image:", generatedImage)

      // Fake Loading
      setTimeout(() => {
        setLoading(false)
      }, 4000)

    } catch (error) {

      console.log(error)
      setLoading(false)

    }
  }

  return (

    <div className='min-h-[80vh] flex items-center justify-center px-4'>

      <motion.form 
        
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onSubmit={onSubmitHandler}
        className='flex flex-col items-center'
      >

        {/* Image */}
        <div className='relative'>

          <img
            src={image}
            alt="Generated"
            className='w-72 sm:w-80 rounded-2xl shadow-xl'
          />

        </div>

        {/* Loading Text */}
        {loading && (

          <div className='mt-4 flex flex-col items-center w-full'>

            <p className='text-gray-600 text-sm mb-2'>
              Generating image...
            </p>

            {/* Loading Bar */}
            <div
              className='w-72 sm:w-80
              h-2 bg-gray-300/60
              rounded-full overflow-hidden'
            >

              <div
                className='h-full
                bg-gradient-to-r
                from-purple-500 to-blue-500
                animate-pulse rounded-full'
                style={{ width: '100%' }}
              ></div>

            </div>

          </div>

        )}

        {/* Input Section */}
        <div
          className='mt-8
          w-full sm:w-[700px]
          flex items-center
          bg-zinc-900
          rounded-full
          shadow-lg overflow-hidden'
        >

          {/* Input */}
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Describe what you want to generate'
            className='flex-1
            bg-transparent
            text-white
            placeholder-gray-400
            outline-none
            px-7 py-5
            text-sm sm:text-base'
          />

          {/* Button */}
          <button
            type='submit'
            className='bg-black hover:bg-zinc-800
            text-white
            px-8 sm:px-12
            py-5
            text-sm sm:text-base
            transition-all duration-300
            cursor-pointer'
          >

            {loading ? 'Generating...' : 'Generate'}

          </button>

        </div>

      </motion.form>

    </div>
  )
}

export default Result