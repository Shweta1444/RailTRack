import { useEffect, useState } from "react";

import {
  Sparkles,
  Train,
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Brain,
  ShieldCheck,
  Timer,
  TrendingUp,
  Building2,
  Zap,
  Activity,
  Gauge,
  ChevronRight,
  CircleDot,
  BarChart3,
  RefreshCw,
  Lock,
  ArrowRight,
} from "lucide-react";

function BlockPlanning({
  maintenance,
  onSubmitPlan,
  existingPlan,
  aiSchedule = [],
  aiScheduleGenerated = false,
  onGenerateAISchedule,
}) {
  const [selectedBlocks, setSelectedBlocks] = useState(
    maintenance.map((item) => item.id)
  );

  const [generated, setGenerated] = useState(aiScheduleGenerated);
  const [optimizedSchedule, setOptimizedSchedule] = useState(aiSchedule);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingPlan);

  /* ---------------------------------------------------
     KEEP AI DATA IN SYNC
  --------------------------------------------------- */

  useEffect(() => {
    if (aiSchedule?.length > 0) {
      setOptimizedSchedule(aiSchedule);
      setGenerated(true);
    }
  }, [aiSchedule]);

  useEffect(() => {
    setSubmitted(!!existingPlan);
  }, [existingPlan]);

  /* ---------------------------------------------------
     GENERATE AI SCHEDULE
  --------------------------------------------------- */

  const handleGenerateAI = () => {
    if (selectedBlocks.length === 0) {
      alert("Please select at least one maintenance task.");
      return;
    }

    setIsAnalyzing(true);
    setGenerated(false);

    setTimeout(() => {
      generateLocalSchedule();

      if (onGenerateAISchedule) {
        onGenerateAISchedule();
      }

      setIsAnalyzing(false);
      setGenerated(true);
    }, 1800);
  };

  /* ---------------------------------------------------
     LOCAL PROTOTYPE AI ENGINE
  --------------------------------------------------- */

  const generateLocalSchedule = () => {
    const selectedMaintenance = maintenance.filter((item) =>
      selectedBlocks.includes(item.id)
    );

    const priorityValue = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    const sortedTasks = [...selectedMaintenance].sort(
      (a, b) =>
        priorityValue[a.priority] - priorityValue[b.priority]
    );

    let currentMinutes = 10 * 60 + 30;

    const formatTime = (minutes) => {
      let normalized = minutes % (24 * 60);

      if (normalized < 0) {
        normalized += 24 * 60;
      }

      const hours = Math.floor(normalized / 60);
      const mins = normalized % 60;

      const period = hours >= 12 ? "PM" : "AM";
      const displayHour = hours % 12 || 12;

      return `${String(displayHour).padStart(2, "0")}:${String(
        mins
      ).padStart(2, "0")} ${period}`;
    };

    const schedule = sortedTasks.map((item, index) => {
      const maintenanceMinutes = parseInt(item.duration) || 60;

      const safetyBuffer = 15;

      const startMinutes = currentMinutes;
      const completionMinutes =
        startMinutes + maintenanceMinutes;

      const blockEndMinutes =
        completionMinutes + safetyBuffer;

      let priorityScore = item.aiPriorityScore;

      if (!priorityScore) {
        priorityScore =
          item.priority === "High"
            ? 92
            : item.priority === "Medium"
            ? 78
            : 62;
      }

      let trafficImpact = "Low";

      if (item.department === "Electrical Department") {
        trafficImpact = "Moderate";
      }

      if (item.priority === "High") {
        trafficImpact = "Low";
      }

      let reason = "";

      if (item.department === "Track Department") {
        reason =
          "High-priority track maintenance is scheduled first to protect critical asset availability.";
      } else if (item.department === "Signal Department") {
        reason =
          "Signal maintenance is placed in a separate operational window to minimize train movement conflicts.";
      } else {
        reason =
          "OHE maintenance is placed in a suitable traffic window with an additional operational safety buffer.";
      }

      const result = {
        sequence: index + 1,

        blockId: `AI-BLOCK-${String(index + 1).padStart(
          2,
          "0"
        )}`,

        department: item.department,
        asset: item.asset,
        location: item.location,

        priority: item.priority,
        priorityScore,

        maintenanceTime: `${maintenanceMinutes} min`,
        bufferTime: `${safetyBuffer} min`,

        startTime: formatTime(startMinutes),
        completionTime: formatTime(completionMinutes),
        blockEnd: formatTime(blockEndMinutes),

        totalBlockTime: `${
          maintenanceMinutes + safetyBuffer
        } min`,

        trafficImpact,

        conflictStatus:
          index === 0 ? "No Conflict" : "Low Conflict",

        reason,

        status: "AI Optimized",
      };

      currentMinutes = blockEndMinutes + 45;

      return result;
    });

    setOptimizedSchedule(schedule);
  };

  /* ---------------------------------------------------
     SELECTION
  --------------------------------------------------- */

  const toggleBlock = (id) => {
    setSelectedBlocks((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );

    setGenerated(false);
  };

  const selectAll = () => {
    setSelectedBlocks(maintenance.map((item) => item.id));
    setGenerated(false);
  };

  const clearAll = () => {
    setSelectedBlocks([]);
    setGenerated(false);
  };

  /* ---------------------------------------------------
     SUBMIT
  --------------------------------------------------- */

  const submitPlan = () => {
    if (optimizedSchedule.length === 0) {
      alert("Generate the AI schedule first.");
      return;
    }

    onSubmitPlan({
      blocks: optimizedSchedule,
      selectedMaintenance: optimizedSchedule,
      schedule: optimizedSchedule,

      optimizationScore: "96%",
      conflictsAvoided: 3,
      assetAvailabilityGain: "+8.4%",

      totalMaintenanceTime: optimizedSchedule.reduce(
        (total, item) =>
          total + parseInt(item.maintenanceTime || 0),
        0
      ),

      totalBlockTime: optimizedSchedule.reduce(
        (total, item) =>
          total + parseInt(item.totalBlockTime || 0),
        0
      ),
    });

    setSubmitted(true);
  };

  /* ---------------------------------------------------
     CALCULATIONS
  --------------------------------------------------- */

  const activeSchedule =
    optimizedSchedule.length > 0
      ? optimizedSchedule
      : aiSchedule;

  const totalMaintenanceTime = activeSchedule.reduce(
    (total, item) =>
      total +
      parseInt(
        item.maintenanceTime ||
          item.duration ||
          0
      ),
    0
  );

  const totalBlockTime = activeSchedule.reduce(
    (total, item) =>
      total +
      parseInt(
        item.totalBlockTime ||
          item.duration ||
          0
      ),
    0
  );

  const highPriorityCount = activeSchedule.filter(
    (item) => item.priority === "High"
  ).length;

  /* ---------------------------------------------------
     PAGE
  --------------------------------------------------- */

  return (
    <div className="blockPlanningPage">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="pageHeading">

        <div>
          <p className="eyebrow">
            AI OPERATIONS ENGINE
          </p>

          <h2>AI Block Planning</h2>

          <p>
            Coordinate maintenance across Track,
            Signal & Telecommunication, and
            Electrical/OHE departments.
          </p>
        </div>

        <div className="aiStatus large">
          <span className="liveDot"></span>

          <Sparkles size={17} />

          AI Engine Ready
        </div>

      </div>

      {/* =================================================
          AI HERO
      ================================================= */}

      <div className="aiHero">

        <div className="aiHeroGlow"></div>

        <div className="aiHeroIcon">
          <Brain size={30} />
        </div>

        <div className="aiHeroContent">

          <div className="aiHeroLabel">
            <span className="liveDot"></span>
            RAILTRACK INTELLIGENCE
          </div>

          <h3>
            AI Maintenance Scheduling Engine
          </h3>

          <p>
            RailTRack analyzes maintenance priority,
            estimated work duration, train traffic,
            safety buffers and cross-department
            conflicts to create an optimized block plan.
          </p>

          <div className="aiHeroTags">

            <span>
              <Activity size={13} />
              Priority Analysis
            </span>

            <span>
              <Train size={13} />
              Traffic Aware
            </span>

            <span>
              <ShieldCheck size={13} />
              Safety Validated
            </span>

            <span>
              <Gauge size={13} />
              Conflict Detection
            </span>

          </div>

        </div>

        <div className="aiConfidenceCard">

          <span>AI CONFIDENCE</span>

          <strong>96%</strong>

          <small>
            Optimization confidence
          </small>

        </div>

      </div>

      {/* =================================================
          AI INPUT FACTORS
      ================================================= */}

      <div className="aiInputGrid">

        <AIInputCard
          icon={Activity}
          title="Maintenance Priority"
          value="Analyzed"
        />

        <AIInputCard
          icon={Clock}
          title="Work Duration"
          value="Estimated"
        />

        <AIInputCard
          icon={Train}
          title="Train Traffic"
          value="Considered"
        />

        <AIInputCard
          icon={ShieldCheck}
          title="Safety Buffer"
          value="15 min"
        />

        <AIInputCard
          icon={Gauge}
          title="Conflict Detection"
          value="Enabled"
        />

      </div>

      {/* =================================================
          DEPARTMENT OVERVIEW
      ================================================= */}

      <div className="sectionTitleRow">

        <div>
          <h3>Department Coordination</h3>

          <p>
            AI considers maintenance requirements
            from all three departments.
          </p>
        </div>

        <span className="coordinationBadge">
          <CheckCircle size={14} />
          3 Departments Connected
        </span>

      </div>

      <div className="departmentOverview">

        <DepartmentCard
          department="Track Department"
          asset="Track T-102"
          icon={Train}
          status="High Priority"
          score="92"
        />

        <DepartmentCard
          department="Signal Department"
          asset="Signal S-204"
          icon={ShieldCheck}
          status="Medium Priority"
          score="78"
        />

        <DepartmentCard
          department="Electrical / OHE"
          asset="OHE O-301"
          icon={Zap}
          status="Medium Priority"
          score="81"
        />

      </div>

      {/* =================================================
          TASK SELECTION
      ================================================= */}

      <div className="panel">

        <div className="panelHeader">

          <div>

            <div className="smallSectionLabel">
              STEP 01
            </div>

            <h3>
              Select Maintenance Tasks
            </h3>

            <p>
              Choose the maintenance activities
              to be considered by the AI engine.
            </p>

          </div>

          <div className="selectionControls">

            <button
              className="miniButton"
              onClick={selectAll}
            >
              Select All
            </button>

            <button
              className="miniButton"
              onClick={clearAll}
            >
              Clear
            </button>

            <div className="selectedCount">
              {selectedBlocks.length} /{" "}
              {maintenance.length} selected
            </div>

          </div>

        </div>

        <div className="planningGrid">

          {maintenance.map((item) => {

            const selected =
              selectedBlocks.includes(item.id);

            const score =
              item.aiPriorityScore ||
              (item.priority === "High"
                ? 92
                : item.priority === "Medium"
                ? 78
                : 62);

            return (
              <button
                key={item.id}
                className={
                  selected
                    ? "planningCard selected"
                    : "planningCard"
                }
                onClick={() =>
                  toggleBlock(item.id)
                }
              >

                <div className="planningTop">

                  <div className="assetIcon">
                    <WrenchIcon />
                  </div>

                  {selected && (
                    <CheckCircle
                      size={21}
                      className="selectedCheck"
                    />
                  )}

                </div>

                <div className="assetDepartment">
                  {item.department}
                </div>

                <h3>{item.asset}</h3>

                <p className="assetLocation">
                  <MapPin size={13} />
                  {item.location}
                </p>

                <div className="planningDetails">

                  <span>
                    <Clock size={14} />
                    {item.duration}
                  </span>

                  <span>
                    <Timer size={14} />
                    Due {item.due}
                  </span>

                </div>

                <div className="priorityRow">

                  <span
                    className={`priority ${item.priority.toLowerCase()}`}
                  >
                    {item.priority} Priority
                  </span>

                </div>

                <div className="assetAIScore">

                  <Sparkles size={13} />

                  AI Priority Score

                  <strong>{score}</strong>

                  <div className="scoreBar">
                    <div
                      style={{
                        width: `${score}%`,
                      }}
                    />
                  </div>

                </div>

              </button>
            );
          })}

        </div>

        {/* =================================================
            GENERATE BUTTON
        ================================================= */}

        <button
          className="primaryButton generateButton"
          onClick={handleGenerateAI}
          disabled={isAnalyzing}
        >

          {isAnalyzing ? (
            <>
              <RefreshCw
                size={18}
                className="spin"
              />

              AI is analyzing railway operations...
            </>
          ) : (
            <>
              <Sparkles size={18} />

              Analyze & Generate AI Schedule

              <ArrowRight size={17} />
            </>
          )}

        </button>

        {/* =================================================
            ANALYSIS STATE
        ================================================= */}

        {isAnalyzing && (
          <div className="aiProcessing">

            <div className="processingHeader">

              <div className="processingPulse">
                <Brain size={19} />
              </div>

              <div>
                <strong>
                  RailTRack AI is analyzing...
                </strong>

                <span>
                  Optimizing maintenance windows
                </span>
              </div>

            </div>

            <div className="processingSteps">

              <ProcessingStep
                icon={CheckCircle}
                text="Maintenance due dates analyzed"
              />

              <ProcessingStep
                icon={CheckCircle}
                text="Train traffic patterns evaluated"
              />

              <ProcessingStep
                icon={CheckCircle}
                text="Cross-department conflicts checked"
              />

              <ProcessingStep
                icon={Activity}
                text="Optimal block windows being calculated"
                active
              />

            </div>

          </div>
        )}

      </div>

      {/* =================================================
          GENERATED SCHEDULE
      ================================================= */}

      {(generated || aiScheduleGenerated) &&
        activeSchedule.length > 0 && (
          <>

            {/* =================================================
                RESULT HEADER
            ================================================= */}

            <div className="generatedHeader">

              <div>

                <div className="smallSectionLabel">
                  STEP 02
                </div>

                <h3>
                  AI-Optimized Block Schedule
                </h3>

                <p>
                  Coordinated maintenance plan generated
                  using railway operational constraints.
                </p>

              </div>

              <div className="generatedStatus">
                <CheckCircle size={16} />
                AI Schedule Generated
              </div>

            </div>

            {/* =================================================
                SUMMARY METRICS
            ================================================= */}

            <div className="aiSummaryGrid">

              <SummaryCard
                icon={Timer}
                title="Maintenance Time"
                value={`${totalMaintenanceTime} min`}
                text="Estimated work duration"
              />

              <SummaryCard
                icon={Clock}
                title="Total Block Time"
                value={`${totalBlockTime} min`}
                text="Including safety buffers"
              />

              <SummaryCard
                icon={AlertTriangle}
                title="High Priority"
                value={highPriorityCount}
                text="Tasks requiring priority"
              />

              <SummaryCard
                icon={TrendingUp}
                title="Asset Availability"
                value="+8.4%"
                text="Projected improvement"
              />

            </div>

            {/* =================================================
                MAIN SCHEDULE
            ================================================= */}

            <div className="panel schedulePanel">

              <div className="panelHeader">

                <div>

                  <div className="aiTitle">
                    <Sparkles size={18} />
                    AI RECOMMENDED SCHEDULE
                  </div>

                  <h3>
                    Coordinated Maintenance Timeline
                  </h3>

                  <p>
                    AI-generated operational windows
                    for the selected departments.
                  </p>

                </div>

                <div className="optimizationBadge">

                  <BarChart3 size={15} />

                  96% Optimized

                </div>

              </div>

              <div className="scheduleTimeline">

                {activeSchedule.map(
                  (item, index) => (
                    <ScheduleItem
                      key={
                        item.blockId || index
                      }
                      item={item}
                    />
                  )
                )}

              </div>

            </div>

            {/* =================================================
                AI DECISION
            ================================================= */}

            <div className="aiAnalysis">

              <div className="aiAnalysisIcon">
                <Brain size={22} />
              </div>

              <div>

                <div className="aiDecisionHeader">

                  <strong>
                    Why RailTRack selected this schedule
                  </strong>

                  <span>
                    AI Decision
                  </span>

                </div>

                <p>
                  RailTRack prioritized maintenance
                  based on asset criticality and due
                  dates, then evaluated work duration,
                  train traffic and operational conflicts.
                  The three departments are distributed
                  across suitable windows while maintaining
                  a 15-minute safety buffer.
                </p>

                <div className="decisionTags">

                  <span>
                    <CheckCircle size={13} />
                    Priority optimized
                  </span>

                  <span>
                    <CheckCircle size={13} />
                    Traffic considered
                  </span>

                  <span>
                    <CheckCircle size={13} />
                    Conflicts reduced
                  </span>

                  <span>
                    <CheckCircle size={13} />
                    Safety buffer applied
                  </span>

                </div>

              </div>

            </div>

            {/* =================================================
                DEPARTMENT SCHEDULE
            ================================================= */}

            <div className="panel">

              <div className="panelHeader">

                <div>

                  <div className="smallSectionLabel">
                    COORDINATION VIEW
                  </div>

                  <h3>
                    Department-wise Schedule
                  </h3>

                  <p>
                    Maintenance windows coordinated
                    across all three departments.
                  </p>

                </div>

              </div>

              <div className="departmentSchedule">

                {activeSchedule.map(
                  (item, index) => (

                    <DepartmentScheduleRow
                      key={
                        item.blockId || index
                      }
                      item={item}
                    />

                  )
                )}

              </div>

            </div>

            {/* =================================================
                APPROVAL WORKFLOW
            ================================================= */}

            <div className="panel approvalPanel">

              <div className="panelHeader">

                <div>

                  <div className="smallSectionLabel">
                    STEP 03
                  </div>

                  <h3>
                    Approval Workflow
                  </h3>

                  <p>
                    The AI plan requires authorization
                    before the final block is released.
                  </p>

                </div>

              </div>

              <div className="workflow">

                <WorkflowStep
                  number="01"
                  title="AI Plan Generated"
                  text="RailTRack AI"
                  status="completed"
                />

                <WorkflowLine />

                <WorkflowStep
                  number="02"
                  title="Controller Review"
                  text="Pending approval"
                  status={
                    submitted
                      ? "active"
                      : "pending"
                  }
                />

                <WorkflowLine />

                <WorkflowStep
                  number="03"
                  title="Station Master Approval"
                  text="Required before block release"
                  status="pending"
                />

                <WorkflowLine />

                <WorkflowStep
                  number="04"
                  title="Final Block Release"
                  text="Block execution"
                  status="locked"
                />

              </div>

            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <div className="submitPlanPanel">

              <div className="submitInfo">

                <div className="submitIcon">
                  <ShieldCheck size={23} />
                </div>

                <div>

                  <strong>
                    {submitted
                      ? "AI Plan Submitted"
                      : "Ready for Controller Review"}
                  </strong>

                  <p>
                    {submitted
                      ? "The optimized maintenance plan has been sent for approval."
                      : "Submit this AI-generated schedule to the Controller for review and approval."}
                  </p>

                </div>

              </div>

              {submitted ? (

                <div className="approvedMessage">

                  <CheckCircle size={18} />

                  Submitted for Approval

                </div>

              ) : (

                <button
                  className="primaryButton"
                  onClick={submitPlan}
                >

                  <ShieldCheck size={18} />

                  Submit AI Plan

                  <ArrowRight size={17} />

                </button>

              )}

            </div>

          </>
        )}

    </div>
  );
}

