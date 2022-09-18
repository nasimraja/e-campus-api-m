const Group = require('../models/groupModel')
const dbConn = require('../dbConnection')
const md5 = require('md5')
require('dotenv').config()
const formidable = require('formidable');
const jsftp = require("jsftp");
const fs = require("fs");
const nodemailer = require("nodemailer");


const Ftp = new jsftp({
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT, // defaults to 21
    user: process.env.FTP_USER, // defaults to "anonymous"
    pass: process.env.FTP_PASS // defaults to "@anonymous"
  });


  

// apply shcolarship code


exports.applyPonumber = (req, res) => {
    
    console.log(req.body);
    let _now = new Date().getTime() ; 
    console.log('SELECT * FROM `po-code` WHERE code = '+req.body.code+' and date(expiry) > date('+_now+')')
    dbConn.query('SELECT * FROM `po-code` WHERE code = ? ', [req.body.code] , (err, result) => {
        if (err) {
            let _resp = {
                success: false,
                message: 'DB error',
            }
            console.log(_resp);

            res.status(500).json(_resp)
        } else {
       
        if (result.length == 0) {
            
            let _resp = {
                success: true,
                exist: false,
            }
            console.log(_resp);
            res.status(200).json(_resp)
        }
        else{
            let _payable = req.body.payable ;  
            let _balance = req.body.balance ;  
           
             let _resp = {
                success: true,
                exist: true,
                payable: _payable,
                balance: _balance 
            }
         
            res.status(200).json(_resp)
        }
    }
    
})

}
 

exports.applyScholarship = (req, res) => {
    console.log(req.body);
    dbConn.query('SELECT * FROM `discount-coupon` WHERE semsid = ? and couponcode = ? ', [req.body.semsid,req.body.couponcode] , (err, result) => {
        if (err) {
            let _resp = {
                success: false,
                message: 'DB error',
            }
            console.log(_resp);

            res.status(500).json(_resp)
        } else {
            let price =  process.env.PRICE
        if (result.length == 0) {
            
            let _resp = {
                success: true,
                exist: false,
            }
            console.log(_resp);
            res.status(200).json(_resp)
        }
        else{
            let _payable = req.body.payable ;  
            let _balance = parseInt(req.body.balance) ;  
            let _totalCost = _payable + _balance ;

            let _discount_type = result[0].type ; 
            let _discount_value = result[0].amount ; 
            let _discount_amount = _discount_value ; 
            if(_discount_type == "Percent"){
                _discount_amount = parseFloat((_discount_value/100)*_totalCost).toFixed(2) ; 
            }

            let _remaining = 0 ; 
            if(_discount_amount > _balance) {
                // _balance = _balance ; 
                _remaining = parseFloat(_discount_amount - _balance).toFixed(2) ;
                if(_remaining < _payable) {
                    _payable = parseFloat(_remaining).toFixed(2) ; 

                }
                
            }
            else{
                _balance = parseFloat(_balance - _discount_amount).toFixed(2) ; 
            }
            
             let _resp = {
                success: true,
                exist: true,
                payable: _payable,
                balance: _balance,
                discount_amount : _discount_amount,
                totalCost : _totalCost,
                remaining : _remaining
            }
            console.log(_resp);
            res.status(200).json(_resp)
        }
    }
    
})

}
 



// get user in a Group list
exports.getGroupUser = (req, res) => {
    console.log(req.query);
    dbConn.query('SELECT * FROM temp_group WHERE primaryEmail = ? and status = 0 ', [req.query.email] , (err, result) => {
        if (err) {
            let _resp = {
                success: false,
                message: 'DB error',
            }
            console.log(_resp);

            res.status(500).json(_resp)
        } else {
            
        if (result.length == 0) {
           
            let _resp = {
                success: true,
                exist: false,
                 
            }
            console.log(_resp);
            res.status(200).json(_resp)
        }
        else{
             

            let _resp = {
                success: true,
                exist: true,

                members: result,
            }
            console.log(_resp);
            res.status(200).json(_resp)
        }
    }
    
})

}
 

