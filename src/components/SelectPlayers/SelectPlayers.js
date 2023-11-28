import "./SelectPlayers.css";
import PropTypes from 'prop-types';


function SelectPlayers({ setPlayers, setCurrentScreen, setPlayerCount }) {

    const handlePlayerCountChange = (count) => {
        setPlayerCount(count);
        setPlayers(new Array(count).fill(null).map((_, index) => ({
            id: index + 1,
            name: `Player ${index + 1}`,
        })));
        setCurrentScreen('playerSetup');
    };

    return (
        <div className="select-players-container">
            <div className="content">
                <h2>Select number of players:</h2>
                <div className="buttons">
                    {[1, 2, 3, 4].map((count) => (
                        <button key={count} onClick={() => handlePlayerCountChange(count)}>
                            {count} Player{count > 1 ? 's' : ''}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

SelectPlayers.propTypes = {
    setPlayers: PropTypes.func.isRequired,
    setCurrentScreen: PropTypes.func.isRequired,
    setPlayerCount: PropTypes.func.isRequired,
};

export default SelectPlayers;
