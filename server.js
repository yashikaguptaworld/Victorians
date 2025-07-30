var express = require("express");
var fileuploader = require("express-fileupload");
var cloudinary = require("cloudinary").v2;

var mysql2 = require("mysql2");
var fs = require("fs");


//AI//
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyA9mhgjBMS0U3dhnOuZqMOREpAaiBOglb0");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });



var app = express();//app() returns an Object:app
app.use(fileuploader());

app.listen(2006, function () {
    console.log("Server Started at Port no: 2006")
})

app.use(express.static("public"));


//===================================================================================================================================================================================

app.get("/project", function (req, resp) {
    // console.log(__dirname);
    // console.log(__filename);

    let path = __dirname + "/public/index.html";
    resp.sendFile(path);
})

//============================================================================================================================================================================
app.use(express.urlencoded(true)); //convert POST data to JSON object

cloudinary.config({
    cloud_name: 'dfyxjh3ff',
    api_key: '261964541512685',
    api_secret: 'PfRVIo1IagO5z_ZnNFI1TQ7DOLc' // Click 'View API Keys' above to copy your API secret
});

//==============================================================================================================================================================================================
let dbConfig = "mysql://avnadmin:AVNS_mV1zWU9yILzEaJ4FRdt@mysql-1dd1a5ef-yashikagupta198922-eee8.c.aivencloud.com:13354/defaultdb";

let mySqlVen = mysql2.createConnection(dbConfig);
mySqlVen.connect(function (errKuch) {
    if (errKuch == null)
        console.log("AiVen Connected Successfulllyyy!!!!");
    else
        console.log(errKuch.message)
})


//======================================================================================================================================================================================================

app.post("/org-det", async function (req, resp) {
    let picurl = "";
    if (req.files != null) {
        let fName = req.files.profilePic.name;
        let fullPath = __dirname + "/public/uploads/" + fName;
        req.files.profilePic.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
        });
    }
    else
        picurl = "nopic.jpg";
    let emailid = req.body.txtEmail3;
    let pwd = req.body.txtPwd3;
    let name = req.body.Name3;
    let address = req.body.Address3;
    let city = req.body.City3;
    let established = req.body.ESTAB3;


    mySqlVen.query("insert into org values(?,?,?,?,?,?,?)", [emailid, pwd, name, address, city, established, picurl], function (errKuch) {
        if (errKuch == null)
            resp.send("Record Saved Successfulllyyy....Badhai");
        else
            resp.send(errKuch)
    })
})


//========================================================================================================================================================================================================

app.post("/update-user", async function (req, resp) {
    let picurl = "";
    if (req.files != null) //user wants to Update Profile Pic
    {
        let fName = req.files.profilePic.name;
        let fullPath = __dirname + "/public/uploads/" + fName;
        req.files.profilePic.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
        });
    }
    else
        picurl = req.body.hdn;


    let emailid = req.body.txtEmail3;
    let pwd = req.body.txtPwd3;
    let name = req.body.Name3;
    let address = req.body.Address3;
    let city = req.body.City3;
    let established = req.body.ESTAB3;

    console.log("emailid: " + emailid);

    mySqlVen.query("update org set pwd=?,name=?,address=?,city=?,established=?,picurl=? where emailid=?", [pwd, name, address, city, established, picurl, emailid], function (errKuch2, result2) {
        if (errKuch2 == null) {
            if (result2.affectedRows == 1)
                resp.send("Record updated Successfulllyyy....Badhai");
            else
                resp.send("Invalid email Id");
        }
        else
            resp.send(errKuch2.message)
    })

})


//============================================================================================================================================================================================================

// SIGNUP FORM 
app.get("/get-one", function (req, resp) {

    let emailid = req.query.txtEmail;
    let pass = req.query.pass;
    let combo = req.query.combo;

    // console.log(pass);

    mySqlVen.query("insert into project values(?,?,?,current_date(),?)", [emailid, pass, combo, 1], function (errKuch) {
        if (errKuch == null)
            resp.send("Record Saved Successfulllyyy....Badhai");
        else
            resp.send(errKuch.message);
    })
})

//===================================================================================================================================================================================================

app.get("/post-one", function (req, resp) {

    let emailid = req.query.txtEmail4;
    let event = req.query.txtTitle4;
    let doe = req.query.txtDate4;
    let toe = req.query.txtTime4;
    let address = req.query.txtAddress4;
    let city = req.query.txtCity4;
    let sports = req.query.txtSport4;
    let minage = req.query.txtMin4;
    let maxage = req.query.txtMax4;
    let last = req.query.txtDate14;
    let fee = req.query.txtFees4;
    let prize = req.query.txtPrize4;
    let contact = req.query.txtContact4;



    console.log(emailid)

    // console.log(pass);

    mySqlVen.query("insert into post values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [null, emailid, event, doe, toe, address, city, sports, minage, maxage, last, fee, prize, contact], function (errKuch) {
        if (errKuch == null)
            resp.send("Event Saved Successfully");
        else
            resp.send(errKuch.message);
    })
})



