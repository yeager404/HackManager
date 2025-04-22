import React from 'react'
import {testimonials} from "../constants/index.jsx"
const Testimonials = () => {
  return (
    <div className='mt-10 tracking-wide'>
          <h2 className='text-3xl sm:text-5xl lg:6xl text-center my-10 lg:my-20'>What people are saying?</h2>
          <div className="flex flex-wrap justify-center">
              {testimonials.map((item, index) => (
                  <div key={index} className='w-full sm:w-1/2 lg:w-1/3 px-4 py-2'>
                      <div className='bg-neutral rounded-md p-6 text-md border border-neutral-800 font-thin'>
                          <p>{item.text}</p>
                          <div className='flex mt-8 items-start'>
                              <img className="w-12 h-12 mr-6 rounded-full border-neutral-300" src={item.image} alt="" />
                              <div>
                                  <h6>{item.user}</h6>
                                  <span className='text-sm font-normal italic text-neutral-600'>{item.company}</span>
                              </div>
                          </div> 
                      </div>
                  </div>
              ))}
          </div>
    </div>
  )
}

export default Testimonials
