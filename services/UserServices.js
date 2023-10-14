const QueryUsers = require('../db/users')

module.exports = (config) => {

    const { getAllUsers, getUserById } = QueryUsers(config)

    function listUsers() {
        return getAllUsers()
    }

    function userDetials(id) {
        return getUserById(id)
    }

    return {
        listUsers,
        userDetials
    }

}