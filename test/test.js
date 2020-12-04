let expect = require('chai').expect;
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/test";


const client = new MongoClient(url)
const connect = client.connect()


describe('Tests',() =>{
    var req = {
        session: {},
        body: {}
    };
    var res = {
        locals: {},
        redirect: ()=>{}
    };
    var next = ()=>{};


    after(()=>{
        connect.then(()=>{
            client.db('test').dropDatabase();
        });
    });

/*
template
it("name",(done)=>{
    connect.then(()=>{
        req.db = client.db('test');
            done();
    });
});
*/



//|---------------------------------------|
//|               accounts                |
//|---------------------------------------|

    describe('Accounts',()=>{

        let getSession = require("../routes/source/checkSession");
        let login = require("../routes/source/login");
        let register = require("../routes/source/register");
        let logout = require("../routes/source/logout");

        before((done)=>{
            connect.then(()=>{
                req.db = client.db('test');
                req.db.collection("users").insertOne({
                    "username":"alice",
                    "password":"asd",
                    "account":"admin",
                    "sessionid":1
                }).then(()=>{done();});
            });
        });


        it('sanityTest',(done)=>{ 
            connect.then(()=>{
                req.db = client.db('test');
                expect(req.db).not.equals(undefined);
                req.db.collection("users").find({"username":"alice"}).toArray((err,users)=>{
                    expect(users[0].account).equals("admin");
                    done();
                });
            });
        });


        it("getSession",(done)=>{
            connect.then(()=>{
                req.db = client.db('test');
                req.session.id = 1;                  
                getSession(req,res,()=>{
                    expect(res.locals.sessionType).equals("admin");
                    expect(res.locals.username).equals("alice");
                    done();
                });
            });
        });

        it("loginNewSession",(done)=>{
            connect.then(()=>{
                req.db = client.db('test');
                req.session.id = 2;
                req.body.username = "alice";
                req.body.password = "asd";
                res.locals.sessionType = "guest";
                login(req,res,()=>{                    
                    getSession(req,res,()=>{
                        expect(res.locals.sessionType).equals("admin");
                        expect(res.locals.username).equals("alice");
                        done();
                    });
                });
            });
        });

        it("logout",(done)=>{
            connect.then(()=>{
                req.db = client.db('test');

                req.session.id = 3;
                login(req,res,()=>{
                    logout(req,res,()=>{});
                    getSession(req,res,()=>{
                        expect(res.locals.sessionType).equals("guest");
                        done();
                    });
                });
            });
        });

        it("RegisterSecondUser",(done)=>{
            connect.then(()=>{
                req.db = client.db('test');
                req.body.username = "bob";
                req.body.password = "123";
                req.session.id = 4;
                res.locals.sessionType = "guest";
                register(req,res,()=>{
                    getSession(req,res,()=>{
                        expect(res.locals.sessionType).equals("user");
                        expect(res.locals.username).equals("bob");
                        done();
                    })
                })
            });
        });

    });

//|---------------------------------------|
//|               orders                  |
//|---------------------------------------|




})