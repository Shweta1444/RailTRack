import {
  LayoutDashboard,
  Train,
  Wrench,
  FileText,
  CheckCircle,
  ShieldCheck,
  Info,
} from "lucide-react";

function Sidebar({
  activePage,
  setActivePage,
  currentRole,
  pendingMemoCount,
  blockPlanRequest,
}) {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Block Planning",
      icon: Train,
    },
    {
      name: "Maintenance",
      icon: Wrench,
    },
    {
      name: "Memo Requests",
      icon: FileText,
    },
    {
      name: "Approvals",
      icon: CheckCircle,
    },
    {
      name: "Final Block",
      icon: ShieldCheck,
    },
    {
  name: "About",
  icon: Info,
},
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
  <img
    src="/railtrack_logo.png"
    alt="RailTRack Logo"
    className="sidebarLogo"
  />

  <div>
    <h1>RailTRack</h1>
    <span>Smart Railway Operations</span>
  </div> 
</div>

      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;

          const approvalCount =
            pendingMemoCount +
            (blockPlanRequest?.controllerStatus === "Pending"
              ? 1
              : 0);

          return (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? "navItem active"
                  : "navItem"
              }
              onClick={() => setActivePage(item.name)}
            >
              <Icon size={20} />

              <span>{item.name}</span>

              {item.name === "Approvals" &&
                approvalCount > 0 && (
                  <span className="navCount">
                    {approvalCount}
                  </span>
                )}
            </button>
          );
        })}
      </nav>

      <div className="sidebarBottom">
        <div className="user">
          <div className="avatar">
            {currentRole === "Maintenance Department"
              ? "MD"
              : currentRole === "Controller"
              ? "CO"
              : "SM"}
          </div>

          <div>
            <strong>{currentRole}</strong>

            <small>
              {currentRole === "Maintenance Department"
                ? "Maintenance"
                : currentRole === "Controller"
                ? "Control Operations"
                : "Operations"}
            </small>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;