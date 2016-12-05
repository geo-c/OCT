/**
 * Error Messages
 */
module.exports = {
    schema: {
        error_1: {
            code: 400,
            message: 'Invalid schema'
        }
    },
    database: {
        error_1: {
            code: 500,
            message: 'Error fetching client from pool'
        },
        error_2: {
            code: 401,
            message: 'Error running query'
        },
        error_3: {
            code: 400,
            message: 'No valid query parameters'
        }
    },
    authentication: {
        error_1: {
            code: 401,
            message: 'Failed to authenticate with this token'
        },
        error_2: {
            code: 401,
            message: 'Failed to authenticate, no token has been sent'
        },
        error_3: {
            code: 401,
            message: 'Failed to authenticate. Wrong username and/or password.'
        }
    },
    query: {
        error_1: {
            code: 404,
            message: 'App not found'
        },
        error_2: {
            code: 404,
            message: 'Log-entry not found'
        },
        error_3: {
            code: 404,
            message: 'No Datasets found for this category'
        },
        error_4: {
            code: 404,
            message: 'No Datasets found near this Point'
        }
    },
    development: {
        error_1: {
            code: 501,
            message: 'Not implemented'
        }
    }
};
