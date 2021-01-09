import {Device, Request} from 'framework7';
import sanitizeHtml from 'sanitize-html';

import sourceValidator from '../validators/source';

export function fetchSource(url, server, age = 6) {
	return new Promise((resolve, reject) => {
		const validateSource = source => {
			sourceValidator.validateAsync(source, {
				abortEarly: false,
				allowUnknown: true,
				stripUnknown: true,
			}).then(validatedSource => {
				if(validatedSource.repo.maxage) {
					const maxDate = validatedSource.repo.timestamp;
					maxDate.setDate(maxDate.getDate() + validatedSource.repo.maxage);

					if(Date.now() > maxDate.getTime()) {
						reject('age');
						return;
					}
				}

				if(validatedSource.repo.icon) {
					validatedSource.repo.icon = `${url}icons/${validatedSource.repo.icon}`;
				}

				validatedSource.apps.forEach(app => {
					if(app.icon) {
						app.icon = `${url}icons-240/${app.icon}`;
					}

					if(app.localized) {
						Object.keys(app.localized).forEach(key => {
							['icon', 'featureGraphic', 'promoGraphic', 'tvBanner'].forEach(asset => {
								if(app.localized[key][asset]) {
									app.localized[key][asset] = `${url}${app.packageName}/${key}/${app.localized[key][asset]}`;
								}
							});

							[
								'phoneScreenshots',
								'sevenInchScreenshots',
								'tenInchScreenshots',
								'tvScreenshots',
								'wearScreenshots',
							].forEach(assets => app.localized[key][assets].forEach((asset, index) => {
								app.localized[key][assets][index] = `${url}${app.packageName}/${key}/${assets}/${asset}`;
							}));
						});
					}
				});

				Object.keys(validatedSource.packages).forEach(key => validatedSource.packages[key].forEach(appPackage => {
					appPackage.apkName = url + appPackage.apkName;
					if(appPackage.obbMainFile) appPackage.obbMainFile = url + appPackage.obbMainFile;
					if(appPackage.obbPatchFile) appPackage.obbPatchFile = url + appPackage.obbPatchFile;
				}));

				resolve({
					...validatedSource,
					url,
					fingerprint: source.fingerprint,
				});
			}).catch(() => reject('validation'));
		};

		if(Device.cordova) {
			window.resolveLocalFileSystemURL(cordova.file.dataDirectory, dataDirectory => {
				dataDirectory.getDirectory('sources', {create: true, exclusive: false}, dataSourcesDirectory => {
					ablota.store.file.hashName(url, data => {
						const fetchIndex = () => {
							ablota.store.file.download(`${url}index-v1.jar`, `${cordova.file.dataDirectory}sources/${data.hash}.jar`, {}, {}, data => {
								if(data.status === 'success') {
									ablota.store.file.jarInfo(data.localUri, data => {
										if(data.status === 'success') {
											validateSource(data);
										} else {
											reject('info');
										}
									}, () => reject('info'));
								} else if(data.status === 'failure') {
									reject('request');
								}
							}, () => reject('request'));
						};

						dataSourcesDirectory.getFile(`${data.hash}.jar`, {create: false}, sourceFile => {
							sourceFile.file(file => {
								if(file.lastModified < new Date().getTime() - age * 60 * 60 * 1000) {
									fetchIndex();
								} else {
									ablota.store.file.jarInfo(sourceFile.toURL(), data => {
										if(data.status === 'success') {
											validateSource(data);
										} else {
											reject('info');
										}
									}, () => reject('info'));
								}
							}, () => fetchIndex());
						}, () => fetchIndex());
					}, () => reject('info'));
				}, () => reject('info'));
			}, () => reject('info'));
		} else {
			Request.promise({
				url: `${server.url}v1/proxy/source?url=${url}index-v1.jar`,
				timeout: 180000,
				dataType: 'json',
			}).then(response => {
				validateSource(response.data);
			}).catch(() => reject('request'));
		}
	});
}

