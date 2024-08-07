const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
const port = process.env.PORT || 8089;
const fs = require("fs");
const { MessagingResponse } = require("twilio").twiml;
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "familpps_ashish",
    password: "Ashish@123",
    database: "familpps_stanley_bbq_laser",
    // host: "localhost",
    // user: "root",
    // password: "",
    // database: "alex_event",
});

// Function to execute database queries
const executeQuery = (query, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(query, values, (err, results) => {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    });
};
// POST request for sending messages

app.post("/api/send-sms", async (req, res) => {
    const { to, from, body, id } = req.body;

    // Replace these with your Twilio credentials
    const accountSid = "AC450154e8d2737cf678f5fafab8520d6d";
    const authToken = "d46cdf2dda2555b38a9fd17fbb0d15fb";

    const client = require("twilio")(accountSid, authToken);

    client.messages
        .create({
            body: body,
            from: from,
            to: to,
        })
        .then(async (message) => {
            const query = `
          UPDATE user_data
          SET texttouser = JSON_SET(
              IFNULL(texttouser, '{"msg": "", "count": 0}'),
              '$.msg',
              ?,
              '$.count',
              IFNULL(JSON_UNQUOTE(JSON_EXTRACT(texttouser, '$.count')), 0) + 1
          )
          WHERE id = ?;
      `;
            const values = [body, id];
            const log = "Message details updated";

            await saveData(req, res, query, values, log);
            res.json({ messageSid: message.sid });
            console.log("Message sent and DB updated;");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});
// POST route to save data
app.post("/api/save", async (req, res) => {
    try {
        const data = req.body;
        const { canvasuri, name, email, itemname } = data;
        const filePath = __dirname + `/canvassophia/${name + Date.now()}.png`;

        const base64Data = canvasuri.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(filePath, base64Data, "base64", async (err) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                console.log("Connected to the database");
                var respath = filePath.replace(
                    "/home/familpps/public_html",
                    "https://familyindustriesapps.com"
                );
                const query = `INSERT INTO user_data (name, email, itemname, canvasuri) VALUES (?, ?, ?, ?)`;
                const values = [data.name, data.email, data.itemname, respath];

                await executeQuery(query, values);
                res.send("Entry updated");
            }
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// Function to handle saving data in a generic way
const saveData = async (req, res, query, values, log) => {
    try {
        console.log("Connected to the database");
        await executeQuery(query, values);
        console.log(log);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500); // Send an error response and return to exit the function
    }
};

// POST route to save SVG data
app.post("/api/savesvg", (req, res) => {
    const data = req.body;
    const { canvasuri, userDetails, timeDiff, itemname, customizeInfo } = data;
    const parseduserDetails = JSON.parse(userDetails);
    const parsedcustomizeInfo = JSON.parse(customizeInfo);
    const parseditemname = JSON.parse(itemname);
    console.log(parsedcustomizeInfo);
    const filePath =
        __dirname + `/canvas/${parseduserDetails.firstName + Date.now()}.svg`;
    console.log("Data received for", parseduserDetails.firstName);
    fs.writeFile(filePath, canvasuri, async (err) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            const respath = filePath.replace(
                "/home/familpps/public_html",
                "https://familyindustriesapps.com"
            );

            const query1 = `INSERT INTO user_data (userdetails, itemname,customizeInfo, canvasuri, usagetime, updationtime) VALUES (?, ?, ?, ?, ?,?)`;
            const values1 = [
                userDetails,
                itemname,
                customizeInfo,
                respath,
                timeDiff,
                new Date(),
            ];
            const log1 = "Data Inserted successfully !!";

            await saveData(req, res, query1, values1, log1);
            const query2 = `UPDATE inventory_list SET used_count = used_count + 1 WHERE img_name = ? and item_name=?`;
            const values2 = [parseditemname.type, parseditemname.color];
            const log2 = "Inventory used count updated";
            await saveData(req, res, query2, values2, log2);
            if (parsedItemDetails.selectedtype === "graphic") {
                const query3 = `UPDATE graphic_list SET graphic_used_count = graphic_used_count + 1 WHERE graphic_img_name = ?`;
                const values3 = [parsedItemDetails.selectedgraphic];
                const log3 = "Graphic count updated";

                await saveData(req, res, query3, values3, log3);
            }

            // If there was no error, you can send the success response here
            res.status(200).send("Entry updated");
        }
    });
});

// GET route to fetch data
app.get("/api/fetchdb", async (req, res) => {
    try {
        const query = `SELECT u.*, i.* FROM user_data AS u INNER JOIN inventory_list AS i ON u.itemname = i.img_name`;
        const result = await executeQuery(query, []);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

// GET route to fetch inventory data
app.get("/api/fetchinventory", async (req, res) => {
    const { type } = req.query;
    let params = [];
    try {
        let query = "SELECT * FROM inventory_list";
        if (type) {
            query += " WHERE item_name = ?";
            params.push(type);
        }
        const result = await executeQuery(query, params);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get("/", (req, res) => {
    res.send("Hey, it's Stanley Sophia");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