// get user in a Group list
exports.checkGroupUser = (req, res) => {
    console.log(req.query);
    dbConn.query('SELECT * FROM temp_group WHERE email = ? and status = 0 ', [req.query.email] , (err, result) => {
        if (err) {
            let _resp = {
                success: false,
                message: 'DB error',
            }
            console.log(_resp);

            res.status(500).json(_resp)
        } else {
            let price =  process.env.PRICE
        if (result.length == 0) {
            console.log({
                success: true,
                exist: false,
                price: price,
                discount: 0
            })
            let _resp = {
                success: true,
                exist: false,
                price: price,
                discount: 0
            }
            console.log(_resp);
            res.status(200).json(_resp)
        }
        else{
             price =  parseInt(price - parseInt((price * parseInt(result[0].discount)) / 100)) ; 
            console.log({
                success: true,
                exist: true,
                price: price,
                discount: result[0].discount
            })

            let _resp = {
                success: true,
                exist: true,
                price: price,
                discount: result[0].discount
            }
            console.log(_resp);
            res.status(200).json(_resp)
        }
    }
    
})

}
 
 
// create new Group
exports.createNewGroup = (req, res) => {
    console.log(req.body)
    const data =  req.body ;
    // console.log(req.query);
 
    let arrayData = [] ;    
    data.members.map((v,i) => {
            arrayData.push([ v.firstname, v.lastname,v.email, data.members[0].email,data.discount]);
        })
 
        var sql = "INSERT INTO temp_group (firstname, lastname, email , primaryEmail ,discount) VALUES ?";
        dbConn.query(sql, [arrayData], (err, result) => {
            if (err) {
             let _resp = {
                 
                status: false,
                message: err,
            } ; 

            console.log(_resp);
            res.status(500).json(_resp);
            } else {

                let toAdmin = data.members[0].email;

                let subjectAdmin = 'Your NeuroAcrobatics Registration Group.';
                let htmlAdmin  = "<p>Dear Group Organizer:</p>";
                htmlAdmin += "<p>Thank you so much for your support.</p>"
                htmlAdmin += "<p>Here is a list of the names and emails of the people you've included as part of your Discount Registration Group.";
                data.members.map((v,i) => {
                    htmlAdmin += "<li>"+v.firstname+ " " + v.lastname+" : "+v.email+"</li>";
                })  
                htmlAdmin += "<p>Each of these individuals has received an invitation to register at the appropriate discount.</p>";
                htmlAdmin += "<p>Should you wish to add more people to your group, go to https://neuroacrobatics.com/course/neuroacrobatics/, click on Group Registration, click on “Add Yourself,” and your Group will appear with the option to add more names.</p>";
                htmlAdmin += "<p>We look forward to seeing you soon. </p>";
                htmlAdmin += "<p>Sincerely,<br />";
                htmlAdmin += " Peter M. Litchfield, Ph.D., President<br />";
                htmlAdmin += "<b>Professional School of Behavioral Health Sciences</b><br />";
                htmlAdmin += "education@bp.edu</p>";

                sendMail(toAdmin,subjectAdmin,subjectAdmin,htmlAdmin); 

                data.members.map((v,i) => {
                    if(i > 0){
                        let toAdmin = v.email;

                        let subjectAdmin = '“NeuroAcrobatics: Invitation to register.”';
                        let htmlAdmin  = "<p>Dear Colleague:</p>";
                        htmlAdmin += '<p>'+ data.members[0].firstname+' '+data.members[0].lastname+' has included you as a Member of a Discount Registration Group for our very special program offering, “NeuroAcrobatics.”';
    
                        htmlAdmin += "<p>If you wish to learn more about this program and/or wish to register as part of this Discount Registration Group, go to https://neuroacrobatics.com/course/neuroacrobatics/ and complete the registrant profile.  The program discount will automatically appear upon entering your name and email.</p>";
                        htmlAdmin += "<p>We hope to see you in the upcoming program!</p>";
                        htmlAdmin += "<p>Sincerely,<br />";
                        htmlAdmin += " Peter M. Litchfield, Ph.D., President<br />";
                        htmlAdmin += "<b>Professional School of Behavioral Health Sciences</b><br />";
                        htmlAdmin += "education@bp.edu</p>";
                        sendMail(toAdmin,subjectAdmin,subjectAdmin,htmlAdmin); 
                    }
                 
                })

                let _resp = {
                    status: true,
                    message: "Added",
                } ; 
        
                res.status(200).json(_resp)
            }
        })
     
        
     
}



