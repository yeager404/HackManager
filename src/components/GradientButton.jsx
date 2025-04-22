import React from 'react';

const GradientButton = () => {
    return (
        <button className="relative border-none outline-none bg-[#3a3a3a] py-2 px-3 text-white font-semibold rounded-[10px] flex justify-center items-center cursor-pointer transition-all duration-300 group">
            {/* Gradient background container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[106%] h-[115%] overflow-hidden rounded-[inherit] -z-20 blur-[10px] transition-all duration-300 group-hover:scale-98 group-hover:blur-[5px]">
                {/* Animated gradient */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] aspect-square rounded-full blur-[10px] transition-all duration-300 group-hover:blur-[5px]"
                    style={{
                        backgroundImage: 'linear-gradient(90deg, hsl(226, 81%, 64%), hsl(271, 81%, 64%), hsl(316, 81%, 64%), hsl(1, 81%, 64%), hsl(46, 81%, 64%), hsl(91, 81%, 64%), hsl(136, 81%, 64%), hsl(181, 81%, 64%))',
                        animation: 'rotate 2s linear infinite'
                    }}
                />
            </div>

            {/* Glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] w-[106%] h-[120%] -z-10 rounded-[inherit] transition-all duration-300" />

            {/* Button label */}
            <div className="w-[156px] h-[45px] text-center leading-[45px] rounded-[22px] bg-[rgba(43,43,43,1)] bg-gradient-to-b from-[rgb(43,43,43)] to-[rgb(68,68,68)]">
                Button
            </div>

            {/* CSS for the rotation animation */}
            <style jsx>{`
        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
        </button>
    );
};

export default GradientButton;