import db from "../database";


export type Product = {
    id?: number;
    name: string;
    price: number;

}

export class ProductStore {
    //get all
    async index(): Promise<Product[]> {
        try {
          // @ts-ignore
          const conn = await db.connect()
          const sql = 'SELECT * FROM products'
    
          const result = await conn.query(sql)
    
          conn.release()
    
          return result.rows.map((product: Product) => ({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price.toString())
        }));
        } catch (err) {
          throw new Error(`Could not get products. Error: ${err}`)
        }
      }
    
      //get product by Id
      async show(id: string): Promise<Product> {
        try {
        const sql = 'SELECT * FROM products WHERE id=($1)'
        // @ts-ignore
        const conn = await db.connect()
    
        const result = await conn.query(sql, [id])
    
        conn.release()
    
        return  {
            id: result.rows[0].id,
            name: result.rows[0].name,
            price: parseFloat(result.rows[0].price)
        };
        } catch (err) {
            throw new Error(`Could not find Product ${id}. Error: ${err}`)
        }
      }
    
      //add product
      async create(p: Product): Promise<Product> {
        try {
            const sql = 'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
            const conn = await db.connect();
    
            const result = await conn.query(sql, [p.name, p.price]);
    
            const product = result.rows[0];
            conn.release();
    
            return {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price)
            };
        } catch (err) {
            throw new Error(`Could not add new Product ${p.name}. Error: ${err}`);
        }
    }
    
    
      //delete Product
      async delete(id: string): Promise<Product> {
        if (!id) {
            throw new Error('Product ID is required for deletion.');
        }
          try {
            const sql = 'DELETE FROM products WHERE id=($1) RETURNING id, name, price';
            // @ts-ignore
            const conn = await db.connect();
            
            const result = await conn.query(sql, [id]);
    
            if (result.rows.length === 0) {
                throw new Error(`Product with id ${id} not found.`);
            }
            
            const product = result.rows[0];

            conn.release()
        return {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price)
        };
          } catch (err) {
              throw new Error(`Could not delete Product ${id}. Error: ${err}`)
          }
      }

      async deleteAll(): Promise<void> {
        try {
            const sql = 'DELETE FROM products';
            const conn = await db.connect();
            await conn.query(sql);
            conn.release();
        } catch (err) {
            throw new Error(`Could not delete all products. Error: ${err}`);
        }
    }
}