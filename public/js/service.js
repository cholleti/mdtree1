'use strict';
var underscore = angular.module('underscore', []);
underscore.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

mdtreeApp
.factory('Auth', function($http, $cookieStore,productService){

'use strict';

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };


    // $cookieStore.remove('user');
    function removeSid() {
        $cookieStore.remove('sid-hapiauth');
    }

    function changeUser(user) {
        $cookieStore.put('user', user);
        // $cookieStore.put('sid-hapiauth', user.sid);
        angular.extend(currentUser, user);
        // console.log(currentUser);
    }

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined) {
                role = currentUser.role;
            }

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {

            if(user === undefined) {
                user = currentUser;
            }
            return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
        },
        register: function(user, success, error) {

            $http.post('/v1/patient/register', user).success(function(user) {
                // changeUser(user.user);
                console.log(user);
                productService.addusertype(user.user.role.title);
                changeUser(user.user);
                productService.adduserdisplayname(user.user.username);
                success(user);
            }).error(error);
            
        },
        login: function(user, success, error ,$scope) {
          
            $http.post('/v1/login', user).success(function(data){  
              console.log(data);
              if(data !== 'temppassword'){

                productService.addusertype(data.user.role.title);
                changeUser(data.user);
                success(data);
                productService.adduserdisplayname(data.user.username);
                console.log(data.user.username);
              }else{
                console.log(user.email);
                productService.adddoctorEmailTemp(user.email);
                success(data);
              }
              

            }).error(error); 
        },
        isAuthenticated: function(){
            // console.log(!!currentUser.username);
            return !!currentUser.username;
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    username: '',
                    role: userRoles.public,
                    email:'',
                    type:''
                });
                removeSid();
                success();
            }).error(error);
        },

        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});




//     $cookieStore.remove('user');

//     function changeUser(user) {
//         angular.extend(currentUser, user);
//     }

//     return {
//         authorize: function(accessLevel, role) {
//             if(role === undefined) {
//                 role = currentUser.role;
//             }

