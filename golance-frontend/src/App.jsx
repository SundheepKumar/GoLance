import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";
import Home from "./Pages/Home.jsx";
import Header from "./Components/Header";
import Tasks from "./Pages/Tasks.jsx";
import PostTaskPage from "./Pages/PostTaskPage";
import MyTasksPage from "./Pages/MyTasksPage";
import ProfilePage from "./Pages/ProfilePage";
import WalletPage from "./Pages/WalletPage";
import MessagePage from "./Pages/MessagePage";

function App() {
  // Initialize user from sessionStorage if available
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login onLogin={(user) => setUser(user)} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post-task" element={<PostTaskPage />} /> 
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/my-tasks" element={<MyTasksPage />} />
        <Route path ="/messages" element={<MessagePage user={user} />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/wallet" element={<WalletPage />} />
      </Routes>
    </Router>
  );
}

export default App;