// create new Group
exports.AddNewGroupUser = (req, res) => {
    console.log(req.body)
    const data =  req.body ;
    // console.log(req.query);
 
    let arrayData = [] ;    
    data.members.map((v,i) => {
            arrayData.push([ v.firstname, v.lastname,v.email, data.primaryEmail,data.discount]);
        })
 
        var sql = "INSERT INTO temp_group (firstname, lastname, email , primaryEmail ,discount) VALUES ?";
        dbConn.query(sql, [arrayData], (err, result) => {
            if (err) {
             let _resp = {
                 
                status: false,
                message: err,
            } ; 

            console.log(_resp);
            res.status(500).json(_resp);
            } else {
                dbConn.query('SELECT * FROM temp_group WHERE email = ?   ', [data.primaryEmail] , (err, resultPrimary) => {
                    if (err) {
        
                        let _resp = {
                            success: false,
                            message: 'DB error',
                        }
                        console.log(_resp);
                        res.status(500).json(_resp)
                    } else {
                       
                    if (resultPrimary.length > 0) {
    data.members.map((v,i) => {

                let toAdmin = v.email;

                let subjectAdmin = '“NeuroAcrobatics: Invitation to register.”';
                let htmlAdmin  = "<p>Dear Colleague:</p>";
                htmlAdmin += '<p>'+ resultPrimary[0].firstname+' '+resultPrimary[0].lastname+' has included you as a Member of a Discount Registration Group for our very special program offering, “NeuroAcrobatics.”';

                htmlAdmin += "<p>If you wish to learn more about this program and/or wish to register as part of this Discount Registration Group, go to https://neuroacrobatics.com/course/neuroacrobatics/ and complete the registrant profile.  The program discount will automatically appear upon entering your name and email.</p>";
                htmlAdmin += "<p>We hope to see you in the upcoming program!</p>";
                htmlAdmin += "<p>Sincerely,<br />";
                htmlAdmin += " Peter M. Litchfield, Ph.D., President<br />";
                htmlAdmin += "<b>Professional School of Behavioral Health Sciences</b><br />";
                htmlAdmin += "education@bp.edu</p>";
                sendMail(toAdmin,subjectAdmin,subjectAdmin,htmlAdmin); 
    })
                let _resp = {
                    status: true,
                    message: "Added",
                } ; 
                console.log(_resp);
                res.status(200).json(_resp)

            }
            else{
                let _resp = {
                    status: true,
                    message: "Added But email not sent",
                } ; 
                console.log(_resp);
                res.status(200).json(_resp)

            }
        
            }

        })

            }
        })
     
        
     
}
 

