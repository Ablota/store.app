import Joi from '@hapi/joi';

export default Joi.object().pattern(Joi.any(), Joi.array().items(Joi.object({
	packageName: Joi.string().trim().required(),
	apkName: Joi.string().trim().required(),
	added: Joi.date().timestamp().required(),
	versionName: Joi.string().trim().required(),
	versionCode: Joi.number().integer().positive().required(),
	minSdkVersion: Joi.number().integer().positive().optional(),
	targetSdkVersion: Joi.number().integer().positive().optional(),
	maxSdkVersion: Joi.number().integer().positive().optional(),
	nativecode: Joi.array().items(Joi.string().trim().lowercase().failover('')).default([]).optional(),
	features: Joi.array().items(Joi.string().trim().lowercase().failover('')).default([]).optional(),
	'uses-permission': Joi.array()
		.items(Joi.array().items(Joi.string().trim().required(), Joi.number().integer().positive().allow(null).default(null).optional()).default([]).optional())
		.default([])
		.optional(),
	'uses-permission-sdk-23': Joi.array()
		.items(Joi.array().items(Joi.string().trim().required(), Joi.number().integer().positive().allow(null).default(null).optional()).default([]).optional())
		.default([])
		.optional(),
	antiFeatures: Joi.array().items(Joi.string().trim()).default([]).optional(),
	size: Joi.number().integer().positive().required(),
	hash: Joi.string().trim().lowercase().required(),
	hashType: Joi.string().trim().lowercase().required(),
	sig: Joi.string().trim().lowercase().optional(),
	signer: Joi.string().trim().lowercase().optional(),
	obbMainFile: Joi.string().trim().optional(),
	obbMainFileSha256: Joi.string().trim().lowercase().optional(),
	obbPatchFile: Joi.string().trim().optional(),
	obbPatchFileSha256: Joi.string().trim().lowercase().optional(),
})).required());
