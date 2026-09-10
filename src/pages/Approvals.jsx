import {
  CheckCircle,
  XCircle,
  FileText,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

import StatusBadge from "../components/StatusBadge";

function Approvals({
  requests,
  blockPlanRequest,
  currentRole,
  approveRequest,
  rejectRequest,
  approveBlockPlanByController,
  rejectBlockPlanByController,
  approveBlockPlanByStationMaster,
}) {
  const isController =
    currentRole === "Controller";

  const isStationMaster =
    currentRole === "Station Master";

  return (
    <div>
      <div className="pageHeading">
        <div>
          <p className="eyebrow">
            CONTROL & APPROVAL
          </p>

          <h2>Approvals</h2>

          <p>
            Review memo requests and AI generated
            maintenance block plans.
          </p>
        </div>
      </div>

      {/* MEMO APPROVAL */}

      <div className="panel">
        <div className="panelHeader">
          <div>
            <div className="sectionIcon">
              <FileText size={19} />
            </div>

            <h3>Memo Requests</h3>

            <p>
              Maintenance requests awaiting Controller
              decision.
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="emptySmall">
            No memo requests available.
          </div>
        ) : (
          <div className="approvalList">
            {requests.map((request) => (
              <div
                className="approvalCard"
                key={request.requestId}
              >
                <div>
                  <strong>
                    {request.asset}
                  </strong>

                  <p>
                    {request.department} •{" "}
                    {request.location}
                  </p>

                  <span>
                    Request ID:{" "}
                    {request.requestId}
                  </span>
                </div>

                <div className="approvalRight">
                  <StatusBadge
                    status={request.requestStatus}
                  />

                  {request.requestStatus ===
                    "Pending" &&
                  isController ? (
                    <div className="approvalActions">
                      <button
                        className="approveButton"
                        onClick={() =>
                          approveRequest(
                            request.requestId
                          )
                        }
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>

                      <button
                        className="rejectButton"
                        onClick={() =>
                          rejectRequest(
                            request.requestId
                          )
                        }
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  ) : request.requestStatus ===
                    "Pending" ? (
                    <span className="waitingText">
                      Waiting for Controller
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI BLOCK PLAN */}

      <div className="panel">
        <div className="panelHeader">
          <div>
            <div className="sectionIcon aiIcon">
              <Sparkles size={19} />
            </div>

            <h3>AI Block Plan Approval</h3>

            <p>
              Controller validates the optimized
              maintenance schedule.
            </p>
          </div>
        </div>

        {!blockPlanRequest ? (
          <div className="emptySmall">
            No AI block plan submitted yet.
          </div>
        ) : (
          <>
            <div className="planSummary">
              <div>
                <span>Request ID</span>
                <strong>
                  {blockPlanRequest.requestId}
                </strong>
              </div>

              <div>
                <span>Controller</span>
                <StatusBadge
                  status={
                    blockPlanRequest.controllerStatus
                  }
                />
              </div>

              {blockPlanRequest.schedule && (
  <div className="approvalSchedule">
    <h4>AI Generated Schedule</h4>

    {blockPlanRequest.schedule.map((item) => (
      <div
        className="approvalScheduleRow"
        key={item.blockId}
      >
        <div>
          <strong>
            {item.blockId}
          </strong>

          <span>
            {item.department}
          </span>
        </div>

        <div>
          <strong>
            {item.asset}
          </strong>

          <span>
            {item.startTime} →{" "}
            {item.completionTime}
          </span>
        </div>

        <div>
          <span>Estimated Time</span>

          <strong>
            {item.maintenanceTime}
          </strong>
        </div>

        <div className="statusBadge success">
          {item.conflictStatus}
        </div>
      </div>
    ))}
  </div>
)}

              <div>
                <span>Station Master</span>
                <StatusBadge
                  status={
                    blockPlanRequest.stationMasterStatus
                  }
                />
              </div>
            </div>

            {blockPlanRequest.controllerStatus ===
              "Pending" &&
            isController ? (
              <div className="approvalActions largeActions">
                <button
                  className="approveButton"
                  onClick={
                    approveBlockPlanByController
                  }
                >
                  <CheckCircle size={17} />
                  Approve AI Block Plan
                </button>

                <button
                  className="rejectButton"
                  onClick={
                    rejectBlockPlanByController
                  }
                >
                  <XCircle size={17} />
                  Reject Plan
                </button>
              </div>
            ) : blockPlanRequest.controllerStatus ===
              "Pending" ? (
              <div className="pendingMessage">
                Waiting for Controller approval.
              </div>
            ) : null}

            {/* STATION MASTER */}

            {blockPlanRequest.controllerStatus ===
              "Approved" && (
              <div className="stationApproval">
                <div>
                  <ShieldCheck size={22} />

                  <div>
                    <strong>
                      Station Master Approval
                    </strong>

                    <p>
                      Final operational validation is
                      required before block release.
                    </p>
                  </div>
                </div>

                {blockPlanRequest.stationMasterStatus ===
                  "Pending" &&
                isStationMaster ? (
                  <button
                    className="approveButton"
                    onClick={
                      approveBlockPlanByStationMaster
                    }
                  >
                    <CheckCircle size={17} />
                    Approve Final Plan
                  </button>
                ) : blockPlanRequest.stationMasterStatus ===
                  "Pending" ? (
                  <div className="pendingMessage">
                    Waiting for Station Master approval.
                  </div>
                ) : (
                  <div className="approvedMessage">
                    <CheckCircle size={17} />
                    Station Master Approved
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Approvals;