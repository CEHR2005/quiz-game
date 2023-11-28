import React, { useState } from 'react';
import SelectPlayers from './components/SelectPlayers/SelectPlayers';
import SelectSubject from './components/SelectSubject/SelectSubject';
import Quiz from './components/Quiz/Quiz';
import GameEnd from './components/GameEnd/GameEnd';
import PlayerSetup from "./components/PlayerSetup/PlayerSetup";

function App() {
  const [currentScreen, setCurrentScreen] = useState('selectPlayers');
  const [playerCount, setPlayerCount] = useState(0);
  const [players, setPlayers] = useState([]);
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([]);
  const [scores, setScores] = useState({});
  const [playerAnswers, setPlayerAnswers] = useState({});

  let screen;

  switch (currentScreen) {
    case 'selectPlayers':
      screen = <SelectPlayers setPlayers={setPlayers} setCurrentScreen={setCurrentScreen} setPlayerCount={setPlayerCount}/>;
      break;
    case 'selectSubject':
      screen = <SelectSubject setSubject={setSubject} setCurrentScreen={setCurrentScreen} />;
      break;
    case 'quiz':
      screen = <Quiz
          players={players}
          subject={subject}
          setCurrentScreen={setCurrentScreen}
          setScores={setScores}
          scores={scores}
          questions={questions}
          setQuestions={setQuestions}
          setPlayerAnswers={setPlayerAnswers}
      />
      break;
    case 'gameEnd':
      screen = <GameEnd players={players} scores={scores} questions={questions} playerAnswers={playerAnswers}/>
      break;
    case 'playerSetup':
      screen = <PlayerSetup playerCount={playerCount} setPlayers={setPlayers} setCurrentScreen={setCurrentScreen} />;
      break;
    default:
      screen = <div>Unknown screen</div>;
  }

  return (
      <div className="App">
        {screen}
      </div>
  );
}

export default App;
