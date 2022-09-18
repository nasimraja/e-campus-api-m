const registerProfile = require('../models/registerprofileModel')
const dbConn = require('../dbConnection');


// course list
// exports.courseList = (req, resp) => {
//     dbConn.query("select * from course", (err, registerProfile) => {
//         if(err)
//         throw new Error(err)
//         return resp.status(200).json({ 
//             success: true,
//             registerProfile
//         })

//     })
// }

// create registerProfile
exports.createNewregisterProfile = (req, res) => {
    console.log(req)
    const data = new registerProfile(req.body)

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    } else {
        dbConn.query('SELECT * FROM registerprofile WHERE email = ?', [req.body.email] , (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                })
            } else {
               if(result.length > 0){
                res.status(400).json({
                    success: false,
                    message: 'Account already exist with this email',
                })
               }
               else{
                registerProfile.createNewregisterProfile(data, (err, registerProfile) => {
                    if(err) {
                        res.send(err)
                        res.json({
                            success: false,
                            message: "Somothing went wrong",
                            data: registerProfile
                        })
                    } else {
                        let email = true ; 
                        if(req.body.sendemail){
                            email  = sendEmail(req.body.email,3) ;
                                
                        }
                       
                            res.status(201).json({
                                success: true,
                                message: 'Registerprofile Inserted Successfully',
                                email: email,
                            })
                        
                        
                       
                    }
                })
               }
            }
          })
       
    }
}

// update course
// exports.updateCourse = (req, res)=>{
//     const data = new Course(req.body);
//     // check null
//     if(req.body.constructor === Object && Object.keys(req.body).length === 0){
//         res.send(400).send({
//             success: false, 
//             message: 'Please fill all fields'
//         });
//     }else{
//         dbConn.query('SELECT * FROM course WHERE toemail = ? and id != ?', [req.body.toemail,req.params.id] , (err, result) => {
//             if (err) {
//                 res.status(500).json({
//                     success: false,
//                     message: 'DB error',
//                     error: err
//                 })
//             } else {
//                if(result.length > 0){
//                 res.status(400).json({
//                     success: false,
//                     message: 'Account already exist with this email',
//                 })
//                }
//                else{
//                 Course.updateCourse(req.params.id, data, (err, Course)=>{
//                     if(err)
//                     res.send(err);
//                     res.json({
//                         status: true,
//                         message: 'Course updated Successfully',
//                     })
//                 })
//                }
       

//     }
// })
// }
// }



