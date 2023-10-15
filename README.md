# urlshortner-expressjs-api
Develop URL shortener with KPI integration. Create concise links for large URLs, addressing customer needs for efficient redirection and tracking performance.


## Initial Setup
- rename the index.js.example file to index.js in config folder.
- make necessary changes to the index.js file inside config folder.
- create a database using the schema file

### Install Dependencies
- npm install

### Start Server
- node app.js


## Routes
Current implementation 

- List all users
  - GET /user/  
- Create new user
  - POST /user/
- Get user detaisl by query parameter (id, email, username, phoneNumber) 
  - GET /user/user-details?email="testuser@test.com"
- Create shortUrl for long url
  - POST /url/
- Get details of short url
  - GET /url/url-details/:shortUrl
