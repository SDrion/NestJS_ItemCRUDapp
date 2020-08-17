import { Injectable, NotFoundException } from "@nestjs/common";

import { Product } from './product.model';

@Injectable()
export class ProductsService {
    products: Product[] = [];

    insertProduct(title: string, desc: string, price: number) {
        const ProdId = Math.random().toString();
        const newProduct = new Product(ProdId, title, desc, price);
        this.products.push(newProduct);
        return ProdId;
    }

    getProducts(): Product[] {
        return [...this.products];
    }

    getSingleProduct(productId: string) {
        const product = this.findProduct(productId)[0];
        return {...product};
    }

    updateProduct(productId: string, title: string, desc: string, price: number){
        const [product, index] = this.findProduct(productId);
        const updatedProduct = {...product};
        if(title) {
            updatedProduct.title = title;
        }
        if(desc) {
            updatedProduct.description = desc;
        }
        if(price) {
            updatedProduct.price = price;
        }

        this.products[index] = updatedProduct;  
    }

    deleteProduct(prodId: string) {
        let productIndex = this.findProduct(prodId)[1];
        this.products.splice(productIndex, 1);
        return [...this.products];
    }

    private findProduct(id: string): [Product, number] {
        const productIndex = this.products.findIndex(prod => prod.id === id);
        const product = this.products[productIndex];
        if(!product) {
            throw new NotFoundException('Could not find a product...');
        }

        return [product, productIndex];
    }

}