export function fetchAsset(url, server, age = 24) {
	return new Promise((resolve, reject) => {
		if(Device.cordova) {
			ablota.store.file.hashName(url, data => {
				if(data.status === 'success') {
					const downloadAsset = () => {
						ablota.store.file.download(url, `${cordova.file.cacheDirectory}assets/${data.hash}`, {}, {}, data => {
							if(data.status === 'success') {
								resolve({
									originalUrl: url,
									localUrl: data.localUri,
								});
							} else if(data.status === 'failure') {
								reject();
							}
						}, () => {
							reject();
						});
					};

					window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, cacheDirectory => {
						cacheDirectory.getDirectory('assets', {create: true, exclusive: false}, cacheAssetsDirectory => {
							cacheAssetsDirectory.getFile(data.hash, {create: false}, assetFile => {
								assetFile.file(file => {
									if(file.lastModified < new Date().getTime() - age * 60 * 60 * 1000) {
										downloadAsset();
									} else {
										resolve({
											originalUrl: url,
											localUrl: assetFile.toURL(),
										});
									}
								}, () => reject());
							}, () => {
								downloadAsset();
							});
						}, () => reject());
					}, () => reject());
				} else {
					reject();
				}
			}, () => reject());
		} else {
			resolve({
				originalUrl: url,
				localUrl: `${server.url}v1/proxy/asset?url=${url}`,
			});
		}
	});
}

export function fetchIcons(items, icons, server, age = 24) {
	return new Promise((resolve) => {
		const promises = items.filter(app => app.icon && !icons[app.icon]).map(app => fetchAsset(app.icon, server, age).then(asset => {
			return new Promise(resolve => {
				const img = new Image();

				img.src = asset.localUrl;
				img.onload = () => {
					resolve(asset);
				};
				img.onerror = () => {
					resolve();
				};
			});
		}));

		Promise.all(promises).then(assets => {
			const appIcons = {};

			assets.filter(asset => asset).forEach(asset => appIcons[asset.originalUrl] = asset.localUrl);

			resolve(appIcons);
		});
	});
}

export function localizeApp(app, language) {
	const attributes = {
		name: app.name,
		authorName: app.authorName,
		summary: app.summary,
		description: app.description,
		icon: app.icon,
		whatsNew: null,
		featureGraphic: null,
		promoGraphic: null,
		tvBanner: null,
		video: null,
		phoneScreenshots: [],
		sevenInchScreenshots: [],
		tenInchScreenshots: [],
		tvScreenshots: [],
		wearScreenshots: [],
	};

	if(app.localized && Object.keys(app.localized).length) {
		const languages = language.split('-');
		const locales = [language, `${languages[0]}-${languages[1]}`, languages[0]];

		Object.keys(attributes).forEach(attribute => {
			const localeMatch = locales.some(locale => {
				const appLocale = app.localized[locale];

				if(appLocale && appLocale[attribute] && appLocale[attribute].length) {
					attributes[attribute] = appLocale[attribute];

					return true;
				}
			});

			if(!localeMatch) {
				locales.concat(['en-US', 'en-GB', 'en']).some(locale => {
					return Object.entries(app.localized).some(([key, value]) => {
						if(key.startsWith(locale) && value[attribute] && value[attribute].length) {
							attributes[attribute] = value[attribute];

							return true;
						}
					});
				});

				if(!attributes[attribute] && Object.values(app.localized)[0][attribute]) {
					attributes[attribute] = Object.values(app.localized)[0][attribute];
				}
			}
		});
	}

	if(attributes.authorName) {
		attributes.authorName = sanitizeHtml(app.authorName, {
			allowedTags: [],
			allowedAttributes: {},
		});
	}

	if(!attributes.summary && attributes.description) {
		attributes.summary = sanitizeHtml(app.description, {
			allowedTags: [],
			allowedAttributes: {},
		}).substring(0, 80);
	}

	['description', 'whatsNew'].filter(attribute => attributes[attribute]).forEach(attribute => {
		attributes[attribute] = sanitizeHtml(attributes[attribute].replace(/(?:\r\n|\r|\n)/g, '<br>'), {
			allowedTags: ['p', 'a', 'br', 'b', 'del', 'i', 'pre', 'var', 'strong', 'em', 'mark', 'small', 'ins', 'sub', 'sup', 'ul', 'ol', 'li'],
			allowedAttributes: {
				a: ['href', 'class', 'target'],
			},
			allowedSchemes: ['http', 'https', 'mailto'],
			allowProtocolRelative: false,
			transformTags: {
				a: sanitizeHtml.simpleTransform('a', {
					class: 'link external',
					target: '_system',
				}),
			},
		});
	});

	return {
		...app,
		...attributes,
	};
}

