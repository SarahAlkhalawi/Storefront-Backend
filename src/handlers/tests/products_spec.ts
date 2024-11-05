import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../server'

const request = supertest(app)

const {
    TOKEN_SECRET,
} = process.env

describe('Products Handlers', () => {
    let token: string, userId: number, productId: number;

    beforeAll(async () => {
        const res = await request.post('/users/').send({
            firstname: "Nour",
            lastname: "Fahad",
            password: "nor122"
        })
        const { body } = res;
        token = body;

        const payload = jwt.verify(token, TOKEN_SECRET as string);
        // @ts-ignore
        const user = payload.user;
        userId = user.id;
    })

    afterAll(async () => {
        await request.delete(`/users/${userId}`).set('Authorization', 'Bearer ' + token)
    })

    it('POST /products/ - should create a new product with valid token', async () => {
        const res = await request.post('/products/')
            .set('Authorization', 'Bearer ' + token)
            .send({
                name: 'test 2',
                price: 250
            })

        productId = res.body.id; 
        expect(res.status).toBe(200)
        expect(res.body.id).not.toBeNull()
        expect(res.body.name).toBe('test 2')
        expect(res.body.price).toBe(250)
    })

    it('GET /products/ - should retrieve all products', async () => {
        const res = await request.get('/products/')
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)

    })

    it('POST /products/ - should return 401 if no token provided', async () => {
        const res = await request.post('/products/')
            .send({
                name: 'test',
                price: 300
            })

        expect(res.status).toBe(401)
        expect(res.body).toBe('Access denied, invalid token')
    })

    it('DELETE /products/:id - should return 401 if no token provided', async () => {
        const res = await request.delete(`/products/${productId}`)
        expect(res.status).toBe(401)
        expect(res.body).toBe('Access denied, invalid token')
    })

    it('GET /products/:id - should return 404 for non-existent product', async () => {
        const res = await request.get('/products/999999')
        expect(res.status).toBe(400)
    })
})
