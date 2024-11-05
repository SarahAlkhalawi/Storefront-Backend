import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import jwt from 'jsonwebtoken'

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
    try{
        const products = await store.index()
        res.json(products)
    }
    catch(err){
        res.status(400)
        res.json(err)
    }
}

const show = async (req: Request, res: Response) => {
    try{
   const product = await store.show(req.params.id)
   res.json(product)
    }
    catch(err){
        res.status(400)
        res.json(err)
    }
}

const create = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET as string)
    } catch(err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }

    try {
        const product: Product = {
            name: req.body.name,
            price: req.body.price,
        }

        const newProduct = await store.create(product)
        res.json(newProduct)
    } catch(err) {
        res.status(400)
        res.json(err)
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET as string)
    } catch(err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
    const id = req.params.id;
    try {
        const deletedProduct = await store.delete(id);
        res.json(deletedProduct);
    } catch (error) {
        res.status(400).send(error);
    }
}
// const destroy = async (req: Request, res: Response) => {
//     const id = req.params.id;

//     try {
//         const authorizationHeader = req.headers.authorization as string
//         const token = authorizationHeader.split(' ')[1]
//         jwt.verify(token, process.env.TOKEN_SECRET as string)  
//         const product = await store.show(id)
//         if (!product) {
//             return res.status(404).json("Product not found")
//         }

//         const deletedProduct = await store.delete(id)
//         res.status(200).json(deletedProduct)
//     } catch (err) {
//         console.error(err)
//         res.status(401).json('Access denied, invalid token') 
//     }
// }


const productRoutes = (app: express.Application) => {
  app.get('/products', index)
  app.get('/products/:id', show)
  app.post('/products', create)
  app.delete('/products/:id', destroy)
}

export default productRoutes;