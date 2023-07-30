import { getHostedUrl } from "../../../utils/application-config-util/applicationConfigUtil";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError } from "../../../utils/api-util/apiErrors";

/**
 * 
 * @returns get the basic auth for authorize the switch call
 */
const getBasicAuth = (): string => Buffer
    // eslint-disable-next-line
    .from(`${process.env.SHARED_APP_CLIENT_ID}:${process.env.SHARED_APP_CLIENT_SECRET}`).toString("base64");

/**
 * 
 * @returns get the header for the switch call
 */
const getSwitchHeader = (): HeadersInit => {

    const headers = {
        "Access-Control-Allow-Credentials": true.toString(),
        "Access-Control-Allow-Origin": getHostedUrl(),
        Authorization: `Basic ${getBasicAuth()}`,
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded"
    };

    return headers;
};

/**
 * 
 * @param subOrgId - sub organization id
 * @param accessToken - access token return from the IS
 * 
 * @returns get the body for the switch call
 */
const getSwitchBody = (subOrgId: string, accessToken: string): Record<string, string> => {
    const body = {
        "grant_type": "organization_switch",
        "scope": process.env.API_SCOPES!,
        "switching_organization": subOrgId,
        "token": accessToken
    };

    return body;
};

/**
 * 
 * @param subOrgId - sub organization id
 * @param accessToken - access token return from the IS
 * 
 * @returns get the request body for the switch call
 */
const getSwitchRequest = (subOrgId: string, accessToken: string): RequestInit => {
    const request = {
        body: new URLSearchParams(getSwitchBody(subOrgId, accessToken)).toString(),
        headers: getSwitchHeader(),
        method: "POST"
    };

    return request;
};

/**
 * 
 * @returns get the endpoint for the switch API call
 */
const getSwitchEndpoint = (): string => `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}/oauth2/token`;

/**
 * 
 * @param req - request object
 * @param res - response object
 * 
 * @returns whether the switch call was successful
 */
export default async function switchOrg(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const subOrgId = body.subOrgId;
    const accessToken = body.param;

    try {

        const fetchData = await fetch(
            getSwitchEndpoint(),
            getSwitchRequest(subOrgId, accessToken)
        );

        const data = await fetchData.json();

        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
