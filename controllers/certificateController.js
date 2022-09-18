const dbConn = require('../dbConnection');
const fs = require("fs");
const moment = require("moment");
const PDFDocument = require("pdfkit");
const blobStream = require('blob-stream');
const nodemailer = require("nodemailer");
var converter = require('number-to-words');




async function sendMail(toAddress, subject, text, html) {
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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.certificate = async (req, resp) => {


  console.log(req.body.uid)
  dbConn.query("SELECT* FROM users WHERE uid = ?", [req.params.id], (error, result) => {
    if (error) {
      resp.status(500).json({
        success: false,
        message: 'Somothing went wrong'
      })
    }
    else {
      if (result.length > 0) {
        console.log(result[0].name);
        console.log(result[0].lastname);
        let firstName = result[0].name;
        let lastname = result[0].lastname;
        dbConn.query("SELECT* FROM users name = ? and lastname = ? ", [result[0].name, result[0].lastname], async (error, result) => {
          // resp.status(200).json({
          //     success: true,
          //     message: 'create certificate',

          // })
          // Create the PDF document
          const doc = new PDFDocument({
            layout: "landscape",
            size: "A4",


          });

          // The name
          const name = capitalizeFirstLetter(firstName) + " " + capitalizeFirstLetter(lastname);

          // Pipe the PDF into an name.pdf file
          doc.pipe(resp);

          // Draw the certificate image
          doc.image("assets/exampleOld.png", 55, 0, { width: 750 });
          // Remember to download the font
          // Set the font to Dancing Script
          doc.font("fonts/cambria.ttf");

          // Draw the name

          doc.fontSize(28).fillColor('#0061af').text(name, 100, 314, {
            align: "center",

          });

          

          // Draw the date
          // doc.fontSize(17).text(moment().format("MMMM Do YYYY"), -275, 430, {
          //     align: "center"
          // });

          // Finalize the PDF and end the stream
          doc.end();

          // let _to = "yasirkhancse@gmail.com" ;
          // let _subject = "Welcome PDF";
          // let _html = "<h3>Hiiiii</h3>" ;
          // await sendMail(_to,_subject,_subject,_html); 


        })
      }
    }
  })

}


exports.certificateWithname =  (req, resp) => {

  const UsernameArray = [];
  const courseArray = [];




  dbConn.query("SELECT* FROM users WHERE uid = ?", [req.body.uid], (error, result) => {
    if (error) {
      resp.status(500).json({
        success: false,
        message: 'Somothing went wrong'
      })
    } else {
      if (result[0]) {
         UsernameArray.push(result[0].name + " " + result[0].lastname);

         dbConn.query("SELECT* FROM course WHERE id = ?", [req.body.id], (error, courseResult) => {
          if (error) {
            resp.status(500).json({
              success: false,
              message: 'Somothing went wrong'
            })
          }
            if (courseResult.length > 0) {
              courseArray.push(courseResult[0].course);
              // resp.status(200).json({
              //   success: true,
              //   data: courseResult[0].coursecode,
        
              // })
        
              setTimeout( () => {
      
                let flatCourseArray = courseArray.flat();
            
            
                // Create the PDF document
                const doc = new PDFDocument({
                  layout: "landscape",
                  size: "A4",
                });
            
                
            
                // Pipe the PDF into an name.pdf file
                doc.pipe(fs.createWriteStream(`${"certificate"}.pdf`));

                setTimeout( () => {
              const data =fs.readFileSync('./certificate.pdf');
             
               resp.contentType("application/pdf");
               resp.send(data)

              },10000);
            
                // Draw the certificate image
                doc.image("assets/datexample.png", 0, 0, { width: 842 });
            
               
                doc.font("fonts/OpenSans-Regular.ttf");
               
            
                // Draw the course name
                console.log(flatCourseArray)
                doc.fontSize(26).fillColor('#1b5492').text(flatCourseArray, 100, 288, {
                  align: "center"
                  
                });
                // Draw the name
                doc.font("fonts/cambria.ttf");
                doc.fontSize(36).fillColor('#0061af').text(UsernameArray, 100, 350, {
                  align: "center"
                });
            
                // Draw the date
                console.log(req.body.Cdate)
                doc.font("fonts/OpenSans-Semibold.ttf");
                let dateDay = moment(req.body.Cdate).format(`DD`);

                let dateMonthyear = moment(req.body.Cdate).format(`[th day of] MMMM YYYY`);
                
                let Ddate = converter.toWords(dateDay);

                let resultDateDay = Ddate.replace("-", " ");

                let result = resultDateDay + dateMonthyear;
                let finalResult = result.toUpperCase()
            
                doc.fontSize(13).text(finalResult, 100, 435, {
                  align: "center"
              });
             
            
                // Finalize the PDF and end the stream
                doc.end();
            
            
                
            
              }, 4000);
              
            }
            else {
              let _resp = {
                success: false,
                message: 'No course id found',
              }
              console.log(_resp);
              resp.status(502).json(_resp)
            }
          
        })

      }
      else {
        let _resp = {
          success: false,
          message: 'No user id found',
        }
        console.log(_resp);
        resp.status(501).json(_resp)
      }
    }

  })

  



 


}



