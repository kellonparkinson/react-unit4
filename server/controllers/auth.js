require('dotenv').config()

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User } = require('../models/user')
const { SECRET } = process.env

const createToken = (username, id) => {
    return jwt.sign(
        {
            username,
            id
        },
        SECRET,
        { 
            expiresIn: '2 days' 
        },
    )
}

module.exports = {
    register: async (req, res) => {
        // console.log('register')

        try {
            const { username, password } = req.body

            let foundUser = await User.findOne({where: {username}})

            if (foundUser) {
                res.status(400).send('cannot create user')
            } else {
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(password, salt)
                const newUser = await User.create({username, hashedPass: hash})
                const token = createToken(newUser.dataValues.username, newUser.dataValues.id)
                console.log('token', token)

                const exp = Date.now() + 1000 * 60 * 60 * 48
                res.send({
                    username: newUser.dataValues.username, 
                    userId: newUser.dataValues.id,
                    token, 
                    exp,
                })
            }
        } catch (err) {
            console.log(err)
            res.status(400).send('error with register')
        }
    },

    login: async (req, res) => {
        // console.log('login')

        try {
            const { username, password } = req.body

            let foundUser = await User.findOne({where: {username}})

            if (foundUser) {
                const isAuth = bcrypt.compareSync(password, foundUser.hashedPass)

                if (isAuth) {
                    const token = createToken(foundUser.dataValues.username, foundUser.dataValues.id)
                    const exp = Date.now() + 1000 * 60 * 60 * 48

                    res.send({
                        username: foundUser.dataValues.username, 
                        userId: foundUser.dataValues.id,
                        token, 
                        exp,
                    })
                } else {
                    res.status(400).send('error logging in')
                }

            } else {
                res.status(400).send('error logging in')
            }
        } catch (err) {
            console.log(err)
            res.status(400).send('error with login')
        }
    },
}