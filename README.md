# Finia server

## Introduction

Finia is a way to simply manage your revenue and expenses, it is like a personal financial manager. Users can visualize and track their transactions through **graphs**, **analyzed information about your transactions** and, especially the **table** where you can add, update, and delete. It is also CSV Exportable so you can easily take out your transaction data through Excel.

## How to contribute

If you want to contribute here are the steps. I assume that you've already installed node and git.

### Environment Variables

```
PORT=3000
NODE_ENV=development

# Get it on redis
REDIS_SECRETKEY=
REDIS_HOST=
REDIS_PORT=

# Get it any postgres database
DATABASE_URL=

# This is where you need to set up your nodemailer
SECRET_EMAIL_PASSWORD=
SECRET_EMAIL=
SECRET_PROTOCOL="http://"
SECRET_DOMAIN="localhost:3000"

# The front-end route for redirecting what page should your user will be on
# When they verified their email and resetting their password
SECRET_LOGIN_ROUTE=
SECRET_RESET_PASS_ROUTE=

# Secret for tokens
REFRESH_TOKEN_SECRETKEY=
ACCESS_TOKEN_SECRETKEY=
EMAIL_VERIFICATION_SECRETKEY=
PASSWORD_RESET_SECRETKEY=

# For creating randomize ids
SET_ID_CHARACTERS=""

# Front-end Base URL
CLIENT_BASE_URL="http://localhost:3000"

# For Admin
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_EMAIL_ADDRESS=

```

### Configuration

1. Download [Docker Desktop](https://www.docker.com/)
   - It will easily help the problem _"But it works on my computer?"_.
   - It will containerize the server so that it will ensure that it will work on any OS.
   - If you want to know more, checkout [Docker](https://www.docker.com/).
2. Download [Act CLI](https://github.com/nektos/act)
   - It will test out github actions locally
3. Configure Database URL
   - As already mentioned above you need to get a postgres database URL first.
4. Configure [Redis](https://redis.io/)
   - You also need Redis for this, it is a in memory storage for faster retrieval.
5. Configure [Nodemailer](https://nodemailer.com/)
   - For sending emails easily, we use this for email verification and resetting passwords.

### Installation

1. Install Packages
   - `npm install`
2. Build
   - `npm run build:dev`
3. Seed the database
   - `npm run seed`
4. Test
   - `npm run test`
5. Run it on Docker
   - `docker compose up`
   - If you are no longer using it `docker compose down`.

## Why did I do this?

As a developer, I want to learn about [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). I tried my best to basically do this, and it would be really helpful if you contribute and criticize about my code and logic.
