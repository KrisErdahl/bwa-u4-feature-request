import React from 'react';
// import ReactDOM from 'react-dom';
import './App.css';
import SearchBar from './../SearchBar/SearchBar';
import SearchResults from './../SearchResults/SearchResults';
import Playlist from './../Playlist/Playlist';
import Spotify from './../../util/Spotify/Spotify';

class App extends React.Component {
	constructor(props) {
		super(props);
		let accessToken = Spotify.getAccessToken();
		this.state = {
			searchResults: [],
			playlistName: 'New Playlist',
			playlistTracks: [],
			accessToken: accessToken,
			expiresIn: 0
		};

		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
	}

	// componentWillMount() {
	// 	let accessToken = Spotify.getAccessToken();
	// 	this.setState({ accessToken });
	// }

	addTrack(track) {
		let tracks = this.state.playlistTracks;
		if (!tracks.includes(track)) {
			tracks.push(track);
			this.setState({ playlistTracks: tracks });
		}
	}

	removeTrack(track) {
		let tracks = this.state.playlistTracks;
		tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
		this.setState({ playlistTracks: tracks });
	}

	updatePlaylistName(name) {
		this.setState({ playlistName: name });
	}

	savePlaylist() {
		// console.log('playlistTracks', this.state.playlistTracks);
		let trackUris = this.state.playlistTracks.map(function(track) {
			return track.uri;
		});
		// console.log('app trackUris', trackUris);
		Spotify.savePlaylist(this.state.playlistName, trackUris);
		this.setState({ playlistTracks: [], searchResults: [] });
	}

	search(term) {
		// console.log(term);
		Spotify.search(term, this.state.accessToken).then(searchResults => {
			this.setState({ searchResults: searchResults });
		});
	}
	//React Router
	render() {
		return (
			<div>
				<h1>
					Ja<span className="highlight">mmm</span>ing
				</h1>
				<div className="App">
					<SearchBar onSearch={this.search} />
					<div className="App-playlist">
						<SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults} />
						<Playlist
							onRemove={this.removeTrack}
							onNameChange={this.updatePlaylistName}
							onSave={this.savePlaylist}
							playlistName={this.state.playlistName}
							playlistTracks={this.state.playlistTracks}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
