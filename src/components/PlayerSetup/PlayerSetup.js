import React, { useState } from 'react';
import "./PlayerSetup.css";
import PropTypes from 'prop-types';


function PlayerSetup({ playerCount, setPlayers, setCurrentScreen }) {

    const defaultPlayerDetails = [
        { id: 1, name: 'Player 1', color: '#FF0000' },
        { id: 2, name: 'Player 2', color: '#0000FF' },
        { id: 3, name: 'Player 3', color: '#008000' },
        { id: 4, name: 'Player 4', color: '#FFA500' },
    ];


    const [playerDetails, setPlayerDetails] = useState(
        defaultPlayerDetails.slice(0, playerCount)
    );


    const handleNameChange = (index, name) => {
        const newDetails = [...playerDetails];
        newDetails[index].name = name;
        setPlayerDetails(newDetails);
    };

    const handleColorChange = (index, color) => {
        const newDetails = [...playerDetails];
        newDetails[index].color = color;
        setPlayerDetails(newDetails);
    };

    const handleSubmit = () => {
        setPlayers(playerDetails);
        setCurrentScreen('selectSubject');
    };

    function handleBack() {
        setCurrentScreen('selectPlayers');
    }

    return (
        <div className="player-setup-container">
            <div className="form-container">
                <h2>Player settings</h2>
                {playerDetails.map((player, index) => (
                    <div key={index} className="player-input-group">
                        <input
                            type="text"
                            placeholder={`Player ${index + 1}`}
                            value={player.name}
                            onChange={(e) => handleNameChange(index, e.target.value)}
                            className="name-input"
                        />
                        <input
                            type="color"
                            value={player.color}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="color-input"
                        />
                    </div>
                ))}
                <div className="navigation-buttons">
                    <button onClick={handleBack} className="back-button">Back</button>
                    <button onClick={handleSubmit} className="submit-button">Next</button>
                </div>

            </div>
        </div>
    );
}

PlayerSetup.propTypes = {
    playerCount: PropTypes.number.isRequired,
    setPlayers: PropTypes.func.isRequired,
    setCurrentScreen: PropTypes.func.isRequired,
};
export default PlayerSetup;
