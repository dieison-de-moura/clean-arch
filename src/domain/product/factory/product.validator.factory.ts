import ValidatorInterface from "../../@shared/validator/validator.interface";
import Product from "../entity/product";
import ProductYupValidator from "../validator/product.yup.validator";

// Classe para criar a validação de Product sem gerar um forte acoplamento
// Assim podemos trocar o validador caso necessário, sem impactar nossa entidade
export default class ProductValidatorFactory {
    static create(): ValidatorInterface<Product> {
        return new ProductYupValidator();
    }
}