const express = require("express");
const mysql = require("mysql");

const app = express();

const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());


app.listen(PORT, () => {
  console.log(
    "Express server is running at port http://localhost:3000/: " + PORT
  );
});

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "kartngo_db",
});

connection.connect((err) => {
  if (!err) {
    console.log("DB connection succeded");
  } else {
    console.log("DB connection failed: " + JSON.stringify(err, undefined, 2));
  }
});

app.get("/fetch-all-Branches", (req, res) => {
    connection.query("SELECT * FROM branches", (err, rows, fields) => {
      if (err) {
        console.error("Error fetching branches: ", err);
        res.status(500).send("Error fetching branches");
      } else {
        console.log("Fetched branches: ", rows); // طباعة الصفوف التي تم جلبها
        res.json(rows);
      }
    });
  });
  


app.post("/create", (req, res) => {
    const { branchID, branchName, city, paymentLink, merchandiser } = req.body;
    const query = `
        INSERT INTO branches (ID, BRANCH_NAME, CITY, PAYMENT_LINK, MERCHANDIZER) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [branchID, branchName, city, paymentLink, merchandiser];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error("Error inserting data: ", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json({ success: true, data: results });
        }
    });
});



app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM branches WHERE ID = ?`;

    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error deleting data: ", err);
            res.status(500).send("Internal Server Error");
        } else if (results.affectedRows > 0) {
            res.status(200).json({ success: true, message: "Branch deleted successfully" });
        } else {
            res.status(404).json({ success: false, message: "Branch not found" });
        }
    });
});







app.put("/update/:id", (req, res) => {
    const branchID = req.params.id;
    const { branchName, city, paymentLink, merchandizer } = req.body;
    const query = `
        UPDATE branches 
        SET BRANCH_NAME = ?, CITY = ?, PAYMENT_LINK = ?, MERCHANDIZER = ?
        WHERE ID = ?
    `;
    const values = [branchName, city, paymentLink, merchandizer, branchID];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error("Error updating data: ", err);
            res.status(500).send("Internal Server Error");
        } else {
            res.status(200).json({ success: true, message: "Branch updated successfully" });
        }
    });
});






process.on('SIGINT', () => {
    connection.end((err) => {
      if (err) {
        console.error('Error closing the database connection:', err);
      } else {
        console.log('Database connection closed.');
      }
      process.exit(0);
    });
  });
  

