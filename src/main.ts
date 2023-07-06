import Customer from "./domain/customer/entity/customer";
import OrderItem from "./domain/checkout/entity/order_item";
import Order from "./domain/checkout/entity/order";
import Address from "./domain/customer/value-object/address";

// agregado 1 - customer e address
let customer = new Customer("123", "Dieison de Moura");
const address = new Address("rua ts", 925, "99999999", "Novo Hamburgo");
customer.Address = address;
customer.activate();

// agregado 2 - order e item - agregado de objeto/entidade
const item1 = new OrderItem("1", "Teste 1", 10, "p1", 100);
const item2 = new OrderItem("2", "Teste 2", 15, "p2", 150);
const order = new Order("1", "123", [item1, item2]);

// agregado 2 se relaciona com agregado 1 através de ID "customerId"