/* =====================================================
   AI INPUT CARD
===================================================== */

function AIInputCard({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="aiInputCard">

      <div className="aiInputIcon">
        <Icon size={18} />
      </div>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>

      <CheckCircle
        size={15}
        className="factorCheck"
      />

    </div>
  );
}

/* =====================================================
   DEPARTMENT CARD
===================================================== */

function DepartmentCard({
  department,
  asset,
  icon: Icon,
  status,
  score,
}) {
  return (
    <div className="departmentCard">

      <div className="departmentIcon">
        <Icon size={22} />
      </div>

      <div className="departmentCardInfo">

        <span>{department}</span>

        <strong>{asset}</strong>

        <small>{status}</small>

      </div>

      <div className="departmentScore">

        <Sparkles size={12} />

        <strong>{score}</strong>

        <small>AI Score</small>

      </div>

    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  icon: Icon,
  title,
  value,
  text,
}) {
  return (
    <div className="aiMetricCard">

      <div className="aiMetricIcon">
        <Icon size={20} />
      </div>

      <span>{title}</span>

      <strong>{value}</strong>

      <small>{text}</small>

    </div>
  );
}

/* =====================================================
   PROCESSING STEP
===================================================== */

function ProcessingStep({
  icon: Icon,
  text,
  active = false,
}) {
  return (
    <div
      className={
        active
          ? "processingStep active"
          : "processingStep"
      }
    >

      <Icon size={15} />

      <span>{text}</span>

    </div>
  );
}

/* =====================================================
   SCHEDULE ITEM
===================================================== */

function ScheduleItem({ item }) {
  const moderate =
    item.trafficImpact === "Moderate";

  return (
    <div className="scheduleItem">

      <div className="scheduleTime">

        <strong>{item.startTime}</strong>

        <ArrowRight size={14} />

        <strong>
          {item.completionTime}
        </strong>

        <small>
          + {item.bufferTime} buffer
        </small>

      </div>

      <div className="scheduleConnector">

        <div className="scheduleDot">
          {item.sequence}
        </div>

      </div>

      <div className="scheduleContent">

        <div className="scheduleContentTop">

          <div>

            <div className="blockId">
              {item.blockId}
            </div>

            <h3>{item.asset}</h3>

            <p>{item.department}</p>

          </div>

          <div className="conflictBadge">

            <CheckCircle size={14} />

            {item.conflictStatus}

          </div>

        </div>

        <div className="scheduleDetails">

          <div>
            <MapPin size={15} />
            <span>{item.location}</span>
          </div>

          <div>
            <Clock size={15} />
            <span>
              Maintenance:{" "}
              <strong>
                {item.maintenanceTime}
              </strong>
            </span>
          </div>

          <div>
            <Timer size={15} />
            <span>
              Total Block:{" "}
              <strong>
                {item.totalBlockTime}
              </strong>
            </span>
          </div>

        </div>

        <div className="scheduleMeta">

          <span className="schedulePriority">

            <Sparkles size={12} />

            AI Score{" "}
            <strong>
              {item.priorityScore}
            </strong>

          </span>

          <span
            className={
              moderate
                ? "trafficBadge moderate"
                : "trafficBadge"
            }
          >

            <Train size={12} />

            Traffic:{" "}
            {item.trafficImpact}

          </span>

          <span
            className={`priority ${item.priority.toLowerCase()}`}
          >
            {item.priority} Priority
          </span>

        </div>

        <div className="aiReason">

          <Sparkles size={15} />

          <span>{item.reason}</span>

        </div>

      </div>

    </div>
  );
}

