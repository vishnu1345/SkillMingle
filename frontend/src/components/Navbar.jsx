import React from 'react'

import { Link } from 'react-router-dom';
import "./Navbar.css"

function Navbar() {
  return (
    <nav className="navbar">
        <h1>SkillMingle</h1>
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
          <li>
            <Link to="/upload-resume">Upload Resume</Link>
          </li>
        </ul>
      </nav>
  )
}

export default Navbar