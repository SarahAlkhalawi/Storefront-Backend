import db from "../database";
import { Product, ProductStore } from './product';

const productStore = new ProductStore();
export type Order = {
    id?: number;
    user_id: number;
    status: string;
}

export class OrderStore {
    
      //add order
      async create(o: Order): Promise<Order> {
        try {
          // @ts-ignore
          const conn = await db.connect()
          const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *'
        
          const result = await conn.query(sql, [o.user_id, o.status])
          const order = result.rows[0]
    
          conn.release()
    
          return order;
        } catch(err) {
          throw new Error(`unable create order (${o.user_id}): ${err}`)
        } 
      }
    
          //get all
    async index(): Promise<Order[]> {
        try {
          // @ts-ignore
          const conn = await db.connect()
          const sql = 'SELECT * FROM orders'
    
          const result = await conn.query(sql)
    
          conn.release()
    
          return result.rows;
        } catch (err) {
          throw new Error(`Could not get orders. Error: ${err}`)
        }
      }
    
      //get order by Id
      async show(id: string): Promise<Order> {
        try {
        const sql = 'SELECT * FROM orders WHERE id=($1)'
        // @ts-ignore
        const conn = await db.connect()
    
        const result = await conn.query(sql, [id])
    
        conn.release()
    
        return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find order ${id}. Error: ${err}`)
        }
      }

      //get order by User Id
      async showByUserId(userId: string): Promise<Order> {
        try {
        const sql = 'SELECT * FROM orders WHERE user_id=($1)'
        // @ts-ignore
        const conn = await db.connect()
    
        const result = await conn.query(sql, [userId])
    
        conn.release()
    
        return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find order ${userId}. Error: ${err}`)
        }
      }
    
      //delete order
      async delete(id: string): Promise<Order> {
        if (!id) {
            throw new Error('Order ID is required for deletion.');
        }
          try {
            const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
            // @ts-ignore
            const conn = await db.connect();
            
            const result = await conn.query(sql, [id]);
    
            if (result.rows.length === 0) {
                throw new Error(`Order with id ${id} not found.`);
            }
            
            const order = result.rows[0];

            conn.release()
        return order;
          } catch (err) {
              throw new Error(`Could not delete order ${id}. Error: ${err}`)
          }
      }

      async addProduct(quantity: number, orderId: string, productId: string): Promise<{quantity: number, orderId: string, productId: string, id?: number}> {
  
        try {
            const productCheck = await productStore.show(productId);
            if (!productCheck) {
                throw new Error(`Product with id ${productId} does not exist.`);
            }

          const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *'
          //@ts-ignore
          const conn = await db.connect()
    
          const result = await conn
              .query(sql, [quantity, orderId, productId])
    
              
          const order = result.rows[0]
    
          conn.release()
    
          return order
        } catch (err) {
          throw new Error(`Could not add product ${productId} to order ${orderId}: ${err}`)
        }
      }


      async deleteAll(): Promise<void> {
        try {
            const conn = await db.connect();
            await conn.query('DELETE FROM order_products');
            await conn.query('DELETE FROM orders');

            conn.release();
        } catch (err) {
            throw new Error(`Could not delete all users. Error: ${err}`);
        }
    }

}