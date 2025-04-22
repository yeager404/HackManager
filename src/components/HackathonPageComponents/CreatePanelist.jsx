import React, { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const CreatePanelist = ({ hackathonId, fetchPanelistList }) => {
  const {token} = useAuthStore();

  const [panelistForm, setPanelistForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    speciality: ''
  });
  const [creatingPanelist, setCreatingPanelist] = useState(false);

  const handlePanelistChange = (e) => {
    const { name, value } = e.target;
    setPanelistForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreatePanelist = async (e) => {
    e.preventDefault();
    
    if (!panelistForm.firstName || !panelistForm.lastName || !panelistForm.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCreatingPanelist(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/hackathon/createPanelist`,
        {
          ...panelistForm,
          hackathonId
        },
        { withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}` // Add Bearer token
        }
         }
      );

      if (response.data.success) {
        toast.success('Panelist created successfully!');
        setPanelistForm({
          firstName: '',
          lastName: '',
          email: '',
          speciality: ''
        });
        await fetchPanelistList();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to create panelist');
    } finally {
      setCreatingPanelist(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
        Create Panelist
      </h2>
      
      <div className="bg-[#0a1128] p-8 rounded-xl shadow-2xl border border-gray-800">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-md"></div>
            <UserPlus className="h-16 w-16 text-blue-400 relative z-10" />
          </div>
          <p className="mt-4 text-gray-400 text-center max-w-md">
            Add a new judge to evaluate hackathon submissions
          </p>
        </div>
        
        <form onSubmit={handleCreatePanelist} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={panelistForm.firstName}
                onChange={handlePanelistChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a2035] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:ring-blue-200 hover:ring-2"
                placeholder="e.g. John"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={panelistForm.lastName}
                onChange={handlePanelistChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a2035] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:ring-blue-200 hover:ring-2"
                placeholder="e.g. Smith"
                required
              />
            </div>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={panelistForm.email}
              onChange={handlePanelistChange}
              className="w-full px-4 py-3 rounded-lg bg-[#1a2035] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:ring-blue-200 hover:ring-2"
              placeholder="panelist@example.com"
              required
            />
            <p className="mt-2 text-sm text-gray-400">
              Login credentials will be sent to this email
            </p>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">
              Expertise/Specialty
            </label>
            <div className="relative">
              <input
                type="text"
                name="speciality"
                value={panelistForm.speciality}
                onChange={handlePanelistChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a2035] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:ring-blue-200 hover:ring-2"
                placeholder="e.g. AI, Blockchain, UI/UX"
              />
              <span className="absolute right-3 top-3 text-gray-500 text-xs">Optional</span>
            </div>
          </div>
  
          <button
            type="submit"
            disabled={creatingPanelist}
            className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-medium transition-all shadow-lg
              ${creatingPanelist 
                ? 'bg-blue-800 cursor-wait' 
                : 'bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white hover:shadow-xl hover:translate-y-[-2px]'}`}
          >
            {creatingPanelist ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Panelist...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Create Panelist Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePanelist;