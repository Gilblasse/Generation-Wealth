import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup , FormControl, Typography, TextField, Button, Avatar } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { withRouter } from "react-router";
import { db } from '../../config/firebaseApp'




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
    const [referralCode , SetReferralCode] = useState('')
    const [phoneNumber , setPhoneNumber] = useState('')
    
    
    const classes = useStyles();


    const handleChange = e =>{
        const inputValue = e.target.value 
        
        switch (e.target.name) {
           
            case 'name':
                setName(inputValue)
                break;

            case 'cashApp':
                setCashApp(inputValue)
                break;

            case 'phoneNumber':
                setPhoneNumber(inputValue)
                break;
        
            case 'referralCode':
                SetReferralCode(inputValue)
                break;

            default:
                break;
        }
    }


    const getlistNumber = async () => {
        const snapShot = await db().collection('members').get()

        const memberDocs = await snapShot.docs
        const memberListNumbers = memberDocs.map(doc => {
            if(!Number.isNaN(+doc.data().listNumber)){
                return +doc.data().listNumber
            }else{
                return 0
            }
        })
        console.log('Member NUmbers: ',memberListNumbers)
        const memberListNumber = Math.max(...memberListNumbers) + 1

        return memberListNumber
    }


    const getMemberLevel = async () => {
        const snapShot = await db().collection('members').doc(referralCode).get()
        const referredBy = snapShot.data()
        if(referredBy){
            const level = referredBy.level ? referredBy.level : 'Level 1'
            return level
            
        }else{
            alert('Please Check The Referral Code')
        }
        
    }


    const handleSubmit = async (e)=> {
        const memberLevel = await getMemberLevel()
        const listNumber = await getlistNumber()

        if (memberLevel){
            await db().collection('members').add({ name, phoneNumber, cashApp, referralCode, listNumber, memberLevel })
    
            const querySnapshot =  await db().collection('members').where('cashApp','==', cashApp).get()
            const member = querySnapshot.docs[0].data()
    
            props.history.push('/', { id: querySnapshot.docs[0].id, member} )
        }

    }


    



    const handleEnterSubmit = e => {
        if(e.key === "Enter"){
            handleSubmit()
        } 
    }





    return (
        <div className='signUpForm'>


            <FormGroup onKeyPress={handleEnterSubmit} style={{ width: 500, margin: '22vh auto 30px' }}>

                <div>
                    <Avatar color='secondary' style={{margin: '0 auto 30px'}}>
                        <LockIcon />
                    </Avatar>

                    <Typography style={{marginBottom: 25}} varient='h3' color="textSecondary"> MemberShip Sign Up </Typography>
                </div>
                
                <FormControl style={{marginBottom: 25}}>
                    <TextField name='name' onChange={handleChange} helperText="" id="outlined-basic" label="Name" variant="outlined" />
                </FormControl>

                <FormControl style={{marginBottom: 25}}>
                    <TextField name='cashApp' onChange={handleChange} helperText="" id="outlined-basic" label="Cash App" variant="outlined" />
                </FormControl>

                <FormControl style={{marginBottom: 25}}>
                    <TextField name="referralCode" onChange={handleChange} helperText="" id="outlined-basic" label="Referral Code" variant="outlined" />
                </FormControl>

                <FormControl style={{marginBottom: 25}}>
                    <TextField type="tel" name="phoneNumber" onChange={handleChange} helperText="" id="outlined-basic" label="Mobile Number" variant="outlined" />
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