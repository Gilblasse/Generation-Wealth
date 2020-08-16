import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup , FormControl, Typography, TextField, Button, Avatar } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { withRouter } from "react-router";
import { db } from '../../config/firebaseApp'
import FooterCaption from '../FooterCaption'
import {welcomeMessage, welcomeDetails} from '../../config/SMS/smsMessages'



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

    const [adminFee , setAdminFee] = useState(false)
    const [cashOut , setCashOut] = useState(false)
    const [investment , setInvestment] = useState(false)
    
    
    const classes = useStyles();


    const handleChange = e =>{
        const inputValue = e.target.value 
        const feilds ={ name: setName, referralCode: SetReferralCode }
        feilds[e.target.name](e.target.value)
    }




    const getlistNumber = async () => {
        const memberships = await db().collection('memberships').get();
        const listNums = memberships.docs.map(member => +member.data().listNumber )
        const maxListNums = Math.max(...listNums)
        const listNum = maxListNums + 1

        return listNum
    }


    const getMemberLevel = async () => {
        const refereredBy = await db().collection('memberships').where('user', '==', referralCode).get()
        const referrRef = refereredBy.docChanges()[0]
        const referrMemebershipID = referrRef ? referrRef.doc.id : referrRef

        if(referrMemebershipID){
            const referrMemebershipLevel = refereredBy.docChanges()[0].doc.data().level
            const level = referrMemebershipLevel ? referrMemebershipLevel : 1

            return referrRef.doc.data()
            
        }else{
            alert('Please Check The Referral Code')
        }

        return false
    }


    const handleSubmit = async (e)=> {
        const entry =  await getMemberLevel()

        if(entry){
            // debugger

            // await sendTextMessage(userInfo)  
            // props.history.push('/thank-you', { id: userID, user: userInfo} )
        }
    }


    const sendTextMessage = async ({name, phoneNumber, listNumber, level, user: referralCode})=>{
        let textMessages = [welcomeDetails(listNumber,level,referralCode), welcomeMessage(name)]

        for (const message of textMessages){

            const config = {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ message, phoneNumber })
            }

            await fetch("http://localhost:3001/api/notifications/signup", config)
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
                    <Avatar color='primary' style={{margin: '0 auto 30px'}}>
                        <LockIcon />
                    </Avatar>

                    <Typography style={{marginBottom: 25, textAlign: 'center'}} varient='h3' color="textSecondary"> Re Entry </Typography>
                </div>
                
                <FormControl style={{marginBottom: 25}}>
                    <TextField name='name' onChange={handleChange} helperText="" id="outlined-basic" label="Name" variant="outlined" />
                </FormControl>

                <FormControl style={{marginBottom: 25}}>
                    <TextField name="referralCode" onChange={handleChange} helperText="" id="outlined-basic" label="Referral Code" variant="outlined" />
                </FormControl>
                
                <Button variant="contained" color="primary" onClick={handleSubmit}>Get New Number</Button>
        
            </FormGroup>


            <FooterCaption/>

        </div>
    );
}

export default withRouter(SignUpForm)