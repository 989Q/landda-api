# ExpressAPI Documentation

### Getting Started

Before running the application, make sure to install the required dependencies using `pnpm`

## Run Application 

Start with Express
```bash
pnpm i

pnpm dev
```

## Authentication

This project utilizes `NextAuth` for authentication, allowing users to log in using their email addresses. The following login credentials are available for testing purposes

**Admin Account**
- email: admin123@gmail.com

**User Account**
- email: user123@gmail.com

## Additional Resources

> config/config.ts, utils/Logging.ts, server.ts/mongoose

RESTful API using Node JS, MongoDB & Typescript IN-DEPTH [2022] 
- https://www.youtube.com/watch?v=72_5_YuDCNA&t=661s

## Installation

Make sure to have `pnpm` installed.
```bash
pnpm init 

pnpm i @types/node ts-node
pnpm i nodemon 

pnpm i express
pnpm i --save-dev typescript @types/express

pnpm i cors
pnpm i --save-dev @types/cors

pnpm i dotenv mongoose

# terminal
pnpm i chalk@^4.1.2

pnpm i jsonwebtoken
pnpm i --save-dev @types/jsonwebtoken

# aws-sdk & multer
dependencies:
+ @aws-sdk/client-s3 3.370.0
+ multer 1.4.5-lts.1

devDependencies:
+ @types/multer 1.4.7

# pnpm i @aws-sdk/s3-request-presigner

pnpm i stripe
```
