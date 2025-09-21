import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import LoginScreen from "./Pages/LoginScreen";
import SignupScreen from "./Pages/SignupScreen";
import UserDashboard from "./Pages/UserDashboard";
import PostTask from "./Pages/PostTask";
import TaskDetails from "./Pages/TaskDetails";
import MyPostedTasks from "./Pages/MyPostedTasks";
import CreditsDashboard from "./Pages/CreditsDashboard";
import AddCredits from "./Pages/AddCredits";
import WithdrawCredits from "./Pages/WithdrawCredits";
import UserProfile from "./Pages/UserProfile";
import EditProfile from "./Pages/EditProfile";
import Messaging from "./Pages/Messaging";
import Notifications from "./Pages/Notifications";
import BidPlacementModal from "./Pages/BidPlacementModal";
import Home from "./Pages/HomePage/homepage";
import TasksPage from "./Pages/TasksPage";

const pages = {
  LoginScreen,
  SignupScreen,
  UserDashboard,
  PostTask,
  TaskDetails,
  MyPostedTasks,
  CreditsDashboard,
  AddCredits,
  WithdrawCredits,
  UserProfile,
  EditProfile,
  Messaging,
  Notifications,
  BidPlacementModal,
  Home,
    TasksPage,
};

export default function Test() {
  const [selected, setSelected] = useState("LoginScreen");
  const SelectedPage = pages[selected];

  return (
    <Router>
      <div>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          style={{ margin: "20px", padding: "8px" }}
        >
          {Object.keys(pages).map((page) => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>

        <div style={{ marginTop: "20px" }}>
          <SelectedPage />
        </div>
      </div>
    </Router>
  );
}
