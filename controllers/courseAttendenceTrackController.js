const courseAttendTrack = require('../models/courseAttendenceTrackModel')
const dbConn = require('../dbConnection');


// coursesession list
exports.courseAttendTracklist = (req, resp) => {
    dbConn.query("select * from course_attendance_track", (err, courseAttendTracklist) => {
        if(err)
        throw new Error(err)
        return resp.status(200).json({ 
            success: true,
            courseAttendTracklist
        })

    })
}

// create course_attendance track
exports.createNewcourseAttendtrack = (req, res) => {
    console.log(req)
    const data = new courseAttendTrack(req.body)

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    } else {
        dbConn.query('SELECT * FROM course_attendance_track WHERE ipaddress = ?', [req.body.ipaddress] , (err, result) => {
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
                courseAttendTrack.createNewcourseAttendtrack(data, (err, createNewcourseAttendtrack) => {
                    if(err) {
                        res.send(err)
                        res.json({
                            success: false,
                            message: "Somothing went wrong",
                            data: createNewcourseAttendtrack
                        })
                    } else {
                        let ipaddress = true ; 
                        if(req.body.ipaddress){
                            ipaddress  = sendipaddress(req.body.ipaddress,3) ;
                                
                        }
                       
                            res.status(201).json({
                                success: true,
                                message: 'createNewcourseAttendtrack Inserted Successfully',
                                ipaddress: ipaddress,
                            })
                        
                        
                       
                    }
                })
               }
            }
          })
       
    }
}

// update courseattendance track
exports.updatecourseAttendtrack = (req, res)=>{
    const data = new courseAttendTrack(req.body);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        dbConn.query('SELECT * FROM course_attendance_track WHERE ipaddress = ? and id != ?', [req.body.ipaddress,req.params.id] , (err, result) => {
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
                courseAttendTrack.updatecourseAttendtrack(req.params.id, data, (err)=>{
                    if(err)
                    res.send(err);
                    res.json({
                        status: true,
                        message: 'course attendence track updated Successfully',
                    })
                })
               }
       

    }
})
}
}
