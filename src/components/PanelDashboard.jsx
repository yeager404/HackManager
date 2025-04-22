import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import {
    Loader2,
    Users,
    Award,
    Star,
    X,
    CheckCircle2,
    LogOut
} from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/authStore';

const PanelDashboard = () => {
    const { user, token, logout } = useAuthStore();
    // Use the id property instead of _id since that's what we're getting from the backend
    const panelistId = user?.id;
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [scoringCriteria, setScoringCriteria] = useState([]);
    const [scores, setScores] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showScoreModal, setShowScoreModal] = useState(false);
    const navigate = useNavigate();

    const fetchTeams = async () => {
        if (!panelistId) {
            toast.error('No panelist ID found');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:4000/api/v1/panelist/getTeamList/${panelistId}`,
                { withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}` // Add Bearer token
                    }
                 },

            );

            if (response.data.success) {
                setTeams(response.data.teams);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch teams');
        } finally {
            setLoading(false);
        }
    };

    const fetchTeamCriteria = async (teamId) => {
        try {
            const response = await axios.get(
                `http://localhost:4000/api/v1/panelist/getCriteria/${teamId}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setScoringCriteria(response.data.scoringCriteria);
                // Initialize scores object with received points
                const initialScores = {};
                response.data.scoringCriteria.forEach(criteria => {
                    initialScores[criteria._id] = criteria.receivedPoints || 0;
                });
                setScores(initialScores);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to fetch scoring criteria');
        }
    };

    useEffect(() => {
        if (panelistId) {
            fetchTeams();
        }
    }, [panelistId]);

    const handleTeamClick = async (team) => {
        setSelectedTeam(team);
        setShowScoreModal(true);
        await fetchTeamCriteria(team._id);
    };

    const handleScoreChange = (criteriaId, value, maxPoints) => {
        const numValue = Number(value);
        if (numValue >= 0 && numValue <= maxPoints) {
            setScores(prev => ({
                ...prev,
                [criteriaId]: numValue
            }));
        }
    };

    const handleSubmitScores = async () => {
        try {
            setSubmitting(true);
            const scoreArray = scoringCriteria.map(criteria => scores[criteria._id]);

            const response = await axios.post(
                'http://localhost:4000/api/v1/panelist/updateTeamScore',
                {
                    teamId: selectedTeam._id,
                    scores: scoreArray
                },
                { withCredentials: true }
            );

            if (response.data.success) {
                toast.success('Scores updated successfully!');
                setShowScoreModal(false);
                setSelectedTeam(null);
                await fetchTeams();
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to update scores');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login-panelist');
        toast.success('Logged out successfully');
    };

    // const ScoreModal = () => (
    //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    //         <div className="bg-neutral-900 rounded-lg p-6 w-full max-w-2xl border border-blue-500/20">
    //             <div className="flex justify-between items-center mb-6">
    //                 <h3 className="text-xl font-semibold text-white">
    //                     Score Team: {selectedTeam?.teamName}
    //                 </h3>
    //                 <button
    //                     onClick={() => {
    //                         setShowScoreModal(false);
    //                         setSelectedTeam(null);
    //                     }}
    //                     className="text-gray-400 hover:text-white"
    //                 >
    //                     <X className="w-6 h-6" />
    //                 </button>
    //             </div>

    //             <div className="space-y-4 max-h-96 overflow-y-auto">
    //                 {scoringCriteria.map((criteria) => (
    //                     <div 
    //                         key={criteria._id} 
    //                         className="bg-neutral-800 p-4 rounded-lg border border-blue-500/10"
    //                     >
    //                         <div className="flex justify-between items-center mb-2">
    //                             <h4 className="text-white font-medium">{criteria.criteria}</h4>
    //                             <span className="text-sm text-blue-400">
    //                                 Max Points: {criteria.maxPoints}
    //                             </span>
    //                         </div>
    //                         <input
    //                             type="number"
    //                             value={scores[criteria._id] ?? ''}
    //                             onChange={(e) => {
    //                                 const value = e.target.value;
    //                                 // Allow empty input or numeric values
    //                                 if (value === '' || (!isNaN(value) && value >= 0 && value <= criteria.maxPoints)) {
    //                                     handleScoreChange(criteria._id, value === '' ? '' : Number(value), criteria.maxPoints);
    //                                 }
    //                             }}
    //                             onBlur={(e) => {
    //                                 // If empty, default to 0
    //                                 if (e.target.value === '') {
    //                                     handleScoreChange(criteria._id, 0, criteria.maxPoints);
    //                                 }
    //                             }}
    //                             min="0"
    //                             max={criteria.maxPoints}
    //                             className="w-full px-4 py-2 rounded-lg bg-neutral-700 border border-blue-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                             placeholder="Enter score"
    //                         />
    //                     </div>
    //                 ))}
    //             </div>

    //             <div className="mt-6 flex justify-end space-x-3">
    //                 <button
    //                     onClick={() => {
    //                         setShowScoreModal(false);
    //                         setSelectedTeam(null);
    //                     }}
    //                     className="px-4 py-2 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
    //                 >
    //                     Cancel
    //                 </button>
    //                 <button
    //                     onClick={handleSubmitScores}
    //                     disabled={submitting}
    //                     className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
    //                         submitting
    //                             ? 'bg-gray-600 cursor-not-allowed'
    //                             : 'bg-blue-600 hover:bg-blue-700'
    //                     }`}
    //                 >
    //                     {submitting ? (
    //                         <>
    //                             <Loader2 className="w-5 h-5 animate-spin" />
    //                             <span>Submitting...</span>
    //                         </>
    //                     ) : (
    //                         <>
    //                             <CheckCircle2 className="w-5 h-5" />
    //                             <span>Submit Scores</span>
    //                         </>
    //                     )}
    //                 </button>
    //             </div>
    //         </div>
    //     </div>
    // );

    // return (
    //     <div className="min-h-screen bg-neutral-900">
    //         <Toaster position="top-center" />

    //         {/* Header */}
    //         <header className="bg-neutral-800 border-b border-blue-500/20 py-6">
    //             <div className="container mx-auto px-4">
    //                 <div className="flex items-center justify-between">
    //                     <div className="flex items-center space-x-3">
    //                         <Award className="w-8 h-8 text-blue-500" />
    //                         <h1 className="text-2xl font-bold text-white">Panel Dashboard</h1>
    //                     </div>
    //                     <button
    //                         onClick={handleLogout}
    //                         className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded-lg text-white"
    //                     >
    //                         <LogOut className="w-5 h-5" />
    //                         <span>Logout</span>
    //                     </button>
    //                 </div>
    //             </div>
    //         </header>

    //         {/* Main Content */}
    //         <main className="container mx-auto px-4 py-8">
    //             <div className="bg-neutral-800 rounded-lg border border-blue-500/20 p-6">
    //                 <div className="flex items-center space-x-2 mb-6">
    //                     <Users className="w-6 h-6 text-blue-500" />
    //                     <h2 className="text-xl font-semibold text-white">Assigned Teams</h2>
    //                 </div>

    //                 {loading ? (
    //                     <div className="flex justify-center py-12">
    //                         <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    //                     </div>
    //                 ) : teams.length > 0 ? (
    //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    //                         {teams.map((team) => (
    //                             <div
    //                                 key={team._id}
    //                                 onClick={() => handleTeamClick(team)}
    //                                 className="bg-neutral-700 rounded-lg p-4 cursor-pointer hover:bg-neutral-600 transition-all transform hover:scale-[1.02] border border-blue-500/10"
    //                             >
    //                                 <div className="flex items-center justify-between mb-3">
    //                                     <h3 className="text-lg font-medium text-white">
    //                                         {team.teamName}
    //                                     </h3>
    //                                     <Star className="w-5 h-5 text-blue-500" />
    //                                 </div>
    //                                 <p className="text-sm text-gray-300">
    //                                     {team.participants?.length || 0} Members
    //                                 </p>
    //                                 {team.scoringCriteria?.some(c => c.receivedPoints) && (
    //                                     <p className="text-sm text-blue-400 mt-2">
    //                                         Scored
    //                                     </p>
    //                                 )}
    //                             </div>
    //                         ))}
    //                     </div>
    //                 ) : (
    //                     <div className="text-center py-12">
    //                         <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
    //                         <p className="text-gray-400">No teams assigned yet</p>
    //                     </div>
    //                 )}
    //             </div>
    //         </main>

    //         {showScoreModal && <ScoreModal />}
    //     </div>
    // );
    const ScoreModal = () => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-xl p-8 w-full max-w-2xl border border-blue-500/30 shadow-2xl shadow-blue-500/10">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-white flex items-center">
                        <Award className="w-6 h-6 text-blue-400 mr-3" />
                        Score Team: <span className="ml-2 text-blue-400">{selectedTeam?.teamName}</span>
                    </h3>
                    <button
                        onClick={() => {
                            setShowScoreModal(false);
                            setSelectedTeam(null);
                        }}
                        className="text-gray-400 hover:text-white bg-neutral-700 hover:bg-neutral-600 p-2 rounded-full transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-5 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                    {scoringCriteria.map((criteria) => (
                        <div
                            key={criteria._id}
                            className="bg-neutral-800 p-5 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all shadow-md"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-white font-medium text-lg">{criteria.criteria}</h4>
                                <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-medium">
                                    Max Points: {criteria.maxPoints}
                                </span>
                            </div>
                            <div className="flex items-center">
                                {/* Number input with buttons */}
                                <div className="flex flex-1">
                                    <button
                                        className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-3 rounded-l-lg border-r border-neutral-600 focus:outline-none text-lg font-bold"
                                        onClick={() => {
                                            const currentValue = scores[criteria._id] || 0;
                                            if (currentValue > 0) {
                                                handleScoreChange(criteria._id, currentValue - 1, criteria.maxPoints);
                                            }
                                        }}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={scores[criteria._id] ?? ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '' || (!isNaN(value) && value >= 0 && value <= criteria.maxPoints)) {
                                                handleScoreChange(criteria._id, value === '' ? '' : Number(value), criteria.maxPoints);
                                            }
                                        }}
                                        onBlur={(e) => {
                                            if (e.target.value === '') {
                                                handleScoreChange(criteria._id, 0, criteria.maxPoints);
                                            }
                                        }}
                                        min="0"
                                        max={criteria.maxPoints}
                                        className="w-full px-4 py-3 bg-neutral-700 text-white text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                                        placeholder="0"
                                    />
                                    <button
                                        className="bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-3 rounded-r-lg border-l border-neutral-600 focus:outline-none text-lg font-bold"
                                        onClick={() => {
                                            const currentValue = scores[criteria._id] || 0;
                                            if (currentValue < criteria.maxPoints) {
                                                handleScoreChange(criteria._id, currentValue + 1, criteria.maxPoints);
                                            }
                                        }}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Optional slider for visual score input */}
                                <input
                                    type="range"
                                    min="0"
                                    max={criteria.maxPoints}
                                    value={scores[criteria._id] || 0}
                                    onChange={(e) => {
                                        handleScoreChange(criteria._id, Number(e.target.value), criteria.maxPoints);
                                    }}
                                    className="ml-4 w-1/3 accent-blue-500 h-2 rounded cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-400">
                                <span>0</span>
                                <span>{Math.floor(criteria.maxPoints / 2)}</span>
                                <span>{criteria.maxPoints}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-700 flex justify-end space-x-4">
                    <button
                        onClick={() => {
                            setShowScoreModal(false);
                            setSelectedTeam(null);
                        }}
                        className="px-6 py-3 rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-all font-medium flex items-center"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmitScores}
                        disabled={submitting}
                        className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${submitting
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-500'
                            }`}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                <span>Submit Scores</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    // return (
    //     <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black">
    //         <Toaster position="top-center" />

    //         {/* Header */}
    //         <header className="bg-gradient-to-r from-neutral-800 to-neutral-900 border-b border-blue-500/30 py-6 sticky top-0 z-10 shadow-lg shadow-black/50">
    //             <div className="container mx-auto px-6">
    //                 <div className="flex items-center justify-between">
    //                     <div className="flex items-center space-x-4">
    //                         <div className="bg-blue-500/20 p-3 rounded-lg">
    //                             <Award className="w-6 h-6 text-blue-400" />
    //                         </div>
    //                         <h1 className="text-2xl font-bold text-white">Panel Dashboard</h1>
    //                     </div>
    //                     <button
    //                         onClick={handleLogout}
    //                         className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 transition-all rounded-lg text-white font-medium shadow-lg shadow-red-900/20 transform hover:-translate-y-0.5"
    //                     >
    //                         <LogOut className="w-4 h-4" />
    //                         <span>Logout</span>
    //                     </button>
    //                 </div>
    //             </div>
    //         </header>

    //         {/* Main Content */}
    //         <main className="container mx-auto px-6 py-10">
    //             <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-xl border border-blue-500/30 p-8 shadow-xl">
    //                 <div className="flex items-center space-x-3 mb-8">
    //                     <div className="bg-blue-600/20 p-2.5 rounded-lg">
    //                         <Users className="w-5 h-5 text-blue-400" />
    //                     </div>
    //                     <h2 className="text-2xl font-bold text-white">Assigned Teams</h2>
    //                 </div>

    //                 {loading ? (
    //                     <div className="flex flex-col items-center justify-center py-20">
    //                         <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
    //                         <p className="text-blue-300">Loading teams...</p>
    //                     </div>
    //                 ) : teams.length > 0 ? (
    //                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //                         {teams.map((team) => (
    //                             <div
    //                                 key={team._id}
    //                                 onClick={() => handleTeamClick(team)}
    //                                 className="bg-gradient-to-br from-neutral-700 to-neutral-800 rounded-xl p-6 cursor-pointer hover:bg-neutral-600 transition-all transform hover:scale-[1.03] border border-blue-500/20 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/5 group"
    //                             >
    //                                 <div className="flex items-center justify-between mb-4">
    //                                     <h3 className="text-xl font-semibold text-white group-hover:text-blue-200 transition-colors">
    //                                         {team.teamName}
    //                                     </h3>
    //                                     <div className="bg-blue-500/20 p-2 rounded-full group-hover:bg-blue-500/40 transition-all">
    //                                         <Star className="w-5 h-5 text-blue-400" />
    //                                     </div>
    //                                 </div>
    //                                 <div className="flex justify-between items-end">
    //                                     <div className="flex items-center space-x-2 text-sm text-gray-300">
    //                                         <Users className="w-4 h-4" />
    //                                         <span>{team.participants?.length || 0} Members</span>
    //                                     </div>
    //                                     {team.scoringCriteria?.some(c => c.receivedPoints) && (
    //                                         <span className="text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-medium">
    //                                             Scored
    //                                         </span>
    //                                     )}
    //                                 </div>
    //                             </div>
    //                         ))}
    //                     </div>
    //                 ) : (
    //                     <div className="flex flex-col items-center justify-center py-20 bg-neutral-800/50 rounded-xl border border-dashed border-neutral-700">
    //                         <div className="bg-neutral-700/50 p-4 rounded-full mb-4">
    //                             <Users className="w-10 h-10 text-gray-400" />
    //                         </div>
    //                         <p className="text-gray-400 text-lg mb-2">No teams assigned yet</p>
    //                         <p className="text-gray-500 text-sm max-w-md text-center">When teams are assigned to you for scoring, they will appear here</p>
    //                     </div>
    //                 )}
    //             </div>
    //         </main>

    //         {showScoreModal && <ScoreModal />}
    //     </div>
    // );
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a1128] to-[#050a17]">
            <Toaster position="top-center" />

            {/* Header */}
            <header className="bg-[#0a1128] border-b border-blue-500/30 py-5 sticky top-0 z-10 shadow-xl shadow-blue-900/10">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-500/20 p-3 rounded-lg backdrop-blur-sm">
                                <Award className="w-6 h-6 text-blue-400" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                                Panel Dashboard
                            </h1>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition-all rounded-lg text-white font-medium shadow-lg hover:shadow-red-900/30 group"
                        >
                            <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-10">
                <div className="bg-[#0a1128] rounded-xl border border-gray-800 p-8 shadow-2xl backdrop-blur-sm">
                    <div className="flex items-center space-x-4 mb-10">
                        <div className="bg-blue-600/20 p-3 rounded-lg backdrop-blur-sm">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white">Assigned Teams</h2>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                            <p className="text-blue-300 font-medium">Loading your assigned teams...</p>
                        </div>
                    ) : teams.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teams.map((team) => (
                                <div
                                    key={team._id}
                                    onClick={() => handleTeamClick(team)}
                                    className="bg-[#1a2035] rounded-xl p-6 cursor-pointer hover:bg-[#1a2845] transition-all border border-gray-800 hover:border-blue-500/50 shadow-lg hover:shadow-blue-500/10 group relative overflow-hidden"
                                >
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-white group-hover:text-blue-200 transition-colors truncate">
                                                {team.teamName}
                                            </h3>
                                            <div className="bg-blue-500/20 p-2 rounded-full group-hover:bg-blue-500/40 transition-all">
                                                <Star className="w-5 h-5 text-blue-400" />
                                            </div>
                                        </div>

                                        {team.projectName && (
                                            <p className="text-gray-400 text-sm mb-4 truncate">
                                                Project: {team.projectName}
                                            </p>
                                        )}

                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center space-x-2 text-sm text-gray-300">
                                                <Users className="w-4 h-4 text-gray-500" />
                                                <span>{team.participants?.length || 0} Member{team.participants?.length !== 1 ? 's' : ''}</span>
                                            </div>
                                            {team.scoringCriteria?.some(c => c.receivedPoints) && (
                                                <span className="text-xs bg-green-900/50 text-green-300 px-2.5 py-1 rounded-full font-medium flex items-center">
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Scored
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-[#1a2035] rounded-xl border-2 border-dashed border-gray-800">
                            <div className="bg-gray-800/50 p-5 rounded-full mb-5 backdrop-blur-sm">
                                <Users className="w-10 h-10 text-gray-500" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-300 mb-2">No teams assigned</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                Teams assigned to you for evaluation will appear here. Check back later or contact the administrator.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {showScoreModal && <ScoreModal />}
        </div>
    );
};

export default PanelDashboard;