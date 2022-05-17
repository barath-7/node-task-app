const request = require('supertest')
const app = require('../app')
const User = require('../src/models/user')

const TEST_USER ={
    "name":"test user",
    "password":"123456789",
    "email":"test@mail",
    "age":123
}
beforeEach(async ()=>{
    await User.deleteMany()
    await new User(TEST_USER).save()
})

test('user creation should be succesful',async ()=>{
    await request(app).post('/users').send({
    "name":"test case user",
    "password":"123456789",
    "email":"test1@mail",
    "age":123
    }).expect(200)
})

test('Check whether login is succesful',async ()=>{
const {email, password}= TEST_USER
    await request(app).post('/users/login').send({
        email,
        password
    }).expect(200)
})