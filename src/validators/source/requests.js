import Joi from '@hapi/joi';

export default Joi.object({
	install: Joi.array().items(Joi.string().trim()).default([]).optional(),
	uninstall: Joi.array().items(Joi.string().trim()).default([]).optional(),
}).required();
