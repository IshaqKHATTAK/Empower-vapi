#http://127.0.0.1:5000/database/TexasBit

DATABASE_API_SCHEMA = {
    "info": {
        "title": "{title}",
        "version": "1.0.0",
        "description": "{title_description}"
    },
    "paths": {
        "{route}": {
            "get": {
                "summary": "{route_summary}",
                "responses": {
                    "200": {
                        "content": {
                            "text/html": {
                                "schema": {
                                    "type": "string"
                                }
                            }
                        },
                        "description": "data being ask ask to fetch"
                    }
                },
                "description": "{route_description}",
                "operationId": "get_data"
            }
        }
    },
    "openapi": "3.0.0",
    "servers": [
        {
            "url": "{server_url}"
        }
    ],
    "security": [],
    "components": {}
}