const jwt = require('jsonwebtoken')
const QueryUsers = require('../db/users')
const bcrypt = require('bcrypt')

module.exports = (config) => {

    const { getAllUsers, getUserById, getUserByEmail, getUserByPhoneNumber, getUserByUsername, addNewUser, updatePasswordByUsername } = QueryUsers(config)

    async function listUsers(req, res) {
        const result = await getAllUsers()
        res.json(result)
    }

    async function userDetials(req, res) {
        const { id, email, phoneNumber, username } = req.query
        if (
            id && (email || username || phoneNumber) ||
            email && (id || username || phoneNumber) ||
            username && (id || email || phoneNumber) ||
            phoneNumber && (id || email || username) ||
            !id && !email && !phoneNumber && !username
        ) {
            res.status(400).json({ error: "Invalid Request" })
        } else if (id) {
            res.json(await getUserById(id))
        } else if (email) {
            res.json(await getUserByEmail(email))
        } else if (phoneNumber) {
            res.json(await getUserByPhoneNumber(phoneNumber))
        } else {
            res.json(await getUserByUsername(username))
        }
    }

    async function createUser(req, res) {
        const { firstName, lastName, username, emailId, password, phoneNumber } = req.body
        if (!firstName || !lastName || !username || !emailId || !password || !phoneNumber) {
            res.status(400).json({ error: "Invalid Request" })
        } else if (await getUserByUsername(username)) {
            res.json({ error: "user already exist" })
        } else if (await getUserByEmail(emailId)) {
            res.json({ error: "Email already exist" })
        } else if (await getUserByPhoneNumber(phoneNumber)) {
            res.json({ error: "Phone number already exist" })
        } else {
            const hashed_password = await bcrypt.hash(password, 10)
            const result = await addNewUser(firstName, lastName, username, emailId, hashed_password, phoneNumber)
            res.json(result)
        }
    }

    async function login(req, res) {
        const { username, password } = req.body
        const user = await getUserByUsername(username)
        const isPasswordValid = await bcrypt.compare(password, user.hashed_password)
        // console.log(isPasswordValid)
        if (!isPasswordValid) {
            res.json({ error: "User not found" })
        } else {
            const jwtToken = jwt.sign({ id: user.id, username }, config.JWT_SECRET)
            res.json({ id: user.id, jwtToken })
        }
    }

    async function updatePassword(req, res) {
        const { authorization } = req.headers
        const jwtToken = authorization.split(' ')[1]
        const { password } = req.body
        try {
            const payload = jwt.verify(jwtToken, config.JWT_SECRET)
            const hashed_password = await bcrypt.hash(password, 10)
            res.json(await updatePasswordByUsername(payload.username, hashed_password))
        } catch (e) {
            console.error(`error : ${e.message}`)
            res.json({ error: "Invalid token" })
        }
    }

    async function verifyToken(req, res) {
        const { authorization } = req.headers
        const jwtToken = authorization.split(' ')[1]
        try {
            const payload = jwt.verify(jwtToken, config.JWT_SECRET)
            res.json(payload)
        } catch (e) {
            res.json({ error: "Invalid Token" })
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