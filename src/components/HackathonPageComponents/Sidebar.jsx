import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "judgementCriteria", label: "Set Judgement Criteria" },
    { id: "import", label: "Import Participant List" },
    { id: "createPanelist", label: "Create Panelist" },
    { id: "assignTeam", label: "Assign Teams" }
  ];

  return (
    <div className="w-64 bg-[#0a1128] p-4 h-screen sticky top-0 border-r border-gray-800 shadow-xl">
      <nav className="space-y-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
              activeTab === tab.id 
                ? 'bg-[#1a365d] text-white shadow-md border-l-4 border-blue-400' 
                : 'text-gray-400 hover:bg-[#1a2035] hover:text-white hover:translate-x-1'
            }`}
          >
            <div className="flex items-center gap-3">
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              <span className="font-medium">{tab.label}</span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
  
};

export default Sidebar;