# Storefront Backend Project

## Introduction : 
To complete this project following technologies are used. 
1. Express
2. Node.js
3. TypeScript
4. Jasmine
5. PostegreSQL

## Getting Started :
                    
### Node                    
 To get started, first step is to install packages using "npm install"

### DataBase :

1. Install postgres and docker
2. run "npm run db" to start database. It runs on port:`5432`
3. "db-migrate db:create full_stack_test" to create test database
4. "db-migrate db:create full_stack_dev" to create dev database
5. Database resetting can be done with: `db-migrate reset`
6. Database initializing can be done with: `db-migrate up`

### Testing :

1. After starting the database run "npm run test".
2. It starts the jasmine and create the tables test it and then drops the tables

### Starting the server :

run "npm run start" to start the server

The database runs on port : `5432`

base url is `http://localhost:3000`

### .env file :
following code should be present in .env file

"POSTGRES_HOST=127.0.0.1
POSTGRES_DB=full_stack_dev
POSTGRES_USER=postgres
POSTGRES_PASSWORD=adithya0602
POSTGRES_DB_TEST=full_stack_test

ENV=dev
BCRYPT_PASSWORD=somePassword
SALT_ROUNDS=11
PEPPER=APPABITP3PP3r
TOKEN_SECRET=SeCReTTokEn"

## As user admin 

The id and password to use are as follows :
1. user_id : 1
2. password : 0602