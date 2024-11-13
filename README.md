### Problem Statement

Set up a project having APIs & frontend separately.
On the front end, there should be a sign-in & sign-up page.
After sign-up, the system should send a welcome email to the user and a randomly generated password to log in to the system later. You can use any preferred method for sending emails.
On successful login, there should be a simple dashboard showing the number of registered cars in your system.
Make a CRUD for categories e.g. Bus, Sedan, SUV, Hatchback, etc.
Make a CRUD for Cars where the user can select one of the categories from the dropdown & can have other fields like color, model, make, registration-no, etc.
Must use data tables for sorting & pagination.
Your system should be protected XSS & should have implemented JWT.
Each create & update module must have both front-end & back-end data validation.

### Frontend Briefing

React is used as frontend framework to develop highly user interactive web application. For main component styling library Ant Design is used that provides bunch of components out of the box like modals, cards, forms, tables. For making HttpCalls, Axios is used as main HttpClient.

User needs to create an account and login to use main features of the application. All routes are properly protected to restrict unauthorized access.

### Project Startup

- Node version >= 20.x.x
- NPM version >= 10.7.x

3. Install Node.js and NPM in your system.
4. Clone the repo from https://github.com/AownAli-SE/frontend-test-task
5. Install dependencies by executing command: npm install
6. Define all variables in .env file
7. Run project by executing command: npm run dev

### Important Packages Used

- React: Core package as a frontend framework
- Ant Design: CSS Library for styling and creating layouts
- Axios: HttpClient to make HTTP calls
- crypto-js: for encryption sensitive data like JWT token
- eslint: Ensures coding style best practices
- vite: build tool
