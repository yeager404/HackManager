import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import codeImg from "../assets/code.jpg";
import { checklistItems } from "../constants/index.jsx"
const Workflow = () => {
    return (
        <div className='mt-20'>
            <h2 className='text-3xl sm:text-5xl lg:text-6xl text-center mt-6 tracking-wide'>Accelerate your{" "} <span className='bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text'>Hackathon workflow</span></h2>
            <div className='flex flex-wrap justify-center'>
                <div className="p-2 w-full lg:w-1/2 pl-20">
                    <img src={codeImg} alt="Code" />
                </div>
                <div className='pt-12 w-full lg:w-1/2'>
                    {checklistItems.map((item, index) => (
                        <div key={index} className='flex mb-20 mt-5'>
                            <div className="text-blue-400 mx-6 bg-neutral-900 h-10 w10 p-2 justify-center items-center rounded-full">
                                    <CheckCircle2/>
                            </div>
                            <div>
                                <h5 className='mt-1 mb-2 text-xl'>{item.title}</h5>
                                <p className='text-md text-neutral-500'>{item.description }</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Workflow