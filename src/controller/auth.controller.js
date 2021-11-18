const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const Auth = async (req, res) => {

    const {adminLogin, adminPassword} = req.body 
    
    const credentials = await db.query('SELECT * FROM admin WHERE email = $1', [adminLogin])
    
    if(credentials.rows.length) {

        const hashPass = credentials.rows[0].password

        if(await bcrypt.compare(adminPassword,hashPass)) {
            
            const accessToken = jwt.sign({}, process.env.PRIVAT_KEY, {expiresIn: '2h'})
            
            res.set({Authorization: `Bearer ${accessToken}`}).status(200).json({message: "Successfully authorizated!"})

        } else {

            res.status(400).send('Wrong login or password')
        }

    } else { 

        res.status(400).send('Wrong data')
    }
}



const isAuth = async (req, res, next) => {

    if(req.method === 'OPTIONS') {

        return next()
    }

    try {
        if(!req.headers.authorization) {

            res.status(401).send()

        } 
        const accessToken = req.headers.authorization.split(' ')[1]

        jwt.verify(accessToken, process.env.PRIVAT_KEY)

        next()
        
    } catch(error) {
        
        res.status(404).send()
    }
}



module.exports = {Auth, isAuth}