export function downloadPackage(app, appPackage, updateCallback) {
	return new Promise((resolve, reject) => {
		const packageFilePath = `${cordova.file.cacheDirectory}packages/${appPackage.hash}`;
		const bytes = {
			current: {},
			total: {},
		};
		const finished = {
			package: false,
		};
		let updateCalled = false;
		const update = () => {
			const bytesCurrent = Object.values(bytes.current).reduce((a, b) => a + b, 0);
			const bytesTotal = Object.values(bytes.total).reduce((a, b) => a + b, 0);

			updateCalled = true;

			updateCallback({
				progress: Math.floor((bytesCurrent / bytesTotal) * 100),
				bytesCurrent,
				bytesTotal,
			});
		};

		const finish = item => {
			finished[item] = true;

			if(Object.values(finished).every(status => status)) {
				updateCallback({
					progress: 100,
				});

				resolve({
					packageFilePath,
				});
			} else if(!updateCalled) {
				const itemsCurrent = Object.values(finished).filter(status => status).length;
				const itemsTotal = Object.keys(finished).length;

				updateCallback({
					progress: Math.floor((itemsCurrent / itemsTotal) * 100),
					itemsCurrent,
					itemsTotal,
				});
			}
		};

		window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, cacheDirectory => {
			cacheDirectory.getDirectory('packages', {create: true, exclusive: false}, packagesDirectory => {
				ablota.store.file.download(appPackage.apkName, packageFilePath, {}, {}, data => {
					if(data.status === 'success') {
						ablota.store.file.hash(packageFilePath, data => {
							if(data.status === 'success') {
								if(data.hash.toLowerCase() === appPackage.hash) {
									finish('package');
								} else {
									packagesDirectory.getFile(packageFilePath, {create: false}, packageFileEntry => {
										packageFileEntry.remove();
									});

									reject('utils.downloadPackage.verification');
								}
							} else {
								reject('utils.downloadPackage.verification');
							}
						}, () => reject('utils.downloadPackage.verification'));
					} else if(data.status === 'update') {
						bytes.current.package = data.bytesCurrent;
						bytes.total.package = data.bytesTotal;

						update();
					} else {
						reject('utils.downloadPackage.failure');
					}
				}, () => {
					reject('utils.downloadPackage.failure');
				});
			}, () => reject('utils.downloadPackage.directory'));
		}, () => reject('utils.downloadPackage.directory'));

		['Main', 'Patch'].forEach(obbName => {
			const obbFile = `obb${obbName}File`;

			if(appPackage[obbFile] && appPackage[`${obbFile}Sha256`]) {
				window.resolveLocalFileSystemURL(cordova.file.externalRootDirectory, externalRootDirectory => {
					externalRootDirectory.getDirectory('Android', {create: true, exclusive: false}, androidDirectory => {
						androidDirectory.getDirectory('obb', {create: true, exclusive: false}, obbDirectory => {
							obbDirectory.getDirectory(appPackage.packageName, {create: true, exclusive: false}, appPackageDirectory => {
								const obbFilename = appPackage[obbFile].substring(appPackage[obbFile].lastIndexOf('/') + 1);
								const obbFilePath = `${cordova.file.externalCacheDirectory}/${obbFilename}`;
								const downloadObbFile = () => {
									ablota.store.file.download(appPackage[obbFile], obbFilePath, {}, {
										title: `${app.name} (${obbName})`,
									}, data => {
										if(data.status === 'success') {
											ablota.store.file.hash(obbFilePath, data => {
												if(data.status === 'success') {
													if(data.hash.toLowerCase() === appPackage[`${obbFile}Sha256`]) {
														window.resolveLocalFileSystemURL(cordova.file.externalCacheDirectory, externalCacheDirectory => {
															externalCacheDirectory.getFile(obbFilename, {create: false}, obbFileEntry => {
																obbFileEntry.moveTo(appPackageDirectory, obbFilename, () => {
																	finish(obbName);
																}, () => reject('utils.downloadPackage.directory'));
															}, () => reject('utils.downloadPackage.directory'));
														}, () => reject('utils.downloadPackage.directory'));
													} else {
														appPackageDirectory.getFile(obbFilename, {create: false}, obbFileEntry => {
															obbFileEntry.remove();
														});

														reject('utils.downloadPackage.verification');
													}
												} else {
													reject('utils.downloadPackage.verification');
												}
											}, () => reject('utils.downloadPackage.verification'));
										} else if(data.status === 'update' && !data.code) {
											bytes.current[obbName] = data.bytesCurrent;
											bytes.total[obbName] = data.bytesTotal;

											update();
										} else {
											reject('utils.downloadPackage.failure');
										}
									}, () => reject('utils.downloadPackage.failure'));
								};

								finished[obbName] = false;
								appPackageDirectory.getFile(obbFilename, {create: false}, () => {
									ablota.store.file.hash(`${cordova.file.externalRootDirectory}Android/obb/${appPackage.packageName}/${obbFilename}`, data => {
										if(data.status === 'success') {
											if(data.hash.toLowerCase() === appPackage[`${obbFile}Sha256`]) {
												finish(obbName);
											} else {
												downloadObbFile();
											}
										} else {
											downloadObbFile();
										}
									}, () => downloadObbFile());
								}, () => {
									downloadObbFile();
								});
							}, () => reject('utils.downloadPackage.directory'));
						}, () => reject('utils.downloadPackage.directory'));
					}, () => reject('utils.downloadPackage.directory'));
				}, () => reject('utils.downloadPackage.directory'));
			}
		});
	});
}