// Create User
exports.createUser = (req, res)=>{
    console.log(req.body)
    var form = new formidable.IncomingForm();
    // console.log(form);
 
    form.parse(req, function (err, fields, files) {
   
        dbConn.query('SELECT * FROM users WHERE mail = ?   ', [fields.email] , (err, result) => {
            if (err) {

                let _resp = {
                    success: false,
                    message: 'DB error',
                }
                console.log(_resp);
                res.status(500).json(_resp)
            } else {
               
            if (result.length > 0) {

                let _resp = {
                    success: false,
                    exist: true,
                }
                console.log(_resp);
                res.status(200).json(_resp)
            }
            else{
        // console.log(files);
        if(files.cv){
            var oldpath = files.cv.filepath;
        var fileName = files.cv.originalFilename
        let _name = Math.floor(Math.random() * 100).toString() +  new Date().getTime().toString() + fileName.replace(/\s+/g, "-") ; 
        let _remote = "/"+ _name; 
         fs.readFile(oldpath, function(err, buffer) {
        if(err) {
            console.error(err);
          
        }
        else {
            Ftp.put(buffer, _remote, err => {
               
                    if(err){
                        let _resp = { 
                            status: false,
                            message : err
                        }
                        console.log(_resp);
                        return res.status(500).json(_resp)
                    }
                    else{
               dbConn.query('INSERT INTO `users_temp`( `fname`, `lname`, `email`, `phone`, `country`, `add1`, `add2`, `city`, `state`, `zip`, `username`, `password`, `paymentoptions`, `amount`, `semsids`, `classes`, `profession`, `highestdeg`, `degrefield`, `yeardegree`, `licenses`, `certifications`, `experienceyears`, `referredyou`,`referredfiled`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ',[fields.fname,fields.lname,fields.email,fields.phone,fields.country,fields.add1,fields.add2,fields.city,fields.state,fields.zip,fields.username,fields.password,fields.paymentoptions,fields.amount,fields.semsids,fields.classes,fields.profession,fields.highestdeg,fields.degrefield,fields.yeardegree,fields.licenses,fields.certifications,fields.experienceyears,fields.referredyou,fields.referredfiled], (err, result) => {
                            if (err) {
                                
                                let _resp = { 
                                    status: false,
                                    message : "not uploaded"
                                }
                                console.log(_resp);
                                return res.status(500).json(_resp)
                            } else {
                                
                                let _resp = { 
                                    status: true,
                                    message : "uploaded",
                                    id: result.insertId
                                    
                                }
                                console.log(_resp);
                                return res.status(200).json(_resp)
                            }
                          })
                    }
            });
       }
   
    });
}else{
    dbConn.query('INSERT INTO `users_temp`( `fname`, `lname`, `email`, `phone`, `country`, `add1`, `add2`, `city`, `state`, `zip`, `username`, `password`, `paymentoptions`, `amount`, `semsids`, `classes`, `profession`, `highestdeg`, `degrefield`, `yeardegree`, `licenses`, `certifications`, `experienceyears`, `referredyou`,`referredfiled`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ',[fields.fname,fields.lname,fields.email,fields.phone,fields.country,fields.add1,fields.add2,fields.city,fields.state,fields.zip,fields.username,fields.password,fields.paymentoptions,fields.amount,fields.semsids,fields.classes,fields.profession,fields.highestdeg,fields.degrefield,fields.yeardegree,fields.licenses,fields.certifications,fields.experienceyears,fields.referredyou,fields.referredfiled], (err, result) => {
        console.log();
        if (err) {

            let _resp = { 
                status: false,
                message : "not uploaded"
            }
            console.log(_resp)
            return res.status(500).json(_resp)
        } else {

            let _resp = { 
                status: true,
                message : "uploaded",
                id: result.insertId
            }
            console.log(_resp)
            return res.status(200).json(_resp)
        }
      })
}
            }
        }
      })

});
}



