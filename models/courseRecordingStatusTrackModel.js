const md5 = require('md5');
const dbConn = require('../dbConnection')


var courseRecordingStatusTrack = function(courseRecordingStatusTrack) {
    this.id = courseRecording.id
    this.trimesId = courseRecording.trimesId
    this.filename = courseRecording.filename
    this.descrip = courseRecording.descrip
    this.link = courseRecording.link
    this.filetype = courseRecording.filetype
    this.uploadedby = courseRecording.uploadedby
    this.uptime = courseRecording.uptime
    this.status = courseRecording.status
    this.fileval = courseRecording.fileval
    this.iframelink = courseRecording.iframelink
    
}


// create new course_objectives_track
// courseRecording.createNewRecordingStatusTrack = (data, result) => {
//     dbConn.query('INSERT INTO course_recordings_statustrack SET ? ', data, (err, res) => {
//         if (err) {
//             result(err ,null);
//         } else {
//             result(null, res)
//         }
//     })
// }

// update course_attendance track
// courseRecording.updatecourseRecording = (id, data, result) => {
//     dbConn.query("UPDATE course_recordings SET trimesId=?,filename=?,descrip=?,link=?, filetype=?,uploadedby=?,uptime=?,status=?,fileval=?,iframelink=? WHERE id = ?", [
//     data.trimesId,
//     data.filename,
//     data.descrip,
//     data.link,
//     data.filetype,
//     data.uploadedby,
//     data.uptime,
//     data.status,
//     data.fileval,
//     data.iframelink,
 
//         id
//         ], (err, res)=>{
//         if(err){
//             console.log('Error while updating the course recordings');
//             result(err ,null);

//         }else{
//             console.log("course recordings updated successfully");
//             result(null, res);
//         }
//     });
// }



module.exports = courseRecordingStatusTrack