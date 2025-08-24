import React, { useEffect, useState } from "react";
import axios from "axios";
import "./JobList.css";
import Navbar from "./Navbar";

const API_URL = import.meta.env.VITE_API_URL;
const SCRAPINGDOG_API_KEY = import.meta.env.VITE_SCRAPINGDOG_API_KEY;

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState({});
  const [field, setField] = useState("frontend developer");
  const [sortBy, setSortBy] = useState("day");
  const [jobType, setJobType] = useState("full_time");
  const [expLevel, setExpLevel] = useState("entry_level");
  const [workType, setWorkType] = useState("at_work");
  const [appliedJobs, setAppliedJobs] = useState({});

  useEffect(() => {
    const fetchJobTitle = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const response = await axios.get(`${API_URL}/resume`, {
          params: { email },
        });
        if (
          response.data.status === "success" &&
          response.data.user.matchedJobTitle
        ) {
          setField(response.data.user.matchedJobTitle);
        } else {
          setField("frontend developer");
        }
      } catch (error) {
        console.error("Failed to fetch job title:", error);
        setField("frontend developer");
      }
    };

    fetchJobTitle();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "https://api.scrapingdog.com/linkedinjobs";
        const params = {
          api_key: SCRAPINGDOG_API_KEY,
          field: field,
          sort_by: sortBy,
          job_type: jobType,
          exp_level: expLevel,
          work_type: workType,
          geoid: "102713980",
          page: 1,
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

    if (field) fetchData();
  }, [field, sortBy, jobType, expLevel, workType]);

  // const fetchSkills = async (jobTitle, index) => {
  //   try {
  //     const response = await axios.post('http://localhost:5000/extract_skills', { job_title: jobTitle });
  //     setSkills(prevSkills => ({
  //       ...prevSkills,
  //       [index]: response.data.skills
  //     }));
  //   } catch (error) {
  //     console.error("Failed to fetch skills:", error);
  //   }
  // };

  const handleCheckboxChange = async (job, index) => {
    const email = localStorage.getItem("userEmail");

    try {
      const response = await axios.post(`${API_URL}/application`, {
        email,
        jobTitle: job.job_position,
        company: job.company_name,
        location: job.job_location,
      });

      if (response.data.status === "success") {
        setAppliedJobs((prev) => ({ ...prev, [index]: true }));
        alert("Job application information saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save job application information:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="JobContainer">
        <div className="jobBody">
          <div className="filter-container">
            <select value={field} onChange={(e) => setField(e.target.value)}>
              <option value="software developer">Software Developer</option>
              <option value="frontend developer">Frontend Developer</option>
              <option value="web developer">Web Developer</option>
              <option value="software engineer">Software Engineer</option>
              <option value="data scientist">Data Scientist</option>
              <option value="product manager">Product Manager</option>
              <option value="ux designer">UX Designer</option>
              <option value="backend developer">Backend Developer</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sort By</option>
              <option value="day">Last 24 hours</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
            </select>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">Job Type</option>
              <option value="full_time">Full Time</option>
              <option value="part_time">Part Time</option>
              <option value="temporary">Temporary</option>
              <option value="contract">Contract</option>
              <option value="volunteer">Volunteer</option>
            </select>
            <select
              value={expLevel}
              onChange={(e) => setExpLevel(e.target.value)}
            >
              <option value="">Experience Level</option>
              <option value="internship">Internship</option>
              <option value="entry_level">Entry Level</option>
              <option value="associate">Associate</option>
              <option value="mid_senior_level">Mid-Senior Level</option>
              <option value="director">Director</option>
            </select>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
            >
              <option value="">Work Type</option>
              <option value="at_work">On-Site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="job-list">
            {jobs.length === 0 && !error ? (
              <p>Loading...</p>
            ) : (
              jobs.map((job, index) => (
                <div className="job-card" key={index}>
                  <img
                    src={job.company_logo_url}
                    alt={`${job.company_name} logo`}
                    className="company-logo"
                  />
                  <h2 className="job-position">{job.job_position}</h2>
                  <p className="company-name">{job.company_name}</p>
                  <p className="job-location">{job.job_location}</p>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <a
                      href={job.job_link}
                      className="job-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Apply Now
                    </a>
                    {/* <button onClick={() => fetchSkills(job.job_position, index)}>Show Skills</button> */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="checkbox"
                        name="applied"
                        id="applied"
                        checked={appliedJobs[index] || false}
                        onChange={() => handleCheckboxChange(job, index)}
                      />{" "}
                      I have applied for this job.
                    </div>
                  </div>
                  {/* {skills[index] && (
                    <div className="skills-list">
                      <h3>Relevant Skills:</h3>
                      <ul>
                        {skills[index].map((skill, skillIndex) => (
                          <li key={skillIndex}>{skill}</li>
                        ))}
                      </ul>
                    </div>
                  )} */}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobList;
