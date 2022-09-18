const dbConn = require('../dbConnection');

// get user 

exports.getuser = (req, resp)=>{
    dbConn.query("SELECT * FROM users", (err, result)=>{
        if(err){
            let _resp = { 
                success: false,
                message: err
            }
            return resp.status(500).json(_resp)
        }else{
            let  _resp = { 
                success: true,
                data: result
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }
    })
}

// sale course semester
exports.getsalesemster = (req, resp) => {
    dbConn.query("select * from sale_semester ORDER BY year DESC", (err, salesemster) => {
        if(err){
          
            let _resp = { 
                success: false,
                message: err
            }
            console.log(_resp);
            return resp.status(500).json(_resp)

        }else{
            let  _resp = { 
                success: true,
                data: salesemster
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }

        

    })
}

// getcoursebycategory
exports.getcoursebycategory = (req, resp)=>{
    dbConn.query('SELECT category FROM course', (err,coursecategory)=>{
        if(err){
            let _resp = {
                success: false,
                message:err
            }
            return resp.status(500).json(_resp)
        }else{
            let _resp = {
                success: true,
                data: coursecategory
            }
            return resp.status(200).json(_resp)
        }

       
    })
}

//  courses
exports.getcoursebyid = (req, resp) => {
  console.log(req.params);
   
    dbConn.query('SELECT * FROM course WHERE id =  ?', [req.params.id] , (err, getcoursebyid) => {
        if(err){
           
            let _resp = { 
                success: false,
                message: err
            }
            console.log(_resp);
            return resp.status(500).json(_resp)

        }else{
            let _resp = { 
                success: true,
                data: getcoursebyid
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }
       
        
        })
}
exports.getprofessionalDiploma = (req, resp) => {
    console.log(req.params);
   
    dbConn.query('SELECT * FROM course WHERE degreepro =  ? and category = ? and semesters = ?  and estatus = 1', [req.params.degreepro,req.params.category,req.params.trimester] , (err, getCourse) => {
        if(err){
            
            let _resp = { 
                success: false,
                message: err
            }
            console.log(_resp);
            return resp.status(500).json(_resp)

        }
        else{
            let _resp ={ 
                success: true,
                data: getCourse
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }

     
        
        })
}
exports.getcourses = (req, resp) => {
    console.log(req.params);
   
    dbConn.query('SELECT * FROM course WHERE individual =  ? and category = ? and semesters = ? and estatus = 1', [req.params.individual,req.params.category,req.params.trimester] , (err, getCourses) => {
        if(err){

            let _resp = { 
                success: false,
                message: err
            }
            console.log(_resp);
            return resp.status(500).json(_resp)

        }else{
            let _resp = { 
                success: true,
                data: getCourses
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }
       
        
        })
}
exports.getCourseid = (req, resp) => {
    console.log(req.params);
    dbConn.query('SELECT * FROM course WHERE id =  ? ' , [req.params.courseid] , (err, getCourseid) => {
        if(err){
            let _resp = { 
                success: false,
                message: err
            }
            console.log(_resp);
            return resp.status(500).json(_resp)
        }
        if(getCourseid[0].sessiondates != "" ){

            let _resp = { 
                success: true,
                data: getCourseid
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
            
        }
       else{
        //    console.log('SELECT * FROM relativecourse WHERE courseid ='+req.params.courseid)
             dbConn.query('SELECT * FROM relativecourse WHERE courseid =  ? ' , [req.params.courseid] , (err, relativecourse) => {
                if(err){
                    let _resp = { 
                        success: false,
                        message: err
                    }
                    console.log(_resp);
                    return resp.status(500).json(_resp)
                } 
                if(relativecourse.length > 0){
                    // console.log('SELECT * FROM course WHERE id IN  ('+relativecourse[0].relativecourses+')')
                    dbConn.query('SELECT * FROM course WHERE FIND_IN_SET(id , ?)  ' , [relativecourse[0].relativecourses] , (err, getrelatedcourse) => {

                        if(err){
                            let _resp = { 
                                success: false,
                                message: err
                            }
                            console.log(_resp);
                            return resp.status(500).json(_resp)
                        }else{
                            let _resp = { 
                                success: true,
                                data: getrelatedcourse
                            }
                            console.log(_resp);
                            return resp.status(200).json(_resp)
                        }
                        // console.log(getrelatedcourse)
                       

                    }) 
                    
                }
                else {
                    let _resp ={ 
                        success: false,  
                    }
                    console.log(_resp);
                    return resp.status(404).json(_resp)
                }

                

             })
       }
        
        
        })
       
        
       
        
}

exports.topics = (req, resp) => {
    console.log(req.params);
    
    dbConn.query('SELECT * FROM course WHERE id =  ? ' , [req.params.courseid] , (err, topics) => {
        if(err){
            let _resp = { 
                success: false,
                message: err
            }
            console.log(_resp);
            return resp.status(500).json(_resp)
        }
        if(topics[0].presenter != "" ){
            dbConn.query('SELECT * FROM users WHERE uid =  ? ' , [topics[0].presenter] , (err, usersResult) => {

                let _resp = { 
                    success: true,
                    data: usersResult
                   
                }
                console.log(_resp);
                return resp.status(200).json(_resp) 

            })
            
        }else{
            dbConn.query('SELECT facultybio FROM users where uid IN (SELECT presenter FROM course where FIND_IN_SET(id , (SELECT relativecourses FROM relativecourse WHERE courseid =  ?)))' , [req.params.courseid] , (err, relativebio) => {
                if(err){
                    let _resp = { 
                        success: false,
                        message: err
                    }
                    console.log(_resp);
                    return resp.status(500).json(_resp)
                }else{
                    let _resp = { 
                        success: true,
                        data: relativebio
                 }
                 console.log(_resp);
                    return resp.status(200).json(_resp)
                }
                       
                    })
                }
                 
            })
            
        }
       
  
         
       
     


// saleSemester list
exports.getyearsSeason = (req, resp) => {
    console.log(req.params);
    // const d = new Date();
    // let CurrentYear = d.getFullYear();
   
    dbConn.query('SELECT * FROM sale_semester WHERE year >= ?', [req.params.year] , (err, getyearsSeason) => {
        if(err)
        throw new Error(err)

        let _resp = { 
            success: true,
            getyearsSeason 
        }

        console.log(_resp);
        return resp.status(200).json(_resp)
        
        })
}

exports.getSeasonName = (req, resp) => {


    const month = ["Winter","Winter","Winter","Summer","Summer","Summer","Summer","Summer","Fall","Fall","Fall","Winter"];
    
    const d = new Date();
    let year = d.getFullYear();
    let MonthName = month[d.getMonth()];
   
    // console.log("here")
    console.log(dbConn)
   
    dbConn.query('SELECT * FROM sale_semester WHERE name = ? and year = ?', [MonthName,year] , (err, getsSeasonName) => {
        if(err){
          
            let _resp = { 
                success: false,
                message: err
            }
            console.log(_resp);
            return resp.status(500).json(_resp)

        }else{
            let _resp = { 
                success: true,
                getsSeasonName 
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }
        
        })
}

exports.getcourseSemester = (req, resp) => {
    console.log(req.params);
    dbConn.query('SELECT * FROM course WHERE semesters >= ?', [req.params.semesters] , (err, result) => {
        if(err)
        throw new Error(err)

        let _resp = { 
            success: true,
            result 
        }
        console.log(_resp);
        return resp.status(200).json(_resp)
        
        })
}
exports.getcoursebySemester = (req, resp) => {
    console.log(req.params);
    dbConn.query('SELECT * FROM course WHERE semesters = ?', [req.params.semesters] , (err, result) => {
        if(err)
        throw new Error(err)

        let _resp = { 
            success: true,
            result 
        }
        console.log(_resp);
        return resp.status(200).json(_resp)
        
        })
}

exports.getCoursebyPresnter = (req, resp) => {
    console.log(req.params);
    dbConn.query('SELECT * FROM course WHERE presenter = ?', [req.params.presenter] , (err, result) => {
        if(err)
        throw new Error(err)

        let _resp = { 
            success: true,
            result 
        }
        console.log(_resp);
        return resp.status(200).json(_resp)
        
        })
}



// exports.getfaculty = (req, resp) => {
  
//     dbConn.query('SELECT * FROM course WHERE presenter = id ?; SELECT * FROM registerprofile WHERE id = ?', [req.body.presenter, req.body.id,] , (err, result) => {
//         if(err)
//         throw new Error(err)

//         return resp.status(200).json({ 
//             success: true,
//             result 
//         })
        
//         })
// }