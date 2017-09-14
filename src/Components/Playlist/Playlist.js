import React from 'react';
import './Playlist.css';
import TrackList from './../TrackList/TrackList';

class Playlist extends React.Component {
	constructor(props) {
		super(props);
		this.onNameChange = this.props.onNameChange.bind(this);
		this.handleNameChange = this.handleNameChange.bind(this);
	}

	handleNameChange(e) {
		this.onNameChange(e.target.value);
	}

	render() {
		return (
			<div className="Playlist">
				<input onChange={this.handleNameChange} defaultValue={'New Playlist'} />
				<TrackList onRemove={this.props.onRemove} tracks={this.props.playlistTracks} />
				{/* onRemove={this.props.onRemove} in Tracklist*/}
				<a onClick={this.props.onSave} className="Playlist-save">
					SAVE TO SPOTIFY
				</a>
			</div>
		);
	}
}

export default Playlist;
