// por padrão, uma entidade deve se auto-validar
// entidade focada no negócio
import Address from "../value-object/address";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerAddressChangedEvent from "../event/customer-address-changed.event";
import SendConsoleLogWhenCustomerAddressIsChangedHandler from "../event/handler/send-console-log-when-customer-address-is-changed.handler";
import Entity from "../../@shared/entity/entity.abstract";
import NotificationError from "../../@shared/notification/notification.error";

export default class Customer extends Entity{
    private _name: string = "";
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        super();
        this._id = id;
        this._name = name;
        this.validate();

        if (this.notification.hasErrors()) {
            throw new NotificationError(this.notification.getErrors());
        }
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    get Address(): Address {
        return this._address;
    }

    get active(): boolean {
        return this._active;
    }

    validate() {
        if (this._id.length === 0) {
            this.notification.addError({
                context: "customer",
                message: "Id is required",
            });
        }
        if (this._name.length === 0) {
            this.notification.addError({
                context: "customer",
                message: "Name is required",
            });
        }
    }

    // dica: não utilizar métodos setters, alterar por exemplo para 'changeName'
    // e aplicar validações referente a regra de negócio
    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLogWhenCustomerAddressIsChangedHandler();

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        const customerAddress = {
            id: this.id,
            name: this.name,
            address: this.addressToString(),
        }
        const customerAddressChangedEvent = new CustomerAddressChangedEvent(customerAddress);
        eventDispatcher.notify(customerAddressChangedEvent);
    }

    isActive(): boolean {
        return this._active;
    }

    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    set Address(address: Address) {
        this._address = address;
    }

    addressToString(): string {
        return `${this._address._street}, ${this._address._number}, ${this._address._city} - ${this._address._zip}`;
    }
}