const expect = require('chai').expect
const apiModel = require('../lib/mysql.js')

let name = 'Dad'
    , password = '12345'
    , avatar = 'avatar'
    , time = 'time'


describe('add User', () => {

    // Create a user
    before((done) => {
        apiModel.insertData([name, password, avatar, time])
            .then(() => {
                done()
            })
    })

    // Delete a user
    after((done) => {
        apiModel.deleteUserData(name).then(() => {
            done()
        })
    })

    // Find users
    it(`should return an Array contain {} when find by name="${name}"`, (done) => {
        apiModel.findUserData(name)
            .then((user) => {
                let data = JSON.parse(JSON.stringify(user))
                console.log(data)
                expect(data).to.have.lengthOf(1)
                done()
            }).catch((err) => {
            if (err) {
                return done(err)
            }
        })
    })
})
