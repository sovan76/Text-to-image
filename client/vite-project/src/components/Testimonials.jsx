import React from 'react'
import { assets, testimonialsData } from '../assets/assets'
import {motion} from 'motion/react'


const Testimonials = () => {
  return (
   <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='relative flex flex-col items-center justify-center py-24 px-6 overflow-hidden'
    >

    {/* Background Glow Effects */}
    <div className='absolute top-10 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl'></div>
    <div className='absolute bottom-10 right-10 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl'></div>

    {/* Section Heading */}
    <div className='relative z-10 text-center mb-16'>

        <h1 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent'>
            Customer Testimonials
        </h1>

        <p className='text-gray-500 mt-4 text-lg'>
            What our users are saying
        </p>

    </div>

    {/* Testimonials Grid */}
    <div className='relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>

        {testimonialsData.map((testimonial, index) => (

            <div
                key={index}
                className='group relative flex flex-col items-center text-center gap-5 p-8
                bg-white/10 backdrop-blur-lg border border-white/20
                rounded-3xl shadow-lg cursor-pointer
                hover:-translate-y-3 hover:shadow-2xl
                transition-all duration-500
                overflow-hidden w-full max-w-[350px]'
            >

                {/* Hover Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition duration-500'></div>

                {/* Profile Image */}
                <div className='relative z-10'>

                    <img
                        src={testimonial.image}
                        alt=''
                        className='w-20 h-20 rounded-full object-cover border-4 border-white shadow-md
                        group-hover:scale-110 transition duration-500'
                    />

                    {/* Online Indicator */}
                    <div className='absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full'></div>

                </div>

                {/* User Info */}
                <div className='relative z-10'>

                    <h2 className='text-xl font-semibold text-gray-800'>
                        {testimonial.name}
                    </h2>

                    <p className='text-sm text-purple-600 font-medium mt-1'>
                        {testimonial.role}
                    </p>

                </div>

                {/* Rating Stars */}
                <div className='relative z-10 flex gap-1'>

                    {Array(testimonial.stars)
                        .fill()
                        .map((_, index) => (

                            <img
                                key={index}
                                src={assets.rating_star}
                                alt='star'
                                className='w-5 h-5 group-hover:rotate-12 transition duration-300'
                            />
                        ))}

                </div>

                {/* Testimonial Text */}
                <p className='relative z-10 text-gray-600 leading-relaxed text-sm'>
                    “{testimonial.text}”
                </p>

                {/* Decorative Border */}
                <div className='absolute inset-0 rounded-3xl border border-transparent group-hover:border-purple-400/30 transition duration-500'></div>

            </div>

        ))}

    </div>

</motion.div>
  )
}

export default Testimonials