import { Application } from "../models/application/application";
import { IdentityProvider, IdentityProviderTemplate, IdentityProviderTemplateModel } from "../models/identityProvider/identityProvider";
import { ENTERPRISE_ID, GOOGLE_ID } from "./util-common/common";
import googleFederatedAuthenticators from "../models/identityProvider/data/templates/google.json";
import enterpriseFederatedAuthenticators from "../models/identityProvider/data/templates/enterprise-identity-provider.json";

/**
 * 
 * @param templateId - application details template id
 * 
 * @returns template related to the template id.
 */

export function selectedTemplateBaesedonTemplateId(templateId: string): IdentityProviderTemplate | null {
    switch (templateId) {
        case GOOGLE_ID:

            return googleFederatedAuthenticators;
        case ENTERPRISE_ID:

            return enterpriseFederatedAuthenticators;
        default :
            return null;
    }
}

/**
 * 
 * @param template - applicaiton details template
 * @param idpDetails - identity provider details
 
 * @returns `[check,onlyIdp]`
 * `check` - if the idp is in authentication sequence, 
 * `onlyIdp` - is the idp is the only idp in the sequence
 */
export function checkIfIdpIsinAuthSequence(template: Application, idpDetails: IdentityProvider): boolean[] {
    const authenticationSequenceModel = template.authenticationSequence;
    const idpName = idpDetails.name;
    let check = false;
    let onlyIdp = false;

    authenticationSequenceModel.steps.forEach((step) => {
        step.options.forEach((option) => {
            if (option.idp === idpName) {
                check = true;
            }
        });

        if (step.options.length === 1) {
            onlyIdp = true;
        }
    });

    return [ check, onlyIdp ];
}

// /**
//  * 
//  * @param template - applicaiton details template
//  * @returns `true` if BASIC AUTH is available in auth sequence, else `false`
//  */
// export function checkIfBasicAvailableinAuthSequence(template): boolean {
//     const authenticationSequenceModel = template.authenticationSequence;
//     let check = false;

//     authenticationSequenceModel.steps.forEach((step) => {
//         step.options.forEach((option) => {
//             if (option.authenticator === "BasicAuthenticator") {
//                 check = true;
//             }
//         });
//     });

//     return check;
// }

/**
 * PatchApplicationAuthMethod mentioned whether we are adding or removing the idp.
 * `REMOVE` Will remove the idp from every step
 */
export const PatchApplicationAuthMethod = {
    ADD: true,
    REMOVE: false
};

export default {
    PatchApplicationAuthMethod, checkIfIdpIsinAuthSequence,
    selectedTemplateBaesedonTemplateId

};
