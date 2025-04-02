FROM node:22.11.0-alpine

## Prepare frontend files
COPY --chown=root:root .next/standalone /opt/app
COPY --chown=root:root .next/static /opt/app/.next/static
COPY --chown=root:root .next/server /opt/app/.next/server
COPY --chown=root:root .next/types /opt/app/.next/types
COPY --chown=root:root public /opt/app/public

USER root

ENV NODE_ENV production

WORKDIR /opt/

EXPOSE 3000

CMD [ "node", "app/server.js" ]
