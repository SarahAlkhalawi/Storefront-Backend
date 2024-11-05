import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../server';  
import { Order } from '../../models/order';

const request = supertest(app);
const { TOKEN_SECRET } = process.env;

let token: string;
let orderId: string;
let userId: string;
let productId: string;

describe('Order Routes', () => {

  beforeAll(async () => {
    const res = await request.post('/users').send({
      firstName: 'Raghad',
      lastName: 'Salem',
      password: 'ra123'
    });

    token = res.body; 
    userId = res.body.userId; 

    
  });

  afterAll(async () => {
    await request.delete(`/users/${userId}`).set('Authorization', `Bearer ${token}`);
  });

  it('should create a new order', async () => {
    const res = await request
      .post('/orders')
      .send({
        userId: userId,
        status: 'active'
      })
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    orderId = res.body.id;
  });

  it('should fetch all orders ', async () => {
    const res = await request
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 401 for GET /orders without a token', async () => {
    const res = await request.get('/orders');
    expect(res.status).toBe(401);
    expect(res.body).toEqual('Access denied, invalid token');
  });

  it('should return 401 for GET /orders/:id without a token', async () => {
    const res = await request.get(`/orders/${orderId}`);
    expect(res.status).toBe(401);
    expect(res.body).toEqual('Access denied, invalid token');
  });

  it('should return 401 for POST /orders without a token', async () => {
    const res = await request
      .post('/orders')
      .send({
        userId: userId,
        status: 'active'
      });
    expect(res.status).toBe(401);
    expect(res.body).toEqual('Access denied, invalid token');
  });

  it('should return 401 for POST /orders/:id/product without a token', async () => {
    const res = await request
      .post(`/orders/${orderId}/product`)
      .send({
        productId: productId,
        quantity: 2
      });
    expect(res.status).toBe(401);
    expect(res.body).toEqual('Access denied, invalid token');
  });

 
});
