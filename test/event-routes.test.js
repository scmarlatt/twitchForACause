process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const eventRoutes = require('../server/routes/event-routes');
const StreamEvent = require('../server/models/stream-event-model');
const RulesModel = require('../server/models/rules-model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const assert = require('chai').assert;

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
				ruleType: 'SubRule',
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
						res.should.have.status(200);
						res.body.should.be.a('array');
						done();
					});
				});
			});

		});
	});

	describe('/POST post a new event', () => {
		it('it should POST a new event', (done) => {
			let testEvent = {
				twitchId:  'scomar1221',
				startDate: '12/21/1992', // must be date format
				status: 'Upcoming',
				description: 'testing 123',
				organization: 'Ozone House',
				totalAmountRaised: 0,
				rules: [
					{ruleType: 'SubRule', subType: 'New', pledgePerSub: 1, limit: 10},
					{ruleType: 'FollowerRule', pledgePerNewFollower: 1, limit: 10}
				]
			};
			chai.request(server)
			.post('/api/events/create')
			.send(testEvent)
			.end((err, res) => {
				res.should.have.status(200);
				done();
			})
		});

		it('it should POST a new event due to a missing field', (done) => {
			let testEvent = {
				startDate: '12/21/1992', // must be date format
				status: 'Upcoming',
				description: 'testing 123',
				organization: 'Ozone House',
				totalAmountRaised: 0,
				rules: [
					{ruleType: 'SubRule', subType: 'New', pledgePerSub: 1, limit: 10},
					{ruleType: 'FollowerRule', pledgePerNewFollower: 1, limit: 10}
				]
			};
			chai.request(server)
			.post('/api/events/create')
			.send(testEvent)
			.end((err, res) => {
				res.should.have.status(500);
				done();
			})
		});

		it('it should not POST a new event', (done) => {
			let testEvent = {
				startDate: '12/21/1992', // must be date format
				status: 'Upcoming',
				description: 'testing 123',
				organization: 'Ozone House',
				totalAmountRaised: 0,
				rules: [
					{ruleType: 'SubRule', subType: 'New', pledgePerSub: 1, limit: 10},
					{ruleType: 'FollowerRule', pledgePerNewFollower: 1, limit: 10}
				]
			};
			chai.request(server)
			.post('/api/events/create')
			.send(testEvent)
			.end((err, res) => {
				res.should.have.status(500);
				done();
			})
		});

		it('it should not POST a new event with bad rules', (done) => {
			let testEvent = {
				twitchId:  'scomar1221',
				startDate: '12/21/1992', // must be date format
				status: 'Upcoming',
				description: 'testing 123',
				organization: 'Ozone House',
				totalAmountRaised: 0,
				rules: [
					{nameType: 'SubRule', subType: 'New', pledgePerSub: 1, limit: 10},
					{ruleType: 'FollowerRule', pledgePerNewFollower: 1, limit: 10}
				]
			};
			chai.request(server)
			.post('/api/events/create')
			.send(testEvent)
			.end((err, res) => {
				res.should.have.status(500);
				done();
			})
		});
	});

	describe('/POST update event by id', () => {
		it('it should POST an item to update', (done) => {
			let testRule = new RulesModel.SubRule({
				ruleType: 'SubRule',
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
					testEvent1.twitchId = "scomar1221";
					chai.request(server)
					.post('/api/events/update/' + savedEvent._id)
					.send(testEvent1)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.have.property('twitchId').eql('scomar1221');
						done();
					});
				});
			});
		});

		it('it should not POST an item to update due to missing fields', (done) => {
			let testRule = new RulesModel.SubRule({
				ruleType: 'SubRule',
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
					let x = {twitch: "scomar1221"};
					//testEvent1.twitchId = "scomar1221";
					chai.request(server)
					.post('/api/events/update/' + savedEvent._id)
					.send(x)
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
				});
			});
		});
	});

	// create rule
		// basic rule creation, make sure event gets updated too
		// invalid input
		// valid rule, but invalid id
	describe('/update/rules/create/:id', () => {
		it('it should create a rule, and update its parent', (done) => {
			let testEvent1 = new StreamEvent({
				twitchId:  "smarlatt",
				startDate: "12/21/2017",
				status: "Active",
				description: "Test String",
				organization: "Ozone House",
				totalAmountRaised: 0,
				rules: []
			});
			testEvent1.save((err, savedEvent) => {
				let testRule = new RulesModel.SubRule({
					ruleType: 'SubRule',
					subType: "New",
					pledgePerSub: 1,
					limit: 10
				});
				chai.request(server)
				.post('/api/events/update/rules/create/' + savedEvent._id)
				.send(testRule)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('newRule');
					res.body.should.have.property('updatedEvent');
					res.body.updatedEvent.rules.should.have.property('length').eql(1);
					done();
				});
			});
		});

		it('it should not create a rule, and not update its parent', (done) => {
			let testEvent1 = new StreamEvent({
				twitchId:  "smarlatt",
				startDate: "12/21/2017",
				status: "Active",
				description: "Test String",
				organization: "Ozone House",
				totalAmountRaised: 0,
				rules: []
			});
			testEvent1.save((err, savedEvent) => {
				let testRule = new RulesModel.SubRule({
					subType: "New",
					pledgePerSub: 1,
					limit: 10
				});
				chai.request(server)
				.post('/api/events/update/rules/create/' + savedEvent._id)
				.send(testRule)
				.end((err, res) => {
					res.should.have.status(500);
					res.body.should.not.have.property('newRule');
					res.body.should.not.have.property('updatedEvent');
					chai.request(server)
					.get('/api/events/get/' + savedEvent._id)
					.end((err, res) => {
						res.body.rules.length.should.be.eql(0);
						done();
					});
				});
			});
		});

		it('it should not create a rule, due to invalid id', (done) => {
			let testEvent1 = new StreamEvent({
				twitchId:  "smarlatt",
				startDate: "12/21/2017",
				status: "Active",
				description: "Test String",
				organization: "Ozone House",
				totalAmountRaised: 0,
				rules: []
			});
			testEvent1.save((err, savedEvent) => {
				let testRule = new RulesModel.SubRule({
					ruleType: 'SubRule',
					subType: "New",
					pledgePerSub: 1,
					limit: 10
				});
				chai.request(server)
				.post('/api/events/update/rules/create/' + 123)
				.send(testRule)
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
			});
		});
	});
	// update rule
		// basic update
		// invalid input
	describe('/update/rules/update', () => {
		it('it should update a rule', (done) => {
			let testRule = new RulesModel.SubRule({
				ruleType: 'SubRule',
				subType: "New",
				pledgePerSub: 1,
				limit: 10
			});
			testRule.save((err, savedRule) => {
				let updatedRule = savedRule;
				updatedRule.limit = 11;
				chai.request(server)
				.post('/api/events/update/rules/update')
				.send(updatedRule)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property('limit').eql(11);
					done();
				});
			});
		});

		it('it should not update a rule', (done) => {
			let testRule = new RulesModel.SubRule({
				ruleType: 'SubRule',
				subType: "New",
				pledgePerSub: 1,
				limit: 10
			});
			testRule.save((err, savedRule) => {
				let updatedRule = {};
				updatedRule._id = savedRule._id;
				updatedRule.limit = savedRule.limit;
				chai.request(server)
				.post('/api/events/update/rules/update')
				.send(updatedRule)
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
			});
		});
	});

	// delete rule
		// invalid input
		// valid delete, event rules array gets spliced
	describe('/update/rules/delete/:id', () => {
		it('it should delete a rule, and update its parent', (done) => {
			// create rule
			let testRule = new RulesModel.SubRule({
				ruleType: 'SubRule',
				subType: "New",
				pledgePerSub: 1,
				limit: 10
			});
			// save rule
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
				// save event with rule info
				testEvent1.save((err, savedEvent) => {
					// delete rule
					chai.request(server)
					.post('/api/events/update/rules/delete/' + savedEvent._id)
					.send(savedRule)
					.end((err, res) => {
						res.should.have.status(200);
						// check parent
						res.body.rules.should.have.property('length').eql(0);
						done();
					});
				});
			});
		});

		it('it should not delete a rule, and not update its parent', (done) => {
			// create rule
			let testRule = new RulesModel.SubRule({
				ruleType: 'SubRule',
				subType: "New",
				pledgePerSub: 1,
				limit: 10
			});
			// save rule
			testRule.save((err, savedRule) => {
				let badRule = {};
				badRule._id = savedRule._id;
				badRule.limit = savedRule.limit;
				let testEvent1 = new StreamEvent({
					twitchId:  "smarlatt",
					startDate: "12/21/2017",
					status: "Active",
					description: "Test String",
					organization: "Ozone House",
					totalAmountRaised: 0,
					rules: [{ruleType: 'SubRule', _id: savedRule._id, amountRaised: 0}]
				});
				// save event with bad rule info
				testEvent1.save((err, savedEvent) => {
					// delete rule
					chai.request(server)
					.post('/api/events/update/rules/delete/' + savedEvent._id)
					.send(badRule)
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
				});
			});
		});
	});

	// delete event by id
		// basic delete
		// invalid input
		// check that a rule from list get properly deleted
	describe('/delete/:id', () => {
		it('it should delete an event', (done) => {
			// create rule
			let testEvent = new StreamEvent({
				twitchId:  "smarlatt",
				startDate: "12/21/2017",
				status: "Active",
				description: "Test String",
				organization: "Ozone House",
				totalAmountRaised: 0,
				rules: []
			});
			// save rule
			testEvent.save((err, savedEvent) => {
				chai.request(server)
				.post('/api/events/delete/' + savedEvent._id)
				.send(savedEvent)
				.end((err, res) => {
					res.should.have.status(200);
					// check parent
					StreamEvent.findById(savedEvent._id, (err, result) => {
						assert.equal(result, null);
						done();
					});
				});
			});
		});

		it('it should not delete an event due to bad input object', (done) => {
			// create rule
			let testEvent = new StreamEvent({
				startDate: "12/21/2017",
				status: "Active",
				description: "Test String",
				organization: "Ozone House",
				totalAmountRaised: 0,
				rules: []
			});
			// save rule
			testEvent.save((err, savedEvent) => {
				chai.request(server)
				.post('/api/events/delete/' + savedEvent._id)
				.send({test: 123})
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
			});
		});

		it('it should not delete an event due to bad req param id', (done) => {
			// create rule
			let testEvent = new StreamEvent({
				startDate: "12/21/2017",
				status: "Active",
				description: "Test String",
				organization: "Ozone House",
				totalAmountRaised: 0,
				rules: []
			});
			// save rule
			testEvent.save((err, savedEvent) => {
				chai.request(server)
				.post('/api/events/delete/123')
				.send(savedEvent)
				.end((err, res) => {
					res.should.have.status(500);
					done();
				});
			});
		});

		it('it should delete an event and a rule', (done) => {
			// create rule
			let testRule = new RulesModel.SubRule({
				ruleType: 'SubRule',
				subType: "New",
				pledgePerSub: 1,
				limit: 10
			});

			testRule.save((err, savedRule) => {
				let testEvent = new StreamEvent({
					twitchId:  "smarlatt",
					startDate: "12/21/2017",
					status: "Active",
					description: "Test String",
					organization: "Ozone House",
					totalAmountRaised: 0,
					rules: [{ruleType: 'SubRule', _id: savedRule._id, amountRaised: 0}]
				});
				// save rule
				testEvent.save((err, savedEvent) => {
					chai.request(server)
					.post('/api/events/delete/' + savedEvent._id)
					.send(savedEvent)
					.end((err, res) => {
						res.should.have.status(200);
						// check parent
						RulesModel.SubRule.findById(savedRule._id, (err, result) => {
							assert.equal(result, null);
							done();
						});
					});
				});
			});
		});
	});	

});