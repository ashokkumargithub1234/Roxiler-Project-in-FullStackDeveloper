import { Component } from "react";
// import { TailSpin } from "react-loader-spinner";
// import Transactions from "./Components/Transactions";
// import Statistics from "./Components/Statistics";
// import BarChartComponent from "./Components/BarChart";
// import PieChartComponent from "./Components/PieChart";
import "./App.css";
/*
const apiStatusConstants = {
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
  initial: "INITIAL",
};

const months = [
  { value: "", displayText: "Select Month" },
  { value: "01", displayText: "January" },
  { value: "02", displayText: "February" },
  { value: "03", displayText: "March" },
  { value: "04", displayText: "April" },
  { value: "05", displayText: "May" },
  { value: "06", displayText: "June" },
  { value: "07", displayText: "July" },
  { value: "08", displayText: "August" },
  { value: "09", displayText: "September" },
  { value: "10", displayText: "October" },
  { value: "11", displayText: "November" },
  { value: "12", displayText: "December" },
];
*/

class App extends Component {
  componentDidMount() {
    this.getProductTransactionData();
  }
  getProductTransactionData = async () => {
    const apiUrl = `https://roxiler-systems-assignment.onrender.com/combined-response?month=06&s_query&limit=10&offset=0`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log(data);
  };

  render() {
    return (
      <div>
        <h1>Ashok</h1>
      </div>
    );
  }
}

export default App;
/*
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const format = require("date-fns/format");
const isMatch = require("date-fns/isMatch");
var isValid = require("date-fns/isValid");
const axios = require("axios");
const cors = require("cors");

const databasePath = path.join(__dirname, "RoxilerTransaction.db");

const app = express();
app.use(cors());
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
    createTable();
  } catch (error) {
    console.log(`DB Error:${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const createTable = async () => {
  const createQuery = `
    CREATE TABLE  IF NOT EXISTS ProductData(
        id INTEGER ,
        title TEXT,
        price TEXT,
        description TEXT,
        category TEXT,
        image TEXT,
        sold BOOLEAN,
        dateOfSale DATETIME
    );`;

  await database.run(createQuery);
};

app.get("/initialize-database", async (request, response) => {
  const url = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
  const responseData = await axios.get(url);
  const transactionData = await responseData.data;
  for (const productData of transactionData) {
    const insertQuery = `INSERT INTO ProductData(id,title,price,description,category,image,sold,dateOfSale)
        VALUES(?,?,?,?,?,?,?,?);`;

    await database.run(insertQuery, [
      productData.id,
      productData.title,
      productData.price,
      productData.description,
      productData.category,
      productData.image,
      productData.sold,
      productData.dateOfSale,
    ]);
  }
  response.send({ message: "Third Party Database Initialized Successfully" });
});

app.get("/transactions", async (req, res) => {
  const {
    selectedMonth = "",
    searchText = "",
    limit = 10,
    offset = 0,
  } = req.query;
  const monthValue = format(new Date(selectedMonth), "MM");
  const getTodoQuery = `
     SELECT
      *
    FROM
      ProductData
    WHERE
      (title LIKE '%${searchText}%' OR description LIKE '%${searchText}%' OR price LIKE '%${searchText}%')
      AND dateOfSale LIKE '%-${monthValue}-%'
      LIMIT ${limit} OFFSET ${offset}
      `;

  const totalSearchedItems = `
     SELECT
      count(id) as total
    FROM
      ProductData
    WHERE
      (title LIKE '%${searchText}%' OR description LIKE '%${searchText}%' OR price LIKE '%${searchText}%')
      AND dateOfSale LIKE '%-${monthValue}-%' 
      `;
  const todoQuery = await database.all(getTodoQuery);
  const totalItems = await database.get(totalSearchedItems);
  res.json({ transactionsData: todoQuery, totalItems });
});

app.get("/statistics", async (req, res) => {
  const { selectedMonth = "" } = req.query;
  const monthValue = format(new Date(selectedMonth), "MM");

  const total_sale_amt = await database.all(`
    SELECT 
    SUM(price) AS total_sale_amt
    FROM ProductData 
    WHERE dateOfSale LIKE '%-${monthValue}-%' and sold = 1;`);

  const total_sold_items = await database.all(`
    SELECT COUNT()AS Total_sold_items
        FROM 
    ProductData 
        WHERE  
    dateOfSale LIKE '%-${monthValue}-%' 
        and 
    sold = 1;`);

  const total_unsold_items = await database.all(`
    SELECT 
    COUNT()AS Total_unSold_items
        FROM 
    ProductData
    WHERE dateOfSale LIKE '%-${monthValue}-%' and sold = 0;`);
  res.send({ total_sale_amt, total_sold_items, total_unsold_items });
});

app.get("/bar-chart", async (req, res) => {
  const { selectedMonth } = req.query;
  const monthValue = format(new Date(selectedMonth), "MM");
  const barChartData = [];

  const priceRange = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: 10000 },
  ];

  for (let range of priceRange) {
    const total = await database.get(`SELECT 
            COUNT() AS count
        FROM 
        ProductData 
            WHERE 
        dateOfSale LIKE '%-${monthValue}-%' and price BETWEEN ${range.min} AND ${range.max};`);

    barChartData.push({
      priceRange: `${range.min}-${range.max}`,
      totalItems: total.count,
    });
  }

  res.send({ barChartData });
});

app.get("/pie-chart", async (req, res) => {
  const { selectedMonth } = req.query;
  const monthValue = format(new Date(selectedMonth), "MM");
  const pieChartData = await database.all(`
    SELECT 
    category,count(id) as items 
    FROM ProductData 
    WHERE dateOfSale LIKE '%-${monthValue}-%' 
    GROUP BY category;
  `);
  res.send({ pieChartData });
});

app.get("/combined-response", async (req, res) => {
  const {
    selectedMonth = "",
    searchText = "",
    limit = 10,
    offset = 0,
  } = req.query;

  const initializeDatabase = await axios.get(
    `https://roxiler-systems-assignment.onrender.com/initialize-database`
  );
  const initializeResponse = await initializeDatabase.data;

  const TransactionsData = await axios.get(
    `https://roxiler-systems-assignment.onrender.com/transactions?selectedMonth=${selectedMonth}&s_query=${searchText}&limit=${limit}&offset=${offset}`
  );
  const TransactionsResponse = await TransactionsData.data;

  const statisticsData = await axios.get(
    `https://roxiler-systems-assignment.onrender.com/statistics?selectedMonth=${selectedMonth}`
  );
  const statisticsResponse = await statisticsData.data;

  const barChartResponse = await axios.get(
    `https://roxiler-systems-assignment.onrender.com/bar-chart?selectedMonth=${selectedMonth}`
  );
  const barChartData = await barChartResponse.data;

  const pieChartResponse = await axios.get(
    `https://roxiler-systems-assignment.onrender.com/pie-chart?selectedMonth=${selectedMonth}`
  );
  const pieChartData = await pieChartResponse.data;

  const combinedResponse = {
    initialize: initializeResponse,
    listTransactions: TransactionsResponse,
    statistics: statisticsResponse,
    barChart: barChartData,
    pieChart: pieChartData,
  };

  res.send(combinedResponse);
});

module.exports = app;

*/
