import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { FormGroup , FormControl, Typography } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import LockIcon from '@material-ui/icons/Lock';
import { withRouter } from "react-router";

// import FolderIcon from '@material-ui/icons/Folder';


const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },

}));




function SignUpForm (props) {
    const [name , setName] = useState('')
    const [cashApp , setCashApp] = useState('')
    const [referalID , setReferalID] = useState('')
    const [password , setPassword] = useState('')
    
    
    const classes = useStyles();

    const handleSubmit = (e)=> {
        e.preventDefault()

        props.history.push('/', 1)
    }




    return (
        <div className='signUpForm'>


            <FormGroup style={{ width: 500, margin: '22vh auto 30px' }}>

                <div>
                    <Avatar color='secondary' style={{margin: '0 auto 30px'}}>
                        <LockIcon />
                    </Avatar>

                    <Typography style={{marginBottom: 25}} varient='h3' color="textSecondary"> MemberShip Sign Up </Typography>
                </div>
                
                <FormControl style={{marginBottom: 25}}>
                    <TextField  helperText="" id="outlined-basic" label="Name" variant="outlined" />
                </FormControl>

                <FormControl style={{marginBottom: 25}}>
                    <TextField  helperText="" id="outlined-basic" label="Cash App" variant="outlined" />
                </FormControl>

                <FormControl style={{marginBottom: 25}}>
                    <TextField  helperText="" id="outlined-basic" label="Referral Code" variant="outlined" />
                </FormControl>

                <FormControl style={{marginBottom: 25}}>
                    <TextField  helperText="" id="outlined-basic" label="Phone" variant="outlined" />
                </FormControl>
                
                <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
        
            </FormGroup>


            <div>
                <Typography varient='body2' color="textSecondary"> Copyright © Generational Wealth 2020. </Typography>
            </div>

        </div>
    );
}

export default withRouter(SignUpForm)