import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom'
// import { auth } from '../config/firebaseApp'
import { AuthContext } from '../Providers/Auth'

function PrivateRoute({component: RouteComponent, ...rest}) {

    const { currentUser } =  useContext(AuthContext)
    const userRoute = routeProps => !!currentUser ? <RouteComponent {...routeProps}/> : <Redirect to={'/generational-wealth-admin'}/>
    

    return (
        <Route {...rest} render={routeProps =>  userRoute(routeProps)}/>
    );
}

export default PrivateRoute; 