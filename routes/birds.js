var express = require('express');
var router = express.Router();
var mysql = require('mysql2');
var dotenv = require('dotenv');
dotenv.config()

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}).promise()

async function getData() {
  const [rows] = await pool.query("SELECT * FROM birds")
  return rows
}

async function getBirdLatest() {
  const dataList = []
  const [row] = await pool.query(`
    SELECT *
    FROM birds
    ORDER BY id DESC
    LIMIT 1;
    `)
  row.map((val, key) => (
    dataList.push(val.created, val.bird, val.lat, val.lon)
  ));
  return dataList
}

async function insertBirdData(bird, lat, lon) {
  const result = await pool.query(`
    INSERT INTO birds (bird, lat, lon)
    VALUES (?, ?, ?)
    `, [bird, lat, lon])
  return result
}

/* GET latest bird data. */
router.get('/latest', async function (req, res, next) {
  const birdData = await getBirdLatest();
  res.json({
    data: birdData
  });
});

/* GET all bird data. */
router.get('/', async function (req, res, next) {
  const birdData = await getData()
  res.json({
    data: birdData
  });
});

/* POST bird data entry */
router.post('/', async function (req, res, next) {
  const { bird, lat, lon } = req.body
  const birdData = await insertBirdData(bird, lat, lon)
  res.status(201).send(birdData)
});

module.exports = router;
