import Joi from '@hapi/joi';

import repo from './repo';
import requests from './requests';
import apps from './apps';
import packages from './packages';

export default Joi.object({
	repo,
	requests,
	apps,
	packages,
}).required();
