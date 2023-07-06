import Product from "../entity/product";

export default class ProductService {

    // utilizado somente em testes, para alteração em grande escala deve ser utilizado
    // outra solução, como rotina, por exemplo
    static increasePrice(products: Product[], percentage: number): Product[] {
        products.forEach((product) => {
            product.changePrice((product.price * percentage) / 100 + product.price);
        });
        return products;
    }
}