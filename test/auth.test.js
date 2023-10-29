const supertest = require('supertest');
const app = require('../api');
const { connect } = require('./database');
const UserModel = require('../model/UserModel');

// Test suite
describe('User Authentication Tests', () => {
    let connection
    // before hook
    beforeAll(async () => {
        connection = await connect()
    })

    afterEach(async () => {
        await connection.cleanup()
    })
    
    // after hook
    afterAll(async () => {
        await connection.disconnect()
    })


    // Test case
    it('should successfully register a user', async () => {
        const response = await supertest(app)
        .post('/signup')
        .set('content-type', 'application/json')
        .send({
            first_name: "Stephen",
            last_name: "Adeosun",
            password: "1234567",
            email: "me@test.com"
        })

        // expectations
        expect(response.status).toEqual(201);
        expect(response.body.data).toMatchObject({
            user: expect.any(Object),
            token: expect.any(String)

        })
    })

    it('should not successfully register a user, when user already exists', async () => {
        await UserModel.create({
            first_name: "Stephen",
            last_name: "Adeosun",
            password: "1234567",
            email: "me@test.com"
        });

        const response = await supertest(app)
        .post('/signup')
        .set('content-type', 'application/json')
        .send({
            first_name: "Stephen",
            last_name: "Adeosun",
            password: "1234567",
            email: "me@test.com"
        })

        // expectations
        expect(response.status).toEqual(409);
        expect(response.body).toMatchObject({
            message: 'User already exists',
        })
        

    })

    // Test case
    it('should successfully login a user', async () => {
        await UserModel.create({
            first_name: "Stephen",
            last_name: "Adeosun",
            password: "1234567",
            email: "me@test.com"
        });

        const response = await supertest(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({
            password: "1234567",
            email: "me@test.com",
        })

        // expectations
        expect(response.status).toEqual(200);
        expect(response.body).toMatchObject({
            success: true,
            message: 'User logged in successfully',
            data: expect.any(Object)    
           
        })

        expect(response.body.data.user.first_name).toEqual('Stephen');
        expect(response.body.data.user.email).toEqual('me@test.com');
    })

    it('should not successfully login a user, when user does not exist', async () => {
        await UserModel.create({
            first_name: "Stephen",
            last_name: "Adeosun",
            password: "1234567",
            email: "me@test.com"
        });

        const response = await supertest(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({
            email: "sam@example.com",
            password: "12345678"
        })

        // expectations
        expect(response.status).toEqual(404);
        expect(response.body).toMatchObject({
            message: 'User not found',
        })
    })
})