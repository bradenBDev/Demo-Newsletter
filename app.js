// IMPORT MODULES
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
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

    const url = "https://us2.api.mailchimp.com/3.0/lists/78186d2534";

    const options = {
        method: "POST",
        auth: "randomstring:e76499c62bb09b219f34efaf9299143e-us2"
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


// API Key
// e76499c62bb09b219f34efaf9299143e-us2

// List ID
// 78186d2534