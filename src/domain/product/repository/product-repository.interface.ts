import Product from "../entity/product";
import RepositoryInterface from "../../@shared/repository/repository-interface";

export default interface ProductRepositoryInterface extends RepositoryInterface<Product> {
    // método apenas no contexto de produto
    // findByName(name: string): Promise<Product>;
}