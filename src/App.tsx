import React from 'react';
import './App.scss';
import CreateMeeting from './components/CreateMeeting/CreateMeeting';
import JoinMeeting from './components/JoinMeeting/JoinMeeting';

function App() {
  return (
    <div className="tring-meeting-lobby">
      <CreateMeeting/>
      <JoinMeeting />
    </div>
  );
}

export default App;
