import Joi from '@hapi/joi';

export default Joi.array().items(Joi.object({
	name: Joi.string().trim().max(50).truncate().required(),
	packageName: Joi.string().trim().required(),
	added: Joi.date().timestamp().required(),
	lastUpdated: Joi.date().timestamp().required(),
	suggestedVersionName: Joi.string().trim().failover(null).optional(),
	suggestedVersionCode: Joi.number().integer().positive().optional(),
	authorName: Joi.string().trim().failover(null).optional(),
	authorEmail: Joi.string().trim().email({
		tlds: false,
	}).failover(null).optional(),
	authorWebSite: Joi.string().trim().uri({
		scheme: ['http', 'https'],
	}).failover(null).optional(),
	icon: Joi.string().trim().failover(null).optional(),
	summary: Joi.string().trim().max(80).truncate().failover(null).optional(),
	description: Joi.string().trim().max(4000).truncate().failover(null).optional(),
	categories: Joi.array().items(Joi.string().trim()).default([]).optional(),
	antiFeatures: Joi.array().items(Joi.string().trim()).default([]).optional(),
	license: Joi.string().trim().replace('Unknown', '').failover(null).optional(),
	webSite: Joi.string().trim().uri({
		scheme: ['http', 'https'],
	}).failover(null).optional(),
	sourceCode: Joi.string().trim().uri({
		scheme: ['http', 'https'],
	}).failover(null).optional(),
	issueTracker: Joi.string().trim().uri({
		scheme: ['http', 'https'],
	}).failover(null).optional(),
	translation: Joi.string().trim().uri({
		scheme: ['http', 'https'],
	}).failover(null).optional(),
	changelog: Joi.string().trim().uri({
		scheme: ['http', 'https'],
	}).failover(null).optional(),
	donate: Joi.string().trim().uri({
		scheme: ['http', 'https'],
	}).failover(null).optional(),
	flattrID: Joi.number().integer().positive().failover(null).optional(),
	liberapayID: Joi.number().integer().positive().failover(null).optional(),
	openCollective: Joi.string().failover(null).optional(),
	bitcoin: Joi.string().trim().alphanum().failover(null).optional(),
	litecoin: Joi.string().trim().alphanum().failover(null).optional(),
	localized: Joi.object().pattern(Joi.any(), Joi.object({
		name: Joi.string().trim().max(50).truncate().failover(null).optional(),
		summary: Joi.string().trim().max(80).truncate().failover(null).optional(),
		description: Joi.string().trim().max(4000).truncate().failover(null).optional(),
		whatsNew: Joi.string().trim().max(500).truncate().failover(null).optional(),
		icon: Joi.string().trim().failover(null).optional(),
		featureGraphic: Joi.string().trim().failover(null).optional(),
		promoGraphic: Joi.string().trim().failover(null).optional(),
		tvBanner: Joi.string().trim().failover(null).optional(),
		video: Joi.string().trim().uri({
			scheme: ['http', 'https'],
		}).failover(null).optional(),
		phoneScreenshots: Joi.array().items(Joi.string().trim()).default([]).optional(),
		sevenInchScreenshots: Joi.array().items(Joi.string().trim()).default([]).optional(),
		tenInchScreenshots: Joi.array().items(Joi.string().trim()).default([]).optional(),
		tvScreenshots: Joi.array().items(Joi.string().trim()).default([]).optional(),
		wearScreenshots: Joi.array().items(Joi.string().trim()).default([]).optional(),
	})).failover(null).optional(),
})).required();
