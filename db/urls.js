module.exports = (config) => {
  const mysqlClient = config.mysql.client;

  async function getRowByShortUrl(shortUrl) {
    const [row] = await mysqlClient.query(
      `SELECT * FROM urls WHERE short_url =  ?`,
      [shortUrl]
    );
    return row[0];
  }

  async function getRowByLongUrl(userId, longUrl) {
    const [row] = await mysqlClient.query(
      `SELECT * FROM urls WHERE user_id = ? and long_url = ?`,
      [userId, longUrl]
    );
    return row[0];
  }

  async function addNewShortUrl(userId, shortUrl, longUrl) {
    const [row] = await mysqlClient.query(
      `INSERT INTO urls (user_id, long_url, short_url) VALUES (?, ?, ?)`,
      [userId, longUrl, shortUrl]
    );
    return row;
  }

  async function getUrlsByUsername(username) {
    const [rows] = await mysqlClient.query(
      `SELECT * FROM urls where user_id = (SELECT id FROM users WHERE username = ?)`,
      [username]
    );
    return rows;
  }

  return {
    getRowByShortUrl,
    getRowByLongUrl,
    addNewShortUrl,
    getUrlsByUsername,
  };
};
