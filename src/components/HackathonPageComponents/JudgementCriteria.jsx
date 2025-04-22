import React from 'react';
import { Loader2, Plus, ClipboardList, Trash2, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const JudgementCriteria = ({ hackathonId, criteriaForm, setCriteriaForm, criteriaList, criteriaLoading, fetchCriteriaList }) => {
  const handleCriteriaChange = (e) => {
    const { name, value } = e.target;
    setCriteriaForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCriteria = async (e) => {
    e.preventDefault();

    if (!criteriaForm.criteria || !criteriaForm.maxPoints) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/hackathon/createCriteria/${hackathonId}`,
        {
          criteria: criteriaForm.criteria,
          maxPoints: criteriaForm.maxPoints,
          hackathonId: hackathonId
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        await fetchCriteriaList();
        setCriteriaForm(prev => ({
          ...prev,
          criteria: "",
          maxPoints: ""
        }));
        toast.success('Scoring criteria added successfully!');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to add scoring criteria');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
        Set Judgement Criteria
      </h2>

      <div className="bg-[#0a1128] p-6 rounded-xl shadow-lg border border-gray-800">
        <h3 className="text-xl font-semibold mb-6 text-blue-400 border-b border-gray-700 pb-2">
          Scoring Criteria
        </h3>

        <form onSubmit={handleAddCriteria} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2 ">
                Criteria Name
              </label>
              <input
                type="text"
                name="criteria"
                value={criteriaForm.criteria}
                onChange={handleCriteriaChange}
                className="w-full px-4 py-3 rounded-lg bg-[#1a2035] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:ring-blue-200 hover:ring-2"
                placeholder="e.g. Innovation, Technical Complexity"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Maximum Points
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="maxPoints"
                  value={criteriaForm.maxPoints}
                  onChange={handleCriteriaChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-lg bg-[#1a2035] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:ring-blue-200 hover:ring-2"
                  placeholder="Enter max points"
                />
                <span className="absolute right-3 top-3 text-gray-400">pts</span>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md hover:shadow-lg hover:translate-y-[-1px]"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Criteria
          </button>
        </form>

        <div className="space-y-4">
          <h4 className="text-lg font-medium text-blue-300 mb-4 flex items-center">
            <ClipboardList className="w-5 h-5 mr-2" />
            Current Criteria
          </h4>
          {criteriaLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : criteriaList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {criteriaList.map((criteria, index) => (
                <div
                  key={criteria._id || index}
                  className="bg-[#1a2035] p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg pop-out"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-white font-medium text-lg mb-1">{criteria.criteria}</h5>
                      <div className="flex items-center mt-2">
                        <span className="px-3 py-1 bg-blue-900/50 rounded-full text-blue-300 text-sm font-medium">
                          Max: {criteria.maxPoints} points
                        </span>
                      </div>
                    </div>
                    <button
                      className="text-gray-400 hover:text-red-400 transition-colors"
                      onClick={() => handleDeleteCriteria(criteria._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
              <FileText className="w-10 h-10 mx-auto text-gray-500 mb-2" />
              <p className="text-gray-400">No scoring criteria added yet</p>
              <p className="text-sm text-gray-500 mt-1">Add your first criteria to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JudgementCriteria;