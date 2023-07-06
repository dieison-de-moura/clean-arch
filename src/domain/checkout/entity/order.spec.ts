import OrderItem from "./order_item";
import Order from "./order"

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrowError("Id is required");
    })

    it("should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("123", "", []);
        }).toThrowError("CustomerId is required");
    })

    it("should throw error when item quantity is empty", () => {
        expect(() => {
            let order = new Order("123", "123", []);
        }).toThrowError("Items are required");
    })

    it("should calculate total", () => {
        expect(() => {
            const item = new OrderItem("1", "Item 1", 100, "p1", 2)
            const item2 = new OrderItem("2", "Item 2", 200, "p2", 2)
            const order = new Order("1", "123", [item]);

            let total = order.total();

            expect(total).toBe(200);

            const order2 = new Order("1", "123", [item, item2]);
            total = order2.total();
            expect(total).toBe(600);
        });
    })

    it("should throw error if the item quantity is less or equal 0", () => {
        expect(() => {
            const item = new OrderItem("1", "Item 1", 100, "p1",0)
            const order = new Order("1", "123", [item]);
        }).toThrowError("Quantity must be greater than 0");
    })
})