export function share({title, text, url}) {
	return new Promise((resolve, reject) => {
		if(Device.cordova) {
			window.plugins.socialsharing.shareWithOptions({
				subject: title,
				message: text,
				url,
			}, () => resolve(), () => reject());
		} else if(navigator.share) {
			navigator.share({
				title,
				text,
				url,
			}).then(() => resolve()).catch(() => reject());
		} else {
			const data = `${title}\n${text}\n${url}`;

			navigator.clipboard.writeText(data).then(() => {
				resolve('utils.share.clipboard');
			}, () => {
				console.log(data);

				resolve('utils.share.console');
			});
		}
	});
}

export function suggestPackage(app, packages, deviceInfo) {
	return new Promise((resolve, reject) => {
		if(deviceInfo && deviceInfo.status === 'success') {
			ablota.store.package.info(app.packageName, packageInfo => {
				const allPackages = packages.filter(appPackage => {
					if(appPackage.minSdkVersion && deviceInfo.sdk < appPackage.minSdkVersion) {
						return false;
					} else if(appPackage.maxSdkVersion && deviceInfo.sdk > appPackage.maxSdkVersion) {
						return false;
					} else if(appPackage.nativecode.length && !deviceInfo.abis.some(abi => appPackage.nativecode.includes(abi))) {
						return false;
					}

					return true;
				}).sort((a, b) => a.versionCode < b.versionCode);
				const compatiblePackages = allPackages.filter(appPackage => {
					if(packageInfo.status === 'success') {
						if(appPackage.signer && !packageInfo.package.signatures.includes(appPackage.signer)) {
							return false;
						} else if(packageInfo.package.versionCode > appPackage.versionCode) {
							return false;
						}
					}

					return true;
				});

				if(allPackages.length) {
					let suggestion = compatiblePackages.find(appPackage => appPackage.versionCode === app.suggestedVersionCode);
					if(!suggestion) {
						suggestion = compatiblePackages.find(appPackage => appPackage.versionName === app.suggestedVersionName);
					}
					if(!suggestion && allPackages.length > compatiblePackages.length) {
						suggestion = allPackages.find(appPackage => appPackage.versionCode === app.suggestedVersionCode);
						if(!suggestion) {
							suggestion = allPackages.find(appPackage => appPackage.versionName === app.suggestedVersionName);
						}
					}
					if(!suggestion) {
						if(compatiblePackages.length && allPackages[0].versionName === compatiblePackages[0].versionName) {
							suggestion = compatiblePackages[0];
						} else {
							suggestion = allPackages[0];
						}
					}

					resolve({
						package: suggestion,
						packages: compatiblePackages,
						installed: packageInfo.status === 'success',
						outdated: packageInfo.status === 'success' && suggestion.versionCode > packageInfo.package.versionCode,
						reinstall: packageInfo.status === 'success' && suggestion.signer && !packageInfo.package.signatures.includes(suggestion.signer),
					});
				} else {
					resolve({
						package: null,
						packages: [],
						installed: packageInfo.status === 'success',
						outdated: false,
						reinstall: false,
					});
				}
			}, () => reject('utils.suggestPackage.packageInfo'));
		} else {
			reject('utils.suggestPackage.deviceInfo');
		}
	});
}

export function splitArray(array, size) {
	return Array.from({length: Math.ceil(array.length / size)}, (v, i) => array.slice(i * size, i * size + size));
}
