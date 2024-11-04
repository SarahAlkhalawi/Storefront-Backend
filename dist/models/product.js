"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
class ProductStore {
    //get all
    async index() {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }
    //get product by Id
    async show(id) {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)';
            // @ts-ignore
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find Product ${id}. Error: ${err}`);
        }
    }
    //add product
    async create(p) {
        try {
            const sql = 'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
            // @ts-ignore
            const conn = await Client.connect();
            const result = await conn
                .query(sql, [p.name, p.price]);
            const Product = result.rows[0];
            conn.release();
            return Product;
        }
        catch (err) {
            throw new Error(`Could not add new Product ${p.name}. Error: ${err}`);
        }
    }
    //delete Product
    async delete(id) {
        try {
            const sql = 'DELETE FROM products WHERE id=($1)';
            // @ts-ignore
            const conn = await Client.connect();
            const result = await conn.query(sql, [id]);
            const Product = result.rows[0];
            conn.release();
            return Product;
        }
        catch (err) {
            throw new Error(`Could not delete Product ${id}. Error: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
