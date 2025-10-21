import React from "react";
import { Link } from "react-router-dom";
import golanceLogo from "../assets/golance_logo.png";
import Header from "../Components/Header";

const developers = [
  {
    name: "Pranavo",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    message: "Focused on building secure and efficient app infrastructure.",
  },
  {
    name: "Sandy",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg",
    message:
      "Committed to creating a seamless freelance experience for students.",
  },
  {
    name: "Sriram",
    avatar: "https://randomuser.me/api/portraits/men/48.jpg",
    message: "Passionate about integrating real-time communications features.",
  },
  {
    name: "Sheeba",
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
    message: "Dedicated to enhancing user engagement and platform usability.",
  },
  {
    name: "Sanjay",
    avatar: "https://randomuser.me/api/portraits/men/49.jpg",
    message:
      "Ensuring smooth cross-campus collaboration with trust and transparency.",
  },
];

export default function Home() {
  return (
    <>
      <div>
        {/* Info Section */}
        <div className="row mt-5 g-4 px-3">
          <div className="col-lg-4">
            <div className="text-center p-4 bg-white rounded-4 shadow-sm h-100">
              <img
                src="https://cdn-icons-png.flaticon.com/512/7872/7872852.png"
                alt="Post Icon"
                className="bd-placeholder-img rounded-circle mb-3"
                width="120"
                height="120"
              />
              <h3 className="fw-semibold mb-3">📌 Create a Task</h3>
              <p className="text-muted">
                Have a project, assignment, or idea? Post it and let campus
                talent bring it to life.
              </p>
              <Link className="btn btn-outline-primary mt-2" to="/post-task">
                + Post Task
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="text-center p-4 bg-white rounded-4 shadow-sm h-100">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1864/1864271.png"
                alt="Bidding Icon"
                className="bd-placeholder-img rounded-circle mb-3"
                width="120"
                height="120"
              />
              <h3 className="fw-semibold mb-3">💰 Browse & Bid</h3>
              <p className="text-muted">
                Discover available tasks, place your bids, and earn credits for
                your skills.
              </p>
              <Link className="btn btn-outline-primary mt-2" to="/tasks">
                View details »
              </Link>
            </div>
          </div>

          {/* 🗂️ Replaced third button from your first code */}
          <div className="col-lg-4">
            <div className="text-center p-4 bg-white rounded-4 shadow-sm h-100">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png"
                alt="Dashboard Icon"
                className="bd-placeholder-img rounded-circle mb-3"
                width="120"
                height="120"
              />
              <h3 className="fw-semibold mb-3">🗂️ My Task Dashboard</h3>
              <p className="text-muted">
                View tasks you posted, bids you placed, and assignments you’re
                working on.
              </p>
              <Link className="btn btn-outline-primary mt-2" to="/my-tasks">
                View details »
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-4 py-5 my-5 text-center bg-light rounded-4 shadow-sm">
          <h1 className="display-4 fw-bold text-primary mb-4">
            Student Freelance Hub
          </h1>
          <div className="col-lg-8 mx-auto">
            <p className="lead mb-4 text-muted">
              GoLance is your campus freelancing hub—connecting students who
              need help with those who can offer solutions. Whether it's
              academic support or creative services, post tasks, bid on work,
              and earn credits in a trusted, student-only environment.
            </p>
            <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
              <Link
                to="/signup"
                className="btn btn-primary btn-lg px-5 py-2 rounded-pill shadow-sm"
              >
                🚀 Get Started
              </Link>
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg px-5 py-2 rounded-pill"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container my-5">
          <h2 className="text-center fw-bold mb-5">Features</h2>
          <div className="row g-4">
            {[
              {
                title: "Secure & Trusted",
                desc: "A safe, student-only environment to post and bid on tasks.",
                icon: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
              },
              {
                title: "Fast & Efficient",
                desc: "Get your tasks done quickly by skilled campus freelancers.",
                icon: "https://cdn-icons-png.flaticon.com/512/7872/7872852.png",
              },
              {
                title: "Earn & Grow",
                desc: "Turn your skills into credits and build your reputation.",
                icon: "https://cdn-icons-png.flaticon.com/512/1864/1864271.png",
              },
              {
                title: "Support & Collaboration",
                desc: "Communicate easily and get help whenever needed.",
                icon: "https://cdn-icons-png.flaticon.com/512/2910/2910765.png",
              },
            ].map((feature) => (
              <div key={feature.title} className="col-md-6 col-lg-3">
                <div className="card h-100 text-center border-0 shadow-sm p-3">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    width="80"
                    height="80"
                    className="mx-auto mb-3"
                  />
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{feature.title}</h5>
                    <p className="card-text text-muted">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🧑‍💻 Message from Developers Section */}
        <div className="container my-5">
          <h2 className="text-center fw-bold mb-4 text-primary">
            Message from the Developers
          </h2>
          <div className="row g-4 justify-content-center">
            {developers.map(({ name, avatar, message }) => (
              <div key={name} className="col-sm-6 col-md-4 col-lg-2 text-center">
                <img
                  src={avatar}
                  alt={name}
                  className="rounded-circle mb-3 shadow-sm"
                  width={100}
                  height={100}
                />
                <h5>{name}</h5>
                <p className="text-muted small">{message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div id="faqs" className="container my-5">
          <h2 className="text-center fw-bold mb-5">FAQs</h2>
          <div className="accordion" id="faqsAccordion">
            {[
              {
                question: "How do I post a task?",
                answer:
                  "Simply click on 'Post Your Task', fill in the details, and submit. Campus freelancers will then be able to bid on it.",
              },
              {
                question: "How do I earn credits?",
                answer:
                  "By completing tasks successfully and receiving approval, you earn credits which can be used for future services or exchanged.",
              },
              {
                question: "Is it safe for students?",
                answer:
                  "Yes! GoLance is a student-only platform with verified users to ensure safety and trust.",
              },
              {
                question: "Can I communicate with freelancers?",
                answer:
                  "Absolutely! You can chat and collaborate directly with freelancers through our platform messaging system.",
              },
              {
                question: "How do I get started?",
                answer:
                  "Click on 'Get Started', sign up with your campus email, and start posting or bidding on tasks!",
              },
            ].map((faq, index) => (
              <div key={index} className="accordion-item">
                <h2 className="accordion-header" id={`heading${index}`}>
                  <button
                    className={`accordion-button ${
                      index !== 0 ? "collapsed" : ""
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${index}`}
                    aria-expanded={index === 0 ? "true" : "false"}
                    aria-controls={`collapse${index}`}
                  >
                    {faq.question}
                  </button>
                </h2>
                <div
                  id={`collapse${index}`}
                  className={`accordion-collapse collapse ${
                    index === 0 ? "show" : ""
                  }`}
                  aria-labelledby={`heading${index}`}
                  data-bs-parent="#faqsAccordion"
                >
                  <div className="accordion-body text-muted">{faq.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="container">
          <footer className="py-5 my-5 border-top">
            <div className="row align-items-center">
              <div className="col-md-3 mb-3 mb-md-0 d-flex align-items-center">
                <img
                  src={golanceLogo}
                  alt="GoLance Logo"
                  height="40"
                  className="me-2"
                />
                <span className="text-body-secondary">© 2025 GoLance</span>
              </div>

              <div className="col-md-5 mb-3 mb-md-0">
                <ul className="nav justify-content-center">
                  {["Home", "Features", "Pricing", "FAQs", "About"].map(
                    (item) => (
                      <li key={item} className="nav-item">
                        <a
                          href="#"
                          className="nav-link px-2 text-body-secondary"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="col-md-4 text-center text-md-end">
                <p className="mb-1 text-body-secondary">📧 golance@gmail.com</p>
                <p className="mb-0 text-body-secondary">📞 +91 98765 43210</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
