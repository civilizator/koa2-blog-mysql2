const expect = require('chai').expect
const apiModel = require('../lib/mysql.js')

describe('add User', () => {

    // Create a user
    before((done) => {
        apiModel.insertData(['wclimb', '123456', 'avator', 'time']).then(() => {
            done()
        })
    })

    // Delete a user
    after((done) => {
        apiModel.deleteUserData('wclimb').then(() => {
            done()
        })
    })

    // Find users
    it('should return an Array contain {} when find by name="wclimb"', (done) => {
        apiModel.findUserData('wclimb').then((user) => {
            let data = JSON.parse(JSON.stringify(user))
            console.log(data)
            expect(data).to.have.lengthOf(1)
            done();
        }).catch((err) => {
            if (err) {
                return done(err)
            }
        })
    })
})
