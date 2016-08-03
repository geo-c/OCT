/**
 * Admin Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "username": {
            "type": "string",
            "minLength": 2
        },
        "email_address": {
            "type": "string"
        },
        "first_name": {
            "type": "string",
            "minLength": 1
        },
        "last_name": {
            "type": "string",
            "minLength": 1
        }
    },
    "required": [
        "username",
        "email_address",
        "first_name",
        "last_name"
    ]
};
