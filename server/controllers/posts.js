const { Post } = require('../models/post')
const { User } = require('../models/user')

module.exports = {
    addPost: async (req, res) => {
        try {
            const {
                title,
                content,
                status,
                userId } = req.body

            await Post.create({title, content, privateStatus: status, userId})

            res.sendStatus(200)
        } catch (err) {
            console.log(err)
            res.status(400).send('errow with adding post')
        }
    },
    
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.findAll({
                where: {privateStatus: false},
                include: [{
                    model: User,
                    required: true,
                    attributes: ['username']
                }]
            })

            res.send(posts)
        } catch (err) {
            console.log(err)
            res.status(400).send('error getting all posts')
        }
    },

    getCurrentUserPosts: async (req, res) => {
        try {
            const {userId} = req.params
            const posts = await Post.findAll({
                where: {userId: userId},
                include: [{
                    model: User,
                    required: true,
                    attributes: ['username']
                }]
            })

            res.send(posts)
        } catch (err) {
            console.log(err)
            res.status(400).send('error getting current posts')
        }
    },

    editPost: async (req, res) => {
        try {
            const { id } = req.params
            const { status } = req.body

            await Post.update({privateStatus: status}, {
                where: {id: +id}
            })

            res.sendStatus(200)
        } catch (err) {
            console.log(err)
            res.status(400).send('error editing post')
        }
    },

    deletePost: async (req, res) => {
        try {
            const { id } = req.params

            await Post.destroy({where: {id: +id}})

            res.sendStatus(200)
        } catch (err) {
            console.log(err)
            res.status(400).send('error deleting')
        }
    }
}