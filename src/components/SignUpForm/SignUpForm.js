import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormGroup , FormControl, Typography, TextField, Button, Avatar, ListItemText } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { withRouter } from "react-router";
import { db } from '../../config/firebaseApp'
import FooterCaption from '../FooterCaption'
import referralCodeGenerator from 'referral-code-generator'
import {sendWelcomeSMS} from '../../config/SMS/smsActions'
import {seedData} from '../../config/seedData'

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
        let inputValue = e.target.value 
        
        switch (e.target.name) {
           
            case 'name':
                inputValue = checkNameInput(inputValue)
                setName(inputValue)
                break;

            case 'cashApp':
                // inputValue = checkCashOutInput(inputValue)
                setCashApp(inputValue)
                break;

            case 'phoneNumber':
                inputValue = checkPhoneNumberField(inputValue)
                setPhoneNumber(inputValue)
                break;
        
            case 'referralCode':
                SetReferralCode(inputValue)
                break;

            default:
                break;
        }
    }




    const checkNameInput = string => {
        return string.split(' ').map(s => capitalizeFirstLetter(s)).join(' ')
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const checkCashOutInput = (cashField) =>{
        if(cashField.length == 1){
            const firstChar = cashField[0] != '$' ? '$'+cashField : cashField
            return firstChar
        }
        return cashField
    }

    const checkPhoneNumberField = number =>{
            let nonSpaceNums = number.replace(/\D/g,'')
            // let completeNumber = nonSpaceNums.replace(nonSpaceNums.substring(0,1),1)
            
            // return completeNumber.split('').slice(0,11).join('')
        return nonSpaceNums
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
            let max = 1 

            refereredBy.docs.forEach(doc => {
                const entry = doc.data()
                entry.level > max && entry.cashOut === true && (max = entry.level) 
            })
            
            return max

        }else{
            alert('Please Check The Referral Code')
        }

        return false
    }



    const isUserInDB = async ()=> {
        const user = await db().collection('users').where('cashApp','==', cashApp).get()
        return user.docs.length == 0 ? false : true
    }



    const handleSubmit = async (e)=> {
        
        if(name === '' || cashApp === '' || referralCode === '' || phoneNumber === ''){
            alert('ERROR: Form Fields Cannot Remain Blank ')
            return

        }else if(phoneNumber.length !== 11){
            alert('Please Ensure Phone Number is 11 Digits Long')
            return
        }

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
                
                props.history.push('/thank-you', { id: userID, user: userInfo} )
                
                await db().collection('memberships').add(userMembership)

                await sendWelcomeSMS(userInfo)
                
            }
        }else {
            alert("You've Already Registered. Please check your text message Or contact a Generation Wealth Administrator")
        }
        
    }
    


    const handleEnterSubmit = e => {
        if(e.key === "Enter"){
            console.log(seedData)
            const newData = seedData
            debugger
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
                    <TextField name='name' onChange={handleChange} helperText="" id="outlined-basic" label="Name" variant="outlined" value={name}/>
                </FormControl>

                <FormControl style={{marginBottom: 25}}>
                    <TextField name='cashApp' onChange={handleChange} helperText="" id="outlined-basic" label="$Cash App or PayPal" variant="outlined" value={cashApp}/>
                </FormControl>

                <FormControl style={{marginBottom: 25}}>
                    <TextField name="referralCode" onChange={handleChange} helperText="" id="outlined-basic" label="Referral Code" variant="outlined" />
                </FormControl>

                <FormControl style={{marginBottom: 25}}>
                    <TextField type="tel" name="phoneNumber" onChange={handleChange} helperText="" id="outlined-basic" label="(Country Code) - Mobile Number" variant="outlined" value={phoneNumber}/>
                </FormControl>
                
                <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
        
            </FormGroup>


            <FooterCaption/>

        </div>
    );
}

export default withRouter(SignUpForm)