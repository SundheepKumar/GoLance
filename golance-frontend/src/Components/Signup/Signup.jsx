import React, { useState } from "react";
import Header from "../Header";

const departments = ["CSE", "ECE", "ME", "EEE", "CE"];
const years = [1, 2, 3, 4];
const skillOptions = ["Web Dev", "Design", "Tutoring", "Writing", "Debugging"];

const mockSignup = async (form) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (form.email.endsWith("@university.edu")) resolve({ success: true });
      else reject({ message: "Campus email required." });
    }, 1000);
  });
};

export default function SignupScreen({ onSignup }) {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    department: "",
    year: "",
    skills: [],
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e) => {
    const val = Array.from(e.target.selectedOptions, (option) => option.value);
    setForm((prev) => ({ ...prev, skills: val }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 800);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await mockSignup(form);
      onSignup && onSignup(res);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <>
    <Header />
    <div className="container d-flex align-items-center justify-content-center min-vh-100 mt-5 mb-5">
      <div className="card p-4 shadow" style={{ maxWidth: 500, width: "100%" }}>
        <div className="text-center mb-3">
          <i
            className="bi bi-mortarboard-fill"
            style={{ fontSize: 44, color: "#1565c0" }}
          />
          <h4 className="fw-bold mt-2 mb-3">
            {step === 1 ? "Verify Campus Email" : "Create Your Profile"}
          </h4>
        </div>
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-3">
              <label className="form-label">Campus Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleProfileSubmit}>
            <div className="mb-3">
              <label className="form-label">OTP*</label>
              <input
                type="text"
                className="form-control"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Department</label>
              <select
                className="form-select"
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              >
                <option value="">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Year of Study</label>
              <select
                className="form-select"
                name="year"
                value={form.year}
                onChange={handleChange}
                required
              >
                <option value="">Select year</option>
                {years.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Skills</label>
              <select
                multiple
                className="form-select"
                name="skills"
                value={form.skills}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(
                    (option) => option.value
                  );
                  setForm((prev) => ({ ...prev, skills: selected }));
                }}
                required
              >
                {skillOptions.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <div className="form-text">
                Hold <b>CTRL</b> (Windows) or <b>CMD</b> (Mac) for multiple
                selection.
              </div>
              <div className="mt-2">
                {form.skills.length === 0 ? (
                  <span className="text-muted small">No skills selected</span>
                ) : (
                  form.skills.map((skill) => (
                    <span key={skill} className="badge bg-primary me-1">
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Signing Up..." : "Signup"}
            </button>
            <button
              className="btn btn-link w-100 mt-2"
              type="button"
              onClick={() => setStep(1)}
            >
              Back to Login
            </button>
          </form>
        )}
        {error && (
          <div className="alert alert-danger p-2 mt-3 mb-0 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
    </>
    
  );
}
