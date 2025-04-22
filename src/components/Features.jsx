import React from 'react'
import { features } from "../constants/index.jsx"
const Features = () => {
    return (
        <div className="relative mt-20 border-b border-neutral-800 min-h-[800px]">
            <div className="text-center">
                <span className="bg-neutral-800 text-blue-500 rounded-full h-6 text-sm font-medium px-2 py-1 uppercase">
                    Features
                </span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide">
                    Easily manage{" "}
                    <span className="bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text">
                        your Hackathon
                    </span>
                </h2>
            </div>
            <div className="flex flex-wrap mt-10 lg:mt-20">
                {features.map((feature, index) => (
                    <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                        <div className="group flex flex-col h-full bg-neutral-900 p-6 rounded-xl transition-transform duration-300 hover:scale-105 shadow-lg">
                            <div className="flex items-center">
                                <div className="flex mx-6 h-10 w-10 p-2 bg-neutral-900 text-blue-700 justify-center items-center rounded-full">
                                    {feature.icon}
                                </div>
                                <h5 className="text-xl text-white">{feature.text}</h5>
                            </div>
                            <p className="text-md text-neutral-400 flex-grow mt-4">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
};

export default Features


