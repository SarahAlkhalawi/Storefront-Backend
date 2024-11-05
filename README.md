# Storefront Backend Project

## Set up
Install all dependencies: `npm install`

Start the docker container: `docker-compose up`

Run tests: `npm run test`

Start server: `npm run start`

Build: `npm run build`

## Environment variables

`POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront
POSTGRES_TEST_DB=storefront_test
POSTGRES_USER=full_stack_user
POSTGRES_PASSWORD=password123
ENV=test
BCRYPT_PASSWORD=my-secret-password
SALT_ROUNDS=10
TOKEN_SECRET=my-secret-token`

## Running Ports 
After start up, the server will start on port `3000` and the database on port `5432`

