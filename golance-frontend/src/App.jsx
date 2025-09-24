import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Home from "./Pages/Home.jsx";
import Header from "./Components/Header";
import Tasks from "./Pages/Tasks.jsx";

function App() {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    const username = localStorage.getItem("username");
    return username ? { username } : null;
  });

  return (
    <Router>
      <Header user={user} />
      <Routes>
        <Route 
          path="/" 
          element={<Login onLogin={(data) => setUser({ username: data.user.username })} />} 
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </Router>
  );
}


export default App;
