import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from './product.model';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    products: Product[] = [];

    constructor(@InjectModel('Product') private readonly productModule: Model<Product>) {}

    async insertProduct(title: string, description: string, price: number) {
        const newProduct = new this.productModule({title, description, price});
        const result = await newProduct.save(); // save object to mongo db
        console.log(result);
        return result.id as string;
    }

    async getProducts() {
        const products = await this.productModule.find().exec();
        return products.map(prod => ({id: prod.id, title: prod.title, description: prod.description, price: prod.price}));
    }

    async getSingleProduct(productId: string) {
        const product = await this.findProduct(productId);
        return {id: product.id, title: product.title, description: product.description, price: product.price};
    }

    async updateProduct(productId: string, title: string, desc: string, price: number){
        const updatedProduct = await this.findProduct(productId);
        if(title) {
            updatedProduct.title = title;
        }
        if(desc) {
            updatedProduct.description = desc; 
        }
        if(price) {
            updatedProduct.price = price;
        }

        updatedProduct.save();
    }

    async deleteProduct(prodId: string) {
        const result = await this.productModule.deleteOne({_id: prodId}).exec();
        if(result.n === 0) {
            throw new NotFoundException('Could not find a product...');
        }
    }

    private async findProduct(id: string): Promise<Product> {
        let product;
        try{
            product = await this.productModule.findById(id);
        } catch(e){
            throw new NotFoundException('Could not find a product...');
        }

        if(!product) {
            throw new NotFoundException('Could not find a product...');
        }

        return product;
    }

}