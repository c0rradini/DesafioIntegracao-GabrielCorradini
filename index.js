require('dotenv').config()

const express = require('express')
const app = express()
const {google} = require('googleapis')
const sheets = google.sheets('v4');
const hubspot = require('@hubspot/api-client')
const url = require('url');

app.get('/sync', async (req, res) => {

    const hubspotClient = new hubspot.Client({apiKey: process.env.API_HUBSPOT})

    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })

    const client = await auth.getClient()
    const googleSheet = google.sheets({version: 'v4', auth: client})
    const spreadSheetId = process.env.ID_SHEETS

    const range = 'A:E'

    const sheetData = {
        auth, spreadSheetId, range
    }

    const getSheetData = await googleSheet.spreadsheets.values.get(sheetData).then(function (columnData) {

        columnData.data.values.forEach(async function (item) {

            const COL_company = 0
            const COL_firstname = 1
            const COL_email = 2
            const COL_phone = 3
            const COL_website = 4

            let properties = {
                "company": item[COL_company],
                "firstname": item[COL_firstname],
                "email": item[COL_email],
                "phone": item[COL_phone],
                "website": item[COL_website]
            }

            const email_hub = item[COL_email]
            const email_hut_whost = email_hub.substring(email_hub.indexOf('@') + 1)

            const website_hub = item[COL_website]
            const website_hub_whost = website_hub.substring(website_hub.indexOf('') + 4)

            //const isEmailCorporacao = 

            if (email_hut_whost === website_hub_whost) {

                try {
                    const apiResponse = await hubspotClient.crm.contacts.basicApi.create({properties});
                    console.log(item[COL_company] + " Cadastrado.")
                } catch (e) {
                    console.log(item[COL_company] + " Já cadastrado.")
                }
            } else {
                console.log(item[COL_email] + " Não foi possível cadastrar pois o e-mail não é da sua corporação.")
            }
        })

    })
    res.send("Sincronizado!")
})
app.listen(process.env.PORT)