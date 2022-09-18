const md5 = require('md5');
const dbConn = require('../dbConnection')

 
var Session = function(session) {
    this.name = session.name
    this.hw = session.hw
    this.cid = session.cid
    this.zoom_link = session.zoom_link
    this.created = new Date()
}

// get all Client 
Session.getAllSession = (data,result) => {
   
        dbConn.query('SELECT * FROM client_session WHERE   cid = ? AND  hw = ?   order by `id` desc', [md5(data.cid) ,data.hw],  (err, res) => {
            if (err) {
              result(err ,null);
            } else {
              result(null, res)
            }
          })
    
  
} 




Session.updateZoomLink = (id,data,result) => {
   
  dbConn.query("UPDATE client_session SET  zoom_link=? WHERE id = ?  ", [
    data.zoom_link,
    id
    ], (err, res)=>{
    if(err){
        console.log(err);
        result(err ,null);;
    }else{
        console.log("Zoom link updated successfully");
        result(null, res);
    }
});

} 


Session.getSessionInfo = (data,result) => {
   
  dbConn.query('SELECT session.* , client.firstname as client_firstname, client.lastname as client_lastname, trainer.firstname as trainer_firstname ,trainer.lastname as trainer_lastname FROM client_session as session LEFT JOIN   capno_users as client on md5(client.id) = session.cid LEFT JOIN capno_users as trainer on md5(trainer.id) = client.associated_practioner WHERE   session.id = ?   order by `id` desc', [data.session_id ],  (err, res) => {
      if (err) {
        result(err ,null);
      } else {
        result(null, res)
      }
    })


} 
 
module.exports = Session