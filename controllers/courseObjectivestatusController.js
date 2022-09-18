const courseObjectiveStatus = require('../models/courseObjectivestatusModel')
const dbConn = require('../dbConnection');


// courseObjective list
exports.courseObjectiveStatusList = (req, resp) => {
    dbConn.query("select * from course_objectives_statustrack", (err, courseObjectiveStatus) => {
        if(err)
        throw new Error(err)
        return resp.status(200).json({ 
            success: true,
            courseObjectiveStatus
        })

    })
}

// create Newobjectivestatus
exports.createNewobjectivestatus = (req, res) => {
    console.log(req)
    const data = new courseObjectiveStatus(req.body)

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    } else {
        dbConn.query('SELECT * FROM course_objectives_statustrack WHERE ipaddress = ?', [req.body.ipaddress] , (err, result) => {
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
                courseObjectiveStatus.createNewobjectivestatus(data, (err, courseObjectiveStatus) => {
                    if(err) {
                        res.send(err)
                        res.json({
                            success: false,
                            message: "Somothing went wrong",
                            data: courseObjectiveStatus
                        })
                    } else {
                        let ipaddress = true ; 
                        if(req.body.sendipaddress){
                            ipaddress  = sendipaddress(req.body.ipaddress,3) ;
                                
                        }
                       
                            res.status(201).json({
                                success: true,
                                message: 'Course Objective Status Inserted Successfully',
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
exports.updateobjectivestatus = (req, res)=>{
    const data = new courseObjectiveStatus(req.body);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        dbConn.query('SELECT * FROM course_objectives_statustrack WHERE filename = ? and id != ?', [req.body.filename,req.params.id] , (err, result) => {
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
                courseObjectiveStatus.updateobjectivestatus(req.params.id, data, (err)=>{
                    if(err)
                    res.send(err);
                    res.json({
                        status: true,
                        message: 'course objective status updated Successfully',
                    })
                })
               }
       

    }
})
}
}
