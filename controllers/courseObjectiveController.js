const courseObjective = require('../models/courseObjectiveModel')
const dbConn = require('../dbConnection');


// courseObjective list
exports.courseObjectivelist = (req, resp) => {
    dbConn.query("select * from course_objectives", (err, courseObjective) => {
        if(err)
        throw new Error(err)
        return resp.status(200).json({ 
            success: true,
            courseObjective
        })

    })
}

// create courseObjective
exports.createNewcourseObjective = (req, res) => {
    console.log(req)
    const data = new courseObjective(req.body)

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    } else {
        dbConn.query('SELECT * FROM course_objectives WHERE filename = ?', [req.body.filename] , (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                })
            } else {
               if(result.length > 0){
                res.status(400).json({
                    success: false,
                    message: 'Account already exist with this filename pdf',
                })
               }
               else{
                courseObjective.createNewcourseObjective(data, (err, courseObjective) => {
                    if(err) {
                        res.send(err)
                        res.json({
                            success: false,
                            message: "Somothing went wrong",
                            data: courseObjective
                        })
                    } else {
                        let filename = true ; 
                        if(req.body.sendfilename){
                            filename  = sendfilename(req.body.filename,3) ;
                                
                        }
                       
                            res.status(201).json({
                                success: true,
                                message: 'Course Objective Inserted Successfully',
                                filename: filename,
                            }) 
                       
                    }
                })
               }
            }
          })
       
    }
}

// update courseattendance track
exports.updatecourseObjective = (req, res)=>{
    const data = new courseObjective(req.body);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        dbConn.query('SELECT * FROM course_objectives WHERE filename = ? and id != ?', [req.body.filename,req.params.id] , (err, result) => {
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
                    message: 'Account already exist with this filename pdf',
                })
               }
               else{
                courseObjective.updatecourseObjective(req.params.id, data, (err)=>{
                    if(err)
                    res.send(err);
                    res.json({
                        status: true,
                        message: 'course objective updated Successfully',
                    })
                })
               }
       

    }
})
}
}
