import FooterComponent from "../../../components/common/footerComponent/footerComponent";
import NavBarComponent from "../../../components/common/navBarComponent/navBarcomponent";
import ManageGroupSectionComponent from "../../../components/sections/settingsSection/manageGroupSection/manageGroupSectionComponent";
import styles from "../../../styles/Home.module.css";

export default function Groups() {
  return (
    <div>
      <ManageGroupSectionComponent />;
    </div>
  );
}

Groups.auth = true;
