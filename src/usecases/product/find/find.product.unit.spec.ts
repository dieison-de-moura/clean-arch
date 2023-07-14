import Product from "../../../domain/product/entity/product";
import FindProductUseCase from "./find.product.usecase";

const product = new Product("123", "Product One", 100);

const MockRepository = () => {
    return {
        find: jest.fn().mockReturnValue(Promise.resolve(product)),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    };
};

describe("Unit Test find product use case", () => {
    it("should find a customer", async () => {
        const productRepository = MockRepository();
        const useCase = new FindProductUseCase(productRepository);

        const input = {
            id: "123",
        };

        const output = {
            id: "123",
            name: "Product One",
            price: 100,
        };

        const result = await useCase.execute(input);

        expect(result).toEqual(output);
    });

    it("should not find a Product", async () => {
        const productRepository = MockRepository();
        productRepository.find.mockImplementation(() => {
            throw new Error("Product not found");
        });
        const useCase = new FindProductUseCase(productRepository);

        const input = {
            id: "123",
        };

        expect(() => {
            return useCase.execute(input);
        }).rejects.toThrow("Product not found");
    });
});