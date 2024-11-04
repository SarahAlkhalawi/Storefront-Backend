import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'
import jwt from 'jsonwebtoken'

const store = new OrderStore()

const index = async (_req: Request, res: Response) => {
    try {
        const authorizationHeader = _req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET as string)
    } catch(err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
  const orders = await store.index()
  res.json(orders)
}

const show = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET as string)
    } catch(err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
   const order = await store.show(req.params.id)
   res.json(order)
}

const showByUserId = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET as string)
    } catch(err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
   const order = await store.showByUserId(req.params.userId)
   res.json(order)
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
        const order: Order = {
            user_id: req.body.userId,
            status: req.body.status,
        }

        const newOrder = await store.create(order)
        res.json(newOrder)
    } catch(err) {
        res.status(400)
        res.json(err)
    }
}

const addProduct = async (_req: Request, res: Response) => {
    try {
        const authorizationHeader = _req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET as string)
    } catch(err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }

    const orderId: string = _req.params.id
    const productId: string = _req.body.productId
    const quantity: number = _req.body.quantity
  
    try {
        if (!productId || !quantity) {
            res.status(400).json({ error: 'Missing productId or quantity' });
            return;
        }
      const addedProduct = await store.addProduct(quantity, orderId, productId)
      res.json(addedProduct)
    } catch(err) {
        console.error(err); 
      res.status(400)
      res.json(err)
    }
}

const destroy = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const deletedOrder = await store.delete(id);
        res.json(deletedOrder);
    } catch (error) {
        res.status(400).send(error);
    }
}



const orderRoutes = (app: express.Application) => {
  app.get('/orders', index)
  app.get('/orders/:id', show)
  app.get('/orders/user/:userId', showByUserId)
  app.post('/orders', create)
  app.delete('/orders/:id', destroy)
  app.post('/orders/:id/product', addProduct)

}

export default orderRoutes;