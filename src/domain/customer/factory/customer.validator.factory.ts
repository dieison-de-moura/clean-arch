import ValidatorInterface from "../../@shared/validator/validator.interface";
import Customer from "../entity/customer";
import CustomerYupValidator from "../validator/customer.yup.validator";

// Classe para criar a validação de Customer sem gerar um forte acoplamento
// Assim podemos trocar o validador caso necessário
export default class CustomerValidatorFactory {
    static create(): ValidatorInterface<Customer> {
        return new CustomerYupValidator();
    }
}