const md5 = require('md5');
const dbConn = require('../dbConnection')


var registerProfile = function(registerProfile) {
    this.id = registerProfile.id
    this.firstname = registerProfile.firstname
    this.lastname = registerProfile.lastname
    this.email = registerProfile.email
    this.confirmemail = registerProfile.confirmemail
    this.password = registerProfile.password
    this.confirmpassword = registerProfile.confirmpassword
    this.telofficenumber = registerProfile.telofficenumber
    this.telcellnumber = registerProfile.telcellnumber
    this.addressline2 = registerProfile.addressline2
    this.country = registerProfile.country
    this.state = registerProfile.state
    this.city = registerProfile.city
    this.postalcode = registerProfile.postalcode  
    this.profession = registerProfile.profession
    this.highestdegreeearned = registerProfile.highestdegreeearned
    this.degreeinwhatfield = registerProfile.degreeinwhatfield
    this.yeardegreeearned = registerProfile.yeardegreeearned
    this.licenses = registerProfile.licenses
    this.certifications = registerProfile.certifications
    this.yearsofprofessionalexperience = registerProfile.yearsofprofessionalexperience
    this.referred = registerProfile.referred
    

}


// create new Client
registerProfile.createNewregisterProfile = (data, result) => {
    dbConn.query('INSERT INTO registerprofile SET ? ', data, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// update Client
// Course.updateregisterProfile = (id, data, result) => {
//     dbConn.query("UPDATE course SET coursecode=?,course=?,semesters=?,cunits=?,sem_abbrevn=?,descr=?,sessiondates=?,created=?,modified=?,price=?,price2=?,stimes=?,etimes=?,presenter=?,labfee=?,topic=?,category=?,course_url=?,individual=?,Prereq=?,emailcontent=?,damount=?,bamount=?,bdate=?,installments=?,damount_new=?,bamount_new=?,bc_date=?,is_date=?,practicum=?,proseminarids=?,relativecourseids=?,insfudates=?,estatus=?,vonly=?,voucher=?,degreepro=?,certifcour=?,followup=?,follow_date=?,follow_email_content=?,pay_deposit_installment=?,pay_deposit_balance_day=?,toemail=?,ccemail=? WHERE id = ?", [
    
//     data.coursecode,
//     data.course,
//     data.semesters,
//     data.cunits,
//     data.sem_abbrevn,
//     data.descr,
//     data.sessiondates,
//     data.created,
//     data.modified,
//     data.price,
//     data.price2,
//     data.stimes,
//     data.etimes, 
//     data.presenter,
//     data.labfee,
//     data.topic,
//     data.category,
//     data.course_url,
//     data.individual,
//     data.Prereq,
//     data.emailcontent,
//     data.damount,
//     data.bamount,
//     data.bdate,
//     data.installments,
//     data.damount_new,
//     data.bamount_new,
//     data.bc_date,
//     data.is_date,
//     data.practicum,
//     data.proseminarids,
//     data.relativecourseids,
//     data.insfudates,
//     data.estatus,
//     data.vonly,
//     data.voucher,
//     data.degreepro,
//     data.certifcour,
//     data.followup,
//     data.follow_date,
//     data.follow_email_content,
//     data.pay_deposit_installment,
//     data.pay_deposit_balance_day,
//     data.toemail,
//     data.ccemail,
//         id
//         ], (err, res)=>{
//         if(err){
//             console.log('Error while updating the course');
//             result(err ,null);

//         }else{
//             console.log("Course updated successfully");
//             result(null, res);
//         }
//     });
// }



module.exports = registerProfile