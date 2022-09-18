const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var ConfiguredReportGraph = function(report) {
    this.name = report.name
    this.status = report.status
    this.original = report.original
    this.byuser = report.byuser
    this.type = report.type
    this.created_at = new Date()
    this.updated_at = new Date()
}

 

// get all Config 
ConfiguredReportGraph.getAllGraph = (data,result) => {
   
        dbConn.query('SELECT * FROM pre_configured_graphs WHERE    pid = ?   order by `graph_order` asc', [data.report_id],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 
  


module.exports = ConfiguredReportGraph