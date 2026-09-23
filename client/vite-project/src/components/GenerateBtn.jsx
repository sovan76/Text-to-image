import React from 'react'
import {motion} from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'  

const GenerateBtn = () => {

  const {user, setIsLoginOpen }= React.useContext(AppContext)
  const Navigate = useNavigate();

   const onClickHandler = () => {
      if(user){
         Navigate('/result') 
      }else{
        setIsLoginOpen(true)
      }
    }


  return (


    <section className='w-full mt-28'>

      <motion.div
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}

        className='max-w-6xl mx-auto
        rounded-[40px]
        border border-white/40
        bg-white/40 backdrop-blur-xl
        shadow-lg shadow-black/5
        overflow-hidden'
      >

        {/* Content */}
        <div
          className='relative flex flex-col
          items-center text-center
          py-24 px-6 sm:px-12 overflow-hidden'
        >

          {/* Glow Effects */}
          <div
            className='absolute -top-20 -left-20
            w-72 h-72 bg-purple-300/20
            rounded-full blur-3xl'
          ></div>

          <div
            className='absolute -bottom-20 -right-20
            w-72 h-72 bg-blue-300/20
            rounded-full blur-3xl'
          ></div>

          {/* Heading */}
          <h1
            className='relative z-10
            text-4xl sm:text-5xl lg:text-6xl
            font-bold tracking-tight
            text-gray-900'
          >

            See the Magic.

            <span
              className='bg-gradient-to-r
              from-purple-600 to-blue-500
              bg-clip-text text-transparent'
            >
              {" "}Try Now
            </span>

          </h1>

          {/* Subtitle */}
          <p
            className='relative z-10
            mt-6 max-w-2xl
            text-lg sm:text-xl
            text-gray-600 leading-relaxed'
          >

            Transform your imagination into stunning
            AI-generated visuals in seconds.

          </p>

          {/* Button */}
          <button
            className='relative z-10 group
            mt-10 px-8 py-4 rounded-2xl
            bg-gradient-to-r
            from-purple-600 to-blue-500
            text-white font-semibold text-lg
            shadow-lg shadow-purple-300/30
            hover:scale-105
            hover:shadow-2xl
            transition-all duration-500'
          >

            <span onClick={onClickHandler} className='flex items-center gap-3'>

              Generate Image

              <span
                className='group-hover:translate-x-1
                transition duration-300'
              >
                →
              </span>

            </span>

          </button>

        </div>

      </motion.div>

    </section>
  )
}

export default GenerateBtn