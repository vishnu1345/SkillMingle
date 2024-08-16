# SkillMingle

SkillMingle is designed to help job seekers find job opportunities that perfectly match their resumes and skill sets.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setting up and Running the Applications](#setting-up-and-running-the-applications)
  - [Python Model](#python-model)
  - [Express Backend](#express-backend)
  - [Frontend](#frontend)
- [Additional Notes](#additional-notes)

## Prerequisites

Before running the application, ensure the following are installed on your system:

- **Node.js and npm**: You can download and install Node.js, which includes npm, from the [official Node.js website](https://nodejs.org/). Select the appropriate installer for your operating system.

- **Python**: Download and install Python from the [official Python website](https://www.python.org/downloads/). Choose the installer that matches your operating system.

- **pip**: pip comes bundled with Python 3.4 and later. To verify pip is installed, run `pip --version` in your terminal or command prompt. If pip is not installed, follow the [official pip installation guide](https://pip.pypa.io/en/stable/installation/).

## Setting up and Running the Applications

### Python Model

1. **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
    
2.  **Install the required packages**:
    ```bash
    pip install flask flask-cors torch transformers scikit-learn numpy
    ```
    
3. **Run the Python application**:
    ```bash
    python app.py
    ```

### Express Backend

1. **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2. **Install the necessary Node.js packages**:
    ```bash
    npm install
    ```

3. **Start the Node.js application**:
    ```bash
    node app.js
    ```

### Frontend

1. **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2. **Install the necessary dependencies**:
    ```bash
    npm install
    ```

3. **Start the development server**:
    ```bash
    npm run dev
    ```

## Additional Notes

- Check your system's environment variables to ensure Python and Node.js are correctly configured.
- If you encounter any errors related to missing packages, rerun the `pip install` or `npm install` commands to resolve dependencies.
