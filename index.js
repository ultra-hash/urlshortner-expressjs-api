const express = require('express');
const app = express()
app.use(express.json())

const sqlite = require('sqlite3');



let db = null;

// SQL QUERIES START
const CREATE_URLS_TABLE = `CREATE TABLE urls (
short_url, 
    long_url
);`;

const INSERT_INTO_TABLE =  `INSERT INTO urls (short_url, long_url) VALUES (?, ?)`;

// SQL QUERIES END



const initDbAndStartServer =  async () => {
    try {
        db = new sqlite.Database(':memory:', sqlite.OPEN_READWRITE, (err) => {
            if (err) console.log(err);
        })

        db.run(CREATE_URLS_TABLE)
        app.listen(4000)
    } catch(e) {
        console.log(e)
        process.exit(1)
    }
}

initDbAndStartServer()


function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
}
  


app.post('/shrink/', (request, response) => {
    const {long_url} = request.body
    console.log(request.body)
    const short_url = generateRandomString(8)
    db.run(INSERT_INTO_TABLE, [short_url, long_url])    
    response.send({status: 200, short_url, long_url, message: 'shorturl stored successfully'})
})



//get all the urls combos
app.get('/all/', async (request, response) => {
    db.all('SELECT * FROM urls', [], (err, row) => {
        let listOfUrls = row
        response.send(listOfUrls)
    })
})


app.get('/r/:short_url/', (request, response) => {
    const {short_url} = request.params
    db.get('SELECT long_url from urls WHERE short_url Like (?)', [short_url], (err, row) => {
        response.redirect(row.long_url)
    } )
})