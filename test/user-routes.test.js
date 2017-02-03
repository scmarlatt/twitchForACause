process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let userRoutes = require('../server/routes/user-routes');
var tfacSchema = require('../server/sqldb/tfac-schemas');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
    beforeEach((done) => {
        tfacSchema.tfacUser.remove({}, (err) => { 
           done();         
        });     
    });

    describe('/GET get user', () => {
        it('it should GET a user by id', (done) => {
            let user = new tfacSchema.tfacUser({tfacUsername: "scmarlatt15",twitchUsername: "scomar1221",email: "scmarlatt15@gmail.com",age: "24"});
            user.save((err, user) => {
                chai.request(server)
                .get('/api/user/' + user.id)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('tfacUsername');
                    res.body.should.have.property('twitchUsername');
                    res.body.should.have.property('email');
                    res.body.should.have.property('age');
                    res.body.should.have.property('_id').eql(user.id);
                  done();
                });
            });
        })
    });

    describe('/POST update user', () => {
        it('it should update a user ', (done) => {
          let user = new tfacSchema.tfacUser({tfacUsername: "scmarlatt15",twitchUsername: "scomar1221",email: "scmarlatt15@gmail.com",age: "24"});
            user.save((err, user) => {
                let user2 = {tfacUsername: "scmarlatt16", twitchUsername: "scomar1221",email: "scmarlatt15@gmail.com",age: "24"};
                chai.request(server)
                .post('/api/user/' + user.id)
                .send(user2)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('tfacUsername').eql(user2.tfacUsername);
                    res.body.should.have.property('twitchUsername');
                    res.body.should.have.property('email');
                    res.body.should.have.property('age');
                    res.body.should.have.property('_id').eql(user.id);
                  done();
                });
            });
        });
    });

    describe('/POST add user', () => {
        it('it should POST a user ', (done) => {
            let user = {
                tfacUsername: "scmarlatt",
                twitchUsername: "scomar1221",
                email: "scmarlatt15@gmail.com",
                age: "24"
            }
            chai.request(server)
            .post('/api/user/newUser')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('tfacUsername');
                res.body.should.have.property('twitchUsername');
                res.body.should.have.property('email');
                res.body.should.have.property('age');
              done();
            });
        });
    });

    describe('/POST user', () => {
        it('it should not POST a second user ', (done) => {
          let user1 = {
              tfacUsername: "scmarlatt",
              twitchUsername: "scomar1221",
              email: "scmarlatt15@gmail.com",
              age: "24"
          };

          let user2 = {
              tfacUsername: "scmarlatt",
              twitchUsername: "scomar1221",
              email: "scmarlatt15@gmail.com",
              age: "24"
          };
          chai.request(server)
          .post('/api/user/newUser')
          .send(user1)
          .end((err, res) => {
              res.should.have.status(200);
            done();
          });
          chai.request(server)
          .post('/api/user/newUser')
          .send(user2)
          .end((err, res) => {
              res.should.have.status(500);
            done();
          });
        });
    });

});