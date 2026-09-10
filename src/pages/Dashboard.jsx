import {
  Train,
  Wrench,
  FileText,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import StatCard from "../components/StatCard";

function Dashboard({
  maintenance,
  requests,
  notifications,
  blockPlanRequest,
  setActivePage,
  currentRole,
}) {
  const pendingMemos = requests.filter(
    (request) =>
      request.requestStatus === "Pending"
  ).length;

  return (
    <div>
      <div className="pageHeading">
        <div>
          <p className="eyebrow">
            SMART RAILWAY CONTROL
          </p>

          <h2>
            Good day, {currentRole}
          </h2>

          <p>
            Monitor maintenance, block planning and
            operational approvals from one place.
          </p>
        </div>

        <div className="dateCard">
          <strong>09 September 2026</strong>
          <span>Wednesday</span>
        </div>
      </div>

      <div className="statsGrid">
        <StatCard
          title="Today's Blocks"
          value="08"
          subtitle="Scheduled"
          icon={Train}
        />

        <StatCard
          title="Maintenance Due"
          value={maintenance.length}
          subtitle="Assets requiring attention"
          icon={Wrench}
          type="warning"
        />

        <StatCard
          title="Pending Memos"
          value={pendingMemos}
          subtitle="Awaiting Controller"
          icon={FileText}
          type="warning"
        />

        <StatCard
          title="Asset Availability"
          value="94%"
          subtitle="+4.2% this week"
          icon={ShieldCheck}
          type="success"
        />
      </div>

      <div className="dashboardGrid">
        <div className="panel aiPanel">
          <div className="panelHeader">
            <div>
              <div className="aiTitle">
                <Sparkles size={20} />

                <span>AI BLOCK PLANNING</span>
              </div>

              <h3>
                Intelligent Block Optimization
              </h3>

              <p>
                AI analyzes maintenance requirements,
                train schedules and asset availability
                to recommend conflict-free blocks.
              </p>
            </div>

            <div className="aiStatus">
              AI Ready
            </div>
          </div>

          <div className="aiMetrics">
            <div>
              <strong>3</strong>
              <span>Maintenance Tasks</span>
            </div>

            <div>
              <strong>0</strong>
              <span>Train Conflicts</span>
            </div>

            <div>
              <strong>270 min</strong>
              <span>Total Block Time</span>
            </div>
          </div>

          <button
            className="primaryButton"
            onClick={() =>
              setActivePage("Block Planning")
            }
          >
            <Sparkles size={17} />
            Open AI Block Planner
          </button>
        </div>

        <div className="panel">
          <div className="panelHeader">
            <div>
              <h3>Recent Notifications</h3>
              <p>Latest operational updates</p>
            </div>
          </div>

          <div className="notificationList">
            {notifications
              .slice(0, 5)
              .map((notification) => (
                <div
                  className="notificationItem"
                  key={notification.id}
                >
                  <div className="notificationIcon">
                    {notification.type ===
                    "success" ? (
                      <CheckCircle size={18} />
                    ) : (
                      <AlertTriangle size={18} />
                    )}
                  </div>

                  <div>
                    <strong>
                      {notification.title}
                    </strong>

                    <p>
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="panel workflowPanel">
        <div className="panelHeader">
          <div>
            <h3>Operational Workflow</h3>

            <p>
              End-to-end maintenance block approval
            </p>
          </div>
        </div>

        <div className="workflow">
          <WorkflowStep
            number="01"
            title="Department Request"
            text="Maintenance department identifies due asset."
          />

          <WorkflowStep
            number="02"
            title="AI Block Plan"
            text="System generates optimized block schedule."
          />

          <WorkflowStep
            number="03"
            title="Controller Approval"
            text="Controller validates the block plan."
          />

          <WorkflowStep
            number="04"
            title="Station Master"
            text="Station Master gives final operational approval."
          />

          <WorkflowStep
            number="05"
            title="Block Released"
            text="Approved maintenance block is released."
          />
        </div>
      </div>
    </div>
  );
}

function WorkflowStep({
  number,
  title,
  text,
}) {
  return (
    <div className="workflowStep">
      <div className="workflowNumber">
        {number}
      </div>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default Dashboard;