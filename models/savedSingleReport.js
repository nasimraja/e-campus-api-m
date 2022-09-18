const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var SavedSingleReport = function(report) {
    this.session_id = report.session_id
    this.pid = report.pid
    this.name = report.name
    this.notes = report.notes
    this.pdf	 = report.pdf	
    this.status	 = report.status	
    this.timezone	 = report.timezone	
    this.added_on = new Date()
}

// get all Client 
SavedSingleReport.getAllReport = (data,result) => {
   
        dbConn.query('SELECT * FROM client_session_report WHERE   session_id = ?    order by `id` desc', [data.session_id],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 
 
// get all Client 
SavedSingleReport.getAllNotes = (data,result) => {
   
  dbConn.query('SELECT notes FROM client_session_report WHERE   session_id = ?  and notes is not NULL && notes != ""  order by `id` desc', [data.session_id],  (err, res) => {
      if (err) {
        result(err, err)
      } else {
        result(null, res)
      }
    })


} 

module.exports = SavedSingleReport