import { Link, useNavigate } from "react-router-dom";
import golanceLogo from "../assets/Golance_Logo.jpg";
import { useEffect, useState } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div>
      {/* Navbar */}
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary px-3">
          <div className="container-fluid">
            {/* Logo */}
            <Link to="/home" className="navbar-brand d-flex align-items-center">
              <img
                src={golanceLogo}
                alt="golance logo"
                height="40"
                className="me-2"
              />
              <span className="fw-bold fs-5">GoLance</span>
            </Link>

            {/* Mobile toggle */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarContent"
              aria-controls="navbarContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Navbar links */}
            <div className="collapse navbar-collapse" id="navbarContent">
              <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link active" to="/home">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Services
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Profile / Sign In */}
            <div className="d-flex align-items-center">
              {user ? (
                <div className="dropdown">
                  <button
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.username}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
                    <li>
                      <Link className="dropdown-item" to={`/profile/${user.id}`}>
                        View Profile
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary px-4">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Section */}
      <main className="container text-center my-5">
        <h1 className="mb-4">Welcome to GoLance</h1>
        <p className="lead mb-5">
          A platform to post tasks, view tasks, and manage your own tasks.
        </p>

        {user ? (
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/post-task" className="btn btn-success btn-lg">
              Post Task
            </Link>
            <Link to="/my-tasks" className="btn btn-warning btn-lg">
              My Tasks
            </Link>
            <Link to="/tasks" className="btn btn-primary btn-lg">
              View All Tasks
            </Link>
          </div>
        ) : (
          <div>
            <Link to="/login" className="btn btn-primary btn-lg">
              Get Started
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
