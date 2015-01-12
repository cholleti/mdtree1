var Enum = require('enum');
var error = function getErrorMessageFrom(err) {
    var errorMessage = '';
    if (err.errors) {
        for (var prop in err.errors) {
            if(err.errors.hasOwnProperty(prop)) {
                errorMessage += err.errors[prop].message + ' '
            }
        }
    } else {
        errorMessage = err.message;
    }
    return errorMessage;
};

var status = {
    Available: {
        value: 0,
        string: 'available'
    },
    Booked: {
        value: 1,
        string: 'booked'
    },
    NoShow: {
        value: 2,
        string: 'noshow'
    },
    Done: {
        value: 3,
        string: 'done'
    },
    Cancel: {
        value: 4,
        string: 'cancel'
    }
};

var cookie = new Enum({
    "cookieName": "sid-mdTree",
    "password": "mdTree",
    "encoding": "iron"
},
{
    "name": "cookie"
});

var auth = {
    patient: {
        'bitMask': 2,
        'title': 'patient'
    }, 
    provider: {
        'bitMask':2,
        'title': 'provider'
    }, 
    admin: {
        'bitMask': 4,
        'title': 'admin'
    },
    user: {
        'title': 'user'
    },    
    crypt: {
        'salt': 5
    }
};

var slotStatus = {
    Available: {
        value: 0,
        string: 'available'
    },
    Booked: {
        value: 1,
        string: 'booked'
    },
    Blocked: {
        value: 2,
        string: 'blocked'
    },
    Time: {
        value: 5,
        string: 'ontime'
    }
};
var http = new Enum({
    'OK': 200,
    'Created': 201,
    'Accepted': 202
}, {'name':'http'});

var formattedDate = function(date) {
    var date = new Date(date);
    var formatDate="";
    if (date.getMonth()<9) {
        formatDate += "0" + (date.getMonth()+1);
    } else {
        formatDate += (date.getMonth()+1);
    }
    if (date.getDate()<10) {
        formatDate += "-" +"0" + date.getDate();
    } else {
        formatDate += "-" +date.getDate();
    }
    formatDate += "-" + date.getFullYear();
    return formatDate;
};

var sendMail = function() {
    var Mailgun = require('mailgun-js');
    var api_key = 'key-32c840d1575c3584ca122a0607ad8618';
    var domain = 'sandboxf200c276c3f449dfb7f547030d42aa12.mailgun.org';
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});
    return { 
        mail: function (to, subject, text, callback) {
            var from_who = 'mdTree <no-reply@mdtree.com>'; 

            var data = {
                from: from_who,
                to: to,
                subject: subject,
                text: text+'\n \n \nBy \nMDTree Team. ' 
            }
            mailgun.messages().send(data, function (err, body) {
                if (err) {
                    console.log("got an error: ", err);
                }
                else {
                    console.log(body);
                    var result = 'Mail sent successfully';
                    console.log('returning from method is ',result);
                    callback(result);
                }
            });
        },
        templates: function (data, callback) {           
            
            mailgun.messages().send(data, function (err, body) {
                if (err) {
                    console.log("got an error: ", err);
                }
                else {
                    var result = 'Mail sent successfully';
                    callback(result);
                }
            });
        }
    }
}();

