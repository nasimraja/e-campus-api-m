const dbConn = require('../dbConnection');

exports.facultyList = (req, resp)=>{
    dbConn.query("SELECT users.thumb, users.name, users.lastname, users.mail, users.courseid as userscourseid, course.course as coursename  FROM users LEFT JOIN course ON course.id = users.courseid WHERE type = ?", [req.params.type], (err, result)=>{

        if(err){
            resp.status(500).json({
                success: false,
                messege: "DB error"
            })
        }else resp.status(200).json({
            success: true,
            result
        })

    }) 
}

exports.facultyStatus = (req, resp)=>{
    dbConn.query("SELECT * FROM users WHERE status = ? and type = ?", [req.params.status,req.params.type], (err, result)=>{

        if(err){
            resp.status(500).json({
                success: false,
                messege: "DB error"
            })
        }else resp.status(200).json({
            success: true,
            result
        })

    }) 
}

exports.AddFaculty = (req, resp)=>{
    
    const facultyData = req.body;

    dbConn.query('SELECT * FROM users WHERE mail = ?', [req.body.mail] , (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
            })
        } else {
           if(result.length > 0){
            resp.status(400).json({
                success: false,
                message: 'Account already exist with this mail',
            })
           }
        }
        dbConn.query("INSERT INTO users SET ?", facultyData, (error, result) => {
            if(error){
                resp.status(500).json({
                    success: false,
                    message: 'Somothing went wrong'
                })
            }
            else{
                resp.status(200).json({
                    success: true,
                    message: 'Add faculty Successfully',
                   
                })
            }
    })

})
}



