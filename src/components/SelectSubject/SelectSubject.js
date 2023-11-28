// Пример логики для выбора темы викторины
import React, { useState } from 'react';
import "./SelectSubject.css";
import PropTypes from 'prop-types';

function SelectSubject({ setSubject, setCurrentScreen }) {
    const subjects = ['HTML', 'CSS', 'JavaScript'];
    const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

    const handleStartQuiz = () => {
        setSubject(selectedSubject);
        setCurrentScreen('quiz');
    };

    const handleBack = () => {
        setCurrentScreen('playerSetup');
    };

    const handleSubjectSelect = (subject) => {
        setSelectedSubject(subject);
    };

    return (
        <div className="select-subject-container">
            <div className="content">
                <h2>Select a quiz topic:</h2>
                <div className="buttons">
                    {subjects.map((subject) => (
                        <button
                            key={subject}
                            onClick={() => handleSubjectSelect(subject)}
                            className={`subject-button ${selectedSubject === subject ? 'active' : ''}`}
                        >
                            {subject}
                        </button>
                    ))}
                </div>
                <div className="navigation-buttons">
                    <button onClick={handleBack} className="back-button">Back</button>
                    <button onClick={handleStartQuiz} className="next-button">Start quiz</button>
                </div>
            </div>
        </div>
    );
}


SelectSubject.propTypes = {
    setSubject: PropTypes.func.isRequired,
    setCurrentScreen: PropTypes.func.isRequired,
};

export default SelectSubject;
