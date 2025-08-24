import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Home.css";
import image from "/Rectangle-2.png"

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resumeData, setResumeData] = useState({
    name: "",
    contact: "",
    experience: [], 
    projects: [],
    skills: [],
    achievements: "",
    certifications: [],
    skillLevels: {},
  });

  const skillsList = [
    "HTML/CSS", "JavaScript", "React.js", "Angular.js", "Bootstrap",
    "Tailwind CSS", "Node.js", "Express.js", "RESTful API Design", "MongoDB",
    "MySQL", "Django", "PostgreSQL", "Redis", "Docker",
    "AWS/Azure/GCP", "Python", "Computer Vision", "Natural Language Processing (NLP)",
    "Swift", "Kotlin", "Flutter", "Dart", "React Native", "Firebase"
  ];

  const skillTests = ["JavaScript", "Reactjs"]; 

  const [searchTerm, setSearchTerm] = useState("");

  const [jobTitles, setJobTitles] = useState([]);

  
  const matchJobTitles = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      const res = await axios.post(`${API_URL}/match-job-title`, { 
        skills: resumeData.skills,
        email: email 
      });
      if (res.data.status === "success") {
        setJobTitles([res.data.matchingTitle]);
  
        const mostRelevantJobTitle = res.data.matchingTitle?.title || '';
  
        
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (resumeData.skills.length > 0) {
      matchJobTitles();
    }
  }, [resumeData.skills]);



  useEffect(() => {
  const fetchResumeData = async () => {
    try {
      const email = localStorage.getItem("userEmail"); 
      const res = await axios.get(`${API_URL}/resume`, { params: { email } });
      if (res.data.status === "success") {
        const userData = res.data.user;
        setResumeData({
          ...userData,
          skills: Array.isArray(userData.skills) ? userData.skills : [],
          skillLevels: userData.skillLevels || {}, 
        });
      }
    } catch (e) {
      console.error(e);
    }
  };
  fetchResumeData();
}, []);


  const handleSkillTestSelect = (e) => {
    const selectedSkill = e.target.value;
    navigate(`/test/${selectedSkill.toLowerCase()}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const handleAddField = (field) => {
    setResumeData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], ""],
    }));
  };

  const handleChange = (index, value, field) => {
    const updatedArray = [...resumeData[field]];
    updatedArray[index] = value;
    setResumeData((prevData) => ({
      ...prevData,
      [field]: updatedArray,
    }));
  };

  const handleSkillClick = (index) => {
    setResumeData((prevData) => {
      const updatedSkills = prevData.skills.includes(index)
        ? prevData.skills.filter((skill) => skill !== index)
        : [...prevData.skills, index];

      return {
        ...prevData,
        skills: updatedSkills,
      };
    });
  };

  const filteredSkills = skillsList.filter((skill) =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="homeContainer">
      <div className="navb">
        <ul>
          <li>
            <Link to="/home">Dashboard</Link>
          </li>
          <li>
            <Link to="/jobs">Jobs</Link>
          </li>
          <li>
            <Link to="/applications">Applications</Link>
          </li>
        </ul>
      </div>
      <div className="body">
        <div className="header">
          {/* <h2>Profile</h2> */}
          <div className="profilePic">
            <div className="photo"></div>
            {resumeData.name || "User"}
            
          </div>
          <button onClick={handleLogout} className="logout">
              Logout
            </button> 
        </div>
        
        <div className = "rectangle2">
          <img src={image} alt="" className="rectangle2img" />
          </div>
        <div className="mainbody">
          <form>
            <div className="name">
              <label>Name: </label>
              <input
                type="text"
                value={resumeData.name}
                onChange={(e) =>
                  setResumeData({ ...resumeData, name: e.target.value })
                }
              />
            </div>
            <div className="contact">
              <label>Contact: </label>
              <input
                type="text"
                value={resumeData.contact}
                onChange={(e) =>
                  setResumeData({ ...resumeData, contact: e.target.value })
                }
              />
            </div>
            <div className="dynamicField">
              <label>Experience: </label>
              {Array.isArray(resumeData.experience) ? (
                resumeData.experience.map((exp, index) => (
                  <div key={index}>
                    <textarea
                      value={exp}
                      onChange={(e) => {
                        const newExperience = [...resumeData.experience];
                        newExperience[index] = e.target.value;
                        setResumeData({
                          ...resumeData,
                          experience: newExperience,
                        });
                      }}
                    ></textarea>
                  </div>
                ))
              ) : (
                <textarea
                  value={resumeData.experience || ""}
                  onChange={(e) =>
                    setResumeData({
                      ...resumeData,
                      experience: [e.target.value],
                    })
                  }
                ></textarea>
              )}
              <button
                type="button"
                onClick={() =>
                  setResumeData({
                    ...resumeData,
                    experience: [...resumeData.experience, ""],
                  })
                }
                className="addFieldButton"
              >
                + Add Experience
              </button>
            </div>
            <div className="dynamicField">
              <label>Projects: </label>
              {resumeData.projects.map((proj, index) => (
                <div key={index} className="dynamicInput">
                  <textarea
                    value={proj}
                    onChange={(e) =>
                      handleChange(index, e.target.value, "projects")
                    }
                  ></textarea>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddField("projects")}
                className="addFieldButton"
              >
                + Add Project
              </button>
            </div>
            <div>
              <label>Skills: </label>
              <div className="skillsContainer">
                <label>Select Skills</label>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="searchInput"
                />
                <div className="skillsGrid">
                  {filteredSkills.map((skill, index) => (
                    <div
                      key={index}
                      className={`skillItem ${
                        resumeData.skills.includes(index) ? "selected" : ""
                      }`}
                      onClick={() => handleSkillClick(index)}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="skilltestcontainer">
              <label>Take a Skill Test: </label>
              <select onChange={handleSkillTestSelect} defaultValue="">
                <option value="" disabled>Select a test</option>
                {skillTests.map((skill, index) => (
                  <option key={index} value={skill}>{skill}</option>
                ))}
              </select>
            </div>
            <div className="skillLevels">
              <h3>Your Skill Levels:</h3>
              {Object.entries(resumeData.skillLevels).map(([skill, level], index) => (
                <div key={index}>
                  <strong>{skill}</strong>: {level}
                </div>
              ))}
            </div>
            <div className="achievements">
              <label>Achievements: </label>
              <textarea
                value={resumeData.achievements}
                onChange={(e) =>
                  setResumeData({ ...resumeData, achievements: e.target.value })
                }
              ></textarea>
            </div>
            <div className="certifications">
              <label>Certifications: </label>
              <textarea
                value={resumeData.certifications.join(", ")}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    certifications: e.target.value.split(","),
                  })
                }
              ></textarea>
            </div>
            {/* <button
              type="submit"
              onClick={async (e) => {
                e.preventDefault();
                await axios.post("http://localhost:3000/resume", {
                  ...resumeData,
                });
              }}
            >
              Save
            </button> */}
            <button
  type="submit"
  onClick={async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("userEmail"); 
    await axios.post(`${API_URL}/resume`, {
      email, // Include the email here
      ...resumeData,
    });
  }}
>
  Save
</button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
