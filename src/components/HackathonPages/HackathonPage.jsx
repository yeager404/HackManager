import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";
import useAuthStore from "../../store/authStore.js";
import Navbar from "../navbar.jsx";

// Import components
import Sidebar from "../HackathonPageComponents/Sidebar";
import Overview from "../HackathonPageComponents/Overview";
import JudgementCriteria from "../HackathonPageComponents/JudgementCriteria.jsx";
import ImportParticipants from "../HackathonPageComponents/ImportParticipants";
import CreatePanelist from "../HackathonPageComponents/CreatePanelist";
import AssignTeam from "../HackathonPageComponents/AssignTeam";

const HackathonPage = () => {
  const { hackathonId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Criteria state
  const [criteriaForm, setCriteriaForm] = useState({
    criteria: "",
    maxPoints: "",
    hackathonId: ""
  });
  const [criteriaList, setCriteriaList] = useState([]);
  const [criteriaLoading, setCriteriaLoading] = useState(false);
  
  // Panelist state
  const [panelistList, setPanelistList] = useState([]);
  const [panelistLoading, setPanelistLoading] = useState(false);

  const fetchCriteriaList = async () => {
    try {
      setCriteriaLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/v1/hackathon/getCriteriaList/${hackathonId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setCriteriaList(response.data.criteriaList);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch criteria');
    } finally {
      setCriteriaLoading(false);
    }
  };

  const fetchPanelistList = async () => {
    try {
      setPanelistLoading(true);
      const response = await axios.get(
        `http://localhost:4000/api/v1/hackathon/getPanelistList/${hackathonId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setPanelistList(response.data.panelistList);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch panelist list');
    } finally {
      setPanelistLoading(false);
    }
  };

  useEffect(() => {
    const fetchHackathonDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/v1/hackathon/getHackathon/${hackathonId}`, {
          withCredentials: true
        });

        if (response.data.success) {
          setHackathon(response.data.hackathon);
          setCriteriaForm(prev => ({ ...prev, hackathonId }));
          await fetchCriteriaList();
        } else {
          throw new Error(response.data.message || 'Failed to fetch hackathon details');
        }
      } catch (error) {
        console.error('Error fetching hackathon:', error);
        toast.error(error.response?.data?.message || error.message || 'Failed to fetch hackathon');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathonDetails();
  }, [hackathonId, navigate]);

  useEffect(() => {
    if (activeTab === "assignTeam") {
      fetchPanelistList();
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview hackathon={hackathon} user={user} />;
      case "judgementCriteria":
        return (
          <JudgementCriteria
            hackathonId={hackathonId}
            criteriaForm={criteriaForm}
            setCriteriaForm={setCriteriaForm}
            criteriaList={criteriaList}
            criteriaLoading={criteriaLoading}
            fetchCriteriaList={fetchCriteriaList}
          />
        );
      case "import":
        return <ImportParticipants hackathonId={hackathonId} criteriaList={criteriaList} />;
      case "createPanelist":
        return <CreatePanelist hackathonId={hackathonId} fetchPanelistList={fetchPanelistList} />;
      case "assignTeam":
        return (
          <AssignTeam
            hackathonId={hackathonId}
            panelistList={panelistList}
            panelistLoading={panelistLoading}
            fetchPanelistList={fetchPanelistList}
          />
        );
      default:
        return <div className="p-6">Select an option from the sidebar</div>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="flex h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HackathonPage;