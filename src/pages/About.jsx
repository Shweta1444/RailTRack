import React from "react";

const About = () => {
  return (
    <div className="about-page">

      {/* Header */}
      <div className="about-hero">
        <div>
          <span className="about-tag">SMART RAILWAY OPERATIONS</span>

          <h1>About RailTRack</h1>

          <p>
            AI-powered block planning for smarter, safer and more efficient
            railway maintenance operations.
          </p>
        </div>
      </div>


      {/* About Project */}
      <div className="about-card">
        <h2>About the Project</h2>

        <p>
          RailTRack is an AI-driven platform designed to optimize railway
          maintenance block planning. It brings maintenance requirements,
          train schedules and operational constraints together to recommend
          suitable maintenance windows with minimum disruption to train
          operations.
        </p>
      </div>


      {/* Key Features */}
      <div className="about-section">
        <h2>Key Features</h2>

        <div className="feature-grid">

          <div className="feature-box">
            <div className="feature-icon">🤖</div>
            <h3>AI Block Optimization</h3>
            <p>
              Finds suitable maintenance windows using AI and optimization.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">🚆</div>
            <h3>Traffic-Aware Scheduling</h3>
            <p>
              Considers train movements while planning maintenance blocks.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">🔧</div>
            <h3>Maintenance Management</h3>
            <p>
              Tracks pending, scheduled and critical maintenance activities.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">⚠️</div>
            <h3>Conflict Detection</h3>
            <p>
              Identifies conflicts between maintenance work and train
              operations.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">👥</div>
            <h3>Multi-Level Approval</h3>
            <p>
              Supports Controller and Station Master approval workflow.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon">🔄</div>
            <h3>Coordinated Planning</h3>
            <p>
              Combines compatible maintenance activities from multiple
              departments whenever possible.
            </p>
          </div>

        </div>
      </div>


      {/* How it Works */}
      <div className="about-card">
        <h2>How RailTRack Works</h2>

        <div className="workflow">

          <div className="workflow-step">
            <span>01</span>
            <h3>Data Collection</h3>
            <p>Train, timetable and maintenance data</p>
          </div>

          <div className="workflow-arrow">→</div>

          <div className="workflow-step">
            <span>02</span>
            <h3>AI Analysis</h3>
            <p>Priority, conflicts and operational impact</p>
          </div>

          <div className="workflow-arrow">→</div>

          <div className="workflow-step">
            <span>03</span>
            <h3>Optimization</h3>
            <p>Best maintenance window</p>
          </div>

          <div className="workflow-arrow">→</div>

          <div className="workflow-step">
            <span>04</span>
            <h3>Approval</h3>
            <p>Controller and Station Master</p>
          </div>

        </div>
      </div>


      {/* Technology Stack */}
      <div className="about-section">
        <h2>Technology Stack</h2>

        <div className="tech-grid">

          <div className="tech-box">
            <span>PY</span>
            <div>
              <h3>Python</h3>
              <p>Programming</p>
            </div>
          </div>

          <div className="tech-box">
            <span>ML</span>
            <div>
              <h3>Scikit-learn</h3>
              <p>Machine Learning</p>
            </div>
          </div>

          <div className="tech-box">
            <span>OR</span>
            <div>
              <h3>Google OR-Tools</h3>
              <p>Optimization</p>
            </div>
          </div>

          <div className="tech-box">
            <span>RE</span>
            <div>
              <h3>React.js</h3>
              <p>Frontend</p>
            </div>
          </div>

          <div className="tech-box">
            <span>TW</span>
            <div>
              <h3>Tailwind CSS</h3>
              <p>UI & Styling</p>
            </div>
          </div>

          <div className="tech-box">
            <span>DB</span>
            <div>
              <h3>MongoDB</h3>
              <p>Database</p>
            </div>
          </div>

          <div className="tech-box">
            <span>JS</span>
            <div>
              <h3>Node.js</h3>
              <p>Backend Runtime</p>
            </div>
          </div>

          <div className="tech-box">
            <span>EX</span>
            <div>
              <h3>Express.js</h3>
              <p>Backend Framework</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default About;