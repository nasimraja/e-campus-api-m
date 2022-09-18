const courseAttendance = require('../models/courseAttendanceModel')
const dbConn = require('../dbConnection');


// coursesession list
exports.courseAttendancelist = (req, resp) => {
    dbConn.query("select * from course_attendance", (err, courseAttendance) => {
        if(err)
        throw new Error(err)
        return resp.status(200).json({ 
            success: true,
            courseAttendance
        })

    })
}

// create course_attendance
exports.createNewcourseAttendance = (req, res) => {
    console.log(req)
    const data = new courseAttendance(req.body)

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    } else {
        dbConn.query('SELECT * FROM course_attendance WHERE stud_id = ?', [req.body.stud_id] , (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                })
            } else {
               if(result.length > 0){
                res.status(400).json({
                    success: false,
                    message: 'Account already exist with this stud_id',
                })
               }
               else{
                courseAttendance.createNewcourseAttendance(data, (err, courseAttendance) => {
                    if(err) {
                        res.send(err)
                        res.json({
                            success: false,
                            message: "Somothing went wrong",
                            data: courseAttendance
                        })
                    } else {
                        let courseid = true ; 
                        if(req.body.sendcourseid){
                            courseid  = sendcourseid(req.body.stud_id,3) ;
                                
                        }
                       
                            res.status(201).json({
                                success: true,
                                message: 'courseattendance Inserted Successfully',
                                courseid: courseid,
                            })
                        
                        
                       
                    }
                })
               }
            }
          })
       
    }
}

// update course_attendance
exports.updatecourseAttendance = (req, res)=>{
    const data = new courseAttendance(req.body);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        dbConn.query('SELECT * FROM course_attendance WHERE stud_id = ? and id != ?', [req.body.stud_id,req.params.id] , (err, result) => {
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
                    message: 'Account already exist with this studyid',
                })
               }
               else{
                courseAttendance.updatecourseAttendance(req.params.id, data, (err, courseAttendance)=>{
                    if(err)
                    res.send(err);
                    res.json({
                        status: true,
                        message: 'courseAttendance updated Successfully',
                    })
                })
               }
       

    }
})
}
}
