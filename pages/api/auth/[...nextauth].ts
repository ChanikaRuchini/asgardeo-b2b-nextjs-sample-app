import { getLoggedUserFromProfile, getLoggedUserId, getOrgId, getOrgName  } from "../../../utils/authorization-config-util/authorizationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import OrgSession from "../../../models/orgSession/orgSession";
import { getHostedUrl } from "../../../utils/application-config-util/applicationConfigUtil";
import RequestMethod from "../../../models/api/requestMethod";

/**
 * 
 * @param req - request body
 * @param res - response body
 * 
 * @returns IS provider that will handle the sign in process. Used in `orgSignin()`
 * [Use this method to signin]
 */
const wso2ISProvider = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, {

    callbacks: {

        async jwt({ token, account, profile }) {

            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
                token.scope = account.scope;
                token.user = profile;
            }
            console.log("token", token);
            return token;
        },
        async redirect({ baseUrl }) {
            return `${baseUrl}/o/moveOrg`;
        },
        async session({ session, token }) {
            const orgSession = await switchOrg(token);

            if (!orgSession) {
                session.error = true;
            } else if (orgSession.expires_in <= 0) {
                session.expires = true;
            }
            else {
                session.accessToken = orgSession.access_token;
                session.idToken = orgSession.id_token;
                session.scope = orgSession.scope;
                session.refreshToken = orgSession.refresh_token;
                session.expires = false;
                session.userId = getLoggedUserId(session.idToken!);
                session.user = getLoggedUserFromProfile(token.user!);
                session.orgId = getOrgId(session.idToken!);
                session.orgName = getOrgName(session.idToken!);
                session.orginalIdToken = token.idToken;
            }
            return session;
        
        }
    },
    debug: true,
    providers: [
        {
            authorization: {
                params: {
                    scope:  process.env.API_SCOPES
                }
            },
            clientId: process.env.SHARED_APP_CLIENT_ID,
            clientSecret: process.env.SHARED_APP_CLIENT_SECRET,
            id: "wso2isAdmin",
            name: "WSO2ISAdmin",
            profile(profile) {

                return {
                    id: profile.sub
                };
            },
            type: "oauth",
            userinfo: `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}/oauth2/userinfo`,
            // eslint-disable-next-line
            wellKnown: `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}/oauth2/token/.well-known/openid-configuration`,

            issuer: `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}/oauth2/token`
        }
    ],
    secret: process.env.SECRET
});

/**
 * 
 * @param token - token object get from the inital login call
 * 
 * @returns - organization id of the logged in organization
 */
async function switchOrg(token: JWT): Promise<OrgSession | null> {

    try {

    const subOrgId: string = getOrganizationId(token);
    const accessToken: string = (token.accessToken as string);

    const body = {
                param: accessToken,
                subOrgId: subOrgId
            };
    const request = {
                body: JSON.stringify(body),
                method: RequestMethod.POST
            };
    
    const res = await fetch(`${getHostedUrl()}/api/settings/switchOrg`, request);
    const data = await res.json();
    return data;
    
    } catch (err) {

        return null;
    }

}

function getOrganizationId(token: JWT): string {

    if(token.user) {
        if (token.user.user_organization) {

            return token.user.user_organization;
        } else if (process.env.SUB_ORGANIZATION_ID) {
    
            return process.env.SUB_ORGANIZATION_ID;
        } else {
    
            return token.user.org_id;
        }
    } else {
        
        return process.env.SUB_ORGANIZATION_ID!;
    }

}


export default wso2ISProvider;
