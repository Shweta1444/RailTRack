import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle,
  Train,
  Sparkles,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Maintenance from "./pages/Maintenance";
import MemoRequests from "./pages/MemoRequests";
import Approvals from "./pages/Approvals";
import BlockPlanning from "./pages/BlockPlanning";

import "./App.css";

function App() {
  // =====================================================
  // WELCOME PAGE
  // =====================================================

  const [showWelcome, setShowWelcome] = useState(true);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const [activePage, setActivePage] = useState("Dashboard");

  // =====================================================
  // ROLE
  // =====================================================

  const [currentRole, setCurrentRole] = useState(
    "Maintenance Department"
  );

  // =====================================================
  // MAINTENANCE DATA
  // =====================================================

  const [maintenance, setMaintenance] = useState([
    {
      id: 1,
      asset: "Track T-102",
      department: "Track Department",
      location: "Raigarh Yard - UP Line",
      due: "Tomorrow",
      priority: "High",
      duration: "90 min",
      estimatedTime: "10:30 AM - 12:00 PM",
      status: "Maintenance Due",
      memoStatus: "Not Applied",
      aiPriorityScore: 92,
    },
    {
      id: 2,
      asset: "Signal S-204",
      department: "Signal Department",
      location: "Platform 2 - DN Line",
      due: "Tomorrow",
      priority: "Medium",
      duration: "60 min",
      estimatedTime: "02:00 PM - 03:00 PM",
      status: "Maintenance Due",
      memoStatus: "Not Applied",
      aiPriorityScore: 78,
    },
    {
      id: 3,
      asset: "OHE O-301",
      department: "Electrical Department",
      location: "Main Line",
      due: "11 Sep",
      priority: "Medium",
      duration: "120 min",
      estimatedTime: "04:00 PM - 06:00 PM",
      status: "Scheduled",
      memoStatus: "Not Applied",
      aiPriorityScore: 81,
    },
  ]);

  // =====================================================
  // MEMO REQUESTS
  // =====================================================

  const [requests, setRequests] = useState([]);

  // =====================================================
  // AI SCHEDULE
  // =====================================================

  const [aiSchedule, setAiSchedule] = useState([]);

  const [aiScheduleGenerated, setAiScheduleGenerated] =
    useState(false);

  // =====================================================
  // BLOCK PLAN
  // =====================================================

  const [blockPlanRequest, setBlockPlanRequest] =
    useState(null);

  const [finalBlockReleased, setFinalBlockReleased] =
    useState(false);

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Track Department - Maintenance Due",
      message:
        "Track T-102 is due tomorrow. Please apply for the required maintenance memo.",
      type: "warning",
    },
    {
      id: 2,
      title: "Signal Department - Maintenance Due",
      message:
        "Signal S-204 is due tomorrow. Please apply for the required maintenance memo.",
      type: "warning",
    },
    {
      id: 3,
      title: "Electrical Department - Maintenance Scheduled",
      message:
        "OHE O-301 is scheduled for maintenance. Estimated duration: 120 minutes.",
      type: "info",
    },
  ]);

  // =====================================================
  // ROLES
  // =====================================================

  const isMaintenance =
    currentRole === "Maintenance Department";

  const isController =
    currentRole === "Controller";

  const isStationMaster =
    currentRole === "Station Master";

  // =====================================================
  // COUNTERS
  // =====================================================

  const pendingMemoCount = requests.filter(
    (request) =>
      request.requestStatus === "Pending"
  ).length;

  const pendingBlockApproval =
    blockPlanRequest?.controllerStatus === "Pending"
      ? 1
      : 0;

  // =====================================================
  // APPLY FOR MEMO
  // =====================================================

  const applyMemo = (id) => {
    if (!isMaintenance) {
      alert(
        "Only Maintenance Department can apply for a memo."
      );
      return;
    }

    const item = maintenance.find(
      (maintenanceItem) =>
        maintenanceItem.id === id
    );

    if (!item) return;

    setMaintenance((items) =>
      items.map((maintenanceItem) =>
        maintenanceItem.id === id
          ? {
              ...maintenanceItem,
              memoStatus:
                "Pending Controller Approval",
            }
          : maintenanceItem
      )
    );

    const existingRequest = requests.find(
      (request) =>
        request.asset === item.asset
    );

    if (!existingRequest) {
      setRequests((previousRequests) => [
        ...previousRequests,
        {
          ...item,
          requestId: `MEMO-${1000 + id}`,
          requestStatus: "Pending",
        },
      ]);
    }

    setNotifications((previous) => [
      {
        id: Date.now(),
        title: "New memo request",
        message: `${item.department} submitted a memo request for ${item.asset}.`,
        type: "info",
      },
      ...previous,
    ]);

    alert(
      `Memo request submitted for ${item.asset}.`
    );
  };

  // =====================================================
  // APPROVE MEMO
  // =====================================================

  const approveRequest = (requestId) => {
    if (!isController) {
      alert(
        "Only Controller can approve memo requests."
      );
      return;
    }

    const request = requests.find(
      (item) =>
        item.requestId === requestId
    );

    if (!request) return;

    setRequests((previous) =>
      previous.map((item) =>
        item.requestId === requestId
          ? {
              ...item,
              requestStatus: "Approved",
            }
          : item
      )
    );

    setMaintenance((previous) =>
      previous.map((item) =>
        item.id === request.id
          ? {
              ...item,
              memoStatus:
                "Controller Approved",
            }
          : item
      )
    );

    setNotifications((previous) => [
      {
        id: Date.now(),
        title: "Memo approved",
        message: `${request.asset} memo has been approved by Controller.`,
        type: "success",
      },
      ...previous,
    ]);
  };

  // =====================================================
  // REJECT MEMO
  // =====================================================

  const rejectRequest = (requestId) => {
    if (!isController) {
      alert(
        "Only Controller can reject memo requests."
      );
      return;
    }

    const request = requests.find(
      (item) =>
        item.requestId === requestId
    );

    if (!request) return;

    setRequests((previous) =>
      previous.map((item) =>
        item.requestId === requestId
          ? {
              ...item,
              requestStatus: "Rejected",
            }
          : item
      )
    );

    setMaintenance((previous) =>
      previous.map((item) =>
        item.id === request.id
          ? {
              ...item,
              memoStatus: "Rejected",
            }
          : item
      )
    );

    setNotifications((previous) => [
      {
        id: Date.now(),
        title: "Memo rejected",
        message: `${request.asset} memo request was rejected.`,
        type: "error",
      },
      ...previous,
    ]);
  };

  // =====================================================
  // AI SCHEDULE ALL 3 DEPARTMENTS
  // =====================================================

  const generateAISchedule = () => {
    const generatedSchedule = [
      {
        blockId: "AI-BLOCK-01",
        department: "Track Department",
        asset: "Track T-102",
        location: "Raigarh Yard - UP Line",
        startTime: "10:30 AM",
        endTime: "12:00 PM",
        duration: "90 min",
        priority: "High",
        priorityScore: 92,
        trafficImpact: "Low",
        reason:
          "Critical maintenance due tomorrow",
        status: "AI Optimized",
      },
      {
        blockId: "AI-BLOCK-02",
        department: "Signal Department",
        asset: "Signal S-204",
        location: "Platform 2 - DN Line",
        startTime: "02:00 PM",
        endTime: "03:00 PM",
        duration: "60 min",
        priority: "Medium",
        priorityScore: 78,
        trafficImpact: "Low",
        reason:
          "Maintenance due tomorrow",
        status: "AI Optimized",
      },
      {
        blockId: "AI-BLOCK-03",
        department: "Electrical Department",
        asset: "OHE O-301",
        location: "Main Line",
        startTime: "04:00 PM",
        endTime: "06:00 PM",
        duration: "120 min",
        priority: "Medium",
        priorityScore: 81,
        trafficImpact: "Moderate",
        reason:
          "Scheduled OHE maintenance",
        status: "AI Optimized",
      },
    ];

    setAiSchedule(generatedSchedule);
    setAiScheduleGenerated(true);

    setMaintenance((previous) =>
      previous.map((item) => {
        const scheduled =
          generatedSchedule.find(
            (block) =>
              block.asset === item.asset
          );

        if (!scheduled) return item;

        return {
          ...item,
          status: "AI Scheduled",
          estimatedTime: `${scheduled.startTime} - ${scheduled.endTime}`,
          duration: scheduled.duration,
          aiPriorityScore:
            scheduled.priorityScore,
        };
      })
    );

    setNotifications((previous) => [
      {
        id: Date.now(),
        title: "AI schedule generated",
        message:
          "RailTRack AI has optimized maintenance blocks for Track, Signal and Electrical departments.",
        type: "success",
      },
      ...previous,
    ]);

    setActivePage("Block Planning");
  };

  // =====================================================
  // SUBMIT AI BLOCK PLAN
  // =====================================================

  const submitBlockPlan = (plan) => {
    const schedule =
      plan?.blocks?.length > 0
        ? plan.blocks
        : aiSchedule;

    const newRequest = {
      ...plan,

      blocks: schedule,

      requestId: `BLOCK-${Date.now()
        .toString()
        .slice(-5)}`,

      controllerStatus: "Pending",

      stationMasterStatus: "Pending",

      finalStatus: "Pending",

      generatedBy: "RailTRack AI",

      generatedAt:
        new Date().toLocaleString(),
    };

    setBlockPlanRequest(newRequest);

    setNotifications((previous) => [
      {
        id: Date.now(),
        title: "AI block plan submitted",
        message:
          "Optimized maintenance schedule for all three departments is waiting for Controller approval.",
        type: "info",
      },
      ...previous,
    ]);

    setActivePage("Approvals");
  };

  // =====================================================
  // CONTROLLER APPROVES BLOCK
  // =====================================================

  const approveBlockPlanByController = () => {
    if (!isController) {
      alert(
        "Only Controller can approve the AI block plan."
      );
      return;
    }

    setBlockPlanRequest((previous) =>
      previous
        ? {
            ...previous,
            controllerStatus: "Approved",
          }
        : previous
    );

    setNotifications((previous) => [
      {
        id: Date.now(),
        title:
          "Controller approved block plan",
        message:
          "Block plan is now waiting for Station Master approval.",
        type: "success",
      },
      ...previous,
    ]);
  };

  // =====================================================
  // CONTROLLER REJECTS BLOCK
  // =====================================================

  const rejectBlockPlanByController = () => {
    if (!isController) {
      alert(
        "Only Controller can reject the AI block plan."
      );
      return;
    }

    setBlockPlanRequest((previous) =>
      previous
        ? {
            ...previous,
            controllerStatus: "Rejected",
            finalStatus: "Rejected",
          }
        : previous
    );

    setNotifications((previous) => [
      {
        id: Date.now(),
        title: "Block plan rejected",
        message:
          "Controller rejected the AI generated block plan.",
        type: "error",
      },
      ...previous,
    ]);
  };

  // =====================================================
  // STATION MASTER APPROVAL
  // =====================================================

  const approveBlockPlanByStationMaster =
    () => {
      if (!isStationMaster) {
        alert(
          "Only Station Master can approve the final block plan."
        );
        return;
      }

      if (
        blockPlanRequest?.controllerStatus !==
        "Approved"
      ) {
        alert(
          "Controller approval is required first."
        );
        return;
      }

      setBlockPlanRequest((previous) =>
        previous
          ? {
              ...previous,
              stationMasterStatus:
                "Approved",
              finalStatus: "Approved",
            }
          : previous
      );

      setNotifications((previous) => [
        {
          id: Date.now(),
          title:
            "Station Master approved",
          message:
            "Block plan is ready for final release.",
          type: "success",
        },
        ...previous,
      ]);
    };

  // =====================================================
  // FINAL BLOCK RELEASE
  // =====================================================

  const releaseFinalBlock = () => {
    if (!blockPlanRequest) {
      alert(
        "No block plan is available."
      );
      return;
    }

    if (
      blockPlanRequest.controllerStatus !==
      "Approved"
    ) {
      alert(
        "Controller approval is required."
      );
      return;
    }

    if (
      blockPlanRequest.stationMasterStatus !==
      "Approved"
    ) {
      alert(
        "Station Master approval is required."
      );
      return;
    }

    if (!isStationMaster) {
      alert(
        "Only Station Master can release the final block."
      );
      return;
    }

    setFinalBlockReleased(true);

    setBlockPlanRequest((previous) =>
      previous
        ? {
            ...previous,
            finalStatus: "Block Released",
          }
        : previous
    );

    setNotifications((previous) => [
      {
        id: Date.now(),
        title: "Final block released",
        message:
          "Approved maintenance block has been released for operations.",
        type: "success",
      },
      ...previous,
    ]);

    setActivePage("Final Block");
  };

  // =====================================================
  // PAGE CONTENT
  // =====================================================

  const renderPage = () => {
    switch (activePage) {
      // =================================================
      // DASHBOARD
      // =================================================

      case "Dashboard":
        return (
          <Dashboard
            maintenance={maintenance}
            requests={requests}
            notifications={notifications}
            blockPlanRequest={
              blockPlanRequest
            }
            setActivePage={setActivePage}
            currentRole={currentRole}
            aiSchedule={aiSchedule}
            aiScheduleGenerated={
              aiScheduleGenerated
            }
            onGenerateAISchedule={
              generateAISchedule
            }
          />
        );

      // =================================================
      // MAINTENANCE
      // =================================================

      case "Maintenance":
        return (
          <Maintenance
            maintenance={maintenance}
            applyMemo={applyMemo}
            currentRole={currentRole}
          />
        );

      // =================================================
      // MEMO REQUESTS
      // =================================================

      case "Memo Requests":
        return (
          <MemoRequests
            requests={requests}
          />
        );

      // =================================================
      // APPROVALS
      // =================================================

      case "Approvals":
        return (
          <Approvals
            requests={requests}
            blockPlanRequest={
              blockPlanRequest
            }
            currentRole={currentRole}
            approveRequest={approveRequest}
            rejectRequest={rejectRequest}
            approveBlockPlanByController={
              approveBlockPlanByController
            }
            rejectBlockPlanByController={
              rejectBlockPlanByController
            }
            approveBlockPlanByStationMaster={
              approveBlockPlanByStationMaster
            }
          />
        );

      // =================================================
      // BLOCK PLANNING
      // =================================================

      case "Block Planning":
        return (
          <BlockPlanning
            maintenance={maintenance}
            existingPlan={
              blockPlanRequest
            }
            aiSchedule={aiSchedule}
            aiScheduleGenerated={
              aiScheduleGenerated
            }
            onGenerateAISchedule={
              generateAISchedule
            }
            onSubmitPlan={submitBlockPlan}
          />
        );

      // =================================================
      // FINAL BLOCK
      // =================================================

      case "Final Block":
        return (
          <FinalBlockPage
            blockPlanRequest={
              blockPlanRequest
            }
            finalBlockReleased={
              finalBlockReleased
            }
            currentRole={currentRole}
            releaseFinalBlock={
              releaseFinalBlock
            }
          />
        );

      default:
        return null;
    }
  };

  // =====================================================
  // WELCOME PAGE
  // =====================================================

  if (showWelcome) {
    return (
      <div className="welcomePage">
        <div className="welcomeOverlay">
          <div className="welcomeCard">

            <div className="welcomeLogo">
              <img
                src="/railtrack-logo.png"
                alt="RailTRack"
              />
            </div>

            <p className="welcomeEyebrow">
              SMART RAILWAY MAINTENANCE PLATFORM
            </p>

            <h1>
              Welcome to{" "}
              <span>RailTRack</span>
            </h1>

            <p className="welcomeDescription">
              AI-powered block planning for
              smarter, safer and more efficient
              railway maintenance operations.
            </p>

            <div className="welcomeFeatures">

              <div>
                <Sparkles size={20} />
                <span>
                  AI Block Optimization
                </span>
              </div>

              <div>
                <Train size={20} />
                <span>
                  Traffic-Aware Scheduling
                </span>
              </div>

              <div>
                <ShieldCheck size={20} />
                <span>
                  Multi-Level Approval
                </span>
              </div>

            </div>
   <img
  src="/railtrack-logo.png"
  alt="RailTRack Logo"
  className="railtrack-logo"
/>
            <button
              className="welcomeButton"
              onClick={() =>
                setShowWelcome(false)
              }
            >
              Enter RailTRack
              <span>→</span>
            </button>

            <p className="welcomeFooter">
              AI-Powered Automatic Block Planning
              System
            </p>

          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MAIN APPLICATION
  // =====================================================

  return (
    <div className="app">

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        currentRole={currentRole}
        pendingMemoCount={
          pendingMemoCount +
          pendingBlockApproval
        }
        blockPlanRequest={
          blockPlanRequest
        }
      />

      <main className="mainContent">

        <Header
          activePage={activePage}
          currentRole={currentRole}
          setCurrentRole={
            setCurrentRole
          }
          notifications={
            notifications
          }
        />

        <div className="pageContent">
          {renderPage()}
        </div>

      </main>
    </div>
  );
}

// =====================================================
// FINAL BLOCK PAGE
// =====================================================

function FinalBlockPage({
  blockPlanRequest,
  finalBlockReleased,
  currentRole,
  releaseFinalBlock,
}) {
  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!blockPlanRequest) {
    return (
      <div className="emptyState">

        <ShieldCheck size={48} />

        <h2>
          No Final Block Available
        </h2>

        <p>
          An AI block plan must be created
          and approved before the final block
          can be released.
        </p>

      </div>
    );
  }

  // =====================================================
  // USE AI GENERATED BLOCKS
  // =====================================================

  const blocks =
    blockPlanRequest.blocks?.length > 0
      ? blockPlanRequest.blocks.map(
          (block, index) => ({
            id:
              block.blockId ||
              `B-${204 + index}`,

            time:
              block.startTime ||
              block.time ||
              "Not Available",

            asset:
              block.asset ||
              "Maintenance Asset",

            location:
              block.location ||
              "Railway Section",

            duration:
              block.duration ||
              "Estimated",

            department:
              block.department ||
              "Maintenance Department",

            priority:
              block.priority ||
              "Medium",

            trafficImpact:
              block.trafficImpact ||
              "Low",
          })
        )
      : [
          {
            id: "B-204",
            time: "10:30 AM",
            asset: "Track T-102",
            location: "UP Line",
            duration: "90 min",
            department:
              "Track Department",
            priority: "High",
            trafficImpact: "Low",
          },
          {
            id: "B-205",
            time: "02:00 PM",
            asset: "Signal S-204",
            location: "DN Line",
            duration: "60 min",
            department:
              "Signal Department",
            priority: "Medium",
            trafficImpact: "Low",
          },
          {
            id: "B-206",
            time: "04:00 PM",
            asset: "OHE O-301",
            location: "Main Line",
            duration: "120 min",
            department:
              "Electrical Department",
            priority: "Medium",
            trafficImpact: "Moderate",
          },
        ];

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div>

      {/* =============================================== */}
      {/* HEADER */}
      {/* =============================================== */}

      <div className="pageHeading">

        <div>

          <p className="eyebrow">
            FINAL OPERATIONS
          </p>

          <h2>
            Final Block
          </h2>

          <p>
            Approved maintenance blocks
            ready for operational release.
          </p>

        </div>

        <div
          className={
            finalBlockReleased
              ? "statusBadge success"
              : "statusBadge warning"
          }
        >
          {finalBlockReleased
            ? "Block Released"
            : "Awaiting Release"}
        </div>

      </div>

      {/* =============================================== */}
      {/* AI INFORMATION */}
      {/* =============================================== */}

      <div className="aiGeneratedBanner">

        <div className="aiBannerIcon">
          <Sparkles size={22} />
        </div>

        <div>

          <strong>
            RailTRack AI Optimized Schedule
          </strong>

          <p>
            Maintenance blocks have been
            coordinated across all three
            departments based on priority,
            duration and traffic impact.
          </p>

        </div>

      </div>

      {/* =============================================== */}
      {/* APPROVAL TIMELINE */}
      {/* =============================================== */}

      <div className="approvalTimeline">

        <div className="timelineItem completed">

          <CheckCircle size={20} />

          <div>
            <strong>
              AI Block Plan
            </strong>

            <span>
              Generated
            </span>
          </div>

        </div>

        <div
          className={
            blockPlanRequest.controllerStatus ===
            "Approved"
              ? "timelineItem completed"
              : "timelineItem"
          }
        >

          <CheckCircle size={20} />

          <div>

            <strong>
              Controller
            </strong>

            <span>
              {
                blockPlanRequest.controllerStatus
              }
            </span>

          </div>

        </div>

        <div
          className={
            blockPlanRequest.stationMasterStatus ===
            "Approved"
              ? "timelineItem completed"
              : "timelineItem"
          }
        >

          <CheckCircle size={20} />

          <div>

            <strong>
              Station Master
            </strong>

            <span>
              {
                blockPlanRequest.stationMasterStatus
              }
            </span>

          </div>

        </div>

        <div
          className={
            finalBlockReleased
              ? "timelineItem completed"
              : "timelineItem"
          }
        >

          <ShieldCheck size={20} />

          <div>

            <strong>
              Final Release
            </strong>

            <span>
              {finalBlockReleased
                ? "Released"
                : "Pending"}
            </span>

          </div>

        </div>

      </div>

      {/* =============================================== */}
      {/* APPROVED SCHEDULE */}
      {/* =============================================== */}

      <div className="panel">

        <div className="panelHeader">

          <div>

            <h3>
              Approved Block Schedule
            </h3>

            <p>
              Request ID:{" "}
              {
                blockPlanRequest.requestId
              }
            </p>

          </div>

          <div className="statusBadge success">
            AI Optimized
          </div>

        </div>

        <div className="blockList">

          {blocks.map((block) => (

            <div
              className="blockRow"
              key={block.id}
            >

              <div className="blockIcon">
                <Train size={20} />
              </div>

              <div className="blockInfo">

                <strong>
                  {block.id}
                </strong>

                <span>
                  {block.asset} •{" "}
                  {block.location}
                </span>

                <small>
                  {block.department}
                </small>

              </div>

              <div className="blockTime">

                <strong>
                  {block.time}
                </strong>

                <span>
                  Estimated duration:{" "}
                  {block.duration}
                </span>

              </div>

              <div className="blockMeta">

                <span>
                  {block.priority}
                </span>

                <span>
                  Traffic:{" "}
                  {block.trafficImpact}
                </span>

              </div>

              <div className="statusBadge success">
                Approved
              </div>

            </div>

          ))}

        </div>

      </div>

      {/* =============================================== */}
      {/* RELEASE PANEL */}
      {/* =============================================== */}

      <div className="releasePanel">

        <div>

          <ShieldCheck size={28} />

          <div>

            <h3>
              Final Block Release
            </h3>

            <p>
              Controller and Station Master
              approval are required before
              operational release.
            </p>

          </div>

        </div>

        {!finalBlockReleased ? (

          blockPlanRequest.controllerStatus ===
            "Approved" &&
          blockPlanRequest.stationMasterStatus ===
            "Approved" ? (

            currentRole ===
            "Station Master" ? (

              <button
                className="primaryButton"
                onClick={
                  releaseFinalBlock
                }
              >

                <ShieldCheck
                  size={18}
                />

                Release Final Block

              </button>

            ) : (

              <div className="pendingMessage">
                Waiting for Station Master
                to release the final block.
              </div>

            )

          ) : (

            <div className="pendingMessage">
              Final block is locked until all
              approvals are completed.
            </div>

          )

        ) : (

          <div className="releasedBanner">

            <CheckCircle size={28} />

            <div>

              <strong>
                Block Successfully Released
              </strong>

              <p>
                Maintenance teams can proceed
                according to the approved
                schedule.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default App;