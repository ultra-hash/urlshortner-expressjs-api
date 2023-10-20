const jwt = require('jsonwebtoken')
const QueryUsers = require('../db/users')
const bcrypt = require('bcrypt')

module.exports = (config) => {

    const { getAllUsers, getUserById, getUserByEmail, getUserByPhoneNumber, getUserByUsername, addNewUser, updatePasswordByUsername } = QueryUsers(config)

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

    async function login(username, password) {
        const user = await getUserByUsername(username)
        const isPasswordValid = await bcrypt.compare(password, user.hashed_password)
        // console.log(isPasswordValid)
        if (!isPasswordValid) {
            return { error: "User not found" }
        }

        const jwtToken = jwt.sign({ id: user.id, username }, config.JWT_SECRET)

        return { id: user.id, jwtToken }
    }

    async function updatePassword(jwtToken, password) {
        try {
            const payload = jwt.verify(jwtToken, config.JWT_SECRET)
            const hashed_password = await bcrypt.hash(password, 10)
            return await updatePasswordByUsername(payload.username, hashed_password)
        } catch (e) {
            console.error(e)
            return { error: "Invalid token" }
        }
    }

    async function verifyToken(jwtToken) {
        try {
            const payload = jwt.verify(jwtToken, config.JWT_SECRET)
            return payload
        } catch (e) {
            return { error: "Invalid Token" }
        }
    }

    return {
        listUsers,
        userDetials,
        createUser,
        login,
        updatePassword,
        verifyToken
    }

}