//===========================================================================================================================================================================================================

app.get("/chk-login", function (req, resp) {

    let emailid2 = req.query.txtEmail2;
    let pwd2 = req.query.txtPwd2;

    console.log(emailid2);


    // console.log(pass);

    mySqlVen.query("select *  from  project where emailid = ? and pwd = ?", [emailid2,pwd2], function (errKuch,result) {


       if (errKuch) {
              console.error("MySQL Error:", errKuch); // print the error in console
               resp.send("Server error");  // send error to client
                return;
            }
        if (result.length === 0) {
            resp.send("Invalid");
        }
        else if (result[0].status == 1) {
            resp.send(result[0].usertype);
        }
        else {
            resp.send("Blocked");
        }

    })
})


//==================================================================================================================================================================================================================================================================

// SEARCH OF ORGANISATION DETAILS
app.get("/get-two", function (req, resp) {
    mySqlVen.query("select * from org where emailid=?", [req.query.txtEmail], function (err, allRecords) {
        if (allRecords.length == 0)
            resp.send("No Record Found");
        else
            resp.json(allRecords);
    })
})


//===============================================================================================================================================================================
//angularhttp.html


app.get("/users", function (req, resp) {
    let emailid = req.query.emailid;
    mySqlVen.query("select * from post where emailid=? ", [emailid], function (err, allRecords) {
        if (err == null)
            resp.send(allRecords);
        else
            resp.send(err.message);
    })
})



//==================================================================================================================================================================================


app.get("/delete-one", function (req, resp) {
    console.log(req.query)
    let rid = req.query.ridKuch;;;;;
    // let pwd=req.query.pwdKuch;

    mySqlVen.query("delete from post where rid=? ", [rid], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows == 1)
                resp.send(rid + " Deleted Successfulllyyyy...");
            else
                resp.send("rid");
        }
        else
            resp.send(errKuch);

    })
})

//================================================================================================================================================================================



app.post("/play-det", async function (req, resp) {
 

async function RajeshBansalKaChirag(imgurl) {
    const myprompt = "Read the text on picture and tell all the information in adhaar card and give output STRICTLY in JSON format {adhaar_number:'', name:'', gender:'', dob: ''}. Dont give output as string."
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())

    const cleaned = result.response.text().replace(/```json|```/g, '').trim();
    const jsonData = JSON.parse(cleaned);
    console.log(jsonData);

    return jsonData

}

app.post("/picreader", async function (req, resp) {
     let profilePic1 = "";
    let profilePic2 = "";
    let jsonData=[];
    try{

    
    if (req.files != null) {
     let    fName = req.files.profilePic1.name;
        let locationToSave = __dirname + "/public/uploads/" + fName;//full ile path

      await  req.files.profilePic1.mv(locationToSave);//saving file in uploads folder

        //saving ur file/pic on cloudinary server
        
            await cloudinary.uploader.upload(locationToSave).then(async function (picUrlResult) {
             profilePic1=picUrlResult.url;
             console.log(profilePic1);
                 jsonData = await RajeshBansalKaChirag(picUrlResult.url);
            });
        }
        else
            profilePic1="nopic.jpg";
    }
     catch{
        console.log("cloudinary crash");
    }


    try{    
    if (req.files != null) {
     let    fName = req.files.profilePic2.name;
        let locationToSave = __dirname + "/public/uploads/" + fName;//full ile path

      await  req.files.profilePic2.mv(locationToSave);//saving file in uploads folder

        //saving ur file/pic on cloudinary server
        
            await cloudinary.uploader.upload(locationToSave).then(async function (picUrlResult) {
             profilePic2=picUrlResult.url;
             console.log(profilePic2);
                 jsonData = await RajeshBansalKaChirag(picUrlResult.url);
            });
        }
        else
            profilePic2="nopic.jpg";
    }
    catch{
        console.log("cloudinary crash");
    }

                let emailid = req.body.txtEmail4;
                let NAME = jsonData.NAME;
                let dob = jsonData.dob;
                
                let gender = jsonData.gender;
                let address = req.body.Address4;
                let contact = req.body.Contact4;
                let sports = req.body.Game4;
                let other = req.body.About4;

                mySqlVen.query("insert into players values(?,?,?,?,?,?,?,?,?,?)", [emailid,profilePic1,profilePic2, NAME, dob, gender, address, contact, sports, other], function (errKuch) {
                    if (errKuch == null)
                        resp.send("Record Saved Successfulllyyy....Badhai");
                    else
                        resp.send(errKuch.message)
                })


                resp.send(jsonData);

            });

        }) 
    


