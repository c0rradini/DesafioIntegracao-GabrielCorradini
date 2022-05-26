require('dotenv').config()
const express = require('express')
const app = express()
const {google} = require('googleapis')
const sheets = google.sheets('v4');
const hubspot = require('@hubspot/api-client')


app.get('/sync', async (req, res) => {

    const hubspotClient = new hubspot.Client({apiKey: process.env.API_HUBSPOT})

    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })

    const client1 = await auth.getClient()
    const googleSheet = google.sheets({version: 'v4', auth: client1})
    const spreadsheetId = process.env.ID_SHEETS

    const range = 'A:E'

    let cadastrados = []
    let naoCadastrados = []

    const sheetData = {
        auth, spreadsheetId, range
    }

    const getSheetData = await googleSheet.spreadsheets.values.get(sheetData).then(function (result) {

        result.data.values.forEach(async function (item) {
            //console.log(item)

            let properties = {
                "company": item[0], "firstname": item[1], "email": item[2], "phone": item[3], "website": item[4]
            }
            // console.log(properties)
            try {
                const apiResponse = await hubspotClient.crm.contacts.basicApi.create({properties});
                //res.send(apiResponse.body)
                //console.log(item[1] + " Cadastrado.")
                cadastrados.push(item[1])

            } catch (e) {
                //console.log(item[1] + " Não cadastrado.")
                naoCadastrados.push(item[1])
                // res.send(e.body)
                // e.message === 'HTTP request failed'
                //     ? console.error(JSON.stringify(e.response, null, 2))
                //     : console.error(e)
            }

        })

    })

    res.send("Sincronizado!")

})


// const BatchInputSimplePublicObjectInput = {
//     inputs: mapArray
// };

//  try {
//      const apiResponse = await hubspotClient.crm.contacts.batchApi.create(BatchInputSimplePublicObjectInput);
//      res.send(apiResponse.body);
//  } catch (e) {
//      res.send(e.body);
//
//      e.message === 'HTTP request failed'
//          ? console.error(JSON.stringify(e.response, null, 2))
//          : console.error(e)
// }

app.listen(process.env.PORT)

