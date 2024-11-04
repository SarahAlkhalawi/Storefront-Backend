"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../product");
const store = new product_1.ProductStore();
describe("Product Model", () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a create method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a update method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a delete method', () => {
        expect(store.index).toBeDefined();
    });
    it('create method should add a product', async () => {
        const result = await store.create({
            name: 'Shirt',
            price: 250
        });
        expect(result).toEqual({
            id: 1,
            name: 'Shirt',
            price: 250
        });
    });
    it('index method should return a list of products', async () => {
        const result = await store.index();
        expect(result).toEqual([{
                id: 1,
                name: 'Shirt',
                price: 250
            }]);
    });
    it('show method should return the correct product', async () => {
        const result = await store.show("1");
        expect(result).toEqual({
            id: 1,
            name: 'Shirt',
            price: 250
        });
    });
    it('delete method should remove the product', async () => {
        store.delete("1");
        const result = await store.index();
        expect(result).toEqual([]);
    });
});
