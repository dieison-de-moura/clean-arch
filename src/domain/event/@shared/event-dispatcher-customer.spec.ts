import Address from "../../../value-object/address";
import Customer from "../../entity/customer";
import CustomerCreatedEvent from "../customer/customer-created.event";
import SendFirstConsoleLogHandler from "../customer/handler/send-first-console-log.handler";
import SendSecondConsoleLogHandler from "../customer/handler/send-second-cosole-log.handler";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests for customer", () => {

    it("should register a customer event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendFirstConsoleLogHandler();
        const eventHandler2 = new SendSecondConsoleLogHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandler2);
    });

    it("should unregister an customer event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendFirstConsoleLogHandler();
        const eventHandler2 = new SendSecondConsoleLogHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandler2);

        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler);
        eventDispatcher.unregister("CustomerCreatedEvent", eventHandler2);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
            0
        );
    });

    it("should unregister all event handlers 2", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendFirstConsoleLogHandler();
        const eventHandler2 = new SendSecondConsoleLogHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandler2);

        eventDispatcher.unregisterAll();

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
        ).toBeUndefined();
    });


    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendFirstConsoleLogHandler();
        const eventHandler2 = new SendSecondConsoleLogHandler();

        // fica "espiando" o eventHandler
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
        ).toMatchObject(eventHandler);
        expect(
            eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
        ).toMatchObject(eventHandler2);

        const customerCreatedEvent = new CustomerCreatedEvent({
            name: "Customer 1",
        });

        // Quando o notify for executado o SendFirstConsoleLogHandler.handle() deve ser chamado
        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should send console log when customer address is changed", () => {
        const customer = new Customer('123', 'Dieison');
        const address = new Address(
            'Street Address',
            999,
            '999999999',
            'Novo Hamburgo'
        );
        customer.changeAddress(address);
    });
});