import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import EventModal from "./EventModal";
import useAuthStore from "../store/authStore";
import { toast } from "react-hot-toast";
import { Loader2, Trash } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { user } = useAuthStore();
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingIds, setDeletingIds] = useState([]);
    const navigate = useNavigate();

    const fetchHackathons = async () => {
        if (!user?._id) {
            toast.error('User not authenticated');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/hackathon/getHackathonsList/${user._id}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (response.ok) {
                setEvents(data.hackathons || []);
            } else {
                throw new Error(data.message || 'Failed to fetch hackathons');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch hackathons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHackathons();
    }, [user?._id]);

    const handleCreateEvent = async (formData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/hackathon/createHackathon`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                await fetchHackathons();
                toast.success('Hackathon created successfully!');
                setShowModal(false);
            } else {
                throw new Error(data.message || 'Failed to create hackathon');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to create hackathon');
        }
    };

    const handleDeleteHackathon = async (hackathonId, e) => {
        e.stopPropagation(); // Prevent event bubbling to the parent div
        if (!hackathonId || !user?._id) {
            toast.error('Missing hackathon ID or user ID');
            return;
        }

        setDeletingIds(prev => [...prev, hackathonId]);

        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/hackathon/deleteHackathon`, {
                data: { userId: user._id, hackathonId: hackathonId },
                withCredentials: true
            });

            if (response.data.success) {
                setEvents(prev => prev.filter(event => event._id !== hackathonId));
                toast.success('Hackathon deleted successfully!');
            } else {
                throw new Error(response.data.message || 'Failed to delete hackathon');
            }
        } catch (error) {
            console.error('Delete error:', error);
            if (error.response) {
                toast.error(`Error ${error.response.status}: ${error.response.data.message || 'Failed to delete hackathon'}`);
            } else if (error.request) {
                toast.error('No response received from server. Please check network connection.');
            } else {
                toast.error(error.message || 'Failed to delete hackathon');
            }
            await fetchHackathons();
        } finally {
            setDeletingIds(prev => prev.filter(id => id !== hackathonId));
        }
    };

    const navigateToHackathon = (hackathonId) => {
        navigate(`/hackathon/${hackathonId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 text-white ">
            <Navbar />

            <div className="text-4xl sm:text-5xl text-center pt-12 font-bold tracking-tight">
                <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-500">
                    Welcome {user?.firstName || 'User'} 👋
                </h1>
            </div>

            {/* Divider - Create Event */}
            <div className="flex items-center my-12">
                <div className="flex-grow border-t border-neutral-700"></div>
                <span className="mx-4 text-lg font-semibold text-blue-400 tracking-wide">Create an Event</span>
                <div className="flex-grow border-t border-neutral-700"></div>
            </div>

            {/* Add Event Button */}
            <div className="flex justify-center">
                <button
                    onClick={() => setShowModal(true)}
                    className="relative px-8 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 transition duration-300 group overflow-hidden"
                >
                    <span className="relative z-10">+ Add Event</span>
                    <span className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-10 transition-all duration-300 rounded-xl blur-lg"></span>
                </button>
            </div>

            {/* Divider - Existing Events */}
            <div className="flex items-center my-12">
                <div className="flex-grow border-t border-neutral-700"></div>
                <span className="mx-4 text-lg font-semibold text-blue-400 tracking-wide">Existing Events</span>
                <div className="flex-grow border-t border-neutral-700"></div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="col-span-full flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : events.length > 0 ? (
                    events.map((event, index) => (
                        <div
                            key={event._id || index}
                            className="bg-neutral-800 p-5 rounded-xl shadow-md border border-neutral-700 hover:border-blue-500 hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer relative pop-out"
                            onClick={() => navigateToHackathon(event._id)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-2 leading-snug">
                                        <span className="text-blue-500">Event Name:</span> {event.hackathonName}
                                    </h3>
                                    <p className="text-gray-400">
                                        <span className="text-blue-500">Team Size:</span> {event.teamMinSize} - {event.teamMaxSize}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => handleDeleteHackathon(event._id, e)}
                                    disabled={deletingIds.includes(event._id)}
                                    className="text-blue-500 hover:text-blue-400 transition-colors p-1"
                                    title="Delete Hackathon"
                                >
                                    {deletingIds.includes(event._id) ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Trash className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 py-12 text-lg">
                        No hackathons created yet
                    </div>
                )}
            </div>

            {showModal && (
                <EventModal setShowModal={setShowModal} onCreateEvent={handleCreateEvent} />
            )}
        </div>
    );
};

export default Dashboard;