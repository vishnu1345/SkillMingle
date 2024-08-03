import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Test.css";

const Test = () => {
  const navigate = useNavigate();
  const { skill } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const skillQuestions = {
      javascript: [
        { id: 1, question: "What is a closure in JavaScript?", options: ["Option 1", "Option 2"], correctAnswer: "Option 1" },
        { id: 2, question: "Explain event delegation.", options: ["Option 1", "Option 2"], correctAnswer: "Option 2" },
        { id: 3, question: "What is the difference between == and ===?", options: ["Option 1", "Option 2"], correctAnswer: "Option 1" },
        { id: 4, question: "What is a promise?", options: ["Option 1", "Option 2"], correctAnswer: "Option 2" },
        { id: 5, question: "What is the use of the 'let' keyword?", options: ["Option 1", "Option 2"], correctAnswer: "Option 1" },
      ],
      reactjs: [
        { id: 1, question: "What is JSX?", options: ["Option 1", "Option 2"], correctAnswer: "Option 1" },
        { id: 2, question: "Explain the virtual DOM.", options: ["Option 1", "Option 2"], correctAnswer: "Option 2" },
        { id: 3, question: "What are hooks?", options: ["Option 1", "Option 2"], correctAnswer: "Option 1" },
        { id: 4, question: "What is the purpose of useState?", options: ["Option 1", "Option 2"], correctAnswer: "Option 2" },
        { id: 5, question: "How do you pass props to a component?", options: ["Option 1", "Option 2"], correctAnswer: "Option 1" },
      ],
    };

    setQuestions(skillQuestions[skill] || []);
  }, [skill]);

  useEffect(() => {
    if (timeLeft === 0) {
      calculateResults();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (id, answer) => {
    setAnswers({ ...answers, [id]: answer });
  };

  const calculateResults = async () => {
    const correctAnswers = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    let level = "";

    if (correctAnswers >= 4) {
      level = "Experienced";
    } else if (correctAnswers >= 2) {
      level = "Intermediate";
    } else {
      level = "Beginner";
    }

    try {
      await axios.post("http://localhost:3000/updateSkillLevel", {
        skill,
        level,
        email: location.state?.id, // Use optional chaining to avoid errors
      });

      alert(`Test complete! You scored ${correctAnswers}/${questions.length}. You are ${level} in ${skill}.`);
      navigate("/home");
    } catch (error) {
      console.error("Error updating skill level:", error);
      alert("An error occurred while updating your skill level. Please try again.");
    }
  };

  return (
    <div className="testContainer">
      <h2>{skill.toUpperCase()} Test</h2>
      <div className="timer">Time Left: {timeLeft} seconds</div>
      {questions.length > 0 ? (
        questions.map((q) => (
          <div key={q.id} className="question">
            <p>{q.question}</p>
            <select onChange={(e) => handleAnswerChange(q.id, e.target.value)}>
              <option value="">Select an answer</option>
              {q.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </div>
        ))
      ) : (
        <p>Loading questions...</p>
      )}
      <button onClick={calculateResults} disabled={timeLeft === 0}>
        Submit Test
      </button>
    </div>
  );
};

export default Test;
