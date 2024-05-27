// helloUsers.jsx
import React from 'react';
import username from '../login/HandleLogin'

const HelloUsers = ({ username }) => {
  return (
    <div>
      <h1>Bienvenidoss,<handleLogin username= {username}/>!</h1>
    </div>
  );
};

export default HelloUsers;
