const { PlaytimeVO } = require("../repositories/vo/playtime-vo");

class ServerStatusFetcher {

	constructor({
		serverStatusRepository,
		userPlaytimeRepository,
		userEventRepository,
		logger
	}) {
		this._serverStatusRepo = serverStatusRepository,
		this._userPlaytimeRepository = userPlaytimeRepository;
		this._userEventRepository = userEventRepository;
		this._logger = logger;
	}

	async fetch() {
		const allPlayers = await this._serverStatusRepo.findAllPlayers();
		const onlinePlayers = await this._serverStatusRepo.findOnlinePlayers();

		return {
			allPlayers,
			onlinePlayers
		};
	}

	async playtimeRanks({
		take
	} = {}) {
		const allPlayers = await this._serverStatusRepo.findAllPlayers();
		const allRecords = await this._userPlaytimeRepository.findPlaytimes();

		const convertedAllPlayers =
			allPlayers.map(p => {
				const foundRecord = allRecords.find(r => r.uuid === p.uuid);
				return new PlaytimeVO({
					uuid: p.uuid,
					nickname: p.nickname,
					minPlayed: foundRecord ? foundRecord.minPlayed : undefined,
					lastPlayedTime: foundRecord ? foundRecord.lastPlayedTime : undefined
				});
		});

		const sorted =
			convertedAllPlayers.sort((a, b) =>
				a.minPlayed > b.minPlayed ? -1 : 1);

		if (take === undefined) {
			return sorted;
		}
		return sorted.slice(0, take);
	}

	async latestChats({
		take
	} = {}) {
		const chatEvents = this._userEventRepository.findPlayerEvents({
			types: ['PlayerChat', 'PlayerJoin'],
			take: take ? take : 20
		})
		return chatEvents;
	}
}

module.exports = { 
	ServerStatusFetcher
};
