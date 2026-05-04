import { useNavigate } from "react-router";
import {
  Button,
  Menu,
  MenuItem,
  MenuDivider,
  Popover,
  Tag,
  Intent,
} from "@blueprintjs/core";
import { useAuth } from "../context/useAuth";

export default function UserProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const roleLabel: Record<string, string> = {
    SUPERADMIN: "Super Admin",
    MANAGER: "Manager",
    SUPERVISOR: "Supervisor",
    POLITICAL_OFFICER: "Political Officer",
    STAFF: "Staff",
    VOLUNTEER: "Volunteer",
  };

  const roleIntent: Record<string, Intent> = {
    SUPERADMIN: Intent.DANGER,
    MANAGER: Intent.PRIMARY,
    SUPERVISOR: Intent.SUCCESS,
    POLITICAL_OFFICER: Intent.WARNING,
    STAFF: Intent.NONE,
    VOLUNTEER: Intent.NONE,
  };

  const handleLogout = () => {
    logout();
  };

  const menu = (
    <Menu>
      <MenuItem
        icon="user"
        text="Profile"
        onClick={() => navigate("/profile")}
      />
      <MenuItem
        icon="cog"
        text="Settings"
        onClick={() => navigate("/settings")}
      />
      <MenuDivider />
      <MenuItem icon="log-out" text="Sign Out" onClick={handleLogout} />
    </Menu>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Tag
        minimal
        intent={roleIntent[user.system_role] ?? Intent.NONE}
        style={{ borderRadius: 0, textTransform: "uppercase", fontSize: 11 }}
      >
        {roleLabel[user.system_role] ?? user.system_role}
      </Tag>
      <Popover content={menu} placement="bottom-end">
        <Button
          icon="user"
          minimal
          text={user.full_name}
          rightIcon="caret-down"
        />
      </Popover>
    </div>
  );
}
