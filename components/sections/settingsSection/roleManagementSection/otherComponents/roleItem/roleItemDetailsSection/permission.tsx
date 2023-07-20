import { List } from "rsuite";
import styles from "../../../../../../../styles/Settings.module.css";

type Permission = {
  name: string;
};

interface PermissionProps {
  permissions?: Permission[];
}

/**
 *
 * @param prop - permissions
 *
 * @returns The permission section of role details
 */
export default function Permission(props: PermissionProps) {
  const { permissions } = props;
  return (
    <div className={styles.addUserMainDiv}>
      {permissions ? (
        permissions.length === 0 ? (
          <p> Permissions are not set at the moment.</p>
        ) : (
          <>
            <List size="sm">
              {permissions.map((item, index) => (
                <List.Item key={index} index={index}>
                  {item.name}
                </List.Item>
              ))}
            </List>
          </>
        )
      ) : null}
    </div>
  );
}
