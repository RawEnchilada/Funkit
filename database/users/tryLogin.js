

module.exports = (username,password,sessionId) =>{

    const jsonfile = require("jsonfile");
    let returnVal = "Failed"
    let json = jsonfile.readFileSync("./database/users/users.json");

    json.forEach(user => {
        if(user.username == username && user.password == password){
            user.sessionId = sessionId;
            returnVal = "Success"
            console.log("Login successful");
        }
    });

    jsonfile.writeFileSync("./database/users/users.json", json, function (err) {
        if (err) console.error(err)
    })

    return returnVal;
}