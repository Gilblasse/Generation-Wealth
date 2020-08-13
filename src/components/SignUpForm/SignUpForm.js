import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup , FormControl, Typography, TextField, Button, Avatar } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { withRouter } from "react-router";
import { db } from '../../config/firebaseApp'
import FooterCaption from '../FooterCaption'



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

            return level
            
        }else{
            alert('Please Check The Referral Code')
        }
        
    }

    const isUserInDB = async ()=> {
        const user = await db().collection('users').where('cashApp','==', cashApp).get()
        return user.docs.length == 0 ? false : true
    }


    const handleSubmit = async (e)=> {
        const checkUserInDB = await isUserInDB()

        if(!checkUserInDB){
            const startingLevel = await getMemberLevel()
            
            if (startingLevel){
                const listNumber = await getlistNumber()
                const newUser = await db().collection('users').add({ name, phoneNumber, cashApp, referralCode })
                const newUserInfo = await newUser.get()
            
                const userID = newUser.id
                const userMembership = { level: startingLevel, listNumber, adminFee, cashOut, investment, user: userID, active: true, skipCount: 0}
                
                const userInfo =  {...newUserInfo.data(), ...userMembership}
                
                await db().collection('memberships').add(userMembership)

                sendTextMessage(userInfo)
                
                props.history.push('/thank-you', { id: userID, user: userInfo} )
            }
        }else {
            alert("You've Already Registered. Please check your text message Or contact a Generation Wealth Administrator")
        }
        
    }


    const sendTextMessage = async ({name, phoneNumber, listNumber, level, user: referralCode})=>{
        const message = `
        Welcome ${name} to GW ‼️
        When your $100 is needed (or you are up for cash out) you will be texted through this automated system. 🗣

        1st STEPS:
        1. Please put this number in your name (not your username) Go to settings, edit, and change it there 
        2. Join this thread for important updates: https://t.me/joinchat/AAAAAE_Lit5NNg2UM2hMRQ
        3. PAYMENTS & CashOuts: https://t.me/joinchat/AAAAAFfektr0mg3I-RFljg
        4. Join The secret chat: https://t.me/joinchat/SOoNHxrV9kHOzA1o45YdDw
        
        🚨Remember to pop in at least once a day or so esp when it’s your turn. If we can’t contact you and it’s your turn to pay someone out we WILL skip you!! If this happens you have to go to the bottom of the list🚨

        Level: ${level}
        List Number: ${listNumber}
        ReferralCode: ${referralCode}
        ` 


        const config = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                message,
                phoneNumber
            })
        }

        fetch(`http://localhost:3001/api/notifications/signup`, config)
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

                    <Typography style={{marginBottom: 25, textAlign: 'center'}} varient='h3' color="textSecondary"> MemberShip Sign Up </Typography>
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


            <FooterCaption/>

        </div>
    );
}

export default withRouter(SignUpForm)