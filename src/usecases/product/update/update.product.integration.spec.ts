import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.usecase";
import CreateProductUseCase from "../create/create.product.usecase";

describe("Integration test update Product integration use case", () => {
    let sequileze: Sequelize;

    // iniciando a conexão com o banco
    beforeEach(async () => {
        sequileze = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequileze.addModels([ProductModel]);
        await sequileze.sync();
    });

    afterEach(async () => {
        await sequileze.close();
    });

    it("Integration test - should UPDATE a product", async () => {
        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);

        const productUpdateUseCase = new UpdateProductUseCase(productRepository);
        const productCreateUseCase = new CreateProductUseCase(productRepository);

        const productCreated = await productCreateUseCase.execute(product);

        expect(productCreated).toEqual({
            id: expect.any(String),
            name: "Product 1",
            price: 100,
        });

        product.changeName("Product integration teste update");
        product.changePrice(214);

        const input = {
            id: productCreated.id,
            name: product.name,
            price: product.price,
        }

        const output = await productUpdateUseCase.execute(input);

        expect(output).toEqual({
            id: expect.any(String),
            name: "Product integration teste update",
            price: 214,
        });
    });
});