require('dotenv/config');

const { initConfigurations, getConfiguration } = require('./configurator');
const { initCronjobApp } = require('./cronjob-app');
const { initExpressApp } = require('./express-app');
const { getLogger } = require('./logger');
const { initSequelizeModels } = require('./mysql-sequelize');
const { initRepositories } = require('./repositories');
const { initServerStatusModules } = require('./server-status');

(async () => {
	const log = getLogger('bootstrap');

	initConfigurations();
	await initSequelizeModels();
	initRepositories();
	initServerStatusModules();

	const port = getConfiguration('HTTP_PORT');
	const webserver = initExpressApp();
	initCronjobApp();

	webserver.listen(port, () =>
		log.info(`the webserver has been started, port: ${port}`)
	);
})();
