import { CopyTextToClipboardCallback } from "../../../../../../utils/util-common/common";
import {
  ENTERPRISE_ID,
  GOOGLE_ID,
} from "../../../../../../utils/util-common/common";
import { copyTheTextToClipboard } from "../../../../../../utils/util-common/common";
import CopyIcon from "@rsuite/icons/Copy";
import InfoRoundIcon from "@rsuite/icons/InfoRound";
import { Session } from "next-auth";
import {
  FlexboxGrid,
  Input,
  InputGroup,
  Modal,
  Panel,
  Stack,
  useToaster,
} from "rsuite";
import ExternalIdentityProvider from "./externalIdentityProvider";
import GoogleIdentityProvider from "./googleIdentityProvider";
import {
  IdentityProvider,
  IdentityProviderTemplate,
} from "../../../../../../models/identityProvider/identityProvider";
import { infoTypeDialog } from "../../../../../common/dialogComponent/dialogComponent";
import { getCallbackUrl } from "../../../../../../utils/identityProviderUtils";

interface PrerequisiteProps {
  orgId: string;
}

interface IdpCreateProps {
  session: Session;
  onIdpCreate: (response: IdentityProvider | null) => void;
  onCancel: () => void;
  template: IdentityProviderTemplate;
  orgId: string;
  openModal: boolean;
}

/**
 *
 * @param prop - `IdpCreateProps`
 * @returns Idp creation modal
 */
export default function IdpCreate(prop: IdpCreateProps) {
  const { session, openModal, onIdpCreate, onCancel, template, orgId } = prop;

  const handleModalClose = (): void => {
    onCancel();
  };

  const resolveTemplateForm = (): JSX.Element | undefined => {
    switch (template.templateId) {
      case GOOGLE_ID:
        return (
          <GoogleIdentityProvider
            session={session}
            template={template}
            onIdpCreate={onIdpCreate}
            onCancel={onCancel}
          />
        );

      case ENTERPRISE_ID:
        return (
          <ExternalIdentityProvider
            session={session}
            template={template}
            onIdpCreate={onIdpCreate}
            onCancel={onCancel}
          />
        );
    }
  };

  return (
    <Modal
      open={openModal}
      onClose={handleModalClose}
      onBackdropClick={handleModalClose}
      size="lg"
    >
      <Modal.Header>
        <>
          <Modal.Title>
            <h4>{template.name}</h4>
          </Modal.Title>
          <p>{template.description}</p>
        </>
      </Modal.Header>
      <Modal.Body>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item colspan={14}>
            {resolveTemplateForm()}
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={9}>
            <Prerequisite orgId={orgId} />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Modal.Body>
    </Modal>
  );
}

function Prerequisite(prop: PrerequisiteProps) {
  const { orgId } = prop;

  const toaster = useToaster();

  const copyValueToClipboard = (text: string) => {
    const callback: CopyTextToClipboardCallback = () =>
      infoTypeDialog(toaster, "Text copied to clipboard");

    copyTheTextToClipboard(text, callback);
  };

  return (
    <Panel
      header={
        <Stack alignItems="center" spacing={10}>
          <InfoRoundIcon />
          <b>Prerequisite</b>
        </Stack>
      }
      bordered
    >
      <p>
        Before you begin, create an OAuth application, and obtain a client ID &
        secret. Add the following URL as the Authorized Redirect URI.
      </p>
      <br />
      <InputGroup>
        <Input readOnly value={getCallbackUrl(orgId)} size="lg" />
        <InputGroup.Button
          onClick={() => copyValueToClipboard(getCallbackUrl(orgId))}
        >
          <CopyIcon />
        </InputGroup.Button>
      </InputGroup>
    </Panel>
  );
}
