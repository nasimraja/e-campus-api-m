const courseObjectiveTrack = require('../models/courseObjectiveTrackModel')
const dbConn = require('../dbConnection');


// courseObjective list
exports.courseObjectivetracklist = (req, resp) => {
    dbConn.query("select * from course_objectives_track", (err, courseObjectivetracklist) => {
        if(err)
        throw new Error(err)
        return resp.status(200).json({ 
            success: true,
            courseObjectivetracklist
        })

    })
}

// create Newobjectivestatus
exports.createNewObjectiveTrack = (req, res) => {
    console.log(req)
    const data = new courseObjectiveTrack(req.body)

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    } else {
        dbConn.query('SELECT * FROM course_objectives_track WHERE ipaddress = ?', [req.body.ipaddress] , (err, result) => {
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
                courseObjectiveTrack.createNewObjectiveTrack(data, (err, courseObjectiveTrack) => {
                    if(err) {
                        res.send(err)
                        res.json({
                            success: false,
                            message: "Somothing went wrong",
                            data: courseObjectiveTrack
                        })
                    } else {
                        let ipaddress = true ; 
                        if(req.body.sendipaddress){
                            ipaddress  = sendipaddress(req.body.ipaddress,3) ;
                                
                        }
                       
                            res.status(201).json({
                                success: true,
                                message: 'Course Objective Track Inserted Successfully',
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
exports.updateObjectiveTrack = (req, res)=>{
    const data = new courseObjectiveTrack(req.body);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        dbConn.query('SELECT * FROM course_objectives_statustrack WHERE name = ? and id != ?', [req.body.name,req.params.id] , (err, result) => {
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
                courseObjectiveTrack.updateObjectiveTrack(req.params.id, data, (err)=>{
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
