import {
  CheckCircle,
  XCircle,
  FileText,
  Sparkles,
  ShieldCheck,
  Clock,
  ArrowRight,
  Train,
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

  const pendingMemos = requests.filter(
    (request) =>
      request.requestStatus === "Pending"
  ).length;

  const approvedMemos = requests.filter(
    (request) =>
      request.requestStatus === "Approved"
  ).length;

  const rejectedMemos = requests.filter(
    (request) =>
      request.requestStatus === "Rejected"
  ).length;

  return (
    <div className="approvalsPage">

      {/* PAGE HEADER */}

      <div className="pageHeading approvalsHeading">
        <div>
          <p className="eyebrow">
            CONTROL & APPROVAL
          </p>

          <h2>Approvals</h2>

          <p>
            Review maintenance requests and validate
            AI-generated railway block plans.
          </p>
        </div>

        <div className="approvalRoleIndicator">
          <ShieldCheck size={18} />

          <div>
            <span>Current Role</span>
            <strong>{currentRole}</strong>
          </div>
        </div>
      </div>


      {/* APPROVAL SUMMARY */}

      <div className="approvalSummaryGrid">

        <div className="approvalSummaryCard">
          <div className="summaryIcon pending">
            <Clock size={20} />
          </div>

          <div>
            <span>Pending Memos</span>
            <strong>{pendingMemos}</strong>
            <small>Awaiting review</small>
          </div>
        </div>


        <div className="approvalSummaryCard">
          <div className="summaryIcon approved">
            <CheckCircle size={20} />
          </div>

          <div>
            <span>Approved Memos</span>
            <strong>{approvedMemos}</strong>
            <small>Successfully approved</small>
          </div>
        </div>


        <div className="approvalSummaryCard">
          <div className="summaryIcon rejected">
            <XCircle size={20} />
          </div>

          <div>
            <span>Rejected Memos</span>
            <strong>{rejectedMemos}</strong>
            <small>Requires attention</small>
          </div>
        </div>


        <div className="approvalSummaryCard">
          <div className="summaryIcon ai">
            <Sparkles size={20} />
          </div>

          <div>
            <span>AI Block Plan</span>

            <strong>
              {blockPlanRequest
                ? "Active"
                : "None"}
            </strong>

            <small>
              {blockPlanRequest
                ? "Plan submitted"
                : "No plan submitted"}
            </small>
          </div>
        </div>

      </div>


      {/* APPROVAL WORKFLOW */}

      <div className="approvalWorkflow panel">

        <div className="workflowHeader">
          <div>
            <p className="eyebrow">
              OPERATIONAL WORKFLOW
            </p>

            <h3>Approval Process</h3>

            <p>
              Railway maintenance blocks pass through
              multiple validation stages before release.
            </p>
          </div>
        </div>


        <div className="approvalWorkflowSteps">

          <div className="approvalStep">
            <div className="workflowStepIcon">
              <Sparkles size={19} />
            </div>

            <div>
              <span>01</span>
              <strong>AI Generated</strong>
              <small>
                Optimized block plan
              </small>
            </div>
          </div>


          <ArrowRight
            className="workflowArrow"
            size={20}
          />


          <div className="approvalStep">
            <div className="workflowStepIcon">
              <FileText size={19} />
            </div>

            <div>
              <span>02</span>
              <strong>Controller</strong>
              <small>
                Operational approval
              </small>
            </div>
          </div>


          <ArrowRight
            className="workflowArrow"
            size={20}
          />


          <div className="approvalStep">
            <div className="workflowStepIcon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <span>03</span>
              <strong>Station Master</strong>
              <small>
                Final validation
              </small>
            </div>
          </div>


          <ArrowRight
            className="workflowArrow"
            size={20}
          />


          <div className="approvalStep">
            <div className="workflowStepIcon">
              <Train size={19} />
            </div>

            <div>
              <span>04</span>
              <strong>Final Release</strong>
              <small>
                Block becomes active
              </small>
            </div>
          </div>

        </div>

      </div>


      {/* MEMO APPROVAL */}

      <div className="panel approvalPanel">

        <div className="panelHeader enhancedPanelHeader">

          <div className="panelTitleGroup">

            <div className="sectionIcon">
              <FileText size={19} />
            </div>

            <div>
              <h3>Memo Requests</h3>

              <p>
                Maintenance requests awaiting
                Controller decision.
              </p>
            </div>

          </div>

          <div className="sectionCount">
            {requests.length}{" "}
            {requests.length === 1
              ? "Request"
              : "Requests"}
          </div>

        </div>


        {requests.length === 0 ? (

          <div className="emptySmall enhancedEmpty">

            <FileText size={34} />

            <div>
              <strong>
                No memo requests
              </strong>

              <p>
                Maintenance departments have not
                submitted any requests yet.
              </p>
            </div>

          </div>

        ) : (

          <div className="approvalList">

            {requests.map((request) => (

              <div
                className="approvalCard enhancedApprovalCard"
                key={request.requestId}
              >

                <div className="approvalCardMain">

                  <div className="approvalAssetIcon">
                    <Train size={20} />
                  </div>

                  <div className="approvalAssetInfo">

                    <div className="assetTitleRow">

                      <strong>
                        {request.asset}
                      </strong>

                      <StatusBadge
                        status={
                          request.requestStatus
                        }
                      />

                    </div>

                    <p>
                      {request.department}
                      <span className="dotSeparator">
                        •
                      </span>
                      {request.location}
                    </p>

                    <span className="requestId">
                      Request ID:{" "}
                      <strong>
                        {request.requestId}
                      </strong>
                    </span>

                  </div>

                </div>


                <div className="approvalRight">

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

                    <div className="waitingStatus">

                      <Clock size={15} />

                      <span>
                        Waiting for Controller
                      </span>

                    </div>

                  ) : (

                    <div className="processedStatus">

                      {request.requestStatus ===
                      "Approved" ? (
                        <CheckCircle size={16} />
                      ) : (
                        <XCircle size={16} />
                      )}

                      <span>
                        {request.requestStatus}
                      </span>

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* AI BLOCK PLAN */}

      <div className="panel approvalPanel aiApprovalPanel">

        <div className="panelHeader enhancedPanelHeader">

          <div className="panelTitleGroup">

            <div className="sectionIcon aiIcon">
              <Sparkles size={19} />
            </div>

            <div>
              <h3>
                AI Block Plan Approval
              </h3>

              <p>
                Controller validates the optimized
                maintenance schedule.
              </p>
            </div>

          </div>

          {blockPlanRequest && (
            <div className="aiPlanBadge">
              <Sparkles size={14} />
              AI Generated
            </div>
          )}

        </div>


        {!blockPlanRequest ? (

          <div className="emptySmall enhancedEmpty">

            <Sparkles size={34} />

            <div>
              <strong>
                No AI block plan submitted
              </strong>

              <p>
                Generate and submit a block plan
                from Block Planning first.
              </p>
            </div>

          </div>

        ) : (

          <>

            {/* PLAN INFORMATION */}

            <div className="planSummary enhancedPlanSummary">

              <div className="planInfoCard">

                <span>
                  Request ID
                </span>

                <strong>
                  {blockPlanRequest.requestId}
                </strong>

              </div>


              <div className="planInfoCard">

                <span>
                  Controller
                </span>

                <StatusBadge
                  status={
                    blockPlanRequest.controllerStatus
                  }
                />

              </div>


              <div className="planInfoCard">

                <span>
                  Station Master
                </span>

                <StatusBadge
                  status={
                    blockPlanRequest.stationMasterStatus
                  }
                />

              </div>

            </div>


            {/* AI GENERATED SCHEDULE */}

            {blockPlanRequest.schedule && (

              <div className="approvalSchedule">

                <div className="scheduleHeader">

                  <div>

                    <div className="scheduleTitle">

                      <Sparkles size={17} />

                      <h4>
                        AI Generated Schedule
                      </h4>

                    </div>

                    <p>
                      Optimized maintenance blocks
                      generated by RailTRack AI.
                    </p>

                  </div>

                  <div className="scheduleCount">
                    {blockPlanRequest.schedule.length}{" "}
                    Blocks
                  </div>

                </div>


                <div className="approvalScheduleList">

                  {blockPlanRequest.schedule.map(
                    (item) => (

                      <div
                        className="approvalScheduleRow enhancedScheduleRow"
                        key={item.blockId}
                      >

                        <div className="scheduleBlockId">

                          <span>
                            Block
                          </span>

                          <strong>
                            {item.blockId}
                          </strong>

                        </div>


                        <div className="scheduleAsset">

                          <strong>
                            {item.asset}
                          </strong>

                          <span>
                            {item.department}
                          </span>

                        </div>


                        <div className="scheduleTime">

                          <span>
                            Schedule
                          </span>

                          <strong>
                            {item.startTime} →{" "}
                            {item.completionTime}
                          </strong>

                        </div>


                        <div className="scheduleDuration">

                          <span>
                            Estimated Time
                          </span>

                          <strong>
                            {item.maintenanceTime}
                          </strong>

                        </div>


                        <div className="scheduleStatus">

                          <span className="statusBadge success">
                            <CheckCircle size={14} />

                            {item.conflictStatus}
                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}


            {/* CONTROLLER APPROVAL */}

            {blockPlanRequest.controllerStatus ===
              "Pending" &&
            isController ? (

              <div className="planDecisionPanel">

                <div>

                  <span className="decisionLabel">
                    CONTROLLER ACTION REQUIRED
                  </span>

                  <h4>
                    Review AI Block Plan
                  </h4>

                  <p>
                    Verify the optimized schedule
                    before sending it for Station
                    Master validation.
                  </p>

                </div>


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

              </div>

            ) : blockPlanRequest.controllerStatus ===
              "Pending" ? (

              <div className="pendingMessage enhancedPending">

                <Clock size={17} />

                <div>
                  <strong>
                    Waiting for Controller approval
                  </strong>

                  <span>
                    The AI block plan must be approved
                    by the Controller before it can
                    proceed.
                  </span>
                </div>

              </div>

            ) : null}


            {/* STATION MASTER */}

            {blockPlanRequest.controllerStatus ===
              "Approved" && (

              <div className="stationApproval enhancedStationApproval">

                <div className="stationApprovalInfo">

                  <div className="stationApprovalIcon">
                    <ShieldCheck size={22} />
                  </div>

                  <div>

                    <span className="decisionLabel">
                      FINAL VALIDATION
                    </span>

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
                    className="approveButton largeApproveButton"
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

                    <Clock size={16} />

                    Waiting for Station Master
                    approval.

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