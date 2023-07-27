import { NextApiResponse } from "next";

export interface ApiError {
    error: boolean,
    msg: string
}

function error500(res: NextApiResponse, msg: ApiError | string) {

    return res.status(500).json(msg);
}

export function notPostError(res: NextApiResponse) {

    return error500(res, "Cannot request data directyly.");
}

export function dataNotRecievedError(res: NextApiResponse) {

    return error500(res, {
        error: true,
        msg: "Error occured when requesting data."
    });
}

export default { dataNotRecievedError, notPostError};
