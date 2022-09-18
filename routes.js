const router = require('express').Router();
const dbConn = require('./dbConnection')
const md5 = require('md5');
const { body } = require('express-validator'); 
// const { login } = require('./controllers/loginController');
const auth = require("./middleware/auth") 
const {getuser,getcoursebycategory,getcoursebyid,topics,getyearsSeason,getcourseSemester,
    getCoursebyPresnter,getsalesemster,getprofessionalDiploma,getcourses,getSeasonName,
    getCourseid,getcoursebySemester} = require('./controllers/saleSemesterController');
const {courseRecordingStatusTrackList} = require('./controllers/courseRecordingStatusTrackController');
const {courserecordinglist,createNewcourse_recordings,updatecourseRecording} = require('./controllers/courseRecordingController');
const {courseObjectivetracklist,createNewObjectiveTrack,updateObjectiveTrack} = require('./controllers/courseObjectiveTrackController');
const {courseObjectiveStatusList,createNewobjectivestatus,updateobjectivestatus} = require('./controllers/courseObjectivestatusController');
const {courseObjectivelist,createNewcourseObjective,updatecourseObjective } = require('./controllers/courseObjectiveController');
const { createNewcourseAttendtrack,updatecourseAttendtrack,courseAttendTracklist } = require('./controllers/courseAttendenceTrackController');
const { courseAttendNetworlist, createNewcourseAttendNetwor,updatecourseAttendNetwor } = require('./controllers/courseAttendNetworkController');
const { courseAttendancelist,createNewcourseAttendance,updatecourseAttendance} = require('./controllers/courseAttendanceController');
const { createNewregisterProfile } = require('./controllers/registerprofileController');
const { courseList,createCourse } = require('./controllers/courseController');
const { createNewCoursesession, courseSessionlist, updateCoursesession } = require('./controllers/coursesessionController');
const {forgotPassword,updatepass,checkGroupUser,getGroupUser, createNewGroup,AddNewGroupUser, createUser, register ,registerNew , registerExisting  , applyScholarship , applyPonumber } = require('./controllers/registerController');
const {login} = require("./controllers/loginController")
const {facultyList,facultyStatus,AddFaculty} = require("./controllers/facultyController")
const {certificate,certificateWithname} = require("./controllers/certificateController")





// sale semester api list
router.get("/api/getyear/:year", getyearsSeason);
router.get("/api/getseasonname", getSeasonName);
// router.get("/api/getfaculty", getfaculty);
router.get("/api/getcourse/:presenter", getCoursebyPresnter);
router.get("/api/get/salesemster", getsalesemster);
router.get("/api/get/course/:trimester/:degreepro/:category", getprofessionalDiploma);
router.get("/api/get/courses/:trimester/:individual/:category", getcourses);
router.get("/api/get/courses/:courseid", getCourseid);
router.get("/api/get/topic/:courseid", topics);
router.get("/get/course/category", getcoursebycategory);

// get presenter
router.get("/api/get/user", getuser);

// certificate api
router.get('/api/certificate/:id', certificate) // certificate api

router.post('/api/get/certificate/withname', certificateWithname) // certificateWithname api
// router.post('/api/get/certificate/withcourse/:id', certificateWithcourse) // certificateWithcourse api



// Group Registration

router.post('/api/add/new/group', AddNewGroupUser) // get trainer list
router.get('/api/check/group', checkGroupUser) // get trainer list
router.get('/api/get/group', getGroupUser) // get trainer list
router.post('/api/add/group', createNewGroup) // get trainer list
router.post('/api/create/user', createUser) // get trainer list
router.post('/api/complete/registration/:id', register) // get trainer list
router.post('/api/complete/registration/existing/:id', registerExisting) // get trainer list
router.post('/api/complete/registration/new/:id', registerNew) // get trainer list
router.post('/api/forgot', forgotPassword)
router.post('/api/rest/password', updatepass)


// router.post('/sendtest', sendMailtest) // get trainer list


// login route

router.post('/api/login', login) // get trainer list 
// course list

router.get("/api/get/course/:id", getcoursebyid)
router.get("/api/listcourse", courseList)
router.post("/api/createcourse", createCourse)
router.get("/api/course/semester/:semesters", getcourseSemester)
router.get("/api/get/course/bysemester/:semesters", getcoursebySemester)

// router.put('/api/update/course/:id', updateCourse)
// router.delete('/api/delete/course/:id', deleteCourse)

// Discount API
router.post("/api/apply/scholarship", applyScholarship)
router.post("/api/apply/ponumber", applyPonumber)


// register profile
router.post("/api/ragisterprofile", createNewregisterProfile)

// faculty API
router.get("/api/faculty/list/:type", facultyList)
router.get("/api/faculty/status/:type/:status", facultyStatus)
router.post("/api/add/faculty", AddFaculty)

// coursesession api list
router.get("/api/coursesession/list", courseSessionlist) // get coursesession list
router.post("/api/create/coursesession", createNewCoursesession)
router.post("/api/update/coursesession/:id", updateCoursesession)

// courseattendance api list
router.get("/api/course/attendancelist/list", courseAttendancelist)
router.post("/api/create/courseattendance", createNewcourseAttendance)
router.put("/api/update/courseAttendance/:id", updatecourseAttendance)

// courseattendancenetwork api list
router.get("/api/course/networlist", courseAttendNetworlist)
router.post("/api/create/courseNetwork", createNewcourseAttendNetwor)
router.put("/api/update/courseNetwork/:id", updatecourseAttendNetwor)

// course attendancene track api list
router.get("/api/course/attendencetracklist", courseAttendTracklist)
router.post("/api/create/attendencetrack", createNewcourseAttendtrack)
router.put("/api/update/attendencetrack/:id", updatecourseAttendtrack)

// courseObjectivelist api list
router.get("/api/course/objectivelist", courseObjectivelist)
router.post("/api/create/courseObjective", createNewcourseObjective)
router.put("/api/update/courseObjective/:id", updatecourseObjective)


// courseObjectivestatus api list
router.get("/api/course/objectiveStatusList", courseObjectiveStatusList)
router.post("/api/create/objectivestatus", createNewobjectivestatus)
router.put("/api/update/objectivestatus/:id", updateobjectivestatus)


// courseObjectivetrack api list
router.get("/api/course/objectivetracklist", courseObjectivetracklist)
router.post("/api/create/objectiveTrack", createNewObjectiveTrack)
router.put("/api/update/objectiveTrack/:id", updateObjectiveTrack)


// course recording api list
router.get("/api/course/courserecordinglist", courserecordinglist)
router.post("/api/create/courserecording", createNewcourse_recordings)
router.put("/api/update/recording/:id", updatecourseRecording)


// course recording status tracker api list

router.get("/api/course/recordingStatusTrackList", courseRecordingStatusTrackList)
// router.post("/api/create/courserecording", createNewcourse_recordings)
// router.put("/api/update/recording/:id", updatecourseRecording)

router.get('/api/countries', function(req, res) {
    dbConn.query('SELECT * FROM country2', function(err, rows) {
 
        if (err) {
            res.json({
                status: false,
                message: err


            });
        } else {
            res.json({
                status: true,
                countries: rows
            });
        }
    });
});

module.exports = router;
