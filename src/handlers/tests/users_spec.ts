import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../server' 

const request = supertest(app)
const { TOKEN_SECRET } = process.env

let token: string;
let userId: number;
let newUserId: number;

describe('User Routes', () => {

    beforeAll(async () => {
        const res = await request.post('/users').send({
            firstName: 'Alaa',
            lastName: 'Sami',
            password: 'al123'
        })

        token = res.body; 
        const decoded = jwt.verify(token, TOKEN_SECRET as string) as { user: { id: number } };
        userId = decoded.user.id;
    })

    afterAll(async () => {
        await request.delete(`/users/${userId}`).set('Authorization', `Bearer ${token}`)
    })

    it('should authenticate a user with valid credentials', async () => {
        const res = await request.post('/users/login').send({
            firstName: 'Alaa',
            password: 'al123'
        })

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        token = res.body 
    })

    it('should create a new user and return a token', async () => {
        const res = await request.post('/users').send({
            firstName: 'Hessa',
            lastName: 'Saud',
            password: 'he123'
        })

        expect(res.status).toBe(200)
        expect(res.body).toBeDefined()
        const decoded = jwt.verify(res.body, TOKEN_SECRET as string) as { user: { id: number } }
        newUserId = decoded.user.id
    })

    it('should fetch all users ', async () => {
        const res = await request.get('/users').set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    it('should fetch a single user by ID ', async () => {
        const res = await request.get(`/users/${userId}`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.id).toBe(userId)
    })

    it('should delete a user ', async () => {
        const res = await request.delete(`/users/${newUserId}`).set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200)
    })

    it('should return 401 for GET /users without a token', async () => {
        const res = await request.get('/users')

        expect(res.status).toBe(401)
        expect(res.body).toEqual('Access denied, invalid token')
    })

    it('should return 401 for GET /users/:id without a token', async () => {
        const res = await request.get(`/users/${userId}`)

        expect(res.status).toBe(401)
        expect(res.body).toEqual('Access denied, invalid token')
    })

    
})

