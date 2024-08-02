// JobList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './JobList.css'; 

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://api.scrapingdog.com/linkedinjobs";
        const params = {
          api_key: "66aca5c8bd5a0b0a9fdd1934",
          field: "software developer",
          geoid: "102713980",
          page: 1
        };

        const response = await axios.get(url, { params });
        if (response.status === 200) {
          setJobs(response.data); 
        } else {
          setError("Request failed with status code: " + response.status);
        }
      } catch (error) {
        setError("An error occurred while fetching job data.");
        console.error("An error occurred:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="job-list">
      {error && <p className="error-message">{error}</p>}
      {jobs.length === 0 && !error ? (
        <p>Loading</p>
      ) : (
        jobs.map((job, index) => (
          <div className="job-card" key={index}>
            <img src={job.company_logo_url} alt={`${job.company_name} logo`} className="company-logo" />
            <h2 className="job-position">{job.job_position}</h2>
            <p className="company-name">{job.company_name}</p>
            <p className="job-location">{job.job_location}</p>
            <a href={job.job_link} className="job-link" target="_blank" rel="noopener noreferrer">Apply Now</a>
          </div>
        ))
      )}
    </div>
  );
};

export default JobList;
