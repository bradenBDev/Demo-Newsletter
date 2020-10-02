// IMPORT MODULES
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

// INITIALIZE EXPRESS AND SET A PORT
const app = express();
const port = 3000;

// TELL EXPRESS TO USE BODY-PARSER AND SET STATIC FOLDER
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// HOMEPAGE

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us2.api.mailchimp.com/3.0/lists/" + process.env.MAILCHIMP_LIST_ID;

    const options = {
        method: "POST",
        auth: "randomstring:" + process.env.MAILCHIMP_API_KEY
    };

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            const responseFromMC = JSON.parse(data);
            const errorCount = responseFromMC.error_count;

            if (response.statusCode === 200 && errorCount < 1) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }

            console.log(responseFromMC);
        });
    });

    request.write(jsonData);
    request.end();
});


// START SERVER

app.listen(process.env.PORT || port, function () {
    console.log("Server running on port " + port);
});