//             return accessLevel.bitMask & role.bitMask;
//         },
//         isLoggedIn: function(user) {
//             if(user === undefined) {
//                 user = currentUser;
//             }
//             return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
//         },
//         register: function(user, success, error) {
//             $http.post('/register', user).success(function(res) {
//                 changeUser(res);
//                 success();
//             }).error(error);
//         },
//         login: function(user, success, error) {
//             console.log(user);
//             $http.post('/v1/login', user).success(function(user){
//                 console.log(data);
//                 changeUser(user);
//                 success(user);
//             }).error(error);
//         },
//         logout: function(success, error) {
//             $http.post('/logout').success(function(){
//                 changeUser({
//                     username: '',
//                     role: userRoles.public
//                 });
//                 success();
//             }).error(error);
//         },
//         accessLevels: accessLevels,
//         userRoles: userRoles,
//         user: currentUser
//     };
// });
mdtreeApp.service('SelectValueService', function() {
    var CategoryJson = [{id:"Doctors",key:"doctors"},{id:"Dentists",key:"dentists"},{id:"Chiropractors",key:"chiropractors"},
    {id:"Vision/Hearing",key:"vision"},{id:"Other Providers",key:"others"}];
    var DoctorsJson = [
    {key:"doc_spl_2",value:"Allergy & Immunology"},
    {key:"doc_spl_50",value:"Anesthesiology"},
    {key:"doc_spl_3",value:"Bariatric Surgery"},
    {key:"doc_spl_4",value:"Cardiology"},
    {key:"doc_spl_5",value:"Chiropractic Medicine"},
    {key:"doc_spl_6",value:"Dermatology"},
    {key:"doc_spl_7",value:"Developmental-Behavioral"},
    {key:"doc_spl_51",value:"Ear, Nose & Throat"},
    {key:"doc_spl_52",value:"Emergency Medicine"},
    {key:"doc_spl_8",value:"Endocrinology & Metabolism"},
    
    {key:"doc_spl_57",value:"Family Medicine"},
    {key:"doc_spl_9",value:"Family Practice"},
    {key:"doc_spl_10",value:"Gastroenterology"},
    {key:"doc_spl_11",value:"Gerontology"},
    {key:"doc_spl_12",value:"Gynecologic Oncology"},
    {key:"doc_spl_13",value:"Hematology/Oncology"},
    {key:"doc_spl_14",value:"Hospice & Palliative Medicine"},
    {key:"doc_spl_15",value:"Infectious Disease"},
    {key:"doc_spl_16",value:"Internal Medicine"},
    {key:"doc_spl_17",value:"Neonatology"},
    {key:"doc_spl_18",value:"Nephrology"},
    {key:"doc_spl_19",value:"Neurology"},
    {key:"doc_spl_58",value:"Neurological Surgery"},
    {key:"doc_spl_53",value:"Neuropsychologist"},
    
    {key:"doc_spl_20",value:"Obstetrics & Gynecology"},
    {key:"doc_spl_21",value:"Occupational Medicine"},
    {key:"doc_spl_22",value:"Ophthalmology"},
    {key:"doc_spl_23",value:"Optometry"},
    {key:"doc_spl_54",value:"Oral & Maxillofacial Surgery"},
    
    {key:"doc_spl_24",value:"Orthopaedic Surgery"},
    {key:"doc_spl_25",value:"Otorhinolaryngology"},
    {key:"doc_spl_26",value:"Pain Management"},
    {key:"doc_spl_59",value:"Pain Medicine"},
    {key:"doc_spl_26",value:"Pathology"},

    {key:"doc_spl_27",value:"Pediatric Otolaryngology"},
    {key:"doc_spl_28",value:"Pediatrics"},
    {key:"doc_spl_29",value:"Perinatology"},
    {key:"doc_spl_30",value:"Physical Medicine & Rehabilitation"},
    {key:"doc_spl_31",value:"Physical Therapy"},
    {key:"doc_spl_32",value:"Plastic Surgery"},
    {key:"doc_spl_33",value:"Podiatrist"},
    {key:"doc_spl_34",value:"Preventive Medicine"},
    {key:"doc_spl_55",value:"Prosthetics"},
    {key:"doc_spl_35",value:"Psychiatry"},
    {key:"doc_spl_36",value:"Psychology"},
    {key:"doc_spl_37",value:"Pulmonology"},
    {key:"doc_spl_38",value:"Radiology"},
    {key:"doc_spl_39",value:"Reproductive Endocrinology/Infertility"},
    {key:"doc_spl_40",value:"Rheumatology"},
    {key:"doc_spl_41",value:"Sleep Medicine"},
    {key:"doc_spl_42",value:"Sports Medicine"},
    {key:"doc_spl_60",value:"Surgery"},
    
    {key:"doc_spl_43",value:"Surgery, Colon & Rectal"},
    {key:"doc_spl_44",value:"Surgery, General"},
    {key:"doc_spl_45",value:"Surgery, Hand"},
    {key:"doc_spl_46",value:"Surgery, Thoracic"},
    {key:"doc_spl_47",value:"Surgery, Urology"},
    {key:"doc_spl_48",value:"Surgery, Vascular"},
    {key:"doc_spl_56",value:"Thoracic Surgery"},
    {key:"doc_spl_56",value:"Urology"},
    {key:"doc_spl_49",value:"Other"}
    ];
    var dentistslists = [
        {key:"den_spl_0",value:"Dental Care"},
        {key:"den_spl_0",value:"Dental Hygiene"},
        {key:"den_spl_2",value:"Endodontics"},
        {key:"den_spl_3",value:"General Dentistry"},
        {key:"den_spl_4",value:"Oral and Maxillofacial Radiology"},
        {key:"den_spl_5",value:"Oral and Maxillofacial Surgery"},
        {key:"den_spl_6",value:"Oral Pathology"},
        {key:"den_spl_7",value:"Orthodontics"},
        {key:"den_spl_8",value:"Pediatric Dentistry"},
        {key:"den_spl_9",value:"Periodontics"},
        {key:"den_spl_10",value:"Prosthodontics"},
        {key:"den_spl_11",value:"Other"}
        ];
        var chiropractors = [
        
        {key:1,value:"Chiropractic"}
        ];
        var vision = [
        {key:"vh_spl_2",value:"Audiology"},
        {key:"vh_spl_3",value:"Eye Doctor"},
        {key:"vh_spl_4",value:"Hearing Specialist"},
        {key:"vh_spl_5",value:"Ophthalmologist"},
        {key:"vh_spl_6",value:"Optometrist"}
        ];
        var otherSpeciality = [
            {key:"other_spl_0",value:"Acupuncture/Acupressure"},
            {key:"other_spl_1",value:"Assisted Living Facility"},
            {key:"other_spl_2",value:"Counseling"},
            {key:"other_spl_3",value:"Genetics"},
            {key:"other_spl_4",value:"Home Health Care"},
            {key:"other_spl_5",value:"Hospice"},
            {key:"other_spl_6",value:"Long-term Care"},
            {key:"other_spl_7",value:"Massage Therapy"},
            {key:"other_spl_8",value:"Midwife"},
            {key:"other_spl_9",value:"Naturopathy"},
            {key:"other_spl_10",value:"Nutritionist"},
            {key:"other_spl_16",value:"Psychology"},
            {key:"other_spl_11",value:"Respiratory Therapy"},
            {key:"other_spl_12",value:"Respite Care"},
            {key:"other_spl_13",value:"Skilled Nursing Facility"},
            {key:"other_spl_14",value:"Sleep Specialist"},
            {key:"other_spl_15",value:"Speech Therapy"}
        ]
        var insuranceJson = [
        {key:"insure_1",value:"I will pay myself"},
        {key:"insure_2",value:"1199SEIU"},
        {key:"insure_3",value:"AARP"},
        {key:"insure_4",value:"Affinity Health Plan "},
        {key:"insure_5",value:"AIG"},
        {key:"insure_6",value:"Allianz Life Insurance Company of North "},
        {key:"insure_7",value:"Allied Insurance Group"},
        {key:"insure_8",value:"Alta Health &amp; Life Insurance Company "},
        {key:"insure_9",value:"Altius (Coventry Health Care)"},
        {key:"insure_10",value:"American Alternatives Insurance Corporat"},
        {key:"insure_11",value:"American Family Insurance"},
        {key:"insure_12",value:"American General Life and Accident Insur"},
        {key:"insure_13",value:"American Heritage Life Insurance Company"},
        {key:"insure_14",value:"American Income Life Insurance Company"},
        {key:"insure_15",value:"American National Insurance Company"},
        {key:"insure_16",value:"American National Life Insurance Company"},
        {key:"insure_17",value:"American States Insurance Company"},
        {key:"insure_18",value:"AmeriChoice by UnitedHealthcare"},
        {key:"insure_19",value:"Amerigroup"},
        {key:"insure_20",value:"AmeriHealth"},
        {key:"insure_21",value:"Anthem Blue Cross Blue Shield (Californi"},
        {key:"insure_22",value:"Anthem Blue Cross Blue Shield (Connectic"},
        {key:"insure_23",value:"Anthem Blue Cross Blue Shield (Virginia)"},
        {key:"insure_24",value:"Assurant Health Employee Benefits"},
        {key:"insure_25",value:"Atlantis Health Plan"},
        {key:"insure_26",value:"AXA Equitable Life Insurance Company"},
        {key:"insure_27",value:"Bankers Life and Casualty Company"},
        {key:"insure_28",value:"Banner Life Insurance Company"},
        {key:"insure_29",value:"BCS Insurance Company "},
        {key:"insure_30",value:"Beech Street"},
        {key:"insure_31",value:"Blue Cross and Blue Shield of Massachuse"},
        {key:"insure_32",value:"Blue Cross Blue Shield"},
        {key:"insure_33",value:"Blue Shield of California"},
        {key:"insure_34",value:"Building Service 32BJ Health Fund"},
        {key:"insure_35",value:"CA Motor Car Dealers Employee Benefits T"},
        {key:"insure_36",value:"CareFirst Blue Cross Blue Shield (Maryla"},
        {key:"insure_37",value:"CarePlus Health Plans"},
        {key:"insure_38",value:"CDPHP"},
        {key:"insure_39",value:"Celtic Insurance Company"},
        {key:"insure_40",value:"Central United Life Insurance Company"},
        {key:"insure_41",value:"Chesapeake Life Insurance Company"},
        {key:"insure_42",value:"Cigna"},
        {key:"insure_43",value:"Cincinnati Life Insurance Company "},
        {key:"insure_44",value:"Commercial Travelers Mutual Insurance Co"},
        {key:"insure_45",value:"ConnectiCare"},
        {key:"insure_46",value:"Conseco Life Insurance Company"},
        {key:"insure_47",value:"Continental Assurance Company "},
        {key:"insure_48",value:"Continental Casualty Company "},
        {key:"insure_49",value:"Continental General Insurance Company "},
        {key:"insure_50",value:"Definity Health"},
        {key:"insure_51",value:"Delta Dental"},
        {key:"insure_52",value:"Elderplan"},
        {key:"insure_53",value:"Emblem "},
        {key:"insure_54",value:"EMC National Life Company "},
        {key:"insure_55",value:"Empire Blue Cross Blue Shield (New York)"},
        {key:"insure_56",value:"Excellus Blue Cross Blue Shield (New Yor"},
        {key:"insure_57",value:"Fidelis Care"},
        {key:"insure_58",value:"First Health (Coventry Health Care)"},
        {key:"insure_59",value:"Freelancers Insurance Company (BlueCard "},
        {key:"insure_60",value:"GEHA Health Plans"},
        {key:"insure_61",value:"General American Life Insurance Company"},
        {key:"insure_62",value:"Genworth Life and Annuity Insurance Comp"},
        {key:"insure_63",value:"GHI"},
        {key:"insure_64",value:"Globe Life &amp; Accident Insurance Company"},
        {key:"insure_65",value:"Golden Rule "},
        {key:"insure_66",value:"Golden Rule Insurance Company"},
        {key:"insure_67",value:"Great West Healthcare"},
        {key:"insure_68",value:"Great-West Life &amp; Annuity Insurance Comp"},
        {key:"insure_69",value:"Group Ins. Trust of the CA Society of CP"},
        {key:"insure_70",value:"Guarantee Trust Life Insurance Company"},
        {key:"insure_71",value:"Guardian"},
        {key:"insure_72",value:"HAP (Alliance)"},
        {key:"insure_73",value:"Hartford Life and Accident Insurance Com"},
        {key:"insure_74",value:"Hartford Life Insurance Company"},
        {key:"insure_75",value:"Harvard Pilgrim Healthcare"},
        {key:"insure_76",value:"Health Net"},
        {key:"insure_77",value:"HealthSmart Preferred Care"},
        {key:"insure_78",value:"HIP"},
        {key:"insure_79",value:"HM Life Insurance Company"},
        {key:"insure_80",value:"Horizon Blue Cross Blue Shield"},
        {key:"insure_81",value:"Hudson Health Plus "},
        {key:"insure_82",value:"Humana Insurance Company"},
        {key:"insure_83",value:"Jefferson National Life Insurance Compan"},
        {key:"insure_84",value:"John Alden Life Insurance Company "},
        {key:"insure_85",value:"John Hancock Life Insurance Company"},
        {key:"insure_86",value:"Kaiser Permanente (California"},
        {key:"insure_87",value:"Kaiser Permanente (Maryland, Virginia, A"},
        {key:"insure_88",value:"Kaiser Permanente (Mid-Atlantic Region)"},
        {key:"insure_89",value:"Kaiser Permanente Insurance Company"},
        {key:"insure_90",value:"Kanawha Insurance Company "},
        {key:"insure_91",value:"Lincoln National Life Insurance Company"},
        {key:"insure_92",value:"MagnaCare"},
        {key:"insure_93",value:"Mamsi"},
        {key:"insure_94",value:"Markel Insurance Company"},
        {key:"insure_95",value:"Massachusetts Casualty Insurance Company"},
        {key:"insure_96",value:"Medi-Cal"},
        {key:"insure_97",value:"Medicaid"},
        {key:"insure_98",value:"Medicare "},
        {key:"insure_99",value:"Mega Life and Health Insurance Company"},
        {key:"insure_100",value:"Mennonite Mutual Aid Association "},
        {key:"insure_101",value:"MESVision"},
        {key:"insure_102",value:"Metropolitan Life Insurance Company"},
        {key:"insure_103",value:"Mid-West National Life Insurance Company"},
        {key:"insure_104",value:"Molina"},
        {key:"insure_105",value:"Monumental Life Insurance Company"},
        {key:"insure_106",value:"Multiplan"},
        {key:"insure_107",value:"Mutual of Omaha"},
        {key:"insure_108",value:"MVP"},
        {key:"insure_109",value:"National Benefit Life Insurance Company "},
        {key:"insure_110",value:"National Capital"},
        {key:"insure_111",value:"National Foundation Life Insurance Compa"},
        {key:"insure_112",value:"National Health Insurance Company"},
        {key:"insure_113",value:"National Union Fire Insurance company of"},
        {key:"insure_114",value:"Nationwide Life Insurance Company"},
        {key:"insure_115",value:"NewYork-Presbyterian Community Health Pl"},
        {key:"insure_116",value:"Nippon Life Insurance Company of America"},
        {key:"insure_117",value:"NLI America "},
        {key:"insure_118",value:"North Carolina Mutual Life Insurance Com"},
        {key:"insure_119",value:"Ohio National Life Insurance Company "},
        {key:"insure_120",value:"OptimaHealth"},
        {key:"insure_121",value:"Oxford Health Plans"},
        {key:"insure_122",value:"PacifiCare"},
        {key:"insure_123",value:"Pan-American Life Insurance Company"},
        {key:"insure_124",value:"PHCS"},
        {key:"insure_125",value:"Philadelphia American Life Insurance Com"},
        {key:"insure_126",value:"Physicians Mutual Insurance Company"},
        {key:"insure_127",value:"POMCO"},
        {key:"insure_128",value:"Premera Blue Cross"},
        {key:"insure_129",value:"Premera Blue Cross (Washington"},
        {key:"insure_130",value:"Primerica Life Insurance Company"},
        {key:"insure_131",value:"Principal Financial Group "},
        {key:"insure_132",value:"Principal Life Insurance Company"},
        {key:"insure_133",value:"Professional Insurance Company"},
        {key:"insure_134",value:"Providence "},
        {key:"insure_135",value:"Prudential Insurance Company of America"},
        {key:"insure_136",value:"QualCare"},
        {key:"insure_137",value:"Rayant"},
        {key:"insure_138",value:"Reassure America Life Insurance Company "},
        {key:"insure_139",value:"Regence Blue Shield (Washington)"},
        {key:"insure_140",value:"Reliance Standard Life Insurance Company"},
        {key:"insure_141",value:"Security Mutual Life Insurance Company o"},
        {key:"insure_142",value:"SelectHealth"},
        {key:"insure_143",value:"Sentry Life Insurance Company"},
        {key:"insure_144",value:"Sierra Health and Life Insurance Company"},
        {key:"insure_145",value:"Significa Insurance Group, Inc. "},
        {key:"insure_146",value:"Standard Insurance Company "},
        {key:"insure_147",value:"Standard Life and Accident Company "},
        {key:"insure_148",value:"State Farm"},
        {key:"insure_149",value:"State Farm Mutual Automobile Insurance C"},
        {key:"insure_150",value:"State Life Insurance Company "},
        {key:"insure_151",value:"SummaCare "},
        {key:"insure_152",value:"SutterSelect"},
        {key:"insure_153",value:"Symetra Life Insurance Company"},
        {key:"insure_154",value:"Texas True Choice/Ethix Southwest"},
        {key:"insure_155",value:"Thrivent Financial for Lutherans "},
        {key:"insure_156",value:"Transamerica Financial Life Insurance Co"},
        {key:"insure_157",value:"TriCare/TriWest"},
        {key:"insure_158",value:"Trustmark Life Insurance Company "},
        {key:"insure_159",value:"Tufts Associated Health Plan"},
        {key:"insure_160",value:"Unicare"},
        {key:"insure_161",value:"Unified Life Insurance Company"},
        {key:"insure_162",value:"Union Fidelity Life Insurance Company"},
        {key:"insure_163",value:"Union Labor Life Insurance Company"},
        {key:"insure_164",value:"Union Security Insurance Company "},
        {key:"insure_165",value:"United Agricultural Employee Welfare Ben"},
        {key:"insure_166",value:"United HealthCare Insurance Company"},
        {key:"insure_167",value:"United States Fire Insurance Company"},
        {key:"insure_168",value:"United States Life Insurance Company in "},
        {key:"insure_169",value:"Unitrin"},
        {key:"insure_170",value:"VSP "},
        {key:"insure_171",value:"Vytra"},
        {key:"insure_172",value:"Wellmark Blue Cross Blue Shield (Iowa)"},
        {key:"insure_173",value:"Wellmark Blue Cross Blue Shield (South D"},
        {key:"insure_174",value:"Wells Fargo (Acordia)"},
        {key:"insure_175",value:"Workers Compensation"},
        {key:"insure_176",value:"Health Plan of Nevada"}
        ];
      var langJson = [{id:"English",key:"en"},{id:"Spanish",key:"es"},{id:"French",key:"fr"},{id:"Hindi",key:"hi"},{id:"Chinese",key:"zh"}
        ,{id:"German",key:"de"},{id:"Italian",key:"it"},{id:"Japanese",key:"ja"},{id:"Korean",key:"ko"}];
    var QusTypeJson = [{id:"What was the name of your high school?",key:"0"},{id:"What is the name of your first PET?",key:"1"},{id:"What is your all-time favorite sports team?",key:"2"},
                        {id:"What is your all-time favorite past-time?",key:"3"},{id:"What was the name of your favorite food as a child?",key:"4"},
                        {id:"What is your favorite color?",key:"5"},
                        {id:"What is the name of your hometown?",key:"6"}];
    var titleJson = [{id:"Dr.",key:"Dr."},{id:"Mr.",key:"Mr."},{id:"Mrs.",key:"Mrs."}];

    var cashPriceJson =  [{id:"$51 - $99",key:"51"},{id:"$100 - $150",key:"100"},{id:"$151 - $200",key:"151"},{id:"$200 +",key:"200"},{id:"Not Available",key:"NoAble"}];
    var OfferJson =  [{id:"10% - 20%",key:"51"},{id:"20% - 30%",key:"100"},{id:"30% - 40%",key:"151"},{id:"40% - 50%",key:"200"},{id:"40% - 50%",key:"200"},{id:"50% +",key:"NoAble"},{id:"Other",key:"Other"},{id:"Not Available",key:"0"}];
    var planType = [{id:"Gold",key:"gold"},{id:"Silver",key:"silver"},{id:"Bronze",key:"bronze"},{id:"Free",key:"free"}];
    var StateJson = [
    { name: 'ALABAMA', abbreviation: 'AL'},
    { name: 'ALASKA', abbreviation: 'AK'},
    { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
    { name: 'ARIZONA', abbreviation: 'AZ'},
    { name: 'ARKANSAS', abbreviation: 'AR'},
    { name: 'CALIFORNIA', abbreviation: 'CA'},
    { name: 'COLORADO', abbreviation: 'CO'},
    { name: 'CONNECTICUT', abbreviation: 'CT'},
    { name: 'DELAWARE', abbreviation: 'DE'},
    { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
    { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
    { name: 'FLORIDA', abbreviation: 'FL'},
    { name: 'GEORGIA', abbreviation: 'GA'},
    { name: 'GUAM', abbreviation: 'GU'},
    { name: 'HAWAII', abbreviation: 'HI'},
    { name: 'IDAHO', abbreviation: 'ID'},
    { name: 'ILLINOIS', abbreviation: 'IL'},
    { name: 'INDIANA', abbreviation: 'IN'},
    { name: 'IOWA', abbreviation: 'IA'},
    { name: 'KANSAS', abbreviation: 'KS'},
    { name: 'KENTUCKY', abbreviation: 'KY'},
    { name: 'LOUISIANA', abbreviation: 'LA'},
    { name: 'MAINE', abbreviation: 'ME'},
    { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
    { name: 'MARYLAND', abbreviation: 'MD'},
    { name: 'MASSACHUSETTS', abbreviation: 'MA'},
    { name: 'MICHIGAN', abbreviation: 'MI'},
    { name: 'MINNESOTA', abbreviation: 'MN'},
    { name: 'MISSISSIPPI', abbreviation: 'MS'},
    { name: 'MISSOURI', abbreviation: 'MO'},
    { name: 'MONTANA', abbreviation: 'MT'},
    { name: 'NEBRASKA', abbreviation: 'NE'},
    { name: 'NEVADA', abbreviation: 'NV'},
    { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
    { name: 'NEW JERSEY', abbreviation: 'NJ'},
    { name: 'NEW MEXICO', abbreviation: 'NM'},
    { name: 'NEW YORK', abbreviation: 'NY'},
    { name: 'NORTH CAROLINA', abbreviation: 'NC'},
    { name: 'NORTH DAKOTA', abbreviation: 'ND'},
    { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
    { name: 'OHIO', abbreviation: 'OH'},
    { name: 'OKLAHOMA', abbreviation: 'OK'},
    { name: 'OREGON', abbreviation: 'OR'},
    { name: 'PALAU', abbreviation: 'PW'},
    { name: 'PENNSYLVANIA', abbreviation: 'PA'},
    { name: 'PUERTO RICO', abbreviation: 'PR'},
    { name: 'RHODE ISLAND', abbreviation: 'RI'},
    { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
    { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
    { name: 'TENNESSEE', abbreviation: 'TN'},
    { name: 'TEXAS', abbreviation: 'TX'},
    { name: 'UTAH', abbreviation: 'UT'},
    { name: 'VERMONT', abbreviation: 'VT'},
    { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
    { name: 'VIRGINIA', abbreviation: 'VA'},
    { name: 'WASHINGTON', abbreviation: 'WA'},
    { name: 'WEST VIRGINIA', abbreviation: 'WV'},
    { name: 'WISCONSIN', abbreviation: 'WI'},
    { name: 'WYOMING', abbreviation: 'WY' }
  ];
    var getCategoryJson  = function(){
      return CategoryJson ;
    }
    var getDoctorsJson  = function(){
      return DoctorsJson ;
    }
    var getdentistslists  = function(){
      return dentistslists ;
    }
    var getchiropractors  = function(){
      return chiropractors ;
    }
    var getvision  = function(){
      return vision ;
    }
    var getinsuranceJson  = function(){
      return insuranceJson ;
    }
    var getLangJson  = function(){
      return langJson ;
    }
    var getQusTypeJson  = function(){
      return QusTypeJson ;
    }
    var gettitleJson  = function(){
      return titleJson ;
    }
    var getcashPriceJson  = function(){
      return cashPriceJson ;
    }
    var getOfferJson  = function(){
      return OfferJson ;
    }
    var getStateJson  = function(){
      return StateJson ;
    }
    var getplanType  = function(){
      return planType ;
    }
    var getotherSpeciality = function(){
        return otherSpeciality
    }

    return {
        getotherSpeciality:getotherSpeciality,
      getCategoryJson: getCategoryJson,
      getDoctorsJson: getDoctorsJson,
      getdentistslists: getdentistslists,
      getchiropractors: getchiropractors,
      getinsuranceJson : getinsuranceJson,
      getLangJson : getLangJson,
      getQusTypeJson : getQusTypeJson,
      gettitleJson : gettitleJson,
      getcashPriceJson : getcashPriceJson,
      getOfferJson : getOfferJson,
      getStateJson : getStateJson,
      getplanType : getplanType,
      getvision : getvision 
    }
});
mdtreeApp.service('productService', function() {
  var specialty;
  var insurance;
  var location;
  var category;
  var doctordetails;
  var date_day_time;
  var reason;
  var name;
  var signupclicked;
  var usertype;
  var loginerror;
  var usererrorname;
  var userdisplayname;
  var doctor;
  var doctorEmailTemp;
  var usertypevalue;
  var locationdetails;
  var addinsurance;
  var SlotStatus;
  var ErrorAppointment;
  var jsonForAdvSearch;
  var errormsgwhenAppointment;
  var temppublisheremail;
  var addspecialty = function(newObj) {
     specialty = newObj;
  }

  var getspecialty = function(){
    return specialty;
  }
  var addusertype = function(newObj) {
     usertype = newObj;
  }

  var getusertype = function(){
    return usertype;
  }

  var addinsurance = function(newObj) {
     insurance = newObj;
  }

  var getinsurance = function(){
    return insurance;
  }
  var addlocation = function(newObj) {
     location = newObj;
  }

  var getlocation = function(){
    return location;
  }
    var addcategory = function(newObj) {
     category = newObj;
    }

    var getcategory = function(){
    return category;
    }
    var adddoctordetails = function(newObj) {
     doctordetails = newObj;
    }

    var getdoctordetails = function(){
    return doctordetails;
    }
    var adddate_day_time = function(data) {
         date_day_time = data;
    }

    var getdate_day_time = function(){
    return date_day_time;
    }
    var addreason = function(data) {
         reason = data
    }

    var getreason = function(){
    return reason;
    }

    var addname = function(data) {
         name = data;
    }

    var getname = function(){
    return name;
    }
    var addsignupclicked = function(data) {
         signupclicked  = data;
    }
    var getsignupclicked = function(){
    return signupclicked ;
    }
    var addloginerror = function(data) {
         loginerror  = data;
    }
    var getloginerror = function(){
    return loginerror ;
    }
    var addusererrorname = function(data) {
         usererrorname  = data;
    }
    var getusererrorname = function(){
    return usererrorname ;
    }
    var adduserdisplayname = function(data) {
         userdisplayname  = data;
    }
    var getuserdisplayname = function(){
    return userdisplayname ;
    }
    var adddoctor = function(data) {
         doctor  = data;
    }
    var getdoctor = function(){
    return doctor ;
    }
    var adddoctorEmailTemp = function(data) {
         doctorEmailTemp  = data;
    }
    var getdoctorEmailTemp = function(){
    return doctorEmailTemp ;
    }
    var addusertypevalue = function(data) {
         usertypevalue  = data;
         
    }
    var getusertypevalue = function(){
    return usertypevalue ;
    }
    var addlocationdetails = function(data) {
         locationdetails  = data;
         
    }
    var getlocationdetails = function(){
    return locationdetails ;
    }
    var addaddinsurance = function(data) {
         addinsurance  = data;
         
    }
    var getaddinsurance = function(){
    return addinsurance ;
    }
    var addSlotStatus = function(data){
          SlotStatus = data;
    }
    var getSlotStatus = function(){
         return SlotStatus ;
    }
    var addErrorAppointment = function(data){
          ErrorAppointment = data;
    }
    var getErrorAppointment = function(){
         return ErrorAppointment ;
    }
    var addjsonForAdvSearch = function(data){
          jsonForAdvSearch = data;
    }
    var getjsonForAdvSearch = function(){
         return jsonForAdvSearch ;
    }
    var adderrormsgwhenAppointment = function(data){
          errormsgwhenAppointment = data;
    }
    var geterrormsgwhenAppointment= function(){
         return errormsgwhenAppointment ;
    }
    var addtemppublisheremail = function(data){
          temppublisheremail = data;
    }
    var gettemppublisheremail= function(){

        var temp = temppublisheremail;
        temppublisheremail = ""
        console.log(temp);
         return temp ;
    }

  return {
    addtemppublisheremail:addtemppublisheremail,
    gettemppublisheremail :gettemppublisheremail,
    adderrormsgwhenAppointment:adderrormsgwhenAppointment,
    geterrormsgwhenAppointment:geterrormsgwhenAppointment,
    addjsonForAdvSearch:addjsonForAdvSearch,
    getjsonForAdvSearch:getjsonForAdvSearch,
    addspecialty: addspecialty,
    getspecialty: getspecialty,
    addinsurance: addinsurance,
    getinsurance: getinsurance,
    addlocation: addlocation,
    getlocation: getlocation,
    addcategory : addcategory,
    getcategory : getcategory,
    adddoctordetails : adddoctordetails,
    getdoctordetails : getdoctordetails,
    adddate_day_time : adddate_day_time,
    getdate_day_time : getdate_day_time,
    addreason : addreason,
    getreason : getreason,
    addsignupclicked : addsignupclicked,
    getsignupclicked : getsignupclicked,
    addname : addname,
    getname : getname,
    addusertype : addusertype,
    getusertype : getusertype,
    addloginerror : addloginerror,
    getloginerror : getloginerror,
    addusererrorname : addusererrorname,
    getusererrorname : getusererrorname,
    adduserdisplayname : adduserdisplayname,
    getuserdisplayname : getuserdisplayname,
    adddoctor : adddoctor,
    getdoctor : getdoctor,
    adddoctorEmailTemp : adddoctorEmailTemp,
    getdoctorEmailTemp : getdoctorEmailTemp,
    addusertypevalue : addusertypevalue,
    getusertypevalue : getusertypevalue,
    addlocationdetails : addlocationdetails,
    getlocationdetails :getlocationdetails,
    addaddinsurance : addaddinsurance,
    getaddinsurance : getaddinsurance,
    addSlotStatus : addSlotStatus,
    getSlotStatus : getSlotStatus,
    addErrorAppointment : addErrorAppointment,
    getErrorAppointment : getErrorAppointment
  };

});