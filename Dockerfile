# Dockerfile
# node:24-alpine keeps the runtime small: the full node image ships build tools
# (imagemagick, curl dev headers, perl) that accounted for most critical CVEs.
FROM node:24-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install only runtime dependencies from the lockfile
RUN npm ci --omit=dev && npm cache clean --force

COPY server.js .

# Run as the unprivileged user provided by the node image
USER node

EXPOSE 8080
CMD [ "node", "server.js" ]
