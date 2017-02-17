process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const eventRoutes = require('../server/routes/event-routes');
const StreamEvent = require('../server/models/stream-event-model');
const RulesModel = require('../server/models/rules-model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Events', () => {
	beforeEach((done) => {
		StreamEvent.remove({}, (err) => {});
		RulesModel.SubRule.remove({}, (err) => {});
		RulesModel.FollowerRule.remove({}, (err) => {});
		RulesModel.PeakViewerRule.remove({}, (err) => {});
		RulesModel.XViewerRule.remove({}, (err) => {});
		RulesModel.MegaDaysRule.remove({}, (err) => {});
		RulesModel.UptimeRule.remove({}, (err) => {});
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
			let testEvent = new StreamEvent({
				twitchId:  "smarlatt",
				startDate: "12/21/2017",
				status: "Active",
				description: "Test String",
				organization: "Ozone House",
				totalAmountRaised: 0,
				rules: []
			})
			testEvent.save((err, testEvent) => {
				chai.request(server)
				.get('/api/events/get/' + testEvent._id)
				.send(testEvent)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('twitchId').eql('smarlatt');
					res.body.should.have.property('startDate');
					res.body.should.have.property('status');
					res.body.should.have.property('description');
					res.body.should.have.property('organization');
					res.body.should.have.property('totalAmountRaised');
					res.body.should.have.property('rules');
					res.body.should.have.property('rules').eql([]);                  
					res.body.should.have.property('_id').eql(testEvent.id);
					done();
				});
			});
		});

		it('it should not GET an event', (done) => {
			chai.request(server)
			.get('/api/events/get/' + 'abcdefg')
			.end((err, res) => {
				res.should.have.status(500);
				done();
			});
		});
	});

	describe('/GET get event by status', () => {
		it('it should GET a list of events by status', (done) => {
			let testEvent1 = new StreamEvent({
				twitchId:  "smarlatt",
				startDate: "12/21/2017",
				status: "Active",
				description: "Test String",
				organization: "Ozone House",
				totalAmountRaised: 0,
				rules: []
			});
			let testEvent2 = new StreamEvent({
				twitchId:  "smarlatt",
				startDate: "12/21/2017",
				status: "Active",
				description: "Test String",
				organization: "Ozone House",
				totalAmountRaised: 0,
				rules: []
			});
			testEvent1.save((err, testEvent1) => {
				testEvent2.save((err, testEvent2) => {
					chai.request(server)
					.get('/api/events/all/' + testEvent2.status)
					.send(testEvent1)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.eql(2);
						done();
					});
				});
			});
		});
	});

	describe('/GET get rules for event by event id', () => {
		it('it should GET a list of rules', (done) => {
			let testRule = new RulesModel.SubRule({
				subType: "New",
				pledgePerSub: 1,
				limit: 10
			});
			testRule.save((err, savedRule) => {
				let testEvent1 = new StreamEvent({
					twitchId:  "smarlatt",
					startDate: "12/21/2017",
					status: "Active",
					description: "Test String",
					organization: "Ozone House",
					totalAmountRaised: 0,
					rules: [{ruleType: 'SubRule', _id: savedRule._id, amountRaised: 0}]
				});
				testEvent1.save((err, savedEvent) => {
					chai.request(server)
					.get('/api/events/get/rules/' + savedEvent._id)
					.end((err, res) => {
						console.log(res.body);
						res.should.have.status(200);
						res.body.rules.should.be.a('array');
						done();
					});
				});
			});

		});
	});
});