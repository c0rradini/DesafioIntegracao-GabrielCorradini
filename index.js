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

            // Pegar item[4] parseURL dps de www.
            // Pegar item[2] parse dps do @+1 e comparar com o parseURL do item[4]
            // se for igual, cadastra, se não, erro.

            const email_hub = item[2]
            const email_hut_whost = email_hub.substring(email_hub.indexOf('@') + 1)
            //console.log(email_hut_whost)

            const website_hub = item[4]
            const website_hub_whost = website_hub.substring(website_hub.indexOf('') + 4)
            //console.log(website_hub_whost)

            if (email_hut_whost === website_hub_whost) {

                try {
                    const apiResponse = await hubspotClient.crm.contacts.basicApi.create({properties});
                    //res.send(apiResponse.body)
                    console.log(item[1] + " Cadastrado.")
                    //cadastrados.push(item[1])

                } catch (e) {
                    console.log(item[1] + " Já cadastrado.")
                    // naoCadastrados.push(item[1])
                    // res.send(e.body)
                    // e.message === 'HTTP request failed'
                    //     ? console.error(JSON.stringify(e.response, null, 2))
                    //     : console.error(e)
                }

            } else {
                console.log(item[2] + " Não foi possível cadastrar pois o e-mail não é da sua corporação.")
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

