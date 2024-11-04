import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'

const store = new UserStore()

const authenticate = async (req: Request, res: Response) => {
    try {
        const user: User = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,

        }

        const u = await store.authenticate(req.body.firstName, req.body.password)
        const token = jwt.sign({user: u}, process.env.TOKEN_SECRET as string)
        res.json(token)
    } catch(err) {
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
        const user: User = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,

        }

        const newUser = await store.create(user)
      //  const token = jwt.sign({user: newUser}, process.env.TOKEN_SECRET as string)
        res.json(newUser)
    } catch(err) {
        res.status(400)
        res.json(err)
    }
}

const index = async (req: Request, res: Response) => {
    try {
        const authorizationHeader = req.headers.authorization as string
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET as string)
    } catch(err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
    const users = await store.index()
    res.json(users)
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
    const product = await store.show(req.params.id)
    res.json(product)
 }


const userRoutes = (app: express.Application) => {
  app.post('/users/login', authenticate)
  app.post('/users', create)
  app.get('/users', index)
  app.get('/users/:id', show)


}

export default userRoutes;