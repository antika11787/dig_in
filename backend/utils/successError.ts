const success = (message: string, data = null) => {
    return {
        success: true,
        message: message,
        data: data
    }
}

const failure = (message: string, error = null, resendLink = null) => {
    return {
        success: false,
        message: message,
        error: error,
        resendLink: resendLink
    }
}

module.exports = { success, failure }