import React from 'react'
import {resourcesLinks, platformLinks, communityLinks} from "../constants/index.jsx"
const Footer = () => {
    return (
        <footer className='mt-20 border-t pt-10 border-neutral-700 '>
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-x-40 px-10 mb-10'>
                <div>
                    <h3 className='text-md font-semibold mb-4'>Resources</h3>
                    <ul className='space-y-2'>
                        {resourcesLinks.map((item, index) => (
                            <li key={index}>
                                <a className="text-neutral-300 hover:text-white" href={item.href}>{item.text}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className='text-md font-semibold mb-4'>Platforms</h3>
                    <ul className='space-y-2'>
                        {platformLinks.map((item, index) => (
                            <li key={index}>
                                <a className="text-neutral-300 hover:text-white" href={item.href}>{item.text}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className='text-md font-semibold mb-4'>Community</h3>
                    <ul className='space-y-2'>
                        {communityLinks.map((item, index) => (
                            <li key={index}>
                                <a className="text-neutral-300 hover:text-white" href={item.href}>{item.text}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <p className='text-sm text-center bg-black pt-2 pb-3'>
                Made by Dre and Yeager
            </p>
      </footer>
  )
}

export default Footer
