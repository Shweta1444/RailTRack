function StatusBadge({ status }) {
  let type = "default";

  if (
    status === "Approved" ||
    status === "Controller Approved" ||
    status === "Block Released"
  ) {
    type = "success";
  }

  if (
    status === "Pending" ||
    status === "Not Applied" ||
    status === "Pending Controller Approval"
  ) {
    type = "warning";
  }

  if (
    status === "Rejected"
  ) {
    type = "danger";
  }

  return (
    <span className={`statusBadge ${type}`}>
      {status}
    </span>
  );
}

export default StatusBadge;