/* =====================================================
   DEPARTMENT SCHEDULE ROW
===================================================== */

function DepartmentScheduleRow({ item }) {
  let Icon = Zap;

  if (item.department === "Track Department") {
    Icon = Train;
  }

  if (item.department === "Signal Department") {
    Icon = ShieldCheck;
  }

  return (
    <div className="departmentScheduleRow">

      <div className="departmentScheduleIcon">
        <Icon size={20} />
      </div>

      <div className="departmentScheduleInfo">

        <strong>{item.department}</strong>

        <span>
          {item.asset} · {item.location}
        </span>

      </div>

      <div className="departmentScheduleTime">

        <strong>{item.startTime}</strong>

        <span>
          to {item.completionTime}
        </span>

      </div>

      <div className="departmentScheduleDuration">

        <Clock size={14} />

        {item.maintenanceTime}

      </div>

      <span
        className={
          item.trafficImpact === "Moderate"
            ? "trafficBadge moderate"
            : "trafficBadge"
        }
      >
        {item.trafficImpact} Traffic
      </span>

    </div>
  );
}

/* =====================================================
   WORKFLOW STEP
===================================================== */

function WorkflowStep({
  number,
  title,
  text,
  status,
}) {
  return (
    <div className={`workflowStep ${status}`}>

      <div className="workflowNumber">

        {status === "completed" ? (
          <CheckCircle size={17} />
        ) : status === "locked" ? (
          <Lock size={15} />
        ) : (
          number
        )}

      </div>

      <div>

        <strong>{title}</strong>

        <span>{text}</span>

      </div>

    </div>
  );
}

/* =====================================================
   WORKFLOW LINE
===================================================== */

function WorkflowLine() {
  return (
    <div className="workflowLine">
      <ChevronRight size={16} />
    </div>
  );
}

/* =====================================================
   WRENCH ICON
===================================================== */

function WrenchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18a2 2 0 0 0 3 3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-2.8-.7-.7-2.8z" />
    </svg>
  );
}

export default BlockPlanning;