# CLIENT BUILD STAGE
FROM node:12-alpine as client

# Create app directory
WORKDIR /usr/src/client

# Copy just package.json and yarn.lock before doing install
# If nothing has changed between last build and this build
# for these files then docker is smart enough to use the last
# build for these next steps which saves on installing all
# dependencies
COPY client/package.json .
COPY client/yarn.lock .

# Install dependencies
RUN yarn --no-progress --frozen-lockfile --production

# Copy the rest of the application source before building
COPY client .

# Build app with webpack
RUN yarn build


# SERVER BUILD AND RUN STAGE
FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/server

# Copy just package.json and yarn.lock before doing install
# If nothing has changed between last build and this build
# for these files then docker is smart enough to use the last
# build for these next steps which saves on installing all
# dependencies
COPY server/package.json .
COPY server/yarn.lock .

# Install dependencies
RUN yarn --no-progress --frozen-lockfile --production

# Copy the rest of the server source
COPY server .

# Copy built dist from client build stage
COPY --from=client /usr/src/client/dist ./client/dist

EXPOSE 80

# Start the server
CMD [ "yarn", "start" ]
