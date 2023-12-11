### General Errors

| checks to perform  | status code       | error message   |
| ------------------ | ----------------- | --------------- |
| improper json body | 400 - bad request | bad json format |

### jwtToken

| checks to perform                  | status code                | error message       |
| ---------------------------------- | -------------------------- | ------------------- |
| if jwtToken not present in headers | 401 - unauthorized request | jwt Token required  |
| if jwtToken not valid              | 401 - unauthozied request  | jwt Token not Valid |
| if jwtToken expired                | 400 - bad request          | jwt Token expired   |

### Register User

| checks to perform             | status code       | error message               |
| ----------------------------- | ----------------- | --------------------------- |
| if username already exists    | 400 - bad request | user already exists         |
| if email already exists       | 400 - bad request | email already exists        |
| if phonenumber already exists | 400 - bad request | phone number already exists |

### Login User

| checks to perform               | status code       | error message                       |
| ------------------------------- | ----------------- | ----------------------------------- |
| if username and password matchs | 400 - bad request | username and password doesn't match |
| if username exists              | 400 - bad request | username dosn't exists              |

### Create Short Url

| checks to perform             | status code       | error message               |
| ----------------------------- | ----------------- | --------------------------- |
| if url not valid              | 400 - bad request | invalid long url            |
| if phonenumber already exists | 400 - bad request | phone number already exists |

### Redirect Short Url

| checks to perform           | status code              | error message         |
| --------------------------- | ------------------------ | --------------------- |
| if short url doesn't exists | 404 - resource not found | short url dont exists |

### Details of Short Url & Stats of short url

| checks to perform                    | status code              | error message                             |
| ------------------------------------ | ------------------------ | ----------------------------------------- |
| if short url doesn't exists          | 404 - resource not found | short url dont exists                     |
| if short url belongs to other user's | 403 - Forbidden reqeust  | access to requested resource is forbidden |
