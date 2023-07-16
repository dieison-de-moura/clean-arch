import express, { Request, Response } from "express";
import CustomerRepository from "../../customer/repository/sequelize/customer.repository";
import CreateCustomerUseCase from "../../../usecases/customer/create/create.customer.usecase";
import ListCustomerUseCase from "../../../usecases/customer/list/list.customer.usecase";

export const customerRoute = express.Router();

customerRoute.post("/", async (req: Request, res: Response) => {
    const useCase = new CreateCustomerUseCase(new CustomerRepository());
    try {
        const customerDto = {
            name: req.body.name,
            address: {
                street: req.body.address.street,
                city: req.body.address.city,
                number: req.body.address.number,
                zip: req.body.address.zip,
            },
        };
        const output = await useCase.execute(customerDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

customerRoute.get("/", async (req: Request, res: Response) => {
    const useCase = new ListCustomerUseCase(new CustomerRepository());
    const output = await useCase.execute({});

    res.format({
        json: async () => res.send(output),
    });
});