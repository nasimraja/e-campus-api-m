const courseAttendNetwor = require('../models/courseAttendNetworkModel')
const dbConn = require('../dbConnection');


// coursesession list
exports.courseAttendNetworlist = (req, resp) => {
    dbConn.query("select * from course_attendance_newtrack", (err, courseAttendNetwor) => {
        if(err)
        throw new Error(err)
        return resp.status(200).json({ 
            success: true,
            courseAttendNetwor
        })

    })
}

// create course_attendance network
exports.createNewcourseAttendNetwor = (req, res) => {
    console.log(req)
    const data = new courseAttendNetwor(req.body)

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    } else {
        dbConn.query('SELECT * FROM course_attendance_newtrack WHERE ipaddress = ?', [req.body.ipaddress] , (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                })
            } else {
               if(result.length > 0){
                res.status(400).json({
                    success: false,
                    message: 'Account already exist with this ipaddress',
                })
               }
               else{
                courseAttendNetwor.createNewcourseAttendNetwor(data, (err, courseAttendNetwor) => {
                    if(err) {
                        res.send(err)
                        res.json({
                            success: false,
                            message: "Somothing went wrong",
                            data: courseAttendNetwor
                        })
                    } else {
                        let ipaddress = true ; 
                        if(req.body.sendipaddress){
                            ipaddress  = sendipaddress(req.body.ipaddress,3) ;
                                
                        }
                       
                            res.status(201).json({
                                success: true,
                                message: 'courseattendencenetwork Inserted Successfully',
                                ipaddress: ipaddress,
                            })
                        
                        
                       
                    }
                })
               }
            }
          })
       
    }
}

// update courseattendance network
exports.updatecourseAttendNetwor = (req, res)=>{
    const data = new courseAttendNetwor(req.body);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        dbConn.query('SELECT * FROM course_attendance_newtrack WHERE ipaddress = ? and id != ?', [req.body.ipaddress,req.params.id] , (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                    error: err
                })
            } else {
               if(result.length > 0){
                res.status(400).json({
                    success: false,
                    message: 'Account already exist with this ipaddress',
                })
               }
               else{
                courseAttendNetwor.updatecourseAttendNetwor(req.params.id, data, (err, courseAttendNetwor)=>{
                    if(err)
                    res.send(err);
                    res.json({
                        status: true,
                        message: 'course attendence network updated Successfully',
                    })
                })
               }
       

    }
})
}
}
