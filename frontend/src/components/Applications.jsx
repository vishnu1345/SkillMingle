
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Applications.css';
import Navbar from './Navbar';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:3000/applications', {
          params: { email },
        });
        if (response.data.status === "success") {
          setApplications(response.data.applications);
        } else {
          setError("Failed to fetch applications");
        }
      } catch (error) {
        setError("An error occurred while fetching applications.");
        console.error("Error:", error);
      }
    };

    fetchApplications();
  }, [email]);

  const handleDeleteApplication = async (jobId) => {
    try {
      const response = await axios.post('http://localhost:3000/deleteApplication', {
        email,
        jobId,
      });

      if (response.data.status === 'success') {
        setApplications(response.data.applications);
        alert('Job application deleted successfully!');
      } else {
        setError('Failed to delete application');
      }
    } catch (error) {
      console.error('Failed to delete application:', error);
      setError('An error occurred while deleting the application.');
    }
  };

  return (
    <>
    <Navbar/>
    <div className="ApplicationsContainer">
      <h1>Jobs You've Applied For</h1>
      {error && <p className="error-message">{error}</p>}
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="application-list">
          {applications.map((application, index) => (
            <div className="application-card" key={index}>
              <h2>{application.jobTitle}</h2>
              <p><strong>Company:</strong> {application.company}</p>
              <p><strong>Location:</strong> {application.location}</p>
              <p><strong>Date Applied:</strong> {new Date(application.date).toLocaleDateString()}</p>
              <button
                className="delete-button"
                onClick={() => handleDeleteApplication(application._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default Applications;
