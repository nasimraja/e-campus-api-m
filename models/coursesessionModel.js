const md5 = require('md5');
const dbConn = require('../dbConnection')


var coursesession = function(coursesession) {
    this.courseid = coursesession.courseid
    this.sessdate = coursesession.sessdate
    
    

}


// create new coursesession
coursesession.createNewCoursesession = (data, result) => {
    dbConn.query('INSERT INTO coursesession SET ? ', data, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// update coursesession
coursesession.updateCoursesession = (id, data, result) => {
    dbConn.query("UPDATE coursesession SET courseid=?,sessdate=? WHERE id = ?", [
    data.courseid,
    data.sessdate,
  
        id
        ], (err, res)=>{
        if(err){
            console.log('Error while updating the coursesession');
            result(err ,null);

        }else{
            console.log("coursesession updated successfully");
            result(null, res);
        }
    });
}



module.exports = coursesession