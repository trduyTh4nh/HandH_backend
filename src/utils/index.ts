
const errorWriteDown = (error: any): string => {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    return errorMessage
}

export {
    errorWriteDown
}