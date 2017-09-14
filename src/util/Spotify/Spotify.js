const clientID = '627216329abc4fa89e00bf36b262c17e';
var accessToken;
const redirectURI = 'http://localhost:3000/';

const Spotify = {
	getAccessToken() {
		if (accessToken) {
			return accessToken;
		}
		const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
		const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
		// console.log(accessTokenMatch, expiresInMatch);
		if (accessTokenMatch && expiresInMatch) {
			accessToken = accessTokenMatch[1];
			const expiresIn = Number(expiresInMatch[1]);
			window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
			window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
			return accessToken;
		} else {
			const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-private&playlist-modify-public&user-read-private&redirect_uri=${redirectURI}`;
			window.location = accessUrl;
		}
	},
	//Trial version
	// getAccessToken() {
	// 	console.log(accessToken);
	// 	if (window.location.hash.indexOf('#access_token') > -1) {
	// 		console.log('I have a token.  Let me save it.');
	// 		let atResults = window.location.hash.match(/access_token=([^&]*)/);
	// 		console.log(atResults);
	// 		accessToken = atResults[1];
	// 		console.log(accessToken);
	// 		// let eiResults = window.location.hash.search(/expires_in=([^/]*)/);
	// 		// //query string to object with keys and values, query-strings npm
	// 		// //issue at the end of the line
	// 		// let expiresIn = eiResults[1];
	// 		// console.log(expiresIn);
	// 		window.setTimeout(() => (accessToken = ''), 3600);
	// 		window.history.pushState('Access Token', null, '/');
	// 		// window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
	// 		// return window.location;
	// 		console.log('I have my accessToken');
	// 		return accessToken;
	// 		// }
	// 		// if (accessToken) {
	// 		// 	console.log('I have my accessToken');
	// 		// 	return accessToken;
	// 	} else {
	// 		window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=token`;
	// 		if (window.location.hash.indexOf('#access_token') > -1) {
	// 		}
	// 	}
	// },

	search(term, accessToken) {
		// console.log(accessToken);
		return (
			fetch(`https://api.spotify.com/v1/search?type=track,artist,album&q=${term}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			})
				.then(response => {
					let body = response.json();
					return body;
				})
				//used postman chrome extention used to determine location of track information
				.then(data => {
					// console.log(data);
					let tracks = data.tracks;
					return tracks.items.map(track => ({
						id: track.id,
						name: track.name,
						artist: track.artists[0].name,
						album: track.album.name,
						uri: track.uri
					}));
				})
		);
	},

	savePlaylist(name, trackUris) {
		if (!name || !trackUris.length) {
			return;
		}
		const accessToken = Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${accessToken}` };
		let userId;
		return fetch('https://api.spotify.com/v1/me', { headers: headers })
			.then(response => response.json())
			.then(jsonResponse => {
				userId = jsonResponse.id;
				return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
						Accept: `application/json`,
						'Content-Type': `application/json`
					},
					method: 'POST',
					body: JSON.stringify({ name: name })
				})
					.then(response => response.json())
					.then(jsonResponse => {
						const playlistId = jsonResponse.id;
						// console.log('playlistId', playlistId);
						const accessToken = Spotify.getAccessToken();
						// console.log(accessToken);
						// console.log('trackUris', trackUris);
						return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
							headers: {
								Authorization: `Bearer ${accessToken}`,
								Accept: `application/json`,
								'Content-Type': `application/json`
							},
							method: 'POST',
							body: JSON.stringify({ uris: trackUris })
						});
					});
			});
	}
	//Trial version
	// savePlaylist(playlistName, trackUris) {
	// 	if (!playlistName || !trackUris.length) {
	// 		return;
	// 	} else {
	// 		let userToken = Spotify.getAccessToken();
	// 		console.log(userToken);
	// 		let userID;
	// 		fetch(`https://api.spotify.com/v1/me`, {
	// 			headers: {
	// 				Authorization: `Bearer ${userToken}`
	// 			}
	// 		})
	// 			.then(response => {
	// 				let body = response.json();
	// 				return body;
	// 			})
	// 			.then(data => {
	// 				console.log(data);
	// 				let userID = data.id;
	// 				return userID;
	// 			})
	// 			.then(
	// 				fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
	// 					headers: {
	// 						Authorization: `Bearer ${userToken}`
	// 					},
	// 					method: 'POST',
	// 					body: JSON.stringify({ name: playlistName })
	// 				})
	// 					.then(response => {
	// 						let body = response.json();
	// 						return body;
	// 					})
	// 					.then(data => {
	// 						const playlistId = data.id;
	// 						fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistId}/tracks`, {
	// 							headers: {
	// 								Authorization: `Bearer ${userToken}`
	// 							},
	// 							method: 'POST',
	// 							body: JSON.stringify({ uris: trackUris })
	// 						});
	// 					})
	// 			);
	// 	}
	// }
};

export default Spotify;