var dateFormat = function getDateFromFormat(val,format) {

    function _getInt(str,i,minlength,maxlength) {
        for (var x=maxlength; x>=minlength; x--) {
            var token=str.substring(i,i+x);
            if (token.length < minlength) {
                return null; 
            }
            if (_isInteger(token)) { 
                return token;
            }
        }
        return null;
    }

    function _isInteger(val) {
        var digits="1234567890";
        for (var i=0; i < val.length; i++) {
            if (digits.indexOf(val.charAt(i))==-1) { return false; }
            }
        return true;
    }

    val=val+"";
    format=format+"";
    var i_val=0;
    var i_format=0;
    var c="";
    var token="";
    var token2="";
    var x,y;
    var now=new Date();
    var year=now.getYear();
    var month=now.getMonth()+1;
    var date=1;
    var hh=now.getHours();
    var mm=now.getMinutes();
    var ss=now.getSeconds();
    var ampm="";
    
    while (i_format < format.length) {
        // Get next token from format string
        c=format.charAt(i_format);
        token="";
        while ((format.charAt(i_format)==c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
            }
        // Extract contents of value based on format token
        if (token=="yyyy" || token=="yy" || token=="y") {
            if (token=="yyyy") { x=4;y=4; }
            if (token=="yy")   { x=2;y=2; }
            if (token=="y")    { x=2;y=4; }
            year=_getInt(val,i_val,x,y);
            if (year==null) { return 0; }
            i_val += year.length;
            if (year.length==2) {
                if (year > 70) { year=1900+(year-0); }
                else { year=2000+(year-0); }
                }
            }
        else if (token=="MMM"||token=="NNN"){
            month=0;
            for (var i=0; i<MONTH_NAMES.length; i++) {
                var month_name=MONTH_NAMES[i];
                if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
                    if (token=="MMM"||(token=="NNN"&&i>11)) {
                        month=i+1;
                        if (month>12) { month -= 12; }
                        i_val += month_name.length;
                        break;
                        }
                    }
                }
            if ((month < 1)||(month>12)){return 0;}
            }
        else if (token=="EE"||token=="E"){
            for (var i=0; i<DAY_NAMES.length; i++) {
                var day_name=DAY_NAMES[i];
                if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
                    i_val += day_name.length;
                    break;
                    }
                }
            }
        else if (token=="MM"||token=="M") {
            month=_getInt(val,i_val,token.length,2);
            if(month==null||(month<1)||(month>12)){return 0;}
            i_val+=month.length;}
        else if (token=="dd"||token=="d") {
            date=_getInt(val,i_val,token.length,2);
            if(date==null||(date<1)||(date>31)){return 0;}
            i_val+=date.length;}
        else if (token=="hh"||token=="h") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<1)||(hh>12)){return 0;}
            i_val+=hh.length;}
        else if (token=="HH"||token=="H") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<0)||(hh>23)){return 0;}
            i_val+=hh.length;}
        else if (token=="KK"||token=="K") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<0)||(hh>11)){return 0;}
            i_val+=hh.length;}
        else if (token=="kk"||token=="k") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<1)||(hh>24)){return 0;}
            i_val+=hh.length;hh--;}
        else if (token=="mm"||token=="m") {
            mm=_getInt(val,i_val,token.length,2);
            if(mm==null||(mm<0)||(mm>59)){return 0;}
            i_val+=mm.length;}
        else if (token=="ss"||token=="s") {
            ss=_getInt(val,i_val,token.length,2);
            if(ss==null||(ss<0)||(ss>59)){return 0;}
            i_val+=ss.length;}
        else if (token=="a") {
            if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
            else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
            else {return 0;}
            i_val+=2;}
        else {
            if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
            else {i_val+=token.length;}
            }
        }
    // If there are any trailing characters left in the value, it doesn't match
    if (i_val != val.length) { return 0; }
    // Is date valid for month?
    if (month==2) {
        // Check for leap year
        if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
            if (date > 29){ return 0; }
            }
        else { if (date > 28) { return 0; } }
        }
    if ((month==4)||(month==6)||(month==9)||(month==11)) {
        if (date > 30) { return 0; }
        }
    // Correct hours value
    if (hh<12 && ampm=="PM") { hh=hh-0+12; }
    else if (hh>11 && ampm=="AM") { hh-=12; }
    var newdate=new Date(year,month-1,date,hh,mm,ss);
    return newdate.getTime();
};

var role = new Enum({
    'salesAdmin': 'salesAdmin',
    'salesManagerAdmin': 'salesManagerAdmin'
}, {'name':'role'});

var adminStatus = new Enum({
    'activate': 'activate',
    'deactivate': 'deactivate'
}, {'name':'adminStatus'});

var searchRadius = 30;
module.exports = {
    errorMessage: error,
    apptStatus: status,
    slotStatus: slotStatus,
    cookie: cookie,
    auth: auth,
    http: http,
    sendingMail: sendMail,
    date: formattedDate,
    dateFormat: dateFormat,
    role: role,
    status: adminStatus,
    radius: searchRadius
};

