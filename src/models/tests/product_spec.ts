import { Product, ProductStore } from '../product';

const store = new ProductStore()
let createdProductId: number;

beforeEach(async () => {
    await store.deleteAll();
    const product = await store.create({
        name: 'Shirt',
        price: 250,
    });
    createdProductId = product.id as number; 
});
describe("Product Model", () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    // it('should have an update method', () => {
    //     expect(store.update).toBeDefined();
    // });
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    

  it('create method should add a product', async () => {
    const result = await store.create({
      name: 'Shirt',
      price: 250
    });
    expect(result).toEqual({
      id: result.id,
      name: 'Shirt',
      price: 250
    });
  });

  it('index method should return a list of products', async () => {
    const result = await store.index();
    expect(result).toEqual([{
        id: result[0].id,
        name: 'Shirt',
        price: 250.00
    }]);
  });

  it('show method should return the correct product', async () => {
 
    const result = await store.show(createdProductId.toString());
    expect(result).toEqual({
        id: result.id,
        name: 'Shirt',
        price: 250
    });
  });

  it('delete method should remove the product', async () => {
    await store.delete(createdProductId.toString());
    const result = await store.index()
    expect(result).toEqual([]);
  });
});