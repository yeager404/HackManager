import React, { useState } from 'react';
import { X } from 'lucide-react';
import useAuthStore from "../store/authStore.js"

const EventModal = ({ setShowModal, onCreateEvent }) => {

    const{user} = useAuthStore();
    const [formData, setFormData] = useState({
        hackathonName: '',
        teamMaxSize: '',
        teamMinSize: '',
        userID: user._id,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate form data
        if (!formData.hackathonName || !formData.teamMinSize || !formData.teamMaxSize) {
            alert('Please fill in all fields');
            return;
        }

        if (parseInt(formData.teamMinSize) > parseInt(formData.teamMaxSize)) {
            alert('Minimum team size cannot be greater than maximum team size');
            return;
        }

        onCreateEvent(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-800 rounded-lg p-6 w-full max-w-md relative">
                <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6">Create New Hackathon</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Hackathon Name
                        </label>
                        <input
                            type="text"
                            name="hackathonName"
                            value={formData.hackathonName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter hackathon name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Min Team Size
                            </label>
                            <input
                                type="number"
                                name="teamMinSize"
                                value={formData.teamMinSize}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-4 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Min size"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Max Team Size
                            </label>
                            <input
                                type="number"
                                name="teamMaxSize"
                                value={formData.teamMaxSize}
                                onChange={handleChange}
                                min="1"
                                className="w-full px-4 py-2 rounded-lg bg-neutral-700 border border-neutral-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Max size"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-800 transition-colors duration-200"
                    >
                        Create Hackathon
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EventModal;