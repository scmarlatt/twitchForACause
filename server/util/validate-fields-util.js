'use strict'
const hasOwn = {}.hasOwnProperty

function validateFields(object, fields) {
	let safe = true;
	fields.forEach((field) => {
		if(!hasOwn.call(object, field)){
			safe = false;
		}
	});
	return safe;
};

const validateHelper = function(object, fields) {
	let safe = true;
	fields.forEach((field) => {
		if(!hasOwn.call(object, field)){
			safe = false;
		}
	});
	return safe;
}

function validateFieldsByRule(object) {
	if(!hasOwn.call(object, 'ruleType')) {
		return false;
	}
	switch(object.ruleType) {
		case 'SubRule':
			let subRuleFields = ['subType', 'pledgePerSub', 'limit'];
			if(!validateHelper(object, subRuleFields)) {
				return false;
			}
			break;
		case 'FollowerRule':
			let followerRuleFields = ['pledgePerNewFollower', 'limit'];
			if(!validateHelper(object, followerRuleFields)){
				return false;
			}
			break;
		case 'PeakViewerRule':
			let peakViewerRuleFields = ['peakViewerGoal', 'pledgeForPeakViewerGoal'];
			if(!validateFields(object, peakViewerRuleFields)){
				return false;
			}
			break;
		case 'XViewerRule':
			let xViewerRuleFields = ['pledgePerXViewersUnit', 'pledgePerXViewersVal', 'limit'];
			if(!validateFields(object, xViewerRuleFields)){
				return false;
			}
			break;
		case 'MegaDaysRule':
			let megaDaysRuleFields = ['pledgePerPersonMegaDaysUnit', 'pledgePerPersonMegaDaysVal', 'limit'];
			if(!validateFields(object, megaDaysRuleFields)){
				return false;
			}
			break;
		case 'UptimeRule':
			let uptimeRuleFields = ['pledgePerHourUptime', 'limit'];
			if(!validateFields(object, uptimeRuleFields)){
				return false;
			}
			break;
		default:
			console.log('default case');
			return false;
	}
	return true;
}

module.exports = {
	validateFields: validateFields,
	validateFieldsByRule: validateFieldsByRule
}