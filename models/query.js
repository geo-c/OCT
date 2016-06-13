/**
 * Query Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "parameter_1": {
            "type": "string",
            "minLength": 2
        }
    },
    "required": [
        "parameter_1"
    ]
};
