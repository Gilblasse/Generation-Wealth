import React from "react";
import "./App.css";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import { Switch, Route, Redirect } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import AdminPage from "./containers/AdminPage";
import { AuthProvider } from "./Providers/Auth";
import RevealMemberInfo from "./components/RevealMemeberInfo/RevealMemberInfo";


function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Switch>

          <Route exact path="/signup" component={SignUpForm} />

          <Route exact path="/gw-admin" component={AdminLogin} />

          <PrivateRoute exact path="/generational-wealth-admin" component={AdminPage}/>
          
          <Route exact path="/thank-you" render={(props) => <RevealMemberInfo {...props} />} />
          
          <Route exact path="/">
            <Redirect to='/signup'/>  
          </Route>

        </Switch>
      </AuthProvider>
    </div>
  );
}

export default App;
