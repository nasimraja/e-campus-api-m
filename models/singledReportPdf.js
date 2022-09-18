const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var SingleSessionPdf = function(pdf) {
    this.session_id = pdf.session_id
    this.pdf_name = pdf.pdf_name
    this.data = pdf.data
    this.type = pdf.type
    this.status = pdf.status
    this.added_on = new Date()
}

// get all Client 
SingleSessionPdf.getAllPdf = (data,result) => {
   
        dbConn.query('SELECT * FROM session_data_report_pdf WHERE   session_id = ?    order by `id` desc', [data.session_id],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 
 
module.exports = SingleSessionPdf