exports.registerNew = (req, res)=>{
    console.log(req.params);
    dbConn.query('SELECT * FROM users_temp WHERE id = ? ', [req.params.id] , (err, result) => {
        if (err) {
            let = _resp = { 
                status: false,
                message : err
            }
            console.log(_resp)
            return res.status(500).json(_resp)
        } else {
            if(result.length >0 ){
                let _courseid = result[0].classes.toString()  ;

                dbConn.query('SELECT * FROM relativecourse WHERE FIND_IN_SET(courseid , ?)', [_courseid] , (err, resultCourses) => {
                  if(resultCourses.length > 0){
                    resultCourses.map((v,i) => {
                        _courseid = _courseid + ',' + v.relativecourses ; 
                    })   
            
                  }   
                  
                  
    dbConn.query('INSERT INTO `users`( `name`, `lastname`, `mail`, `phone`, `country`, `address`, `addresstwo`, `city`, `state`, `zip`, `username`, `pass`,  `semester_id`, `courseid`, `profession1`, `highestdeg`, `degrefield`, `yeardegree`, `licenses`, `certifications`, `experienceyears`, `referredyou`,`referredfiled`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ',[result[0].fname,result[0].lname,result[0].email,result[0].phone,result[0].country,result[0].add1,result[0].add2,result[0].city,result[0].state,result[0].zip,result[0].username,result[0].password,result[0].semsids,_courseid,result[0].profession,result[0].highestdeg,result[0].degrefield,result[0].yeardegree,result[0].licenses,result[0].certifications,result[0].experienceyears,result[0].referredyou,result[0].referredfiled], (err, resultAdd) => {
      
        if (err) {

            let _resp = { 
                status: false,
                message : err
            }
            console.log(_resp)
            return res.status(500).json(_resp)
        } else {
            dbConn.query('SELECT * FROM course WHERE FIND_IN_SET(id, ?) ', [result[0].classes] , (err, resultCourse) => {

                if (err) {

                    let _resp = { 
                        status: false,
                        message : err
                    }
                    console.log(_resp)
                    return res.status(500).json(_resp)
                } else {

                    let _nextDate =  resultCourse.length > 0 ? resultCourse[0].bc_date ? resultCourse[0].bc_date : 0 : 0 ;
    dbConn.query('INSERT INTO `users_billing`(`userid`, `usersess`, `bilemail`, `bilfname`, `billname`, `billaddress`, `billcity`, `bilstate`, `billzip`, `billcon`, `amount`, `details`,`discountcoupon`,`pocode`,`balance`,`next_date`)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ',[result[0].email,'NewPayment',result[0].email,result[0].fname,result[0].lname,result[0].add1,result[0].city,result[0].state,result[0].zip,result[0].country,0,JSON.stringify(req.body.details),req.body.discountcoupon,req.body.pocode , req.body.balance,_nextDate], (err, resultBill) => {
        if (err) {

            let _resp = { 
                status: false,
                message : err,
                id: resultAdd.insertId
            }
            console.log(_resp)
            return res.status(500).json(_resp)
        } else {
            let toStud  = result[0].email ; 
            let subjectStud  = 'You are successfully registered '+ resultCourse[0].coursecode+ ' '+resultCourse[0].course ; 
            if(resultCourse[0].emailcontent){
                sendMail(toStud,subjectStud,subjectStud,resultCourse[0].emailcontent); 
            }

            let toAdmin = "education@bp.edu";
            // let toAdmin = "yasirkhancse@gmail.com";

            let subjectAdmin = result[0].fname+' '+result[0].lname+' is successfully registered e-campus.bp.edu';
            let htmlAdmin  = "<p>Hello Admin,</p>";
            htmlAdmin += "<p>"+result[0].fname+" "+result[0].lname+" has registered. See details below:</p>";
            // htmlAdmin += "<p>Below are the student details and the Course name:</p>";
            htmlAdmin += "<p>Student Name: "+result[0].fname+" "+result[0].lname+"</p>";
            htmlAdmin += "<p>Student Email: "+result[0].email+"</p>";
            htmlAdmin += "<p>Course Name: "+resultCourse[0].coursecode+ ' '+resultCourse[0].course+"</p>";
            htmlAdmin += "<p>Amount Paid: $"+req.body.paidAmount +"</p>";
            htmlAdmin += "<p>Scholarship Code: "+(req.body.discountcoupon == "" || !req.body.discountcoupon ? "NA" : req.body.discountcoupon)+"</p>";
            htmlAdmin += "<p>PO Number: "+(req.body.pocode == "" || !req.body.pocode ? "NA" : req.body.pocode )+"</p>";
            let date = new Date().toLocaleString() ;
            htmlAdmin += "<p>Registration Date: "+date+"</p>";
            sendMail(toAdmin,subjectAdmin,subjectAdmin,htmlAdmin); 
           

            let _resp = { 
                status: true,
                message : "added",
                id: resultAdd.insertId
            }
            console.log(_resp)
            return res.status(200).json(_resp)
        }
      })
      
    }
})
      
    }
})
})

            }
            else{
                let _resp = { 
                    status: false,
                    message : "not found"
                } 
                console.log(_resp)
                return res.status(404).json(_resp)
            }

}
})

}
    



