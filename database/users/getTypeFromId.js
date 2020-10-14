

module.exports = (sessionId) =>{

    const jsonfile = require("jsonfile");
    let returnVal = "guest";
    let json = jsonfile.readFileSync("./database/users/users.json");

    json.forEach(user => {
        if(user.sessionId == sessionId){
            returnVal = user.type;
        }
    });
    return returnVal;
}