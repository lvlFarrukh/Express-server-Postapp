import mysql from "mysql2";

export const queryData = (query) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    });
    connection.connect(function (err) {
      if (err) throw err;
    });

    connection.query(query, function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        resolve(results);
      } else {
        console.log("No records found!");
        resolve("No records found!");
      }
    });

    connection.end();
  });
};
