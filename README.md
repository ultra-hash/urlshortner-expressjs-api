# urlshortner-expressjs-api
Develop URL shortener with KPI integration. Create concise links for large URLs, addressing customer needs for efficient redirection and tracking performance.

 ## Features
 - [x] generate shorturl for a longurl
 - [x] redirect from shoturl to a longurl
 - [x] track the details of the users ipaddress, browser, os who visited the shorturls
 - [x] create user
 - [ ] track changes to the user details
 - [ ] show analytics of each url
 - [ ] show analytics of a user's 


## Setup
> [!important]
> - rename the index.js.example file to index.js in config folder.
> - make necessary changes to the index.js file inside config folder.
> - create a database using the schema file

### Install Dependencies
- npm install

### Start Server
- node app.js


## End Points
Current implementation 

- List all users
  - `GET /user/`
- Create new user
  - `POST /user/`
- Get user details by query parameter (id, email, username, phoneNumber) 
  - `GET /user/user-details?email="testuser@test.com"`
- Create shortUrl for long url
  - `POST /url/`
- Redirect to LongUrl using shortUrl
  - `GET /url/:shortUrl`
- Get details of short url
  - `GET /url/url-details/:shortUrl`
