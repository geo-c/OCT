/**
 * App Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "app_name": {
            "type": "string",
            "minLength": 1
        },
        "app_description": {
            "type": "string"
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
        },
        "type": {
            "type": "string",
            "minLength": 1
        },
        "url": {
            "type": "string",
            "minLength": 1
        }
    },
    "required": [
        "app_name",
        "email_address",
        "first_name",
        "last_name",
        "url"
    ]
};
