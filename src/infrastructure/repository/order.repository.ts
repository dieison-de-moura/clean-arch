import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";

export default class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        try {
            await OrderModel.create(
                {
                    id: entity.id,
                    customer_id: entity.customerId,
                    total: entity.total(),
                    items: entity.items.map((item) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        product_id: item.productId,
                        quantity: item.quantity,
                    })),
                },
                {
                    include: [{ model: OrderItemModel }],
                }
            );
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }

    }

    async update(entity: Order): Promise<void> {
        // update order data
        try {
            await OrderModel.update(
                {
                    customer_id: entity.customerId,
                    total: entity.total(),
                },
                {
                    where: {
                        id: entity.id
                    },
                }
            );
            //update data order items
            await this.updateOrderItems(entity, entity.items);
        } catch (error) {
            throw new Error(`Ops! Something went wrong: ${error}`);
        }
    };
    async find(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne(
                {
                    where: { id },
                    include: ["items"],
                    rejectOnEmpty: true,
                }
            );
        } catch (error) {
            throw new Error("Order not found");
        }

        const orderItems = orderModel.items.map((item) =>
            new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
        )

        let order = new Order(orderModel.id, orderModel.customer_id, orderItems);
        order._totalOrder = order.total();

        return order;
    };

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({include: ["items"]});

        const result = orderModels.map((orderModel) => {
            const orderItems = orderModel.items.map((item) =>
                new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
            )

            let order = new Order(orderModel.id, orderModel.customer_id, orderItems);
            order._totalOrder = order.total();

            return order;
        })

        return result;
    };

    async updateOrderItems(order: Order, items: OrderItem[]): Promise<void> {
        // Removing existing items before upgrading
        await OrderItemModel.destroy({
            where: {
                order_id: order.id,
            },
        });

        // add new order items
        await OrderItemModel.bulkCreate(
            items.map((item) => ({
                order_id: order.id,
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
            }))
        );
    }
}