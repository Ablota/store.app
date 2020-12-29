export default {
	app: {
		name: 'Ablota Store',
	},
	pages: {
		home: {
			title: 'Home',
			newUpdated: 'New & Updated',
			addSource: 'Add a new source',
			noApps: 'Unfortunately we cannot show you any apps here. Either you have not yet added any sources or your sources do not contain any apps.',
		},
		categories: {
			title: 'Categories',
			official: {
				Connectivity: {
					title: 'Connectivity',
				},
				Development: {
					title: 'Development',
				},
				Games: {
					title: 'Games',
				},
				Graphics: {
					title: 'Graphics',
				},
				Internet: {
					title: 'Internet',
				},
				Money: {
					title: 'Money',
				},
				Multimedia: {
					title: 'Multimedia',
				},
				Navigation: {
					title: 'Navigation',
				},
				'Phone & SMS': {
					title: 'Phone & SMS',
				},
				Reading: {
					title: 'Reading',
				},
				'Science & Education': {
					title: 'Science & Education',
				},
				Security: {
					title: 'Security',
				},
				'Sports & Health': {
					title: 'Sports & Health',
				},
				System: {
					title: 'System',
				},
				Theming: {
					title: 'Theming',
				},
				Time: {
					title: 'Time',
				},
				Writing: {
					title: 'Writing',
				},
			},
		},
		sources: {
			title: 'Sources',
			add: {
				title: 'Add Source',
				description: 'By adding a new source you will be able to see and download new apps.',
				suggestions: {
					'f-droid': {
						title: 'F-Droid',
						description: 'Catalogue of FOSS (Free and Open Source Software) applications for the Android platform.',
					},
					izzyOnDroid: {
						title: 'IzzyOnDroid',
						description: 'Official binaries built by the original application developers, taken from their resp. repositories (mostly Github).',
					},
					bitwarden: {
						title: 'Bitwarden',
						description: 'Bitwarden, the open source password manager, makes it easy to generate and store unique passwords for any browser or device.',
					},
					newPipe: {
						title: 'NewPipe',
						description: 'A libre lightweight streaming frontend for Android.',
					},
				},
				errors: {
					validation: 'The ',
				},
			},
		},
		manager: {
			title: 'Manager',
			updateAvailable: 'Update Available',
			updateAll: 'Update All',
			noApps: 'No apps installed or compatible with @:app.name were found.',
			updateSystem: 'An update for @:app.name was found and must now be installed. Please continue and download the update as usual on the next page.',
			uninstall: {
				before: 'Do you really want to uninstall this app?',
				after: 'The app was successfully uninstalled.',
			},
			errors: {
				list: 'An error occurred while checking the installed apps.',
				uninstall: 'An error occurred while uninstalling the app.',
				launch: 'An error occurred while launching the app.',
			},
		},
		app: {
			details: 'Metadata about the package suggested by the source.',
			permissions: 'The app can use or request the following permissions.',
			features: 'The app can use the following hardware and software features.',
			hashes: 'The hashes are used to verify the app to detect malicious changes.',
			donate: 'Express your appreciation for the development and work related to this app by contributing a monthly or one-time donation.',
			install: {
				success: 'The app has been successfully installed and can now be used.',
				failure: 'The installation of the app has failed.',
			},
			reinstall: 'In order to install the suggested update the old version must first be uninstalled. This only happens if the update has not been published by the same developer. Please only do this if you trust the source.',
			launch: 'An error occurred while launching the app.',
			share: {
				title: '@:app.name: {app}',
				text: '{summary}\n\nGet the app "{app}" now with @:(app.name).',
			},
			crypto: {
				text: 'It is possible that no application has opened for the donation. If this is the case, you can copy the address here and make the donation with your crypto wallet.',
				clipboard: 'The address for donating was copied to the clipboard.',
			},
		},
		source: {
			footer: 'Updated {date}, Version {version}',
			address: 'Updates or changes to this source will be downloaded from this address.',
			mirrors: 'If the address is not reachable the mirrors are used to update the source.',
			fingerprint: 'The fingerprint is used to verify the source to detect malicious changes.',
			add: 'The selected source ({source}) does not yet exist on your device. Do you want to add this source now?',
			share: {
				title: '@:app.name: {source}',
				text: 'Add the source "{source}" to @:app.name and enjoy the new app. | Add the source "{source}" to @:app.name and enjoy {apps} new apps.',
			},
			remove: {
				before: 'Do you really want to remove this source?',
				after: 'The source was successfully removed.',
			},
		},
		category: {
			notFound: 'No apps with this name were found.',
		},
		about: {
			title: 'About',
			version: 'Version {version}',
			slogan: 'The universal, decentralized and open source app store.',
			description: [
				'Our goal is to provide developers and end customers with access to a fair and transparent App Store. In order to achieve this, our source code and business model is fully publicly available. We do not accept any compromises in terms of security and privacy while taking our role as responsible developers seriously.',
				'End customers benefit from more freedom in choosing and downloading apps, while contributing to better financial support for developers.',
				'Developers do not have to accept any restrictions on the distribution of their apps. Payments go directly through the developer and can therefore be better used for the maintenance and further development of the products.',
				'We believe in the success of ethically developed and distributed software and want to motivate others to do the same.',
			],
			trademark: 'Ablota Store is part of the Ablota&reg; product series. The brand Ablota&reg; is an international registered trademark of <a href="https://starapps-ltd.com" target="_system" class="link external">StarApps GmbH</a>.',
		},
		404: {
			title: '404 – Not Found',
			description: 'The page or app you were looking for could not be found.',
		},
	},
	actions: {
		sources: {
			load: {
				fingerprint: 'The fingerprint of the source ({source}) does not match anymore. You could be spoofed! The source is not displayed for the time being.',
				age: 'The source index has reached its self-defined maximum age. The source ({source}) must first be updated by the provider before it is displayed again.',
				validation: 'The source structure validation has failed. Therefore we may be missing important information. The source ({source}) is not displayed for the time being.',
				request: 'The request to download the source has failed. The source ({source}) is not displayed for the time being.',
				info: 'An error occurred while extracting the source index information. The source ({source}) is not displayed for the time being.',
			},
			add: {
				incorrect: 'The address provided either contains no source or the information contained is incorrect.',
				exists: 'This source has already been added.',
				fingerprint: 'The fingerprint of the source does not match. Please check the fingerprint again. Unless you find a mistake you could be spoofed.',
			},
		},
	},
	utils: {
		downloadPackage: {
			failure: 'The download of the package failed. Please make sure that your internet connection is stable.',
			verification: 'Verification of the downloaded package failed. It could be that someone is intercepting your connection.',
			directory: 'An error occurred while checking the download directory.',
		},
		share: {
			clipboard: 'The text for sharing was copied to the clipboard.',
			console: 'The text for sharing could not be copied to the clipboard. It was now printed in the console.',
		},
		suggestPackage: {
			deviceInfo: 'An error occurred while getting information about the device.',
			packageInfo: 'An error occurred while getting information about the package.',
		},
	},
	words: {
		more: 'More',
		url: 'URL',
		fingerprint: 'Fingerprint',
		optional: 'Optional',
		back: 'Back',
		address: 'Address',
		mirrors: 'Mirrors',
		sha256: 'SHA-256',
		sha512: 'SHA-512',
		ok: 'OK',
		cancel: 'Cancel',
		add: 'Add',
		remove: 'Remove',
		description: 'Description',
		version: 'Version',
		versions: 'Versions',
		screenshots: 'Screenshots',
		whatsNew: 'What\'s New',
		website: 'Website',
		email: 'Email',
		sourceCode: 'Source Code',
		issueTracker: 'Issue Tracker',
		license: 'License',
		translation: 'Translation',
		changelog: 'Changelog',
		or: 'or',
		of: 'of',
		bitcoin: 'Bitcoin',
		litecoin: 'Litecoin',
		liberapay: 'Liberapay',
		flattr: 'Flattr',
		openCollective: 'Open Collective',
		donate: 'Donate',
		antiFeatures: 'Anti Features',
		links: 'Links',
		explore: 'Explore',
		close: 'Close',
		suggestion: 'Suggestion',
		suggestions: 'Suggestions',
		undo: 'Undo',
		search: 'Search',
		socialMedia: 'Social Media',
		mastodon: 'Mastodon',
		twitter: 'Twitter',
		reddit: 'Reddit',
		installed: 'Installed',
		differences: 'Differences',
		install: 'Install',
		uninstall: 'Uninstall',
		launch: 'Launch',
		video: 'Video',
		verifying: 'Verifying',
		download: 'Download',
		downloading: 'Downloading',
		installing: 'Installing',
		items: 'Items',
		update: 'Update',
		step: 'Step',
		done: 'Done',
		hashes: 'Hashes',
		details: 'Details',
		date: 'Date',
		minSdkVersion: 'Minimum SDK Version',
		targetSdkVersion: 'Target SDK Version',
		maxSdkVersion: 'Maximum SDK Version',
		abis: 'ABIs',
		size: 'Size',
		apk: 'APK',
		obbMain: 'OBB-Main',
		obbPatch: 'OBB-Patch',
		permissions: 'Permissions',
		features: 'Features',
		copy: 'Copy',
	},
	counts: {
		apps: '1 App | {count} Apps',
	},
	validations: {
		url: 'Please enter a valid URL.',
		text: 'Please enter a valid text.',
	},
	lists: {
		antiFeatures: {
			Ads: {
				title: 'Ads',
				description: 'This Anti-Feature is applied to an app that contains advertising.',
			},
			Tracking: {
				title: 'Tracking',
				description: 'This Anti-Feature is applied to apps that track you and/or report your activity to somewhere, either without your permission or by default (i.e. you’d have to actively seek out an option to disable it).',
			},
			NonFreeNet: {
				title: 'Non-Free Network Services',
				description: 'This Anti-Feature is applied to apps that promote or depend entirely on a Non-Free network service.',
			},
			NonFreeAdd: {
				title: 'Non-Free Addons',
				description: 'This Anti-Feature is applied to apps that, although Free Software themselves, promote other Non-Free applications or plugins.',
			},
			NonFreeDep: {
				title: 'Non-Free Dependencies',
				description: 'This Anti-Feature is applied to apps that require things that are not Free Software in order to run.',
			},
			UpstreamNonFree: {
				title: 'Upstream Non-Free',
				description: 'This Anti-Feature is applied to apps where the upstream source code includes proprietary software by default in their own releases.',
			},
			NonFreeAssets: {
				title: 'Non-Free Assets',
				description: 'This Anti-Feature is applied to apps that contain and make use of Non-Free assets. The most common case is apps using artwork - images, sounds, music, etc. - under a non-commercial license.',
			},
			KnownVuln: {
				title: 'Known Vulnerability',
				description: 'This Anti-Feature is applied to apps with a known security vulnerability.',
			},
			DisabledAlgorithm: {
				title: 'Disabled Algorithm',
				description: 'This Anti-Feature is applied to apps that were signed using a signature algorithm that is considered outdated or unsafe.',
			},
			NoSourceSince: {
				title: 'No Source Since',
				description: 'The upstream source for this app is no longer available. Either the app went proprietary, the source repository was dropped, or it has moved to a location currently not known to us. This means there will not be further updates unless the source reappears.',
			},
			ApplicationDebuggable: {
				title: 'Application Debuggable',
				description: 'This Anti-Feature is applied to apps that are debuggable.',
			},
		},
	},
	popups: {
		downloadApp: {
			title: 'Download @:app.name',
			steps: {
				download: {
					description: 'Download @:app.name directly from our official source. Use only this website or the app itself to download @:(app.name).',
				},
				unknownSources: {
					title: 'Unknown Sources',
					description: 'Your device may warn you about downloading apps from unknown sources. This is not a specific warning for our app, but applies to all apps downloaded from the Internet. It is important that you only download apps from trusted manufacturers. Please enable your browser for the installation.',
				},
				openInstall: {
					title: 'Open File & Install App',
					description: 'Once the download is complete, open the file and confirm the installation of the app.',
				},
				done: {
					description: '@:app.name is ready! You can now launch @:app.name and start downloading apps.',
				},
			},
		},
	},
};
