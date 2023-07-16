import express, { Request, Response } from "express";
import CreateProductUseCase from "../../../usecases/product/create/create.product.usecase";
import ProductRepository from "../../product/repository/sequelize/product.repository";
import ListProductUseCase from "../../../usecases/product/list/list.product.usecase";
import FindProductUseCase from "../../../usecases/product/find/find.product.usecase";


export const productRoute = express.Router();

productRoute.post("/", async (req: Request, res: Response) => {
    const useCase = new CreateProductUseCase(new ProductRepository());
    try {
        const productDto = {
            name: req.body.name,
            price: req.body.price,
        };
        const output = await useCase.execute(productDto);
        res.status(201).send(output);
    } catch (err) {
        res.status(400).send(err);
    }
});

productRoute.get("/", async (req: Request, res: Response) => {
    const useCase = new ListProductUseCase(new ProductRepository());
    const output = await useCase.execute({});

    res.format({
        json: async () => res.send(output),
    });
});

productRoute.get("/:id", async (req: Request, res: Response) => {
    const useCase = new FindProductUseCase(new ProductRepository());
    const input = {
        id: req.params.id,
    }
    const output = await useCase.execute(input);

    res.format({
        json: async () => res.send(output),
    });
});