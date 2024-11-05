import db from "../database";
import bcrypt from "bcrypt";
import { Order } from "./order";

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = process.env.SALT_ROUNDS as string;

export type User = {
    id?: number;
    firstName: string;
    lastName: string;
    password: string;
}

export class UserStore {
    
      //add user
      async create(u: User): Promise<User> {
        try {
          // @ts-ignore
          const conn = await db.connect()
          const sql = 'INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *';
    
          const hash = bcrypt.hashSync(
            u.password + pepper, 
            parseInt(saltRounds)
          );
    
          const result = await conn.query(sql, [u.firstName, u.lastName, hash])

          const user = result.rows[0]
    
          conn.release()
    
          return user
        } catch(err) {
          throw new Error(`unable create user (${u.firstName}): ${err}`)
        } 
      }

      async authenticate(firstName: string, password: string): Promise<User | null> {
        const conn = await db.connect()
        const sql = 'SELECT password FROM users WHERE firstName=($1)'
    
        const result = await conn.query(sql, [firstName])
    
        console.log(password+pepper)
    
        if(result.rows.length) {
    
          const user = result.rows[0]
    
          console.log(user)
    
          if (bcrypt.compareSync(password+pepper, user.password)) {
            return user
          }
        }
    
        return null
      }

    
          //get all
    async index(): Promise<User[]> {
        try {
          // @ts-ignore
          const conn = await db.connect()
          const sql = 'SELECT * FROM users'
    
          const result = await conn.query(sql)
    
          conn.release()
    
          return result.rows;
        //   return result.rows.map((user: User) => ({
        //     id: user.id,
        //     firstName: user.firstName,
        //     lastName: user.lastName,
        //     password: user.password
        // }));
        } catch (err) {
          throw new Error(`Could not get users. Error: ${err}`)
        }
      }
    
      //get user by Id
      async show(id: string): Promise<User> {
        try {
        const sql = 'SELECT * FROM users WHERE id=($1)'
        // @ts-ignore
        const conn = await db.connect()
    
        const result = await conn.query(sql, [id])
    
        conn.release()
    
        return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`)
        }
      }
    
      //delete User
      async delete(id: string): Promise<User> {
        if (!id) {
            throw new Error('User ID is required for deletion.');
        }
          try {
            const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
            // @ts-ignore
            const conn = await db.connect();
            
            const result = await conn.query(sql, [id]);
    
            if (result.rows.length === 0) {
                throw new Error(`User with id ${id} not found.`);
            }
            
            const user = result.rows[0];

            conn.release()
        return user;
          } catch (err) {
              throw new Error(`Could not delete user ${id}. Error: ${err}`)
          }
      }

      async deleteAll(): Promise<void> {
        try {
            const sql = 'DELETE FROM users';
            const conn = await db.connect();
            await conn.query(sql);
            conn.release();
        } catch (err) {
            throw new Error(`Could not delete all users. Error: ${err}`);
        }
    }

  //   async deleteAll(): Promise<void> {
  //     try {
  //         const conn = await db.connect();
  //         await conn.query('DELETE FROM order_products');
  //         await conn.query('DELETE FROM orders');
  //         await conn.query('DELETE FROM users');


  //         conn.release();
  //     } catch (err) {
  //         throw new Error(`Could not delete all users. Error: ${err}`);
  //     }
  // }
}