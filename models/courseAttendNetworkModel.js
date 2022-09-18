const md5 = require('md5');
const dbConn = require('../dbConnection')


var courseAttendNetwor = function(courseAttendNetwor) {
    this.id = courseAttendNetwor.id
    this.admin = courseAttendNetwor.admin
    this.name = courseAttendNetwor.name
    this.ipaddress = courseAttendNetwor.ipaddress
    this.action = courseAttendNetwor.action
    this.Time = courseAttendNetwor.Time
    this.attendance = courseAttendNetwor.attendance
    this.coursename	 = courseAttendNetwor.coursename
    
}


// create new course_attendance network
courseAttendNetwor.createNewcourseAttendNetwor = (data, result) => {
    dbConn.query('INSERT INTO course_attendance_newtrack SET ? ', data, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// update course_attendance network
courseAttendNetwor.updatecourseAttendNetwor = (id, data, result) => {
    dbConn.query("UPDATE course_attendance_newtrack SET admin=?,name=?,ipaddress=?,action=?,Time=?,attendance=?,coursename=? WHERE id = ?", [
    data.admin,
    data.name,
    data.ipaddress,
    data.action,
    data.Time,
    data.attendance,
    data.coursename,
 
        id
        ], (err, res)=>{
        if(err){
            console.log('Error while updating the course attendence network');
            result(err ,null);

        }else{
            console.log("course attendence network updated successfully");
            result(null, res);
        }
    });
}



module.exports = courseAttendNetwor