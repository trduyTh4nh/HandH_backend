
import _ from 'lodash'

const errorWriteDown = (error: any): string => {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }

    return errorMessage
}

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

export {
    errorWriteDown,
    getInfoData
}