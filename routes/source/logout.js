//remove user's session id from database
module.exports = (req, res, next) => {

    if (res.locals.sessionType != "guest") {

        let coll = req.db.collection('users');


        coll.find({}).toArray((er, docs) => {
            docs.forEach((entry) => {
                if (entry.sessionid == req.session.id) {
                    coll.updateOne(entry, {
                        $set: {
                            "username": entry.username,
                            "password": entry.password,
                            "account": entry.account,
                            "sessionid": "none"
                        }
                    },
                    (eerr, result) => {
                    });
                }
            });
        });
    }
    res.redirect("/"+res.locals.page);
}
