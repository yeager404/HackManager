import React from 'react';
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import ParticlesComponent from './animations/particles.jsx';

const HeroSection = () => {
    return (
        <section className="relative w-full h-[600px] flex flex-col items-center justify-center text-white overflow-hidden -mt-14">
            {/* Particles in Background */}
            <div className="absolute inset-0 w-full">
                <ParticlesComponent id="particles" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center mt-6 lg:mt-20">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl tracking-wide">
                    HackManager
                    <span className='bg-gradient-to-r from-blue-700 to-blue-800 text-transparent bg-clip-text'>
                        {" "}for organising Hackathons
                    </span>
                </h1>
                <p className='mt-10 text-lg text-neutral-400 max-w-4xl'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci consequuntur quidem facilis odit modi doloribus deserunt fugiat.
                </p>

                {/* Button */}
                <div className="flex justify-center my-10">
                    <button className="pop-out relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg bg-gradient-to-br from-blue-500 to-blue-800 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-neutral-900 rounded-md group-hover:bg-transparent">
                            Start for free
                        </span>
                    </button>
                </div>

                {/* Videos */}
                {/* <div className='flex mt-10 justify-center'>
                    <video src={video1} autoPlay loop muted className='rounded-lg w-1/3 border border-orange-700 mx-2 my-4 pop-out'> Video isn't supported</video>
                    <video src={video2} autoPlay loop muted className='rounded-lg w-1/3 border border-orange-700 mx-2 my-4 pop-out'> Video isn't supported</video>
                </div> */}
            </div>
        </section>
    );
};

export default HeroSection;
