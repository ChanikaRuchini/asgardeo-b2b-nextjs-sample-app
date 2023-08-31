import FooterComponent from "../../../components/common/footerComponent/footerComponent";
import NavBarComponent from "../../../components/common/navBarComponent/navBarcomponent";
import APICall from "../../../components/sections/ApiCallSection/APICall";
import styles from "../../../styles/Home.module.css";

export default function Resources() {
  return (
    <div>
      <APICall />
    </div>
  );
}

Resources.auth = true;
