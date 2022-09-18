const courseRecordingStatusTrack = require('../models/courseRecordingStatusTrackModel')
const dbConn = require('../dbConnection');


// course recording list
exports.courseRecordingStatusTrackList = (req, resp) => {
    dbConn.query("select * from course_recordings_statustrack", (err, courseRecordingStatusTrackList) => {
        if(err)
        throw new Error(err)
        return resp.status(200).json({ 
            success: true,
            courseRecordingStatusTrackList
        })

    })
}

// create course recording
// exports.createNewcourse_recordings = (req, res) => {
//     console.log(req)
//     const data = new courseRecording(req.body)

//     // check null
//     if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//         res.status(400).json({
//             success: false,
//             message: 'Please fill all fields'
//         })
//     } else {
//         dbConn.query('SELECT * FROM course_recordings WHERE filename = ?', [req.body.filename] , (err, result) => {
//             if (err) {
//                 res.status(500).json({
//                     success: false,
//                     message: 'DB error',
//                 })
//             } else {
//                if(result.length > 0){
//                 res.status(400).json({
//                     success: false,
//                     message: 'Account already exist with this filename',
//                 })
//                }
//                else{
//                 courseRecording.createNewcourse_recordings(data, (err, courseRecording) => {
//                     if(err) {
//                         res.send(err)
//                         res.json({
//                             success: false,
//                             message: "Somothing went wrong",
//                             data: courseRecording
//                         })
//                     } else {
//                         let filename = true ; 
//                         if(req.body.sendfilename){
//                             filename  = sendfilename(req.body.filename,3) ;
                                
//                         }
                       
//                             res.status(201).json({
//                                 success: true,
//                                 message: 'course recording Inserted Successfully',
//                                 filename: filename,
//                             }) 
                       
//                     }
//                 })
//                }
//             }
//           })
       
//     }
// }

// update course recording
// exports.updatecourseRecording = (req, res)=>{
//     const data = new courseRecording(req.body);
//     // check null
//     if(req.body.constructor === Object && Object.keys(req.body).length === 0){
//         res.send(400).send({
//             success: false, 
//             message: 'Please fill all fields'
//         });
//     }else{
//         dbConn.query('SELECT * FROM course_objectives_statustrack WHERE filename = ? and id != ?', [req.body.name,req.params.id] , (err, result) => {
//             if (err) {
//                 res.status(500).json({
//                     success: false,
//                     message: 'DB error',
//                     error: err
//                 })
//             } else {
//                if(result.length > 0){
//                 res.status(400).json({
//                     success: false,
//                     message: 'Account already exist with this filename pdf',
//                 })
//                }
//                else{
//                 courseRecording.updatecourseRecording(req.params.id, data, (err)=>{
//                     if(err)
//                     res.send(err);
//                     res.json({
//                         status: true,
//                         message: 'course objective status updated Successfully',
//                     })
//                 })
//                }
       

//     }
// })
// }
// }
