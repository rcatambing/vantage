import { useState } from "react";
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Alignment,
  Button,
  InputGroup,
  Icon,
  Popover,
  Menu,
  MenuItem,
  MenuDivider,
  Tag,
  Intent,
} from "@blueprintjs/core";
import { useApp } from "../context/useApp";
import { useAuth } from "../context/useAuth";
import UserProfileMenu from "./UserProfileMenu";
import {
  generateDemoTestData,
  isDemoModeEnabled,
  resetDemoData,
  setDemoModeEnabled,
} from "../features/accounts/demoData";
import { appToaster } from "../toaster";

export default function TopNavbar() {
  const { toggleSidebar, setGalleryOpen } = useApp();
  const { isAuthenticated } = useAuth();
  const [demoEnabled, setDemoEnabled] = useState(isDemoModeEnabled());

  async function toggleDemo() {
    const next = !demoEnabled;
    setDemoModeEnabled(next);
    setDemoEnabled(next);
    const toaster = await appToaster;
    toaster.show({
      message: next ? "Demo mode enabled" : "Demo mode disabled",
      intent: next ? Intent.SUCCESS : Intent.NONE,
    });
    window.location.reload();
  }

  async function handleGenerateDemoData() {
    const result = generateDemoTestData(25);
    const toaster = await appToaster;
    toaster.show({
      message: `Generated ${result.accountsAdded} demo accounts, ${result.affiliationsAdded} affiliations, ${result.signalsAdded} signals`,
      intent: Intent.PRIMARY,
      timeout: 4500,
    });
    window.dispatchEvent(new Event("vantage-demo-data-updated"));
  }

  async function handleResetDemoData() {
    resetDemoData();
    const toaster = await appToaster;
    toaster.show({ message: "Demo data reset to baseline", intent: Intent.WARNING });
    window.dispatchEvent(new Event("vantage-demo-data-updated"));
  }

  const userMenu = (
    <Menu>
      <MenuItem icon="user" text="Profile" />
      <MenuItem icon="cog" text="Settings" />
      <MenuDivider />
      <MenuItem
        icon={demoEnabled ? "disable" : "play"}
        text={demoEnabled ? "Disable Demo Mode" : "Enable Demo Mode"}
        onClick={toggleDemo}
      />
      <MenuItem
        icon="database"
        text="Generate Demo Test Data"
        onClick={handleGenerateDemoData}
        disabled={!demoEnabled}
      />
      <MenuItem
        icon="reset"
        text="Reset Demo Data"
        onClick={handleResetDemoData}
        disabled={!demoEnabled}
      />
      <MenuDivider />
      <MenuItem icon="log-out" text="Sign Out" />
    </Menu>
  );

  return (
    <Navbar fixedToTop={false} style={{ height: 48, paddingInline: 8 }}>
      <NavbarGroup align={Alignment.LEFT}>
        <Button icon="menu" minimal onClick={toggleSidebar} />
        <NavbarHeading style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 4 }}>
          <Icon icon="satellite" size={18} intent="primary" />
          <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>VANTAGE</span>
        </NavbarHeading>
        <NavbarDivider />
        <InputGroup
          leftIcon="search"
          placeholder="Search campaigns, voters, intel\u2026"
          style={{ width: 280 }}
          small
        />
      </NavbarGroup>

      <NavbarGroup align={Alignment.RIGHT}>
        <Button icon="notifications" minimal />
        <Button
          icon="grid-view"
          minimal
          onClick={() => setGalleryOpen(true)}
        />
        <NavbarDivider />
        {demoEnabled && (
          <Tag minimal intent={Intent.PRIMARY} style={{ borderRadius: 0, marginRight: 8 }}>
            DEMO DATA
          </Tag>
        )}
        {isAuthenticated ? (
          <UserProfileMenu />
        ) : (
          <Popover content={userMenu} placement="bottom-end">
            <Button icon="user" minimal text="Operator" rightIcon="caret-down" />
          </Popover>
        )}
      </NavbarGroup>
    </Navbar>
  );
}
