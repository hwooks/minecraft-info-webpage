const { getEventBroker } = require('../event-broker');
const { getLogger } = require('../logger');
const { getMcApiRequester } = require('../mc-api-requester');
const { getRepository } = require('../repositories');
const { NotifyEveryHourJob } = require('./notify-every-time-job');
const { WritePlaytimeJob } = require('./write-playtime-job');

const initCronjobApp = () => {
	const eventBroker = getEventBroker();
	const logger = getLogger('cronjob-app');

	// dependencies of CronjobApps
	const mcApiRequester = getMcApiRequester();
	const userPlaytimeRepository = getRepository('UserPlaytimeRepository');
	const serverStatusRepository = getRepository('ServerStatusRepository');

	// ccronJobApp 
	const cronJobApps = [
		new NotifyEveryHourJob({
			mcApiRequester
		}),
		
		new WritePlaytimeJob({
			userPlaytimeRepository,
			serverStatusRepository,
			logger: getLogger('writePlaytimeJob')
		})
	];

	for (const app of cronJobApps) {
		eventBroker.subscribe(
			app.topicName(),
			() => app.execute()
		);
	}

	logger.info(`cronjob-apps are ready, number of jobs: ${cronJobApps.length}`);
};

module.exports = {
	initCronjobApp
};