exports.register = (req, res)=>{
    console.log(req.params);
    dbConn.query('SELECT * FROM users_temp WHERE id = ? ', [req.params.id] , (err, result) => {
        if (err) {
            let = _resp = { 
                status: false,
                message : err
            }
            console.log(_resp)
            return res.status(500).json(_resp)
        } else {
            if(result.length >0 ){

    dbConn.query('INSERT INTO `users`( `name`, `lastname`, `mail`, `phone`, `country`, `address`, `addresstwo`, `city`, `state`, `zip`, `username`, `pass`,  `semester_id`, `courseid`, `profession1`, `highestdeg`, `degrefield`, `yeardegree`, `licenses`, `certifications`, `experienceyears`, `referredyou`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ',[result[0].fname,result[0].lname,result[0].email,result[0].phone,result[0].country,result[0].add1,result[0].add2,result[0].city,result[0].state,result[0].zip,result[0].username,result[0].password,result[0].semsids,result[0].classes,result[0].profession,result[0].highestdeg,result[0].degrefield,result[0].yeardegree,result[0].licenses,result[0].certifications,result[0].experienceyears,result[0].referredyou], (err, resultAdd) => {
      
        if (err) {

            let _resp = { 
                status: false,
                message : err
            }
            console.log(_resp)
            return res.status(500).json(_resp)
        } else {
            dbConn.query('SELECT * FROM course WHERE id = ? ', [result[0].classes] , (err, resultCourse) => {

                if (err) {

                    let _resp = { 
                        status: false,
                        message : err
                    }
                    console.log(_resp)
                    return res.status(500).json(_resp)
                } else {


    dbConn.query('INSERT INTO `users_billing`(`userid`, `usersess`, `bilemail`, `bilfname`, `billname`, `billaddress`, `billcity`, `bilstate`, `billzip`, `billcon`, `amount`, `details`)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ',[result[0].email,'NewPayment',result[0].email,result[0].fname,result[0].lname,result[0].add1,result[0].city,result[0].state,result[0].zip,result[0].country,0,JSON.stringify(req.body.details)], (err, resultBill) => {
        if (err) {

            let _resp = { 
                status: false,
                message : err,
                id: resultAdd.insertId
            }
            console.log(_resp)
            return res.status(500).json(_resp)
        } else {
            let toStud  = result[0].email ; 
            let subjectStud  = 'You are successfully registered '+ resultCourse[0].coursecode+ ' '+resultCourse[0].course ; 
            sendMail(toStud,subjectStud,subjectStud,resultCourse[0].emailcontent); 

            let toAdmin = "education@bp.edu";
            let subjectAdmin = result[0].fname+' '+result[0].lname+' is successfully registered e-campus.bp.edu';
            let htmlAdmin  = "<p>Hello Admin,</p>";
            htmlAdmin += "<p>"+result[0].fname+" "+result[0].lname+" has registered. See details below:</p>";
            // htmlAdmin += "<p>Below are the student details and the Course name:</p>";
            htmlAdmin += "<p>Student Name: "+result[0].fname+" "+result[0].lname+"</p>";
            htmlAdmin += "<p>Student Email: "+result[0].email+"</p>";
            htmlAdmin += "<p>Course Name: "+resultCourse[0].coursecode+ ' '+resultCourse[0].course+"</p>";
            let date = new Date().toLocaleString() ;
            htmlAdmin += "<p>Registration Date: "+date+"</p>";
            sendMail(toAdmin,subjectAdmin,subjectAdmin,htmlAdmin); 
           

            let _resp = { 
                status: true,
                message : "added",
                id: resultAdd.insertId
            }
            console.log(_resp)
            return res.status(200).json(_resp)
        }
      })
      
    }
})
      
    }
})
            }
            else{
                let _resp = { 
                    status: false,
                    message : "not found"
                } 
                console.log(_resp)
                return res.status(404).json(_resp)
            }

}
})

}
    


