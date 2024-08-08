import { Response } from "express"

const StatusCode = {
    OK: 200,
    CREATED: 201
}

const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created'
}


interface SuccessResponseOptions {
    message?: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: Record<string, any>;
}


class SuccessResponse {
    public message: string
    public statusCode: number
    public metadata: Record<string, any>;
    constructor({
        message = '',
        statusCode = StatusCode.OK,
        reasonStatusCode = ReasonStatusCode.OK,
        metadata = {}
    }: SuccessResponseOptions) {
        this.message = message || reasonStatusCode;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }

    send(res: Response, header: Record<string, string | number> = {}): Response {
        Object.keys(header).forEach(key => res.setHeader(key, header[key]));
        return res.status(this.statusCode).json({
            message: this.message,
            metadata: this.metadata
        });
    }
}


class OK extends SuccessResponse {

    constructor({ message = '', statusCode = StatusCode.OK }) {
        super({ message, statusCode })
    }
}

class CREATED extends SuccessResponse {
    public options?: Record<string, any>;
    constructor({ options = {}, message = '', statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata = {} }) {
        super({ message, statusCode, reasonStatusCode, metadata })
        this.options = options
    }
}

export {
    SuccessResponse,
    OK,
    CREATED
}