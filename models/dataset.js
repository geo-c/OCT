/**
 * Dataset Model for schema validation
 * @type {Object}
 */
module.exports = {
    "properties": {
        "ds_type": {
            "type": "string"
        },
        "ds_description": {
            "type": "string"
        },
        "ds_host": {
            "type": "string"
        },
        "ds_port": {
            "type": "string"
        },
        "db_instance": {
            "type": "string"
        },
        "db_user": {
            "type": "string"
        },
        "db_password": {
            "type": "string"
        },
        "created_by": {
            "type": "string"
        },
        "md_name": {
            "type": "string"
        },
        "md_description": {
            "type": "string"
        },
        "publisher": {
            "type": "string"
        },
        "published": {
            "type": "string"
        },
        "license": {
            "type": "string"
        },
        "sd_name": {
            "type": "string"
        },
        "sd_description": {
            "type": "string"
        },
        "query_intern": {
            "type": "string"
        },
        "query_extern": {
            "type": "string"
        },
        "query_description": {
            "type": "string"
        },
        "categories": {
            "type": "array"
        }
    },
    "required": [
        "ds_host"
    ]
};
