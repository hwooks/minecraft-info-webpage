
// {"player":{"uuid":"d8da487c-f51d-36d3-8f08-893175b8d8d5","displayName":"jaydee","address":"183.109.193.172","port":59172,"exhaustion":2.266624,"exp":0.9189186,"whitelisted":false,"banned":false,"op":false},"deathMessage":"jaydee fell from a high place","drops":[],"eventType":"PlayerDeath"}

const { PlayerEventVO } = require('../../repositories/vo/player-event-vo');

class DeathEventVO {

	constructor({
		uuid,
		nickname,
		deathMessage,
		createdAt
	}) {
		this._uuid = uuid;
		this._nickname = nickname;
		this._deathMessage = deathMessage;
		this._createdAt = createdAt;

		if (createdAt && createdAt instanceof Date === false) {
			throw new Error('createdAt must be instance of Date');
		}
	}

	static fromEventAPIResponse(response) {
		return new DeathEventVO({
			uuid: response.player.uuid,
			nickname: response.player.displayName,
			deathMessage: response.deathMessage,
			createdAt: new Date()
		});
	}

	get uuid() {
		return this._uuid;
	}

	get nickname() {
		return this._nickname;
	}

	get deathMessage() {
		return this._deathMessage;
	}

	get createdAt() {
		return this._createdAt;
	}

	toPlayerEventVO() {
		return new PlayerEventVO({
			uuid: this._uuid,
			nickname: this._nickname,
			type: PlayerEventVO.PlayerDeath(),
			message: this._deathMessage,
			createdAt: this._createdAt
		});
	}
}

module.exports = {
	DeathEventVO
};
