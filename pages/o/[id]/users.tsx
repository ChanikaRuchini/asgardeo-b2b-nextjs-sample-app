import FooterComponent from "../../../components/common/footerComponent/footerComponent";
import NavBarComponent from "../../../components/common/navBarComponent/navBarcomponent";
import ManageUserSectionComponent from "../../../components/sections/settingsSection/manageUserSection/manageUserSectionComponent";
import styles from "../../../styles/Home.module.css";

export default function Users() {
  return (
    <div>
      <ManageUserSectionComponent />;
    </div>
  );
}

Users.auth = true;
