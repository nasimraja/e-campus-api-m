const Course = require('../models/courseModel')
const dbConn = require('../dbConnection');


// course list
exports.courseList = (req, resp) => {
    dbConn.query("select * from course", (err, course) => {
        if(err)
        throw new Error(err)
        return resp.status(200).json({ 
            success: true,
            course
        })

    })
}

// create course
exports.createNewcourse = (req, res) => {
    console.log(req)
    const data = new Course(req.body)

    // check null
    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
        res.status(400).json({
            success: false,
            message: 'Please fill all fields'
        })
    } else {
        dbConn.query('SELECT * FROM course WHERE toemail = ?', [req.body.toemail] , (err, result) => {
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
                Course.createNewcourse(data, (err, Course) => {
                    if(err) {
                        res.send(err)
                        res.json({
                            success: false,
                            message: "Somothing went wrong",
                            data: Course
                        })
                    } else {
                        let email = true ; 
                        if(req.body.sendemail){
                            email  = sendEmail(req.body.toemail,3) ;
                                
                        }
                       
                            res.status(201).json({
                                success: true,
                                message: 'Course Inserted Successfully',
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
exports.updateCourse = (req, res)=>{
    const data = new Course(req.body);
    // check null
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.send(400).send({
            success: false, 
            message: 'Please fill all fields'
        });
    }else{
        dbConn.query('SELECT * FROM course WHERE toemail = ? and id != ?', [req.body.toemail,req.params.id] , (err, result) => {
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
                    message: 'Account already exist with this email',
                })
               }
               else{
                Course.updateCourse(req.params.id, data, (err, Course)=>{
                    if(err)
                    res.send(err);
                    res.json({
                        status: true,
                        message: 'Course updated Successfully',
                    })
                })
               }
       

    }
})
}
}

// delete Client
exports.deleteCourse = (req, res)=>{
    Course.deleteCourse(req.params.id, (err, Course)=>{
        if(err)
        res.send(err);
        res.json({success:true,
             message: 'course deleted successully!'
        });
    })
}
// create course
exports.createCourse = (req, resp)=>{
    
    const courseData = req.body;
  

    dbConn.query('SELECT * FROM course WHERE coursecode = ?', [req.body.coursecode] , (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
            })
        } else {
           if(result.length > 0){
            resp.status(400).json({
                success: false,
                message: 'Account already exist with this coursecode',
            })
           }
        }
        dbConn.query("INSERT INTO course SET ?", courseData, (error, result) => {
            if(error){
                resp.status(500).json({
                    success: false,
                    message: 'Somothing went wrong'
                })
            }
            else{
                resp.status(200).json({
                    success: true,
                    message: 'Course Inserted Successfully',
                   
                })
            }
    })

})
}

