import FooterComponent from "../../../components/common/footerComponent/footerComponent";
import NavBarComponent from "../../../components/common/navBarComponent/navBarcomponent";
import ProfileSectionComponent from "../../../components/sections/profileSection/profileComponent";
import ManageGroupSectionComponent from "../../../components/sections/settingsSection/manageGroupSection/manageGroupSectionComponent";
import styles from "../../../styles/Home.module.css";

export default function Profile() {
  return (
    <div>
      <ProfileSectionComponent />;
    </div>
  );
}

Profile.auth = true;
