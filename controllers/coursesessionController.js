const Coursesession = require('../models/coursesessionModel')
const dbConn = require('../dbConnection');


// coursesession list
exports.courseSessionlist = (req, resp) => {
    dbConn.query("select * from coursesession", (err, coursesession) => {
        if(err)
        throw new Error(err)
        return resp.status(200).json({ 
            success: true,
            coursesession
        })

    })
}

// create Coursesession
exports.createNewCoursesession = (req, res) => {
    console.log(req)
    const data = new Coursesession(req.body)

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    } else {
        dbConn.query('SELECT * FROM coursesession WHERE courseid = ?', [req.body.courseid] , (err, result) => {
            if (err) {
                res.status(500).json({
                    success: false,
                    message: 'DB error',
                })
            } else {
               if(result.length > 0){
                res.status(400).json({
                    success: false,
                    message: 'Account already exist with this courseid',
                })
               }
               else{
                Coursesession.createNewCoursesession(data, (err, Coursesession) => {
                    if(err) {
                        res.send(err)
                        res.json({
                            success: false,
                            message: "Somothing went wrong",
                            data: Coursesession
                        })
                    } else {
                        let courseid = true ; 
                        if(req.body.sendcourseid){
                            courseid  = sendcourseid(req.body.courseid,3) ;
                                
                        }
                       
                            res.status(201).json({
                                success: true,
                                message: 'Coursesession Inserted Successfully',
                                courseid: courseid,
                            })
                        
                        
                       
                    }
                })
               }
            }
          })
       
    }
}

// update coursesection
exports.updateCoursesession = (req, res)=>{
    const data = new Coursesession(req.body);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        dbConn.query('SELECT * FROM coursesession WHERE courseid = ? and id != ?', [req.body.courseid,req.params.id] , (err, result) => {
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
                    message: 'Account already exist with this courseid',
                })
               }
               else{
                Coursesession.updateCoursesession(req.params.id, data, (err, Coursesession)=>{
                    if(err)
                    res.send(err);
                    res.json({
                        status: true,
                        message: 'Coursesession updated Successfully',
                    })
                })
               }
       

    }
})
}
}