//=====================================================================================================================================================================================



app.post("/update-user2", async function (req, resp) {
    let picurl = "";
    if (req.files != null) //user wants to Update Profile Pic
    {
        let fName = req.files.profilePic2.name;
        let fullPath = __dirname + "/public/uploads/" + fName;
        req.files.profilePic2.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function (picUrlResult) {
            picurl = picUrlResult.url;   //will give u the url of ur pic on cloudinary server

            console.log(picurl);
        });
    }
    else
        picurl = req.body.hdn;


    let emailid = req.body.txtEmail4;
    let NAME = req.body.txtName4;
    let dob = req.body.dob4;
    let gender = req.body.Gender4;
    let address = req.body.Address4;
    let contact = req.body.Contact4;
    let sports = req.body.Game4;
    let other = req.body.About4;

    console.log("emailid: " + emailid);

    mySqlVen.query("update players set NAME=?,dob=?,gender=?,address=?,contact=?,sports=?,other=? where emailid=?", [NAME, dob, gender, address, contact, sports, other, emailid], function (errKuch2, result2) {
        if (errKuch2 == null) {
            if (result2.affectedRows == 1)
                resp.send("Record updated Successfulllyyy....Badhai");
            else
                resp.send("Invalid email Id");
        }
        else
            resp.send(errKuch2.message)
    })

})


//==============================================================================================================================================================================================================================

app.get("/get-three", function (req, resp) {
    mySqlVen.query("select * from players where emailid=?", [req.query.txtEmail], function (err, allRecords) {
        if (allRecords.length == 0)
            resp.send("No Record Found");
        else
            resp.json(allRecords);
    })
})


//========================================================================================================================================================================================================================================


app.get("/do-fetch", function (req, resp) {
    mySqlVen.query("select * from project", function (err, allRecords) {
        resp.send(allRecords);
    })
})

//============================================================================================================================================================================================================


app.get("/block-one", function (req, resp) {
    let emailid = req.query.emailid;

    mySqlVen.query("UPDATE project SET status=0 WHERE emailid=?", [emailid], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows === 1)
                resp.send("BLOCKED!!!! " + emailid);
            else
                resp.send("Invalid emailid");
        } else {
            resp.send(errKuch);
        }
    });
});


//===========================================================================================================================================================================================================================


app.get("/unblock-one", function (req, resp) {
    let emailid = req.query.emailid;

    mySqlVen.query("UPDATE project SET status=1 WHERE emailid=?", [emailid], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows === 1)
                resp.send(" UNBLOCKED!!!!!!" + emailid);
            else
                resp.send("Invalid emailid");
        } else {
            resp.send(errKuch);
        }
    });
});

//=================================================================================================================================================================================================================================================
//ORGANISATION CARDS

app.get("/do-fetch-all-users", function (req, resp) {
    mySqlVen.query("select * from org", function (err, allRecords) {
        resp.send(allRecords);
    })
})

//===========================================================================================================================================================================================================================================================

app.get("/do-fetch-all-players", function (req, resp) {
    mySqlVen.query("select * from players", function (err, allRecords) {
        resp.send(allRecords);
    })
})


//===================================================================================================================================================================================================================================================================
//WHEN WE WANT ALL TOURNAMENTS IN CARDS WITHOUT HAVE ANY INTREST IN GAME AND CITY

app.get("/do-fetch-all-tournaments", function (req, resp) {
    mySqlVen.query("select * from post", function (err, allRecords) {
        resp.send(allRecords);
    })
})



//================================================================================================================================================================================================================================

app.get("/do-fetch-all-tournaments-explore",function(req,resp)
{
  console.log(req.query)
        mySqlVen.query("select * from post where city=? and sports=?",[req.query.kuchCity,req.query.kuchGame],function(err,allRecords)
        {
          console.log(allRecords)
                    resp.send(allRecords);
        })
})


//=========================================================================================================================================================================================================================================

app.get("/do-fetch-all-cities",function(req,resp)
{
        mySqlVen.query("select distinct city from post",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})

//===========================================================================================================================================


app.get("/do-fetch-all-sports",function(req,resp)
{
        mySqlVen.query("select distinct sports from post",function(err,allRecords)
        {
                    resp.send(allRecords);
        })
})

//===========================================================================================================================================



app.get("/change-pwd", function (req, resp) {
  

    mySqlVen.query("UPDATE project set pwd=? WHERE emailid=? and pwd=?", [req.query.kuchpwd1,req.query.kuchEmailid,req.query.kuchpwd], function (errKuch, result) {
        console.log();
        if (errKuch == null) {
            if (result.affectedRows === 1)
                resp.send("UPDATED SUCEESSFULLY");
            else
                resp.send("Invalid emailid");
        } else {
            resp.send(errKuch);
        }
    });
});