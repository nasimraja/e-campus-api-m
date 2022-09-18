
const dbConn = require('../dbConnection');
// const login = require('../models/loginModel')




exports.login = (req, res) => {
    console.log(req)
    console.log(req.body)
    // const data = new login(req.body)

    // check null
    console.log('SELECT * FROM users WHERE mail = "'+req.body.mail+'" and pass = "'+req.body.pass+'"')
    dbConn.query('SELECT * FROM users WHERE mail = ? and pass = ?', [req.body.mail, req.body.pass], (err, result) => {
        if (err) {

            let _resp = { 
                success: false,
                message: 'DB error',
            }
            console.log(_resp);
            res.status(500).json(_resp)
        } else { 
            console.log(result);
            if (result.length > 0) {
                let _resp = {
                    success: true,
                    message: 'log in successssss',
                    user: result[0].uid,
                }
                console.log(_resp);
                res.status(200).json(_resp)
            }
            else {
                let _resp = {
                    success: false,
                    message: 'log in failed',
                }
                console.log(_resp);
                res.status(404).json(_resp)
            }
        }
    })

}