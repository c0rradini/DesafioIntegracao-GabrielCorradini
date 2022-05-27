const request = require("supertest");
const app = require("./index");

describe("Teste para sincronização.", () => {
    test("Testa se Google Sheets e HubSpot estão sincronizando.", async () => {
        const response = await request(app).get("/sync");
        expect(response.statusCode).toBe(200);
    });
});