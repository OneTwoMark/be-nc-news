# Northcoders News API

[Hosted Version](https://marks-be-nc-news.onrender.com/api)

## Summary
This project is a news website backend API that allows users to access articles, post comments, and interact with various endpoints.

## Getting Started
### Cloning the repository
Clone the repository to your local machine. 

git clone https://github.com/OneTwoMark/be-nc-news.git

### Installing dependencies

npm install - to install project dependencies

### Setting up the database 

npm run setup-dbs 

### Environment variables

You need to create two .env files in the root directory of your project to configure the database connections.

#### .env.development
Create a file named .env.development with the following content:
PGDATABASE=nc_news

#### .env.test
Create a file named .env.test with the following content:
PGDATABASE=nc_news_test

### Seeding the local database

npm run seed

### Running Tests

npm test


## Minimum Versions
- **Node.js**: v14.x or higher (recommended), v10.x (minimum)
- **Postgres**: v12.x or higher 

## Scripts

Here are some useful npm scripts for managing the project:

Start the server: npm start

Seed production database: npm run seed-prod

Setup databases: npm run setup-dbs

Seed local database: npm run seed

Seed test database: npm run test-seed

Run tests: npm test

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
