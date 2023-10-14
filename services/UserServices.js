const QueryUsers = require('../db/users')
const bcrypt = require('bcrypt')

module.exports = (config) => {

    const { getAllUsers, getUserById, getUserByEmail, getUserByPhoneNumber, getUserByUsername, addNewUser } = QueryUsers(config)

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

    async function createUser(first_name, last_name, username, email, password, phone_number) {
        if (await getUserByUsername(username)) {
            return { error: "user already exist" }
        } else if (await getUserByEmail(email)) {
            return { error: "Email already exist" }
        } else if (await getUserByPhoneNumber(phone_number)) {
            return { error: "Phone number already exist" }
        } else {
            const hashed_password = await bcrypt.hash(password, 10)
            return addNewUser(first_name, last_name, username, email, hashed_password, phone_number)
        }
    }

    return {
        listUsers,
        userDetials,
        createUser
    }

}