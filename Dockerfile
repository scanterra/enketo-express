FROM node:8

ENV ENKETO_SRC_DIR=/srv/src/enketo_express

WORKDIR ${ENKETO_SRC_DIR}

RUN npm install -g grunt-cli@1.2.0 pm2@3.0.3

COPY . ${ENKETO_SRC_DIR}

RUN npm install --production

# Persist the `secrets` directory so the encryption key remains consistent.
RUN mkdir -p ${ENKETO_SRC_DIR}/setup/docker/secrets
VOLUME ${ENKETO_SRC_DIR}/setup/docker/secrets

EXPOSE 8005

CMD ["/bin/bash", "-c", "${ENKETO_SRC_DIR}/setup/docker/start.sh"]

