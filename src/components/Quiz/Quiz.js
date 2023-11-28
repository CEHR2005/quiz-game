import React, { useState, useEffect } from 'react';
import questionsData from '../../data/questions.json';
import "./Quiz.css";
import PropTypes from 'prop-types';

function Quiz({ players, subject, setCurrentScreen, setScores, scores, questions, setQuestions, setPlayerAnswers }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [answersSelectedByPlayers, setAnswersSelectedByPlayers] = useState({});
    const [timeLeft, setTimeLeft] = useState(30);
    const [isNextButtonEnabled, setIsNextButtonEnabled] = useState(false);
    const [isAnswerButtonEnabled, setIsAnswerButtonEnabled] = useState(true);

    useEffect(() => {
        if (timeLeft <= 0) {
            const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;


            if (nextPlayerIndex === 0 || currentPlayerIndex === players.length - 1) {
                setIsNextButtonEnabled(true);
                setIsAnswerButtonEnabled(false);
            }

            if (currentPlayerIndex !== players.length - 1) {
                setIsNextButtonEnabled(false);
                setCurrentPlayerIndex(nextPlayerIndex);
                setTimeLeft(30);
            }
        } else {
            const timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

            return () => clearTimeout(timerId);
        }
    }, [timeLeft, currentPlayerIndex, players.length, setIsNextButtonEnabled, setAnswersSelectedByPlayers]);

    useEffect(() => {
        const subjectQuestions = questionsData.find(q => q.category === subject)?.questions;
        if (subjectQuestions) {
            const randomQuestions = subjectQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
            setQuestions(randomQuestions);
        } else {
            console.error('No questions found for this topic:', subject);
        }
    }, [subject]);

    const handleNextQuestion = () => {
        const nextQuestionIndex = currentQuestionIndex + 1;
        if (nextQuestionIndex < questions.length) {
            setCurrentQuestionIndex(nextQuestionIndex);
            setCurrentPlayerIndex(0);
            setAnswersSelectedByPlayers({});
            setIsAnswerButtonEnabled(true);
            setIsNextButtonEnabled(false);
        } else {
            setCurrentScreen('gameEnd');
        }
    };

    const handleAnswerSelect = (answer) => {
        const player = players[currentPlayerIndex];
        const question = questions[currentQuestionIndex];

        setPlayerAnswers(prevAnswers => {
            const newAnswers = { ...prevAnswers };
            const questionKey = `question-${currentQuestionIndex}`;
            if (!newAnswers[questionKey]) {
                newAnswers[questionKey] = {};
            }
            if (!newAnswers[questionKey][answer]) {
                newAnswers[questionKey][answer] = [player.name];
            } else {
                newAnswers[questionKey][answer].push(player.name);
            }
            return newAnswers;
        });

        setAnswersSelectedByPlayers(prevSelected => {
            const newSelected = { ...prevSelected };
            const playerColor = player.color;

            if (!newSelected[answer]) {
                newSelected[answer] = [playerColor];
            } else if (!newSelected[answer].includes(playerColor)) {
                newSelected[answer].push(playerColor);
            }

            return newSelected;
        });

        setTimeLeft(30);

        if (answer === question.correct) {
            setScores({ ...scores, [player.name]: (scores[player.name] || 0) + 10 });
        }

        const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;

        if (nextPlayerIndex === 0 || currentPlayerIndex === players.length - 1) {
            setIsNextButtonEnabled(true);
        } else {
            setCurrentPlayerIndex(nextPlayerIndex);
        }

    };

    if (!questions.length || currentQuestionIndex >= questions.length) {
        return <div>Loading...</div>;
    }

    const { question, answers } = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <div className="player-corners">
                {players.map((player, index) => (
                    <div
                        key={player.id}
                        className={`corner ${index === 0 ? "top-left" : ""} ${index === 1 ? "top-right" : ""} ${index === 2 ? "bottom-left" : ""} ${index === 3 ? "bottom-right" : ""}`}
                    >
                        <p style={{
                            color: player.color,
                            textShadow: currentPlayerIndex === index ? `0 0 20px ${player.color}, 0 0 40px ${player.color}, 0 0 60px ${player.color}` : 'none', // Усиленное свечение для активного игрока
                        }}>
                            {player.name}
                        </p>
                    </div>
                ))}
            </div>

            <div className="header" style={{ color: players[currentPlayerIndex].color }}>
                <h2 style={{ color: players[currentPlayerIndex].color }}>
                    {players[currentPlayerIndex].name}'s turn
                </h2>
                <p>Time left: {timeLeft} seconds</p>
            </div>

            <div className="question-info">
                <h2>Question {currentQuestionIndex + 1} из {questions.length}</h2>
                <p>{question}</p>
            </div>

            <div className="buttons-container">
                {answers.map((answer, index) => {
                    const selectedColors = answersSelectedByPlayers[answer] || [];
                    let buttonStyle = {};
                    switch (selectedColors.length) {
                        case 1:
                            buttonStyle.backgroundColor = selectedColors[0];
                            break;
                        case 2:
                            buttonStyle.background = `linear-gradient(to right, 
                            ${selectedColors[0]} 50%, 
                            ${selectedColors[1]} 50%)`;
                            break;
                        case 3:
                            buttonStyle.background = `linear-gradient(to right, 
                            ${selectedColors[0]} 0%, ${selectedColors[0]} 33.33%, 
                            ${selectedColors[1]} 33.33%, ${selectedColors[1]} 66.66%, 
                            ${selectedColors[2]} 66.66%, ${selectedColors[2]} 100%
                          )`;
                            break;
                    }

                    return (
                        <button key={index} className="button" style={buttonStyle} disabled={!isAnswerButtonEnabled} onClick={() => handleAnswerSelect(answer)}>
                            {answer}
                        </button>
                    );
                })}
            </div>

            {currentPlayerIndex === players.length - 1 && (
                <button onClick={handleNextQuestion} disabled={!isNextButtonEnabled}>Next</button>
            )}
        </div>
    );
}

Quiz.propTypes = {
    players: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string
    })).isRequired,
    subject: PropTypes.string.isRequired,
    setCurrentScreen: PropTypes.func.isRequired,
    setScores: PropTypes.func.isRequired,
    scores: PropTypes.object.isRequired,
    questions: PropTypes.arrayOf(PropTypes.shape({
        question: PropTypes.string.isRequired,
        answers: PropTypes.arrayOf(PropTypes.string).isRequired,
        correct: PropTypes.string.isRequired,
    })).isRequired,
    setQuestions: PropTypes.func.isRequired,
    setPlayerAnswers: PropTypes.func.isRequired,
};

export default Quiz;
