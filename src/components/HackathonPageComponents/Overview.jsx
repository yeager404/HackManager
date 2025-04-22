import React from 'react';

const Overview = ({ hackathon, user }) => {
  // Hardcoded description (you can replace this with your actual hackathon.description)
  const hardcodedDescription = `
🚀 Welcome to CodeFusion 2023: The Ultimate Innovation Challenge!

Join us for a 48-hour adrenaline-fueled coding marathon where creativity meets technology. This year's theme:\n\n "🌳Sustainable Futures Through Tech🌳".`;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-900 to-black p-6 rounded-xl shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
          Hackathon Overview
        </h2>
        
        {hackathon && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Key Details (unchanged) */}
            <div className="space-y-5">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover:border-blue-500 transition-all duration-300">
                <h3 className="text-sm font-semibold text-blue-400 mb-1">HACKATHON NAME</h3>
                <p className="text-xl font-bold text-white">{hackathon.hackathonName}</p>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover:border-blue-500 transition-all duration-300">
                <h3 className="text-sm font-semibold text-blue-400 mb-1">ORGANIZER</h3>
                <p className="text-lg text-white">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover:border-blue-500 transition-all duration-300">
                <h3 className="text-sm font-semibold text-blue-400 mb-1">TEAM SIZE</h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-900/50 rounded-full text-blue-300 text-sm font-medium">
                    {hackathon.teamMinSize} min
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="px-3 py-1 bg-blue-900/50 rounded-full text-blue-300 text-sm font-medium">
                    {hackathon.teamMaxSize} max
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Description */}
            <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-800 hover:border-blue-500 transition-all duration-300 h-full">
              <h3 className="text-sm font-semibold text-blue-400 mb-3">DESCRIPTION</h3>
              <p className="text-gray-300 whitespace-pre-line">
                {hardcodedDescription || hackathon.description || (
                  <span className="text-gray-500 italic">No description provided</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;