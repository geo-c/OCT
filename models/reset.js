/**
 * Login Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "app_name": {
            "type": "string",
            "minLength": 2
        }
    },
    "required": [
        "app_name"
    ]
};
