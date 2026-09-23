import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (

    <footer className='w-full mt-16 pb-10'>

  <div className='max-w-6xl mx-auto'>

    {/* Divider */}
    <div className='h-[1px] w-full bg-gray-300/60 mb-8'></div>

    {/* Content */}
    <div
      className='flex flex-col md:flex-row
      items-center justify-between gap-8'
    >

      {/* Left */}
      <Link
        to="/"
        className='flex flex-col sm:flex-row
        items-center gap-4'
      >

        <img
          src={assets.logo}
          alt="Logo"
          className='w-36'
        />

        <p className='text-gray-600 text-sm sm:text-base'>
          © 2026 Imagify. All rights reserved.
        </p>

      </Link>

      {/* Social Icons */}
      <div className='flex items-center gap-4'>

        {[assets.facebook_icon,
          assets.twitter_icon,
          assets.instagram_icon].map((icon, index) => (

          <div
            key={index}
            className='w-12 h-12 rounded-full
            bg-white/60 backdrop-blur-md
            border border-white/40
            flex items-center justify-center
            shadow-md cursor-pointer
            hover:-translate-y-1
            hover:shadow-xl
            transition-all duration-300'
          >

            <img
              className='w-5 h-5'
              src={icon}
              alt=""
            />

          </div>

        ))}

      </div>

    </div>

  </div>

</footer>
  )
}

export default Footer