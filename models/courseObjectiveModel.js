const md5 = require('md5');
const dbConn = require('../dbConnection')


var courseObjective = function(courseObjective) {
    this.id = courseObjective.id
    this.filename = courseObjective.filename
    this.descrip = courseObjective.descrip
    this.uploadedby = courseObjective.uploadedby
    this.uptime = courseObjective.uptime
    this.filetype = courseObjective.filetype
    this.link = courseObjective.link
    this.status = courseObjective.status
    this.courseId	 = courseObjective.courseId
    
}


// create new course objective
courseObjective.createNewcourseObjective = (data, result) => {
    dbConn.query('INSERT INTO course_objectives SET ? ', data, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// update course_attendance track
courseObjective.updatecourseObjective = (id, data, result) => {
    dbConn.query("UPDATE course_objectives SET filename=?,descrip=?,uploadedby=?,uptime=?, filetype=?,link=?,status=?,courseId=? WHERE id = ?", [
    data.filename,
    data.descrip,
    data.uploadedby,
    data.uptime,
    data.filetype,
    data.link,
    data.status,
    data.courseId,
 
        id
        ], (err, res)=>{
        if(err){
            console.log('Error while updating the course objective');
            result(err ,null);

        }else{
            console.log("course objective updated successfully");
            result(null, res);
        }
    });
}



module.exports = courseObjective