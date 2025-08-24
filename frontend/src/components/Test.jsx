import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Test.css";

const API_URL = import.meta.env.VITE_API_URL;

const Test = () => {
  const navigate = useNavigate();
  const { skill } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const skillQuestions = {
      javascript: [
        {
          id: 1,
          question: "What is a closure in JavaScript?",
          options: [
            "A function bundled together with its lexical environment",
            "A block of code that runs after a timeout",
            "A variable declaration that prevents reassignment",
            "A method for handling HTTP requests",
          ],
          correctAnswer:
            "A function bundled together with its lexical environment",
        },
        {
          id: 2,
          question: "Explain event delegation.",
          options: [
            "A technique for attaching events to multiple elements",
            "A method of reusing functions in different contexts",
            "A way to prevent event propagation",
            "A strategy for managing asynchronous operations",
          ],
          correctAnswer:
            "A technique for attaching events to multiple elements",
        },
        {
          id: 3,
          question: "What is the difference between == and ===?",
          options: [
            "== compares values with type coercion, === compares without type coercion",
            "== checks for strict equality, === checks for loose equality",
            "== is used for arrays, === is used for objects",
            "== and === are interchangeable",
          ],
          correctAnswer:
            "== compares values with type coercion, === compares without type coercion",
        },
        {
          id: 4,
          question: "What is a promise?",
          options: [
            "An object representing the eventual completion or failure of an asynchronous operation",
            "A function that ensures code executes sequentially",
            "A variable that holds multiple asynchronous tasks",
            "A method for creating dynamic HTML content",
          ],
          correctAnswer:
            "An object representing the eventual completion or failure of an asynchronous operation",
        },
        {
          id: 5,
          question: "What is the use of the 'let' keyword?",
          options: [
            "To declare a block-scoped variable",
            "To create a constant variable",
            "To declare a global variable",
            "To assign a value to an existing variable",
          ],
          correctAnswer: "To declare a block-scoped variable",
        },
      ],
      reactjs: [
        {
          id: 1,
          question: "What is JSX?",
          options: [
            "A syntax extension that allows writing HTML within JavaScript",
            "A JavaScript library for building user interfaces",
            "A tool for managing state in React applications",
            "A method for handling events in React",
          ],
          correctAnswer:
            "A syntax extension that allows writing HTML within JavaScript",
        },
        {
          id: 2,
          question: "Explain the virtual DOM.",
          options: [
            "An in-memory representation of the real DOM elements",
            "A way to manage asynchronous operations in React",
            "A method to improve the performance of React components",
            "A function that converts JSX into JavaScript objects",
          ],
          correctAnswer: "An in-memory representation of the real DOM elements",
        },
        {
          id: 3,
          question: "What are hooks?",
          options: [
            "Functions that allow you to use state and other React features in functional components",
            "A way to create class components in React",
            "A syntax for writing inline CSS in React components",
            "A tool for managing routing in React applications",
          ],
          correctAnswer:
            "Functions that allow you to use state and other React features in functional components",
        },
        {
          id: 4,
          question: "What is the purpose of useState?",
          options: [
            "To declare state variables in functional components",
            "To fetch data from an API",
            "To manage side effects in React components",
            "To update the DOM directly from a React component",
          ],
          correctAnswer: "To declare state variables in functional components",
        },
        {
          id: 5,
          question: "How do you pass props to a component?",
          options: [
            "By adding attributes to the component element",
            "By using the useEffect hook",
            "By defining state variables in the component",
            "By modifying the component's default properties",
          ],
          correctAnswer: "By adding attributes to the component element",
        },
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
    const correctAnswers = questions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    let level = "";

    if (correctAnswers >= 4) {
      level = "Experienced";
    } else if (correctAnswers >= 2) {
      level = "Intermediate";
    } else {
      level = "Beginner";
    }

    try {
      await axios.post(`${API_URL}/updateSkillLevel`, {
        skill,
        level,
        email: localStorage.getItem("userEmail"),
      });

      alert(
        `Test complete! You scored ${correctAnswers}/${questions.length}. You are ${level} in ${skill}.`
      );
      navigate("/home");
    } catch (error) {
      console.error("Error updating skill level:", error);
      alert(
        "An error occurred while updating your skill level. Please try again."
      );
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
                <option key={index} value={option}>
                  {option}
                </option>
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
