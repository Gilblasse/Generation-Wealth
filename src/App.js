import React from 'react';
import './App.css';
import SignUpForm from './components/SignUpForm';
import AdminLogin from './components/AdminLogin';
import { Switch, Route } from "react-router-dom";


function App() {
  return (
    <div className="App">

      <Switch>
        <Route exact path="/signup" component={SignUpForm}/>
        <Route exact path="/admin" component={AdminLogin}/>
        <Route exact path="/" component={SignUpForm}/>
      </Switch>
      
    </div>
  );
}

export default App;
