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
            
            const companyCol = 0
            const nameCol = 1
            const emailCol = 2
            const phoneCol = 3
            const websiteCol = 4

            let properties = {
                "company": item[companyCol],
                "firstname": item[nameCol],
                "email": item[emailCol],
                "phone": item[phoneCol],
                "website": item[websiteCol]
            }

            const domainEmail = email_hub.substring(emailCol.indexOf('@') + 1)
            const domainWebsite = website_hub.substring(websiteCol.indexOf('') + 4)

            //const isEmailCorporacao = domainEmail === domainWebsite
            //if (isEmailCorporacao) {

            if (domainEmail === domainWebsite) {
                try {
                    const apiResponse = await hubspotClient.crm.contacts.basicApi.create({ properties });
                    console.log(item[companyCol] + " Cadastrado.")
                } catch (e) {
                    console.log(item[companyCol] + " Já cadastrado.")
                }
            } else {
                console.log(item[emailCol] + " Não foi possível cadastrar pois o e-mail não é da sua corporação.")
            }
        })
    })
    res.send("Sincronizado!")
})
app.listen(process.env.PORT)