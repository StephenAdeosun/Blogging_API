const request = require('supertest');
const express = require('express');
const app = express(); 
const {
  ValidateBlogCreation,
  ValidateBlogUpdate,
} = require('../blogs/blog_middleware'); 
const { BearerTokenAuth } = require('../middleware/middleware');
const UserModel = require('../model/UserModel');

const mockUser = {
  _id: 'user_id_here', 
};

UserModel.findOne = jest.fn(() => mockUser);

const sampleBlog = {
  title: 'Sample Blog',
  body: 'Sample blog body',
  description: 'Sample description',
  tags: 'Sample tags',
  state: 'Sample state',
};

// Define a sample token for testing
const sampleToken = 'sample_token_here';

// Mock the jwt.verify function to return the mockUser
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => mockUser),
}));

// Import your controller
const controller = require('../blogs/blog_controller'); // Update the path

// Define a test case for the '/create' endpoint
describe('POST /create', () => {
  // Create a user token for authentication
  const userToken = 'sample_user_token';

  // Define the authentication middleware
  app.use(BearerTokenAuth);

  // Define the validation middleware
  app.use(ValidateBlogCreation);

  // Define the route for creating a blog
  app.post('/create', (req, res) => {
    // Use your controller to create a blog
    controller.CreateBlog(req, res);
  });

  // Write a test case for creating a blog
  it('creates a new blog', async () => {
    // Define a sample request for creating a blog
    const requestPayload = {
      body: sampleBlog,
    };

    // Send a POST request to the '/create' endpoint with authentication headers
    const response = await request(app)
      .post('/create')
      .set('Authorization', `Bearer ${userToken}`)
      .send(requestPayload);

    // Add your assertions here to check if the blog was created successfully
    expect(response.status).toBe(201); // Adjust the expected status code
    // Add more assertions as needed
  });
});
