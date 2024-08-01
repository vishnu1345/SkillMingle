import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Home.css";

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
  });

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/resume", {
          params: { email: location.state.id },
        });
        if (res.data.status === "success") {
          setResumeData(res.data.user);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchResumeData();
  }, [location.state.id]);

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

  return (
    <div className="homeContainer">
      <div className="nav">
        <ul>
          <li>
            <Link to="/home">Dashboard</Link>
          </li>
          <li>
            <Link to="/home">Jobs</Link>
          </li>
          <li>
            <Link to="/home">Applications</Link>
          </li>
          <li>
            <Link to="/home">Resources</Link>
          </li>
        </ul>
      </div>
      <div className="body">
        <div className="header">
          <h2>Hello {resumeData.name || location.state.id}</h2>
          <div className="profilePic">
            <div className="photo">insert</div>
            <button onClick={handleLogout} className="logout">
              Logout
            </button>
          </div>
        </div>
        <div className="homebg"></div>
        <div className="mainbody">
         
          <form>
            <div>
              <label>Name: </label>
              <input
                type="text"
                value={resumeData.name}
                onChange={(e) =>
                  setResumeData({ ...resumeData, name: e.target.value })
                }
              />
            </div>
            <div>
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
              <textarea
                value={resumeData.skills.join(", ")}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    skills: e.target.value.split(","),
                  })
                }
              ></textarea>
            </div>
            <div>
              <label>Achievements: </label>
              <textarea
                value={resumeData.achievements}
                onChange={(e) =>
                  setResumeData({ ...resumeData, achievements: e.target.value })
                }
              ></textarea>
            </div>
            <div>
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

            <button
              type="submit"
              onClick={async (e) => {
                e.preventDefault();
                await axios.post("http://localhost:3000/resume", {
                  email: location.state.id,
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
