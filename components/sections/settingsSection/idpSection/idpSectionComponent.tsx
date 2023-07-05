/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import EnterpriseIdentityProvider from "../../../../models/identityProvider/data/templates/enterprise-identity-provider.json";
import GoogleIdentityProvider from "../../../../models/identityProvider/data/templates/google.json";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../common/dialogComponent/dialogComponent";
import AppSelectIcon from "@rsuite/icons/AppSelect";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Button, Container, FlexboxGrid, Stack, useToaster } from "rsuite";
import IdentityProviderList from "./otherComponents/identityProviderList";
import IdpCreate from "./otherComponents/idpCreateModal/idpCreate";
import SelectIdentityProvider from "./otherComponents/selectIdentityProvider";
import {
  IdentityProvider,
  IdentityProviderTemplate,
} from "../../../../models/identityProvider/identityProvider";
import RequestMethod from "../../../../models/api/requestMethod";

interface IdpSectionComponentProps {
  session: Session;
}

/**
 *
 * @param prop - session
 *
 * @returns The idp interface section.
 */
export default function IdpSectionComponent(props: IdpSectionComponentProps) {
  const { session } = props;

  const toaster = useToaster();

  const [idpList, setIdpList] = useState<IdentityProvider[]>([]);
  const [openSelectModal, setOpenSelectModal] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<IdentityProviderTemplate>(undefined);

  const templates: IdentityProviderTemplate[] = [
    EnterpriseIdentityProvider,
    GoogleIdentityProvider,
  ];

  const fetchAllIdPs = useCallback(async () => {
    const res = await listAllIdentityProviders(session);

    if (res) {
      setIdpList(res);
    } else {
      setIdpList([]);
    }
  }, [session]);

  async function listAllIdentityProviders(
    session: Session
  ): Promise<IdentityProvider[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };

      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };
      const res = await fetch(
        "/api/settings/identityProvider/listAllIdentityProviders",
        request
      );
      const data = await res.json();

      if (data) {
        if (data.identityProviders) {
          return data.identityProviders;
        } else {
          return [];
        }
      }
      return data;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    fetchAllIdPs();
  }, [fetchAllIdPs]);

  const onAddIdentityProviderClick = (): void => {
    setOpenSelectModal(true);
  };

  const onTemplateSelect = (template: IdentityProviderTemplate): void => {
    setOpenSelectModal(false);
    setSelectedTemplate(template);
  };

  const onSelectIdpModalClose = (): void => {
    setOpenSelectModal(false);
  };

  const onCreationDismiss = (): void => {
    setSelectedTemplate(undefined);
  };

  const onIdpCreated = (response: IdentityProvider): void => {
    if (response) {
      successTypeDialog(
        toaster,
        "Success",
        "Identity Provider Created Successfully"
      );

      setIdpList([...idpList, response]);

      setOpenSelectModal(false);
      setSelectedTemplate(undefined);
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while creating the identity provider. Try again."
      );
    }
  };

  return (
    <Container>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" alignItems="flex-start">
          <h2>Identity Providers</h2>
          <p>
            Manage identity providers to allow users to log in to your
            application through them.
          </p>
        </Stack>
      </Stack>

      {idpList ? (
        idpList.length === 0 ? (
          <FlexboxGrid
            style={{ height: "60vh", marginTop: "24px", width: "100%" }}
            justify="center"
            align="middle"
          >
            <Stack alignItems="center" direction="column">
              <AppSelectIcon
                style={{ opacity: 0.2 }}
                width="150px"
                height="150px"
              />
              <p style={{ fontSize: 14, marginTop: "20px" }}>
                There are no identity providers available at the moment.
              </p>
              <Button
                appearance="primary"
                onClick={onAddIdentityProviderClick}
                size="md"
                style={{ marginTop: "12px" }}
              >
                Add Identity Provider
              </Button>
            </Stack>
          </FlexboxGrid>
        ) : (
          <IdentityProviderList
            fetchAllIdPs={fetchAllIdPs}
            idpList={idpList}
            session={session}
          />
        )
      ) : null}

      {openSelectModal && (
        <SelectIdentityProvider
          templates={templates}
          onClose={onSelectIdpModalClose}
          openModal={openSelectModal}
          onTemplateSelected={onTemplateSelect}
        />
      )}
      {selectedTemplate && (
        <IdpCreate
          session={session}
          onIdpCreate={onIdpCreated}
          onCancel={onCreationDismiss}
          openModal={!!selectedTemplate}
          template={selectedTemplate}
          orgId={session.orgId}
        />
      )}
    </Container>
  );
}