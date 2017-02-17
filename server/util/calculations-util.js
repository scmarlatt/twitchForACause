module.exports = class CalcUtil {
	static megaDays () {
	
	}

	static megaDaysTotalToGive (megaDays, megaDaysRule) {
		let total = megaDays * (megaDaysRule.pledgePerPersonMegaDaysVal / megaDaysRule.pledgePerPersonMegaDaysUnit);
		return (total > megaDaysRule.limit) ? limit : total;
	}

	static peakViewerTotalToGive (peakViewers, peakViewersRule) {
		return (peakViewers >= peakViewersRule.peakViewerGoal) ? peakViewersRule.pledgeForPeakViewerGoal : 0;
	}

	static xViewerTotalToGive (peakViewers, xViewersRule) {
		let total = peakViewers * (xViewersRule.pledgePerXViewersVal / xViewersRule.pledgePerXViewersUnit);
		return (peakViewers >= peakViewersRule.peakViewerGoal) ? peakViewersRule.pledgeForPeakViewerGoal : 0;
	}

	static subTotalToGive (subObject, subRule) {
		let total;
		if (subRule.subType === "New Sub") {
			total = subObject.newSubs * subRule.pledgePerSub;
			return (total > subObject.limit) ? limit : total;
		} else if (subRule.subType === "Re Sub") {
			total = subObject.reSubs * subRule.pledgePerSub;
			return (total > subObject.limit) ? limit : total;
		} else {
			total = subObject.deltaSubs * subRule.pledgePerSub;
			return (total > subObject.limit) ? limit : total;
		}
	}

	static followerTotalToGive (newFollowers, newFollowerRule) {
		let total = newFollowers * newFollowerRule.pledgePerNewFollower;
		return (total > newFollowerRule.limit) ? limit : total;
	}

	static uptimeTotalToGive (uptime, uptimeRule) {
		let total = uptime * uptimeRule.pledgePerHourUptime;
		return (total > uptimeRule.limit) ? limit : total;
	}
};