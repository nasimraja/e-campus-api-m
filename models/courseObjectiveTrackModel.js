const md5 = require('md5');
const dbConn = require('../dbConnection')


var courseObjectiveTrack = function(courseObjectiveTrack) {
    this.id = courseObjectiveTrack.id
    this.admin = courseObjectiveTrack.admin
    this.name = courseObjectiveTrack.name
    this.ipaddress = courseObjectiveTrack.ipaddress
    this.action = courseObjectiveTrack.action
    this.Time = courseObjectiveTrack.Time
    this.course = courseObjectiveTrack.course
    this.description = courseObjectiveTrack.description
    
}


// create new course_objectives_track
courseObjectiveTrack.createNewObjectiveTrack = (data, result) => {
    dbConn.query('INSERT INTO course_objectives_track SET ? ', data, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// update course_attendance track
courseObjectiveTrack.updateObjectiveTrack = (id, data, result) => {
    dbConn.query("UPDATE course_objectives_track SET admin=?,name=?,ipaddress=?,action=?, Time=?,course=?,description=? WHERE id = ?", [
    data.admin,
    data.name,
    data.ipaddress,
    data.action,
    data.Time,
    data.course,
    data.description,
 
        id
        ], (err, res)=>{
        if(err){
            console.log('Error while updating the course objective status');
            result(err ,null);

        }else{
            console.log("course objective status updated successfully");
            result(null, res);
        }
    });
}



module.exports = courseObjectiveTrack