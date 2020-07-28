![CI build](https://github.com/MappedIn/contact-monitoring-dashboard/workflows/CI/badge.svg)

# Contact Monitoring Dashboard

1. [Setup](#Setup)
2. [Scripts](#scripts)
3. [Dependencies](#dependencies)

[](#Setup)

# Setup

### Basic Setup

##### Basic environment variables

-   [ ] `cp ./.env.example ./.env`
-   [ ] populate `MONGO_CONNECTION_URL` with the connection string for your database.
-   [ ] populate `MAPPEDIN_VENUE_SLUGS` with a comma separated string of venue slugs. The first in the list will be used as the default slug. (Alternatively, try the prepopulated demo venue!)
-   [ ] populate `MAPPEDIN_API_KEY` and `MAPPEDIN_API_SECRET` with your credentials from mappedin, to allow the dashboard to load your venue's map from the mappedin API. (Alternatively, try the prepopulated demo credentials!)

##### Auth0 setup and environment variables

-   [ ] Create a free account at auth0.com, if you do not already have one.
-   [ ] On the Auth0 dashboard, click "Applications" and create an app with type "Single Page Web Application".
-   [ ] Copy the Domain, Client ID, and Client Secret values and assign them to the appropriate variables in your new `.env` file.
-   [ ] Populate "Allowed Callback URLs" on the auth0 application settings page. For localhost use `http://localhost:8080/, http://localhost:8080/redirect, http://localhost:8080/refresh-token` (use actual domain in production).
-   [ ] Populate "Allowed Logout URLs" on the auth0 application settings page. For localhost use `http://localhost:8080` (use actual domain in production).
-   [ ] Populate "Allowed Web Origins" on the auth0 application settings page. For localhost use `http://localhost:8080` (use actual domain in production). Pro tip: don't put a `/` on the end of the web origin, it won't work.
-   [ ] Click the "Connections" tab in your application. Verify that only one Database is enabled under the "Database" heading. No action should be required. If more than one database is enabled, logins with the correct username/password may fail.
-   [ ] Recommended: on the same "Connections" tab, disable any social login options under "Social", to prevent arbitrary people from gaining access to the contact monitoring dashboard.
-   [ ] Recommended: click the toplevel "Connections" -> "Database" menu, and select your database (the only one if you created a new Auth0 account). Turn on the "Disable Sign Ups" option, to prevent arbitrary people from gaining access to the contact monitoring dashboard.
-   [ ] On the Auth0 dashboard under "Users & Roles" -> "Users", click the "Create User" button, and create a user. If you're using an existing Auth0 account with multiple connections, make sure you choose the one that's enabled for this application.
-   [ ] On the auth0 dashboard, click "APIs", then "Create API". Choose a name, an identifier (suggestion: "https://contact-monitoring.example.com"), and RS256. Click "Create".
-   [ ] Paste the identifier you chose into your `.env` file under `AUTH0_AUDIENCE`.

##### Install dependencies and start dev mode

-   [ ] `yarn` to install all dependencies.
-   [ ] `yarn dev` and open `http://localhost:8080` in browser assuming you didn't change the `PORT` in your `.env`.
-   [ ] Use the username and password you created on the Auth0 dashboard to log in.

### Production Setup

For deployment of the live system, a Dockerfile is provided as a common format compatible with many infrastructure setups. A minimal setup for deployments without existing infrastructure should at least include something like an nginx reverse proxy for SSL termination: the node server in this repo is not intended to be exposed directly to the internet, so running in in that fashion may not be secure.

[](#scripts)

# Scripts

### Installing Dependencies

`yarn`
Installs developer dependencies in the root directory, then installs server dependencies in the ./server directory, then installs client dependencies in the ./client directory.

`yarn server`
Installs server dependencies and alias to the server sub project. This lets you call scripts in server like: `yarn server test` or `yarn server lint`, also simply calling `yarn server` will install the server's dependencies. To add new dependencies to server you can do `yarn server add [options] [new dependency]`

`yarn client`
Installs client dependencies and alias to the client sub project. This lets you call scripts in client like: `yarn client test` or `yarn client lint`, also simply calling `yarn client` will install the client's dependencies. To add new dependencies to client you can do `yarn client add [options] [new dependency]`

### Development Server

`yarn dev`
Runs development server which runs webpack-dev-server and watches for client code changes to automatically rebuild and refresh the page. It also runs the server with nodemon which watches for server changes and restarts the server for you.

Note: This does not run this application in an environment that resembles a production environment in any way. It is meant to allow fast code iteration for a better developer experience. Once you've finished developing a feature or fixing a bug you should re-test locally using a production-like environment (see below)

### Production Docker Testing

(recommended over using Production Build and Server below)

`yarn docker`

This is the best way as a developer to test the application as if it was running in production. It is an alias for `yarn docker:build && yarn docker:dev`

`yarn docker:build`

Builds the docker image

`yarn docker:dev`

This requires that you have previously run `yarn docker:build`. It starts a new docker process using the latest image using flags `-it --rm` which starts the container in foreground mode and when you quit it automatically, this also removes the container which makes it easy to re-run everything without cleaning it up first. Uses `--env-file ./.env` to run the image using our defined environment variables.

### Production Build and Server

`yarn client build`

Builds the client dist in production mode.

`yarn start`

Starts the service in production mode. It is up to you to make sure environment variables are defined.

Because this is not exactly how things run in production, it is still recommended that developers use the docker commands to confirm their changes will work on production before opening any PR.

### Tests

Testing is split from server and client so they can both have separate code coverage requirements

`yarn server test`

Tests the server using jest. You can pass flags in as if you were running `jest` directly (e.g. `yarn server test --watch` is equivelant to `jest --watch` for watching server files and re-running tests for you).

`yarn server lint`

Runs the linter against server files

The client has similar scripts that can be accessed using `yarn client`

`yarn client test`

Same as on the server; it is an alias to jest.

`yarn client lint`

Runs client source code linting on the javascript and the CSS/SCSS/LESS files

Finally,

`yarn ci:test`

Runs all the linting and all the tests on the server and the client. You **cannot** treat this like an alias to jest.

[](#dependencies)

# Dependencies

-   node: 12.x
-   yarn: 1.x
-   docker
