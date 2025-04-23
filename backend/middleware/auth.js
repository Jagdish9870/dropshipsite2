import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {

    const { token } = req.headers;
    console.log("token", token);
    
    if (!token) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }

    try {

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        console.log("token_decode", token_decode);
        
        next()

    } catch (error) {
        console.log("error", error.message)
        res.json({ success: false, message: error.message })
    }

}

export default authUser