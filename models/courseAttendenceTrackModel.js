const md5 = require('md5');
const dbConn = require('../dbConnection')


var courseAttendTrack = function(courseAttendTrack) {
    this.id = courseAttendTrack.id
    this.admin = courseAttendTrack.admin
    this.name = courseAttendTrack.name
    this.ipaddress = courseAttendTrack.ipaddress
    this.action = courseAttendTrack.action
    this.Time = courseAttendTrack.Time
    this.oldattendance = courseAttendTrack.oldattendance
    this.newattendance = courseAttendTrack.newattendance
    this.coursename	 = courseAttendTrack.coursename
    
}


// create new course_attendance track
courseAttendTrack.createNewcourseAttendtrack = (data, result) => {
    dbConn.query('INSERT INTO course_attendance_track SET ? ', data, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// update course_attendance track
courseAttendTrack.updatecourseAttendtrack = (id, data, result) => {
    dbConn.query("UPDATE course_attendance_track SET admin=?,name=?,ipaddress=?,action=?,Time=?,oldattendance=?, newattendance=?,coursename=? WHERE id = ?", [
    data.admin,
    data.name,
    data.ipaddress,
    data.action,
    data.Time,
    data.oldattendance,
    data.newattendance,
    data.coursename,
 
        id
        ], (err, res)=>{
        if(err){
            console.log('Error while updating the course attendence track');
            result(err ,null);

        }else{
            console.log("course attendence track updated successfully");
            result(null, res);
        }
    });
}



module.exports = courseAttendTrack