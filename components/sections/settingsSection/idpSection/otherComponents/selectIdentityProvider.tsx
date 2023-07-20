import Image from "next/image";
import { Avatar, Modal } from "rsuite";
import styles from "../../../../../styles/Settings.module.css";
import { IdentityProviderTemplate } from "../../../../../models/identityProvider/identityProvider";
import { getImageForTheIdentityProvider } from "../../../../../utils/identityProviderUtils";

interface SelectIdentityProviderProps {
  openModal: boolean;
  onClose: () => void;
  templates: IdentityProviderTemplate[];
  onTemplateSelected: (
    IdentityProviderTemplate: IdentityProviderTemplate
  ) => void;
}

/**
 *
 * @param prop - openModal (function to open the modal), onClose (what will happen when modal closes),
 *               templates (templates list), onTemplateSelected
 *              (what will happen when a particular template is selected)
 *
 * @returns A modal to select idp's
 */
export default function SelectIdentityProvider(
  prop: SelectIdentityProviderProps
) {
  const { openModal, onClose, templates, onTemplateSelected } = prop;

  return (
    <Modal open={openModal} onClose={onClose} onBackdropClick={onClose}>
      <Modal.Header>
        <>
          <Modal.Title>
            <h4>Select Identity Provider</h4>
          </Modal.Title>
          <p>Choose one of the following identity providers</p>
        </>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className={styles.idp__template__list}>
            {templates.map((template) => {
              return (
                <div
                  key={template.id}
                  className={styles.idp__template__card}
                  onClick={() => onTemplateSelected(template)}
                >
                  <div>
                    <h5>{template.name}</h5>
                    <small>{template.description}</small>
                  </div>

                  <Avatar style={{ background: "rgba(255,0,0,0)" }}>
                    <Image
                      src={getImageForTheIdentityProvider(template.templateId!)}
                      alt="idp image"
                      width={40}
                    />
                  </Avatar>
                </div>
              );
            })}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
