const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var SavedMultipleReport = function(report) {
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
SavedMultipleReport.getAllReport = (data,result) => {
   
        dbConn.query('SELECT * FROM multisession_data_report WHERE   clid = ?    order by `id` desc', [md5(data.client_id)],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 
 
module.exports = SavedMultipleReport