exports.registerExisting = (req, res)=>{
    console.log(req.params);
    dbConn.query('SELECT * FROM users WHERE uid = ? ', [req.params.id] , (err, result) => {
        if (err) {
           
            let _resp = { 
                status: false,
                message : err
            }   
            console.log(_resp)
            return res.status(500).json(_resp)
        } else {
            if(result.length >0 ){
                let _semids = result[0].semester_id.toString() + ',' + req.body.semsids.toString() ;
                let _courseid = result[0].courseid.toString() + ',' + req.body.classes.toString() ;

    dbConn.query('SELECT * FROM relativecourse WHERE FIND_IN_SET(courseid , ?)', [req.body.classes] , (err, resultCourses) => {
      if(resultCourses.length > 0){
        resultCourses.map((v,i) => {
            _courseid = _courseid + ',' + v.relativecourses ; 
        })   

      }      

    dbConn.query('update `users` set  `semester_id` = ? , `courseid` = ? where `uid` = ? ',[_semids,_courseid,req.params.id], (err, resultAdd) => {
       
        if (err) { 
            let _resp = {    
                status: false,
                message : err
            }
            console.log(_resp)
            return res.status(500).json(_resp)
        } else {
            dbConn.query('SELECT * FROM course WHERE FIND_IN_SET(`id` ,  ? ) ', [req.body.classes] , (err, resultCourse) => {

                if (err) {

                    let _resp = { 
                        status: false,
                        message : err
                    }
                    console.log(_resp)
                    return res.status(500).json(_resp)
                } else {

                    let _nextDate =  resultCourse.length > 0 ? resultCourse[0].bc_date ? resultCourse[0].bc_date : 0 : 0 ;

    dbConn.query('INSERT INTO `users_billing`(`userid`, `usersess`, `bilemail`, `bilfname`, `billname`, `billaddress`, `billcity`, `bilstate`, `billzip`, `billcon`, `amount`, `details`,`discountcoupon`,`pocode`,`balance`,`next_date`)  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ',[result[0].mail,'NewPayment',result[0].mail,result[0].name,result[0].lastname,result[0].address,result[0].city,result[0].state,result[0].zip,result[0].country,0,JSON.stringify(req.body.details) ,req.body.discountcoupon,req.body.pocode , req.body.balance,_nextDate], (err, resultBill) => {
        if (err) {
   
            let _resp = { 
                status: false,
                message : err, 
                id: resultAdd.insertId
            }
            console.log(_resp)
            return res.status(500).json(_resp) 
        } else {
            resultCourse.map(async (v,i) => {


            let toStud  = result[0].mail ; 
            let subjectStud  = 'You are successfully registered '+ v.coursecode+ ' '+v.course ; 
            if(v.emailcontent){
                await sendMail(toStud,subjectStud,subjectStud,v.emailcontent); 
            }

            let toAdmin = "education@bp.edu";
            // let toAdmin = "yasirkhancse@gmail.com";
            let subjectAdmin = result[0].name+' '+result[0].lastname+' is successfully registered e-campus.bp.edu';
            let htmlAdmin  = "<p>Hello Admin,</p>";
            htmlAdmin += "<p>"+result[0].name+" "+result[0].lastname+" has registered. See details below:</p>";
            // htmlAdmin += "<p>Below are the student details and the Course name:</p>";
            htmlAdmin += "<p>Student Name: "+result[0].name+" "+result[0].lastname+"</p>";
            htmlAdmin += "<p>Student Email: "+result[0].mail+"</p>";
            htmlAdmin += "<p>Course Name: "+v.coursecode+ ' '+v.course+"</p>";
            htmlAdmin += "<p>Amount Paid: $"+req.body.paidAmount +"</p>";
            htmlAdmin += "<p>Scholarship Code: "+(req.body.discountcoupon == "" || !req.body.discountcoupon ? "NA" : req.body.discountcoupon)+"</p>";
            htmlAdmin += "<p>PO Number: "+(req.body.pocode == "" || !req.body.pocode ? "NA" : req.body.pocode )+"</p>";
            let date = new Date().toLocaleString() ;
            htmlAdmin += "<p>Registration Date: "+date+"</p>";
            await sendMail(toAdmin,subjectAdmin,subjectAdmin,htmlAdmin); 
           

        }) 

        let  _resp = { 
            status: true,
            message : "added",
            id: resultAdd.insertId
        }
        console.log(_resp)
            return res.status(200).json(_resp)
        }
      })
      
    }
})
      
    }
})

    })  

               
            }
            else{
                
                let _resp = { 
                    status: false,
                    message : "not found"
                }
                console.log(_resp)
                return res.status(404).json(_resp)
            }

}
})

}
    
 
async function sendMail(toAddress,subject,text,html) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();
   
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // generated ethereal user
        pass: process.env.SMTP_PASS, // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Professional School" <tech@bp.edu>', // sender address
      to: toAddress, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
      html: html, // html body
    });
  
    console.log("Message sent: %s", info.messageId);

  }
