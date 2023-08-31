import FooterComponent from "../../../components/common/footerComponent/footerComponent";
import NavBarComponent from "../../../components/common/navBarComponent/navBarcomponent";
import ManageGroupSectionComponent from "../../../components/sections/settingsSection/manageGroupSection/manageGroupSectionComponent";
import RoleManagementSectionComponent from "../../../components/sections/settingsSection/roleManagementSection/roleManagementSectionComponent";
import styles from "../../../styles/Home.module.css";

export default function Roles() {
  return (
    <div>
      <RoleManagementSectionComponent />;
    </div>
  );
}

Roles.auth = true;
