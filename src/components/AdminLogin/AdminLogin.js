import React, { useState, useCallback } from 'react';
import { FormGroup , FormControl, Typography, TextField, Button, Avatar } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { auth } from '../../config/firebaseApp'
import { withRouter } from 'react-router'
import FooterCaption from '../FooterCaption';




function AdminLogin({ history }) {

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')


    const handleInputChange = e =>{
        const inputValue = e.target.value
        e.target.name === 'email' ? setEmail(inputValue) : setPassword(inputValue)
    } 


    const handleLogin = useCallback(
        async e => {

            try {
                const user = await auth().signInWithEmailAndPassword(email, password)
                console.log('User: ', user)
                history.push('/generational-wealth-admin')

            } catch (error) {
                alert(error)
                setEmail('')
                setPassword('')
            }
        }
    )

    const handleEnterLogin = e => {
        if(e.key === "Enter"){
            handleLogin()
        } 
    }



    return (
        <div className='signUpForm'>


            <FormGroup onKeyPress={handleEnterLogin} style={{ width: 500, margin: '22vh auto 30px' }}>

                <div>
                    <Avatar color='secondary' style={{margin: '0 auto 30px'}}>
                        <LockIcon />
                    </Avatar>
                    
                    <Typography variant="h4" style={{textAlign: 'center'}} component="h4" color="textSecondary" gutterBottom > GW Admin Login</Typography>
                </div>

                
                <FormControl style={{marginBottom: 25}}>
                    <TextField name='email' value={email} onChange={handleInputChange} helperText="" id="outlined-basic" label="Email" variant="outlined" />
                </FormControl>

                <FormControl style={{marginBottom: 25}}>
                    <TextField type="password" name='password' onChange={handleInputChange} helperText="" id="outlined-basic" label="Password" variant="outlined" />
                </FormControl>

    
                <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
        
            </FormGroup>


            <FooterCaption/>

        </div>
    );
}

export default withRouter(AdminLogin);