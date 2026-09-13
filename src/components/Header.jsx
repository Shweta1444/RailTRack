import { Bell, Menu, UserRound, ChevronDown } from "lucide-react";

function Header({
  activePage,
  currentRole,
  setCurrentRole,
  notifications = [],
}) {
  return (
    <header className="header">
      <div className="headerLeft">
        <button className="mobileMenu">
          <Menu size={20} />
        </button>

        <div>
          <h1>{activePage}</h1>
          <p>RailTRack Smart Railway Operations</p>
        </div>
      </div>

      <div className="headerRight">
        <div className="roleSelector">
  <div className="roleIcon">
    <UserRound size={17} />
  </div>

  <div className="roleInfo">
    <span className="roleLabel">CURRENT ROLE</span>

    <select
      value={currentRole}
      onChange={(event) =>
        setCurrentRole(event.target.value)
      }
    >
      <option value="Maintenance Department">
        Maintenance Department
      </option>

      <option value="Controller">
        Controller
      </option>

      <option value="Station Master">
        Station Master
      </option>
    </select>
  </div>

  <ChevronDown
    className="roleArrow"
    size={17}
  />
</div>

        <button className="notificationButton">
          <Bell size={20} />

          {notifications.length > 0 && (
            <span>{notifications.length}</span>
          )}
        </button>
      </div>
    </header>
  );
}

export default Header; 