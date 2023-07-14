import { Sequelize } from "sequelize-typescript";
import Product from "../../../domain/product/entity/product";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";

describe("Unit test for listing products use case", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should list a product", async () => {
        const productRepository = new ProductRepository();
        const useCase = new ListProductUseCase(productRepository);
        const product = new Product("1", "Product 1", 100);
        await productRepository.create(product);

        const product2 = new Product("2", "Product 2", 200);
        await productRepository.create(product2);

        const foundProducts = await useCase.execute({});

        const output = {
            products: [
                {
                    id: "1",
                    name: "Product 1",
                    price: 100,
                },
                {
                    id: "2",
                    name: "Product 2",
                    price: 200,
                }]
        };

        expect(foundProducts).toEqual(output);
    });
});