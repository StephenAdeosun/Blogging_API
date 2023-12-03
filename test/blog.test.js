const supertest = require('supertest');
const app = require('../api');
const { connect } = require('./database');
const UserModel = require('../model/UserModel');
const BlogModel = require('../model/BlogModel');

// Test suite
describe('Blog Tests', () => {
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
    // {"level":"error","message":"You are not authenticated!"}
    it('should not successfully create a blog, when user is not authenticated', async () => {
        const response = await supertest(app)
        .post('/blog/create')
        .set('content-type', 'application/json')
        .send({
            title: "My First Blog",
            body: "This is my first blog",
            description: "This is my first blog",
            user_id: "60d5d2f6c8b8ea1f8c4c9f5c"
        })

        // expectations
        expect(response.status).toEqual(401);
        // expect(response.body).toMatchObject({
        //     success: false,
        //     message: "You are not authenticated!"
        // })
    })

    // it should successfully create a blog when user is authenticated
    it("should successfully create a blog when user is authenticated", async () => {
        const user = await UserModel.create({
            first_name: "Stephen",
            last_name: "Adeosun",
            password: "1234567",
            email: "me@test.com"
        });

        const response = await supertest(app)
        .post('/blog/create')
        .set('content-type', 'application/json')
        .set("authorization", ``)
        .send({
            title: "My First Blog",
            body: "This is my first blog",
            description: "This is my first blog",
            user_id: user._id
        })

        // expectations
        expect(response.status).toEqual(201);
        expect(response.body.data).toMatchObject({
            blog: expect.any(Object),
        })


    })
   


    it('should successfully get all blogs', async () => {
        const user = await UserModel.create({
            first_name: "Stephen",
            last_name: "Adeosun",
            password: "1234567",
            email: "me@test.com"
        });

        await BlogModel.create({
            title: "My First Blog",
            body: "This is my first blog",
            description: "This is my first blog",
            user_id: user._id
        });

        const response = await supertest(app)
        .get('/blog/')
        .set('content-type', 'application/json')
        .send()

        // expectations
        expect(response.status).toEqual(200);
        expect(response.body.data).toMatchObject({
            blogs: expect.any(Array),
        })
    }
    )
    it('should successfully get a blog', async () => {
        const user = await UserModel.create({
            first_name: "Stephen",
            last_name: "Adeosun",
            password: "1234567",
            email: "me@test.com"
        });

        const blog = await BlogModel.create({
            title: "My First Blog",
            body: "This is my first blog",
            description: "This is my first blog",
            user_id: user._id
        });

        const response = await supertest(app)
        .get(`/blog/${blog._id}`)
        .set('content-type', 'application/json')
        .send()

        // expectations
        expect(response.status).toEqual(200);
        expect(response.body.data).toMatchObject({
            blog: expect.any(Object),
        })
    }
    )
    // it('should successfully update a blog', async () => {
    //     const user = await UserrModel.create({
    //         first_name: "Stephen",
    //         last_name: "Adeosun",
    //         password: "1234567",
    //         email: "me@test.com"

        });
