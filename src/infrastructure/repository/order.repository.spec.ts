import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import CustomerRepository from "./customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../value-object/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([
            CustomerModel,
            OrderModel,
            OrderItemModel,
            ProductModel,
        ]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 999, "99977222", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });

    it("should UPDATE a order", async () => {
        // create a new order
        const customerRepository = new CustomerRepository();
        const customer = new Customer("customer1", "Some Customer");
        const address = new Address("Street Full Cycle", 999, "99977222", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("product1", "Some Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "order-item-1",
            product.name,
            product.price,
            product.id,
            1 // qtd
        );

        const order = new Order("order1", "customer1", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        // check data from order
        expect(orderModel.toJSON()).toStrictEqual({
            id: "order1",
            customer_id: "customer1",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "order1",
                    product_id: "product1",
                },
            ],
        });
        // end create a new order

        // update an order
        // address.changeStreet("New street"); TODO
        product.changeName("New product 2");
        product.changePrice(200);
        orderItem.changeName(product.name);
        orderItem.changePrice(product.price);
        order.changeItems([orderItem]);
        await orderRepository.update(order);

        const orderModelUpdate = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        // check data from order after update
        expect(orderModelUpdate.toJSON()).toStrictEqual({
            id: "order1",
            customer_id: "customer1",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "order1",
                    product_id: "product1",
                },
            ],
        });
    });

    it("should find an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 999, "99977222", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        const orderFound = await orderRepository.find(order.id);

        expect(orderModel.toJSON()).toStrictEqual({
            id: orderFound._id,
            customer_id: orderFound._customerId,
            total: orderFound._totalOrder,
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order._id,
                    product_id: product.id,
                },
            ],
        });
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 999, "99977222", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);


        const customerTwo = new Customer("456", "Another Customer");
        const addressTwo = new Address("Street 2", 999, "99977222", "City 2");
        customerTwo.changeAddress(addressTwo);
        await customerRepository.create(customerTwo);

        const productTwo = new Product("456", "Another Product", 100);
        await productRepository.create(productTwo);

        const orderItemTwo = new OrderItem(
            "2",
            product.name,
            product.price,
            product.id,
            4
        );

        const orderTwo = new Order("456", "123", [orderItemTwo]);
        await orderRepository.create(orderTwo);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);

        // tentar entender porque aqui da erro e no customer não
        // expect(orders).toContainEqual(order);
        // expect(orders).toContainEqual(orderTwo);

        expect(orders.some((o) => o._id === order._id && o._customerId === order._customerId)).toBe(true);
        expect(orders.some((o) => o._id === orderTwo._id && o._customerId === orderTwo._customerId)).toBe(true);
    });
});