

module.exports = (sessionId) =>{

    const jsonfile = require("jsonfile");
    let returnVal = "Failed"
    let json = jsonfile.readFileSync("./database/users/users.json");

    json.forEach(user => {
        if(user.sessionId == sessionId){
            user.sessionId = "";
            returnVal = "Success"
            console.log("Logout successful");
        }
    });

    jsonfile.writeFileSync("./database/users/users.json", json, function (err) {
        if (err) console.error(err)
    })

    return returnVal;
}