import React, { useState } from 'react';
import "./GameEnd.css";
import PropTypes from 'prop-types';


function GameEnd({ players, scores, questions, playerAnswers }) {
    const [reviewVisible, setReviewVisible] = useState(false);

    const winners = Object.entries(scores).reduce((acc, [name, score]) => {
        if (!acc.score || score > acc.score) {
            return { score, winners: [name] };
        }
        if (score === acc.score) {
            acc.winners.push(name);
        }
        return acc;
    }, { score: null, winners: [] });

    const toggleReview = () => setReviewVisible(!reviewVisible);

    function startNewGame() {
        window.location.reload();
    }
    const renderAnswers = (question, questionIndex, playerAnswers) => {
        const answersForQuestion = playerAnswers[`question-${questionIndex}`] || {};

        return (
            <ul style={{ listStyleType: 'none' }}>
                {question.answers.map((answer, index) => {
                    const playersWhoSelected = answersForQuestion[answer] || [];
                    let answerStyle = {};

                    const colors = playersWhoSelected.map(playerName => {
                        const player = players.find(p => p.name === playerName);
                        return player ? player.color : null;
                    }).filter(color => color);

                    if (playersWhoSelected.length > 0) {
                        const colorStops = playersWhoSelected.map((playerName, i, arr) => {
                            const player = players.find(p => p.name === playerName);
                            const color = player ? player.color : null;
                            const width = 100 / arr.length;
                            const start = width * i;
                            const end = start + width;
                            return `${color} ${start}%, ${color} ${end}%`;
                        });
                        answerStyle.background = `linear-gradient(to right, ${colorStops.join(', ')})`;
                    }
                    return (
                        <li key={index} style={{ margin: '5px 0', padding: '5px', borderRadius: '5px', ...answerStyle }}>
                            <span style={{ color: colors.length ? 'white' : 'initial' }}>{answer}</span>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className="game-end-container">
            <h2>Results</h2>
            <ul className="results-list">
                {players.map((player) => (
                    <li key={player.id} style={{ color: player.color }}>
                        {player.name}: {scores[player.name]} points
                    </li>
                ))}
            </ul>

            {winners.winners.length > 0 && (
                <div className="winner-announcement">
                    Winner{winners.winners.length > 1 ? 's' : ''}: {winners.winners.join(', ')}
                </div>
            )}

            <div className="buttons-container">
                <button className="new-game-button" onClick={startNewGame}>Start new game</button>
                <button className="review-button" onClick={toggleReview}>View answers</button>
            </div>

            {reviewVisible && (
                <div className="review-container">
                    {questions.map((question, index) => (
                        <div key={index} className="review-question">
                            <p>Question: {question.question}</p>
                            {renderAnswers(question, index, playerAnswers)}
                            <p className="review-answer">Correct answer: {question.correct}</p>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

GameEnd.propTypes = {
    playerAnswers: PropTypes.object.isRequired,
    players: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
    })).isRequired,
    questions: PropTypes.arrayOf(PropTypes.shape({
        question: PropTypes.string.isRequired,
        answers: PropTypes.arrayOf(PropTypes.string).isRequired,
        correct: PropTypes.string.isRequired,
    })).isRequired,
    scores: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default GameEnd;
