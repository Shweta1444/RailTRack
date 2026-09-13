import { useState } from "react";
import {
  FileText,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MapPin,
  ChevronRight,
} from "lucide-react";

import StatusBadge from "../components/StatusBadge";

function MemoRequests({ requests }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalRequests = requests.length;

  const pendingRequests = requests.filter(
    (request) =>
      request.requestStatus === "Pending"
  ).length;

  const approvedRequests = requests.filter(
    (request) =>
      request.requestStatus === "Approved"
  ).length;

  const rejectedRequests = requests.filter(
    (request) =>
      request.requestStatus === "Rejected"
  ).length;

  // =====================================================
  // FILTER + SEARCH
  // =====================================================

  const filteredRequests = requests.filter(
    (request) => {
      const matchesSearch =
        request.requestId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.asset
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.department
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        request.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "All" ||
        request.requestStatus === filter;

      return matchesSearch && matchesFilter;
    }
  );

  return (
    <div className="memoRequestsPage">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="pageHeading">
        <div>
          <p className="eyebrow">
            BLOCK PERMISSION
          </p>

          <h2>Memo Requests</h2>

          <p>
            Review and monitor maintenance block
            requests submitted by departments.
          </p>
        </div>

        <div className="memoHeaderBadge">
          <FileText size={17} />
          {totalRequests} Total Requests
        </div>
      </div>

      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="memoSummaryGrid">

        <MemoSummaryCard
          icon={FileText}
          title="Total Requests"
          value={totalRequests}
          text="All submitted requests"
        />

        <MemoSummaryCard
          icon={Clock}
          title="Pending"
          value={pendingRequests}
          text="Awaiting controller review"
        />

        <MemoSummaryCard
          icon={CheckCircle}
          title="Approved"
          value={approvedRequests}
          text="Approved memo requests"
        />

        <MemoSummaryCard
          icon={XCircle}
          title="Rejected"
          value={rejectedRequests}
          text="Rejected requests"
        />

      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {requests.length === 0 ? (
        <div className="emptyState">

          <div className="emptyStateIcon">
            <FileText size={32} />
          </div>

          <h2>No Memo Requests</h2>

          <p>
            Maintenance departments have not
            submitted any memo requests yet.
          </p>

        </div>
      ) : (

        <>
          {/* =================================================
              SEARCH + FILTER
          ================================================= */}

          <div className="memoToolbar">

            <div className="memoSearch">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search request ID, asset, department..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            <div className="memoFilters">

              {[
                "All",
                "Pending",
                "Approved",
                "Rejected",
              ].map((status) => (

                <button
                  key={status}
                  className={
                    filter === status
                      ? "memoFilter active"
                      : "memoFilter"
                  }
                  onClick={() =>
                    setFilter(status)
                  }
                >
                  {status}
                </button>

              ))}

            </div>

          </div>

          {/* =================================================
              REQUEST TABLE
          ================================================= */}

          <div className="panel memoTablePanel">

            <div className="memoTableHeader">

              <div>
                <div className="smallSectionLabel">
                  REQUEST MONITORING
                </div>

                <h3>
                  Maintenance Memo Requests
                </h3>

                <p>
                  Track the current approval status
                  of submitted requests.
                </p>
              </div>

              <div className="requestCount">
                {filteredRequests.length} Requests
              </div>

            </div>

            {filteredRequests.length === 0 ? (

              <div className="memoNoResults">
                <Search size={30} />

                <strong>
                  No matching requests
                </strong>

                <span>
                  Try another search term or filter.
                </span>
              </div>

            ) : (

              <div className="memoRequestList">

                {filteredRequests.map(
                  (request) => (

                    <div
                      className="memoRequestRow"
                      key={request.requestId}
                    >

                      {/* REQUEST ID */}

                      <div className="memoRequestId">

                        <div className="memoRequestIcon">
                          <FileText size={18} />
                        </div>

                        <div>
                          <span>
                            REQUEST ID
                          </span>

                          <strong>
                            {request.requestId}
                          </strong>
                        </div>

                      </div>

                      {/* ASSET */}

                      <div className="memoAssetInfo">

                        <strong>
                          {request.asset}
                        </strong>

                        <span>
                          {request.department}
                        </span>

                      </div>

                      {/* LOCATION */}

                      <div className="memoLocation">

                        <MapPin size={15} />

                        <span>
                          {request.location}
                        </span>

                      </div>

                      {/* DUE */}

                      <div className="memoDue">

                        <span>DUE</span>

                        <strong>
                          {request.due}
                        </strong>

                      </div>

                      {/* STATUS */}

                      <div className="memoStatus">

                        <StatusBadge
                          status={
                            request.requestStatus
                          }
                        />

                      </div>

                      {/* VIEW */}

                      <button
                        className="viewRequestButton"
                        onClick={() =>
                          setSelectedRequest(
                            request
                          )
                        }
                      >
                        View
                        <ChevronRight size={15} />
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>
        </>
      )}

      {/* =================================================
          REQUEST DETAILS MODAL
      ================================================= */}

      {selectedRequest && (

        <div
          className="memoDetailsOverlay"
          onClick={() =>
            setSelectedRequest(null)
          }
        >

          <div
            className="memoDetailsModal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="memoDetailsTop">

              <div className="memoDetailsIcon">
                <FileText size={22} />
              </div>

              <button
                className="closeMemoModal"
                onClick={() =>
                  setSelectedRequest(null)
                }
              >
                ×
              </button>

            </div>

            <p className="eyebrow">
              MEMO REQUEST
            </p>

            <h2>
              {selectedRequest.requestId}
            </h2>

            <p className="memoModalSubtitle">
              Maintenance block request details
            </p>

            <div className="memoModalStatus">
              <span>Status</span>

              <StatusBadge
                status={
                  selectedRequest.requestStatus
                }
              />
            </div>

            <div className="memoDetailGrid">

              <MemoDetail
                label="Asset"
                value={selectedRequest.asset}
              />

              <MemoDetail
                label="Department"
                value={selectedRequest.department}
              />

              <MemoDetail
                label="Location"
                value={selectedRequest.location}
              />

              <MemoDetail
                label="Due Date"
                value={selectedRequest.due}
              />

              <MemoDetail
                label="Duration"
                value={
                  selectedRequest.duration ||
                  "Not specified"
                }
              />

              <MemoDetail
                label="Priority"
                value={
                  selectedRequest.priority ||
                  "Medium"
                }
              />

            </div>

            <div className="memoApprovalInfo">

              {selectedRequest.requestStatus ===
              "Pending" ? (
                <>
                  <Clock size={18} />

                  <div>
                    <strong>
                      Awaiting Controller Approval
                    </strong>

                    <span>
                      The memo request is waiting
                      for Controller review.
                    </span>
                  </div>
                </>
              ) : selectedRequest.requestStatus ===
                "Approved" ? (
                <>
                  <CheckCircle size={18} />

                  <div>
                    <strong>
                      Request Approved
                    </strong>

                    <span>
                      The Controller has approved
                      this maintenance memo.
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <AlertCircle size={18} />

                  <div>
                    <strong>
                      Request Rejected
                    </strong>

                    <span>
                      This maintenance memo request
                      was rejected.
                    </span>
                  </div>
                </>
              )}

            </div>

            <button
              className="primaryButton fullWidth"
              onClick={() =>
                setSelectedRequest(null)
              }
            >
              Close Details
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

/* =====================================================
   SUMMARY CARD
===================================================== */

function MemoSummaryCard({
  icon: Icon,
  title,
  value,
  text,
}) {
  return (
    <div className="memoSummaryCard">

      <div className="memoSummaryIcon">
        <Icon size={19} />
      </div>

      <div className="memoSummaryContent">

        <span>{title}</span>

        <strong>{value}</strong>

        <small>{text}</small>

      </div>

    </div>
  );
}

/* =====================================================
   DETAIL ITEM
===================================================== */

function MemoDetail({ label, value }) {
  return (
    <div className="memoDetailItem">

      <span>{label}</span>

      <strong>{value}</strong>

    </div>
  );
}

export default MemoRequests;