import React, { useState } from 'react';
import { Users, Mail, Briefcase, Loader2, X , User, Award, Check} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AssignTeam = ({ hackathonId, panelistList, panelistLoading, fetchPanelistList }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPanelist, setSelectedPanelist] = useState(null);
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [assigning, setAssigning] = useState(false);

  const fetchTeams = async () => {
    try {
      setTeamsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/hackathon/getTeams/${hackathonId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Add a check to ensure teams is an array
        const teamsData = Array.isArray(response.data.teams) ? response.data.teams : [];
        setTeams(teamsData);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch teams');
    } finally {
      setTeamsLoading(false);
    }
  };

  const handlePanelistClick = (panelist) => {
    setSelectedPanelist(panelist);
    setSelectedTeams([]);
    setShowModal(true);
    fetchTeams();
  };

  const handleTeamSelect = (teamId) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId);
      } else {
        return [...prev, teamId];
      }
    });
  };

  const handleAssignTeams = async () => {
    if (!selectedPanelist) {
      toast.error('No panelist selected');
      return;
    }

    if (selectedTeams.length === 0) {
      toast.error('Please select at least one team');
      return;
    }

    setAssigning(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/hackathon/assignTeam`,
        {
          teamID: selectedTeams,
          panelistID: selectedPanelist._id
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Teams assigned successfully');
        setShowModal(false);
        setSelectedPanelist(null);
        setSelectedTeams([]);
        fetchPanelistList();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to assign teams');
    } finally {
      setAssigning(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPanelist(null);
    setSelectedTeams([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
        Assign Teams to Panelists
      </h2>

      <div className="bg-[#0a1128] p-6 rounded-xl shadow-lg border border-gray-800">
        {panelistLoading ? (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
              <p className="text-gray-400">Loading panelists...</p>
            </div>
          </div>
        ) : panelistList && panelistList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {panelistList.map((panelist) => (
              <div
                key={panelist._id}
                className={`bg-[#1a2035] p-5 rounded-xl border border-gray-700 transition-all hover:border-blue-500 hover:shadow-lg cursor-pointer pop-out
                  ${selectedPanelist?._id === panelist._id ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handlePanelistClick(panelist)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-900/30 rounded-lg">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {panelist.firstName} {panelist.lastName}
                      </h3>
                    </div>
                    <div className="space-y-2.5 text-sm pl-11">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{panelist.email}</span>
                      </div>
                      {panelist.speciality && (
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{panelist.speciality}</span>
                        </div>
                      )}
                      {panelist.teams && panelist.teams.length > 0 && (
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
                            {panelist.teams.length} team{panelist.teams.length !== 1 ? 's' : ''} assigned
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl">
            <Users className="w-14 h-14 mx-auto mb-4 text-gray-500" />
            <h3 className="text-lg font-medium text-gray-400 mb-1">No panelists found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Add panelists first to assign teams to them
            </p>
          </div>
        )}
      </div>

      {/* Assignment Modal */}
      {showModal && selectedPanelist && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a1128] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-gray-800 shadow-2xl">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Assign Teams to <span className="text-blue-400">{selectedPanelist.firstName} {selectedPanelist.lastName}</span>
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {teamsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : teams && teams.length > 0 ? (
                <div className="space-y-3">
                  {teams.map(team => (
                    <label
                      key={team._id}
                      className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-all
                        ${selectedTeams.includes(team._id)
                          ? 'bg-blue-900/30 border-blue-700'
                          : 'bg-[#1a2035] border-gray-700 hover:border-blue-500'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTeams.includes(team._id)}
                        onChange={() => handleTeamSelect(team._id)}
                        className="mt-1 w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-800"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{team.teamName}</h4>
                        {team.projectName && (
                          <p className="text-sm text-gray-400 mt-1">Project: {team.projectName}</p>
                        )}
                        {team.members && team.members.length > 0 && (
                          <p className="text-xs text-gray-500 mt-2">
                            {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                  <p className="text-gray-400">No teams available for assignment</p>
                  <p className="text-sm text-gray-500 mt-1">Create teams first to assign them</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-800">
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-lg font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTeams}
                  disabled={assigning || selectedTeams.length === 0}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2
                    ${assigning
                      ? 'bg-blue-800 cursor-wait'
                      : selectedTeams.length === 0
                        ? 'bg-gray-700 cursor-not-allowed text-gray-500'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-800/50'}`}
                >
                  {assigning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Assigning...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Assign {selectedTeams.length} Team{selectedTeams.length !== 1 ? 's' : ''}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTeam;