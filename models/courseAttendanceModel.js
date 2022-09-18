const md5 = require('md5');
const dbConn = require('../dbConnection')


var courseatend = function(courseatend) {
    this.id = courseatend.id
    this.courseid = courseatend.courseid
    this.stud_id = courseatend.stud_id
    this.attendance = courseatend.attendance
    
    

}


// create new course_attendance
courseatend.createNewcourseAttendance = (data, result) => {
    dbConn.query('INSERT INTO course_attendance SET ? ', data, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// update course_attendance
courseatend.updatecourseAttendance = (id, data, result) => {
    dbConn.query("UPDATE course_attendance SET courseid=?,stud_id=?,attendance=? WHERE id = ?", [
    data.courseid,
    data.stud_id,
    data.attendance,
        id
        ], (err, res)=>{
        if(err){
            console.log('Error while updating the coursesession');
            result(err ,null);

        }else{
            console.log("attendance updated successfully");
            result(null, res);
        }
    });
}



module.exports = courseatend