import { NextApiResponse } from "next";

interface Error404Interface {
    error: boolean,
    msg: string
}

function error404(res: NextApiResponse, msg: Error404Interface | string) {

    return res.status(404).json(msg);
}

export function notPostError(res: NextApiResponse) {

    return error404(res, "Cannot request data directyly.");
}

export function dataNotRecievedError(res: NextApiResponse) {

    return error404(res, {
        error: true,
        msg: "Error occured when requesting data."
    });
}

export default { dataNotRecievedError, notPostError };
