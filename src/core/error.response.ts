import reasonPhrases from "../utils/reasonPhrases";
import statusCode from "../utils/statusCode";

class ErrorResponse extends Error {
    public status?: number;
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

class ConflitRequestError extends ErrorResponse {
    constructor(message: string = reasonPhrases.CONFLICT, status: number = statusCode.CONFLICT) {
        super(message, status)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message: string = reasonPhrases.BAD_REQUEST, status: number = statusCode.BAD_REQUEST) {
        super(message, status)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message: string = reasonPhrases.NOT_FOUND, status: number = statusCode.NOT_FOUND) {
        super(message, status)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = reasonPhrases.UNAUTHORIZED, status: number = statusCode.UNAUTHORIZED) {
        super(message, status)
    }
}

export {
    ErrorResponse,
    BadRequestError,
    NotFoundError,
    AuthFailureError,
    ConflitRequestError
}