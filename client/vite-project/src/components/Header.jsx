import React from 'react'
import { assets } from '../assets/assets'
import {motion} from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Header = () => {
  
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
    <motion.div 
    className='min-h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden'
    
    initial={{opacity: 0.2, y: 100}}
    transition={{duration:1}}
    whileInView={{opacity: 1, y:0}}
    viewport={{once: true}}
    >

      {/* Top Badge */}
      <motion.div className='inline-flex items-center gap-2 bg-white border border-gray-300 rounded-full px-5 py-2 shadow-sm text-gray-600 text-sm'
       initial={{opacity: 0, y: -20}}
       animate={{opacity: 1, y:0}}
       viewport={{once: true}}
       transition={{delay: 0.2, duration: 0.8}}
      >
        <p>Best text to image generator in the world.</p>
        <img className='w-4' src={assets.star_icon} alt="star" />
      </motion.div>

      {/* Heading */}
      <motion.h1 className='mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight max-w-4xl'>
        Turn text to image in seconds with{" "}
        <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400'
        
        initial={{opacity: 0}}
        animate={{opacity: 1, y:0}}
        transition={{delay: 0.4, duration: 2}}
        >
          TextToImage
        </span>
      </motion.h1>

      {/* Description */}
      <motion.p className='mt-5 text-gray-600 text-base sm:text-lg max-w-2xl leading-relaxed'
       initial={{opacity: 0, y:20}}
        animate={{opacity: 1, y:0}}
        transition={{delay: 0.6, duration: 0.8}}
        >
        Unleash your creativity with AI. Turn your imagination into visual art in seconds — just type, and watch the magic happen.
      </motion.p>

      {/* Button */}
      <motion.button  onClick={onClickHandler} className='cursor-pointer flex items-center gap-2 bg-blue-700 text-white px-8 py-3 rounded-full mt-8 hover:bg-blue-800 hover:scale-105 transition-all duration-300 ease-in-out shadow-lg'
       whileHover={{sacale: 1.05}}
       whileTap={{ sacale: 0.95}}
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y:0}}
        transition={{default: {duration: 0.5 }, opacity: {delay:0.8, duration:1}}}
      >
        Generate Images
        <img className='w-5' src={assets.star_group} alt="star group" />
      </motion.button>

      {/* Sample Images */}
  <motion.div className='flex flex-wrap justify-center gap-3 mt-10 max-w-4xl'
        initial={{opacity: 0, y:20}}
        animate={{opacity: 1, y:0}}
        transition={{delay: 0.6, duration: 0.8}}
        >
  {Array(6).fill('').map((item, index) => (
    <motion.img

      whileHover={{scale:1.05, duration :0.1}}
      key={index}
      src={index % 2 === 0 ? assets.sample_img_1 : assets.sample_img_2}
      alt="sample"
      className={`w-16 sm:w-20 rounded-lg shadow-md hover:scale-105 transition-all duration-300 ${
        index === 0
          ? 'rotate-6'
          : index === 1
          ? '-rotate-6'
          : ''
      }`}
    />
  ))}
</motion.div>

<motion.p className='mt-4 text-sm text-gray-500 tracking-wide'
        initial={{opacity: 0, y:20}}
        animate={{opacity: 1, y:0}}
        transition={{delay: 0.6, duration: 0.8}}
        >
  AI-generated creations powered by{" "}
  <span className='font-semibold bg-gradient-to-r from-blue-500 to-teal-400 text-transparent bg-clip-text'>
    Imagify
  </span>
</motion.p>

    </motion.div>
  )
}

export default Header