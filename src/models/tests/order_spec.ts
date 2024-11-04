import { Order, OrderStore } from '../order';
import { Product, ProductStore } from '../product';
import { User, UserStore } from '../user';

const userStore = new UserStore()
const productStore = new ProductStore()
const store = new OrderStore()

let createdOrderId: number;
let createdProductId: number;
let createdUserId: number;

beforeEach(async () => {
    await store.deleteAll();

    const product = await productStore.create({
        name: 'Shirt',
        price: 250,
    });
    createdProductId = product.id as number; 
    console.log('Created Product ID:', createdProductId);

    const user = await userStore.create({
        firstName: 'test',
        lastName: 'test',
        password: 'test123'
    });
    createdUserId = user.id as number; 

    const order = await store.create({
        user_id: createdUserId,
        status: 'test',
    });
    createdOrderId = order.id as number; 
});

afterAll(async () => {
    await store.deleteAll();
    await productStore.deleteAll();
    await userStore.deleteAll();
})


describe("Order Model", () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('should have an add product method', () => {
        expect(store.addProduct).toBeDefined();
    });
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('should have a showByUserId method', () => {
        expect(store.showByUserId).toBeDefined();
    });
    

  it('create method should add a Order', async () => {
    const result = await store.create({
      user_id: createdUserId,
      status: 'active'
    });
    expect(result).toEqual({
      id: result.id,
      user_id: createdUserId,
      status: 'active',
    });
  });

  it('index method should return a list of orders', async () => {
    const result = await store.index();
    expect(result).toEqual([{
        id: result[0].id,
        user_id: createdUserId,
        status: 'test',
    }]);
  });

  it('show method should return the correct order', async () => {
 
    const result = await store.show(createdOrderId.toString());
    expect(result).toEqual({
        id: result.id,
        user_id: createdUserId,
        status: 'test',
    });
  });

  it('show method should return the correct order by user Id', async () => {
 
    const result = await store.showByUserId(createdUserId.toString());
    expect(result).toEqual({
        id: result.id,
        user_id: createdUserId,
        status: 'test',
    });
  });

  it('delete method should remove the order', async () => {
    await store.delete(createdOrderId.toString());
    const result = await store.index()
    expect(result).toEqual([]);
  });
});