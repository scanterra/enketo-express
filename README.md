## Contenido

* [Informacion general](#informacion-general)
* [Tecnologias](#tecnologias)
* [Setup](#setup)

## Informacion General

Este repositorio es un clon del repositorio [ENKETO-EXPRESS](https://github.com/enketo/enketo-express/). Actualmente estamos usando la versión desde el tag: `1.70.1`(commit `8608e90a6e7a0285df3c95944b0857dcb16ece55`).
Los cambios realizados sobre este repositorio son:
- Implementación de branding específico de Scanterra, logos, fondos de pantalla.
- Arreglo en la generación de imágenes Docker

## Tecnologias

Las mismas utilizadas en [enketo-express](https://github.com/enketo/enketo-express):
- Pug@2.0.3
  - [requerimientos JS](package.json)

* Imagenes:
- [enketo-express](https://hub.docker.com/repository/docker/scanterra/kobotoolbox_enketo-express)

## Setup

La generación de imágenes solo utiliza el Dockerfile local del repositorio.
Recordar generar el archivo `config/config.json` o `config/.env` con las variables necesarias.

- Requerimientos:
    - [`Docker`](https://docs.docker.com/)
- Generar imágen `scanterra/kobotoolbox_enketo_express:latest`
    - `docker build -t scanterra/kobotoolbox_enketo_express:latest .`

## Referencias

- [README anterior](/README_OLD.md)
