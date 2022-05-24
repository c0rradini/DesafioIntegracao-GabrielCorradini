require('dotenv').config()
const express = require('express')
const app = express()
const hubspot = require('@hubspot/api-client')
const {google} = require('googleapis');
const sheets = google.sheets('v4');

app.get('/sincroniza', (req, res) => {
    res.send('Hello World!')
    const hubspotClient = new hubspot.Client({ apiKey: process.env.YOUR_API_KEY })

})

app.listen(process.env.PORT)
