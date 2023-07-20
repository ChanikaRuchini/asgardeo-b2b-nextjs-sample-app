/**
 * check if the user is an administrator of the logged in identity server
 * 
 * @param scopes - scopes of the logged in user
 * 
 * @returns `true` if the user is an administrator, else `false`
 */
export function checkAdmin(scopes: string): boolean {
    const scopesList: string[] = scopes.split(/\s+/);

    const adminScopes = [ "email", "internal_login", "internal_user_mgt_create", "internal_user_mgt_delete",
    "internal_user_mgt_list", "internal_user_mgt_update", "internal_user_mgt_view", "openid", "profile" ];

    for (let i = 0; i < adminScopes!.length; i++) {
        if (!scopesList.includes(adminScopes![i])) {
            return false;
        }
    }

    return true;
}

/**
 * 
 * @param orgId - organization id
 * 
 * @returns organization url
 */
export function getOrgUrl(orgId: string): string {

    const managementAPIServerBaseUrl = getManagementAPIServerBaseUrl();

    return `${managementAPIServerBaseUrl}/o/${orgId}`;
}

export function getMeEnpointUrl(orgId: string): string {

    const managementAPIServerBaseUrl = getManagementAPIServerBaseUrl();

    return `${managementAPIServerBaseUrl}/t/${orgId}`;
}

export function getUrl(orgId: string): string {
    return `${getHostedUrl()}/o/${orgId}`;
}

export function getRolesEnpointUrl(orgId: string): string {

    const baseUrl = "https://api.authz.cloudservices.wso2.com";
    // eslint-disable-next-line
    const matches = baseUrl.match(/^(http|https)?\:\/\/([^\/?#]+)/i);
    const domain = matches && matches[0];
    return `${domain}/o/${orgId}`;
}


/**
 * URL extracted from the `config.AuthorizationConfig.BaseOrganizationUrl`
 * 
 * @returns get managemnt API server base URL
 */

export function getManagementAPIServerBaseUrl() {

    // todo: implementation will change after changes are done to the IS.

    const baseOrganizationUrl = `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}`;
    // eslint-disable-next-line
    const matches = baseOrganizationUrl!.match(/^(http|https)?\:\/\/([^\/?#]+)/i);
    const domain = matches && matches[0];

    return domain;
}

/**
 * Tenant domain extracted from the `config.AuthorizationConfig.BaseOrganizationUrl`
 * 
 *  @returns tenatn domain.
 */
export function getTenantDomain() {

    const baseOrganizationUrl = `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}`;
    const url = baseOrganizationUrl.split("/");
    const path = url[url.length - 1];

    return path;
}

/**
 * 
 * get hosted url
 * value of `config.ApplicationConfig.HostedUrl`
 */
export function getHostedUrl() : string {

    return process.env.NEXT_PUBLIC_HOSTED_URL!;
}

export default {
    checkAdmin, getOrgUrl, getManagementAPIServerBaseUrl, getTenantDomain, getHostedUrl, getUrl
};
