import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Harry Potter",
                price: 100,
            });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe("Harry Potter");
        expect(response.body.price).toBe(100);
    });

    it("should not create a product", async () => {
        const response = await request(app).post("/product").send({
            name: "Harry Potter",
            price: 0,
        });
        expect(response.status).toBe(400);
    });

    it("should list all product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Harry Potter",
                price: 100,
            });
        expect(response.status).toBe(201);
        const response2 = await request(app)
            .post("/product")
            .send({
                name: "Naruto",
                price: 39,
            });
        expect(response2.status).toBe(201);

        const listResponse = await request(app).get("/product").send();

        expect(listResponse.status).toBe(200);
        expect(listResponse.body.products.length).toBe(2);
        const product = listResponse.body.products[0];
        expect(product.name).toBe("Harry Potter");
        expect(product.price).toBe(100);
        const product2 = listResponse.body.products[1];
        expect(product2.name).toBe("Naruto");
        expect(product2.price).toBe(39);

    });

    it("should find a product", async () => {
        const response = await request(app)
            .post("/product")
            .send({
                name: "Harry Potter",
                price: 100,
            });
        expect(response.status).toBe(201);
        expect(response.body.id).toEqual(expect.any(String));

        const findProduct = await request(app).get(`/product/${response.body.id}`).send();
        expect(findProduct.status).toBe(200);
        expect(findProduct.body).toEqual({
            id: response.body.id,
            name: findProduct.body.name,
            price: findProduct.body.price,
        })
    });
});