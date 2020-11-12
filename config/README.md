## Configuration
==============

Ver el documento con la información de configuración del sistema. [DOC ANTERIOR](./README_OLD.md)

Configuración de variables de entorno de ejemplo: [sample.env](./sample.env).

Configuración en formato json, `config.json` ejemplo:

```
- app name: "app_name"
- redis:
    - cache:
        - host: redis-cache
        - port: 6380
    - main:
        - host: redis-main
        - port: 6379
- linked form and data server:
    - api key: "enketoapitoken",
    - server url: "",
    - name: "KoBo Toolbox"
```
