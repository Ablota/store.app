import Joi from '@hapi/joi';

export default Joi.object({
	name: Joi.string().trim().max(50).truncate().required(),
	description: Joi.string().trim().max(4000).truncate().failover(null).required(),
	address: Joi.string().trim().uri({
		scheme: ['http', 'https'],
	}).required(),
	icon: Joi.string().trim().optional(),
	mirrors: Joi.array().items(Joi.string().trim().uri({
		scheme: ['http', 'https'],
	})).default([]).optional(),
	version: Joi.number().integer().positive().required(),
	timestamp: Joi.date().timestamp().required(),
	maxage: Joi.number().integer().min(0).optional(),
}).required();
