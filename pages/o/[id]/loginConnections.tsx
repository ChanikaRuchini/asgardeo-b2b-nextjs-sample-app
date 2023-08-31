import FooterComponent from "../../../components/common/footerComponent/footerComponent";
import NavBarComponent from "../../../components/common/navBarComponent/navBarcomponent";
import IdpSectionComponent from "../../../components/sections/settingsSection/idpSection/idpSectionComponent";
import styles from "../../../styles/Home.module.css";

export default function LoginConnections() {
  return (
    <div>
      <IdpSectionComponent />;
    </div>
  );
}

LoginConnections.auth = true;
