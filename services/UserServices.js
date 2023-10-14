const QueryUsers = require('../db/users')

module.exports = (config) => {

    const { getAllUsers, getUserById, getUserByEmail, getUserByPhoneNumber, getUserByUsername } = QueryUsers(config)

    function listUsers() {
        return getAllUsers()
    }

    function userDetials(id, email, phoneNumber, username) {
        if (id) {
            return getUserById(id)
        } else if (email) {
            return getUserByEmail(email)
        } else if (phoneNumber) {
            return getUserByPhoneNumber(phoneNumber)
        } else {
            return getUserByUsername(username)
        }
    }

    return {
        listUsers,
        userDetials
    }

}