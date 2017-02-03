process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let eventRoutes = require('../server/routes/event-routes');
var tfacSchema = require('../server/sqldb/tfac-schemas');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Events', () => {
    beforeEach((done) => {
        tfacSchema.streamEvent.remove({}, (err) => {});
        tfacSchema.subRule.remove({}, (err) => {});
        tfacSchema.followerRule.remove({}, (err) => {});
        tfacSchema.peakViewerRule.remove({}, (err) => {});
        tfacSchema.xViewerRule.remove({}, (err) => {});
        tfacSchema.megaDaysRule.remove({}, (err) => {});
        tfacSchema.uptimeRule.remove({}, (err) => {});
        done();     
    });

    describe('/GET get events', () => {
        it('it should GET all events', (done) => {
          chai.request(server)
          .get('/api/events/all')
          .end((err, res) => {
              res.should.have.status(200);
              res.should.have.property('body').eql([]);
            done();
          });
        });
    });
    
    describe('/GET get event by id', () => {
        it('it should GET an event', (done) => {
          let testEvent = new tfacSchema.streamEvent({
            userID:  "smarlatt",
            startDate: "12/21/2017",
            status: "Active",
            description: "Test String",
            organization: "Ozone House",
            rules: []
          })
          testEvent.save((err, testEvent) => {
              chai.request(server)
              .get('/api/events/getEvent/' + testEvent.id)
              .send(testEvent)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('userID').eql('smarlatt');
                  res.body.should.have.property('startDate');
                  res.body.should.have.property('status');
                  res.body.should.have.property('description');
                  res.body.should.have.property('organization');
                  res.body.should.have.property('rules');
                  res.body.should.have.property('rules').eql([]);                  
                  res.body.should.have.property('_id').eql(testEvent.id);
                done();
              });
          });
        });

        it('it should not GET an event', (done) => {
            chai.request(server)
            .get('/api/events/getEvent/' + 'abcdefg')
            .end((err, res) => {
                res.should.have.status(500);
              done();
            });
        });
    });

    describe('/GET get event by status', () => {
        it('it should GET a list of events by status', (done) => {
          let testEvent1 = new tfacSchema.streamEvent({
            userID:  "smarlatt",
            startDate: "12/21/2017",
            status: "active",
            description: "Test String",
            organization: "Ozone House",
            rules: []
          });
          let testEvent2 = new tfacSchema.streamEvent({
            userID:  "smarlatt",
            startDate: "12/21/2017",
            status: "active",
            description: "Test String",
            organization: "Ozone House",
            rules: []
          });
          testEvent1.save((err, testEvent1) => {
            testEvent2.save((err, testEvent2) => {
              chai.request(server)
              .get('/api/events/getEvent/' + testEvent2.status)
              .send(testEvent1)
              .end((err, res) => {
                  console.log(res.body);
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                done();
              });
            });
          });
        });
    });
});