const md5 = require('md5');
const dbConn = require('../dbConnection')


var courseObjectiveStatus = function(courseObjectiveStatus) {
    this.id = courseObjectiveStatus.id
    this.admin = courseObjectiveStatus.admin
    this.name = courseObjectiveStatus.name
    this.ipaddress = courseObjectiveStatus.ipaddress
    this.action = courseObjectiveStatus.action
    this.Time = courseObjectiveStatus.Time
    this.newStatus = courseObjectiveStatus.newStatus
    this.oldStatus = courseObjectiveStatus.oldStatus
    this.filename	 = courseObjectiveStatus.filename
    this.description = courseObjectiveStatus.description
    this.uploadedby	 = courseObjectiveStatus.uploadedby
    
}


// create new course_objectives_statustrack
courseObjectiveStatus.createNewobjectivestatus = (data, result) => {
    dbConn.query('INSERT INTO course_objectives_statustrack SET ? ', data, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// update course_attendance track
courseObjectiveStatus.updateobjectivestatus = (id, data, result) => {
    dbConn.query("UPDATE course_objectives_statustrack SET admin=?,name=?,ipaddress=?,action=?, Time=?,newStatus=?,oldStatus=?,filename=?,description=?,uploadedby=? WHERE id = ?", [
    data.admin,
    data.name,
    data.ipaddress,
    data.action,
    data.Time,
    data.newStatus,
    data.oldStatus,
    data.filename,
    data.description,
    data.uploadedby,
 
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



module.exports = courseObjectiveStatus