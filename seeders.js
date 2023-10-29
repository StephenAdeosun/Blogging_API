const db = require('./db');
const {connect } = require('./db/index')
const UserModel = require('./model/UserModel');


connect()

const seed = async () => {
    const user1 = await UserModel.create({
        id: 1,
        username: 'user1',
        firstname: 'user1',
        lastname: 'user1',
        email: 'jj@knjppk',
        password: '1234',
        user_type: 'user'
    })

    if (user1) {
        console.log('user1 created')
    }
    else {
        console.log('user1 not created')
        console.error(err)	
    }
}

seed()