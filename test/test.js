let expect = require('chai').expect;
let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/test";


const client = new MongoClient(url)
const connect = client.connect()

/*
In order to avoid race conditions, every req,res is defined locally,
and most functions are invoked with callbacks.

Some cannot be invoked in such a way because the
functions that we are testing return next() before their operation has finished.
                ^THIS IS INTENTIONAL^

So in short -> Race conditions may apply.

Sanity Tests are for making sure the test database is working correctly,
they should not be affected by race conditions.
*/

describe('Tests',() =>{


    after(()=>{
        connect.then(()=>{
            client.db('test').dropDatabase();
        });
    });


//|---------------------------------------|
//|               accounts                |
//|---------------------------------------|

// Should be pretty consistent

    describe('Accounts',()=>{

        let getSession = require("../routes/source/checkSession");
        let login = require("../routes/source/login");
        let register = require("../routes/source/register");
        let logout = require("../routes/source/logout");

        before((done)=>{
            connect.then(()=>{
                let req = {db:null};
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
                let req={db:null};
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
                let req = {
                    db:null,
                    session:{id: 1}
                }
                let res={locals:{}};
                req.db = client.db('test');              
                getSession(req,res,()=>{
                    expect(res.locals.sessionType).equals("admin");
                    expect(res.locals.username).equals("alice");
                    done();
                });
            });
        });

        it("loginNewSession",(done)=>{
            connect.then(()=>{
                let req ={
                    db:null,
                    session:{id:2},
                    body:{
                        username:"alice",
                        password:"asd"
                    }
                }
                let res = {
                    locals:{sessionType:"guest"}
                }
                req.db = client.db('test');
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
                let req = {
                    db: null,
                    session:{id:3},
                    body:{
                        username:"alice",
                        password:"asd"
                    }
                };
                let res = {
                    locals:{},
                    redirect: ()=>{}
                };
                req.db = client.db('test');

                login(req,res,()=>{
                    logout(req,res,()=>{});
                    setTimeout(() => {
                        getSession(req,res,()=>{
                            expect(res.locals.sessionType).equals("guest");
                            done();
                        });
                    },50);
                });
            });
        });

        it("RegisterSecondUser",(done)=>{
            connect.then(()=>{
                let req = {
                    db:null,
                    body:{
                        username:"bob",
                        password:"123"
                    },
                    session:{id:4}
                };
                let res = {locals:{sessionType: "guest"}};
                req.db = client.db('test');
                register(req,res,()=>{
                    setTimeout(() => {
                        getSession(req,res,()=>{
                            expect(res.locals.sessionType).equals("user");
                            expect(res.locals.username).equals("bob");
                            done();
                        });                        
                    }, 50);
                })
            });
        });

        it("RegisterInvalidUser",(done)=>{
            connect.then(()=>{
                let req = {
                    db:null,
                    body:{
                        username:"",
                        password:""
                    },
                    session:{id:5}
                };
                let res = {locals:{sessionType:"guest"}};
                req.db = client.db('test');
                register(req,res,()=>{
                    getSession(req,res,()=>{
                        expect(res.locals.sessionType).equals("guest");
                        done();
                    })
                })
            });
        });

    });

//|---------------------------------------|
//|               orders                  |
//|---------------------------------------|

//  Order tests have race conditions that are not present in a live enviroment
//  No clue how to fix it

    describe('Orders',()=>{

        let postOrder = require("../routes/source/postOrder");
        let deleteOrder = require("../routes/source/deleteOrder");
        const { ReplSet } = require("mongodb");
        let ObjectId = require('mongodb').ObjectId; 

        before((done)=>{
            connect.then(()=>{
                let req = {db:null};
                req.db = client.db('test');
                req.db.collection("orders").insertOne({
                    "user":"username",
                    "name":"alice",
                    "product":"product",
                    "email":"mail",
                    "address":"street",
                    "amount":1,
                    "price":10
                }).then(()=>{
                req.db.collection("products").insertOne({
                    "name":"test",
                    "price":10
                })}).then(done());
            });
        });

        //sanityTest sometimes has race conditions, i have no clue why
        it('sanityTest',(done)=>{ 
            connect.then(()=>{
                let req={db:null};
                req.db = client.db('test');
                expect(req.db).not.equals(undefined);
                req.db.collection("orders").find({"address":"street"}).toArray((err,orders)=>{
                    let result = orders.find((element)=>{return element.name == "alice"});
                    expect(result.user).equals("username");
                    done();
                });
            });
        });

        //this is the most affected test,collection.find will return empty array sometimes
        it('postOrderForProduct',(done)=>{
            connect.then(()=>{
                let req = {
                    db:null,
                    body:{
                        name:"bob",
                        email:"mail",
                        address:"address",
                        amount:2,
                        product:"test"
                    }
                };
                let res = {
                    locals:{
                        sessionType: "user",
                        username: "userBob"
                    }
                }
                req.db = client.db('test');
                postOrder(req,res,()=>{
                    setTimeout(() => {
                        req.db.collection('orders').find({"name":"bob"}).toArray((err,orders)=>{
                            let result = orders.find((element)=>{return element.user == "userBob"});
                            expect(result.price).equals(2*10);
                            done();
                        });
                    },200);
                });
            });
        });

        it('postOrderForInvalidProduct',(done)=>{
            connect.then(()=>{
                let req = {
                    db:null,
                    body:{
                        name:"charlie",
                        email:"mail",
                        address:"address",
                        amount:2,
                        product:"none"
                    }
                };
                let res = {
                    locals:{
                        sessionType: "user",
                        username: "userCharlie"
                    }
                }
                req.db = client.db('test');
                postOrder(req,res,()=>{
                    setTimeout(() => {
                        req.db.collection('orders').find({"name":"charlie"}).toArray((err,orders)=>{
                            expect(orders.length).equals(0);
                            done();
                        });
                    },50);
                });
            });
        });

        it('deleteUserOrder',(done)=>{
            connect.then(()=>{
                let req = {
                    db:null,
                    body:{
                        name:"danny",
                        email:"mail",
                        address:"address",
                        amount:1,
                        product:"test"
                    }
                };
                let res = {
                    locals:{
                        sessionType: "user",
                        username: "userDanny"
                    }
                }
                req.db = client.db('test');
                postOrder(req,res,()=>{
                    req.db.collection('orders').find({"user":"userDanny"}).toArray((err,orders)=>{
                        req.body.id = orders[0]._id;
                        deleteOrder(req,res,()=>{
                            setTimeout(() => {
                                req.db.collection('orders').find({"name":"danny"}).toArray((err,orders)=>{
                                    expect(orders.length).equals(0);
                                    done();
                                });
                            },50);
                        });
                    });
                });
            });
        });

    });


//|---------------------------------------|
//|               products                |
//|---------------------------------------|



})