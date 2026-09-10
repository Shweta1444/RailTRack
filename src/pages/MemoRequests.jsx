import {
  FileText,
  Clock,
  CheckCircle,
} from "lucide-react";

import StatusBadge from "../components/StatusBadge";

function MemoRequests({ requests }) {
  return (
    <div>
      <div className="pageHeading">
        <div>
          <p className="eyebrow">
            BLOCK PERMISSION
          </p>

          <h2>Memo Requests</h2>

          <p>
            Maintenance block requests submitted by
            departments.
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="emptyState">
          <FileText size={48} />

          <h2>No Memo Requests</h2>

          <p>
            Maintenance departments have not submitted
            any memo requests yet.
          </p>
        </div>
      ) : (
        <div className="panel">
          <div className="tableWrapper">
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Asset</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr key={request.requestId}>
                    <td>
                      <strong>
                        {request.requestId}
                      </strong>
                    </td>

                    <td>{request.asset}</td>

                    <td>
                      {request.department}
                    </td>

                    <td>{request.location}</td>

                    <td>{request.due}</td>

                    <td>
                      <StatusBadge
                        status={
                          request.requestStatus
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemoRequests;