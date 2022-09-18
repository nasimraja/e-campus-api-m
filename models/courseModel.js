const md5 = require('md5');
const dbConn = require('../dbConnection')


var Course = function(Course) {
    this.id = Course.id
    this.coursecode = Course.coursecode
    this.course = Course.course
    this.semesters = Course.semesters
    this.cunits = Course.cunits
    this.sem_abbrevn = Course.sem_abbrevn
    this.descr = Course.descr
    this.sessiondates = Course.sessiondates
    this.created = Course.created
    this.modified = Course.modified
    this.price = Course.price
    this.price2 = Course.price2
    this.stimes = Course.stimes
    this.etimes = Course.etimes  
    this.presenter = Course.presenter
    this.labfee = Course.labfee
    this.topic = Course.topic
    this.category = Course.category
    this.course_url = Course.course_url
    this.individual = Course.individual
    this.Prereq = Course.Prereq
    this.emailcontent = Course.emailcontent
    this.damount = Course.damount
    this.bamount = Course.bamount
    this.bdate = Course.bdate
    this.installments = Course.installments
    this.damount_new = Course.damount_new
    this.bamount_new = Course.bamount_new
    this.bc_date = Course.bc_date
    this.is_date = Course.is_date
    this.practicum = Course.practicum
    this.proseminarids = Course.proseminarids
    this.relativecourseids = Course.relativecourseids
    this.insfudates = Course.insfudates
    this.estatus = Course.estatus
    this.vonly = Course.vonly
    this.voucher = Course.voucher
    this.degreepro = Course.degreepro
    this.certifcour = Course.certifcour
    this.followup = Course.followup
    this.follow_date = Course.follow_date
    this.follow_email_content = Course.follow_email_content
    this.pay_deposit_installment = Course.pay_deposit_installment
    this.pay_deposit_balance_day = Course.pay_deposit_balance_day
    this.toemail = Course.toemail
    this.ccemail = Course.ccemail

}


// create new Client
Course.createNewcourse = (data, result) => {
    dbConn.query('INSERT INTO course SET ? ', data, (err, res) => {
        if (err) {
            result(err ,null);
        } else {
            result(null, res)
        }
    })
}

// update Client
Course.updateCourse = (id, data, result) => {
    dbConn.query("UPDATE course SET coursecode=?,course=?,semesters=?,cunits=?,sem_abbrevn=?,descr=?,sessiondates=?,created=?,modified=?,price=?,price2=?,stimes=?,etimes=?,presenter=?,labfee=?,topic=?,category=?,course_url=?,individual=?,Prereq=?,emailcontent=?,damount=?,bamount=?,bdate=?,installments=?,damount_new=?,bamount_new=?,bc_date=?,is_date=?,practicum=?,proseminarids=?,relativecourseids=?,insfudates=?,estatus=?,vonly=?,voucher=?,degreepro=?,certifcour=?,followup=?,follow_date=?,follow_email_content=?,pay_deposit_installment=?,pay_deposit_balance_day=?,toemail=?,ccemail=? WHERE id = ?", [
    
    data.coursecode,
    data.course,
    data.semesters,
    data.cunits,
    data.sem_abbrevn,
    data.descr,
    data.sessiondates,
    data.created,
    data.modified,
    data.price,
    data.price2,
    data.stimes,
    data.etimes, 
    data.presenter,
    data.labfee,
    data.topic,
    data.category,
    data.course_url,
    data.individual,
    data.Prereq,
    data.emailcontent,
    data.damount,
    data.bamount,
    data.bdate,
    data.installments,
    data.damount_new,
    data.bamount_new,
    data.bc_date,
    data.is_date,
    data.practicum,
    data.proseminarids,
    data.relativecourseids,
    data.insfudates,
    data.estatus,
    data.vonly,
    data.voucher,
    data.degreepro,
    data.certifcour,
    data.followup,
    data.follow_date,
    data.follow_email_content,
    data.pay_deposit_installment,
    data.pay_deposit_balance_day,
    data.toemail,
    data.ccemail,
        id
        ], (err, res)=>{
        if(err){
            console.log('Error while updating the course');
            result(err ,null);

        }else{
            console.log("Course updated successfully");
            result(null, res);
        }
    });
}

// Delete course
Course.deleteCourse = (id, result)=>{
    dbConn.query("UPDATE course SET deleted = 1 WHERE id = ?", id, (err, res)=>{
        if(err){
            console.log('Error while deleting the course');
            result(err, null);
        }else{
            console.log("course deleted successfully");
            result(null, res);
        }
    });
}

module.exports = Course