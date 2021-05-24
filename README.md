# cheeseformice (cheese.formice.com)

Website for cheese.formice.com

## Install the dependencies

```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
npm run lint
```

### Build the app for production

```bash
quasar build
quasar serve --silent dist/spa
```

### Customize the configuration

See [Configuring quasar.conf.js](https://v2.quasar.dev/quasar-cli/quasar-conf-js).

## Running with the backend stack

First you need to create a `frontend` network with the following command

```bash
docker network create --attachable --driver bridge frontend
```

Once that is done, that will allow you to connect this service to the [backend](https://github.com/cheeseformice/cheese.formice.com) nginx reverse proxy.

To start the service, just run

```bash
docker-compose up --build --detach
```

To check the logs, just run

```bash
docker-compose logs --follow
```
