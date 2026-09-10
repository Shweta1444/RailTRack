import {
  Wrench,
  MapPin,
  Clock,
  Send,
} from "lucide-react";

import StatusBadge from "../components/StatusBadge";

function Maintenance({
  maintenance,
  applyMemo,
  currentRole,
}) {
  const isMaintenance =
    currentRole === "Maintenance Department";

  return (
    <div>
      <div className="pageHeading">
        <div>
          <p className="eyebrow">
            ASSET MANAGEMENT
          </p>

          <h2>Maintenance Due</h2>

          <p>
            Monitor assets requiring maintenance and
            request operational blocks.
          </p>
        </div>
      </div>

      <div className="maintenanceGrid">
        {maintenance.map((item) => (
          <div
            className="maintenanceCard"
            key={item.id}
          >
            <div className="maintenanceTop">
              <div className="assetIcon">
                <Wrench size={22} />
              </div>

              <StatusBadge
                status={item.memoStatus}
              />
            </div>

            <h3>{item.asset}</h3>

            <p className="department">
              {item.department}
            </p>

            <div className="assetDetails">
              <div>
                <MapPin size={16} />
                {item.location}
              </div>

              <div>
                <Clock size={16} />
                {item.duration}
              </div>
            </div>

            <div className="maintenanceMeta">
              <span>
                Due: <strong>{item.due}</strong>
              </span>

              <span
                className={`priority ${item.priority.toLowerCase()}`}
              >
                {item.priority}
              </span>
            </div>

            {item.memoStatus === "Not Applied" ? (
              isMaintenance ? (
                <button
                  className="primaryButton fullWidth"
                  onClick={() =>
                    applyMemo(item.id)
                  }
                >
                  <Send size={16} />
                  Apply for Memo
                </button>
              ) : (
                <div className="pendingMessage">
                  Only Maintenance Department can
                  apply for memo.
                </div>
              )
            ) : (
              <div className="memoStatusBox">
                <strong>Memo Status</strong>

                <span>{item.memoStatus}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Maintenance;