//   const randomString = (n, r='') => {
//     while (n--) r += String.fromCharCode((r=Math.random()*62|0, r+=r>9?(r<36?55:61):48));
//     return r;
//   };

//   const randomtext = randomString(15)

  exports.forgotPassword = (req, resp)=>{
   
    dbConn.query('SELECT * FROM users WHERE mail = ?', [req.body.mail] , (error, result) => {
       
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
            })
        } else {
           if(result.length > 0){
            const random = (Math.random() + 1).toString(36).substring(7);
           
            sendMail(
                result[0].mail,
                // "mdnasim4234@gmail.com",
                'password reset request',
                'You recently requested to reset password.',
                '<p>Please click here to <a href="http://localhost:3000/reset/password/'+random+'"> reset</a> your password</p>'
                

            );
            // const uid = result[0].uid;
           
           
            dbConn.query("UPDATE users SET resetpassword = ? WHERE uid = ? ", [random, result[0].uid], (error, result) => {
                if (error) throw error;
                if(result){
                    resp.status(200).json({
                        success: true,
                        message: 'token inserted'
                    })
                }
            });
            
           }


           else{
            resp.status(400).json({
                success: false,
                message: 'your email not exit my database please register',
            })
           }
           
        }

})
}

exports.updatepass = (req, resp)=>{
    
    dbConn.query('SELECT * FROM users WHERE resetpassword = ?', [req.body.resetpassword] , (error, result) => { 

        if (error) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
            })
        }else{
            
            if(result){
                console.log(req.body.pass)
                console.log(req.body.resetpassword)
                dbConn.query("UPDATE users SET pass = ? WHERE resetpassword = ? ", [req.body.pass, req.body.resetpassword], (error, updatedresult) => {
                    if (error) throw error;
                    if(updatedresult){
                        resp.status(200).json({
                            success: true,
                            message: 'password updated'
                        })
                    }
                });

            }else{
                resp.status(400).json({
                    success: false,
                    message: 'back to home page',
                })
            }
        }
    })
}
