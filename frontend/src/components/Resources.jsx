import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Resources.css";

function Resources() {
    const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF file.");
    }
  };
  return (
    <>
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
          <li>
            <Link to="/upload-resume">Upload Resume</Link>
          </li>
        </ul>
      </div>
      <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>Upload Resume</h2>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
        className={`pdfUpload ${isDragging ? 'dragging' : ''}`}
      >
        {file ? (
          <p>{file.name}</p>
        ) : (
          <p>Drag & drop your PDF here or click to upload</p>
        )}
      </div>
      <input
        id="fileInput"
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
    </div>
    </>
  );
}

export default Resources;
