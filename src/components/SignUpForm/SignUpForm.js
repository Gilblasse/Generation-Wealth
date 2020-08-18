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
        const user = await db().collection('users').where('name','==',name).where('cashApp','==', cashApp).get()
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
            // console.log(seedData)
            // const newData = seedData
            // uploadEntries(newData)
            handleSubmit()
            // updateCashOutEntries()
        } 
    } 



    const uploadEntries = async(newData)=>{
        // debugger
        const seedInfo = newData.map( d=> {
            return (
                {
                    name: d.name, 
                    phoneNumber: d.phoneNumber, 
                    cashApp: d.cashApp, 
                    refBy: d["Referred by"]?.replace(/\D/g,''),
                    listNumber: +d["#"], 
                    adminFee: d.adminFee, 
                    investment: d.investment, 
                    cashOut: d.cashOut, 
                    notes: d["Notes- Telegram Name"]
                }
            )
        })

        let count = 0
        const total = seedInfo.length
        console.log('Total: ', seedInfo.length)
       
        for(const data of seedInfo){
            let {name, phoneNumber, cashApp, refBy, notes} = data
            let {listNumber, adminFee, investment, cashOut} = data
            
            refBy = refBy || ""
            phoneNumber = phoneNumber || ""
            notes = notes || ""
            cashApp = cashApp || ""
            cashOut = (cashOut == 'TRUE')
            adminFee = (adminFee == 'TRUE')
            investment = (investment == 'TRUE')
            const isUser = await db().collection('users').where('name','==',name).where('cashApp','==',cashApp).get()

            if(isUser.docs.length == 0){
                const newUser = await db().collection('users').add({name, phoneNumber, cashApp, refBy, notes})
                const newUserDocs = await newUser.get()
                const userID = newUserDocs.id
                await db().collection('memberships').add({listNumber, level: 1, adminFee, investment, cashOut, active: !cashOut, skipCount: 0, user: userID})
            }else{
                const userid = isUser.docs[0].id
                await db().collection('memberships').add({listNumber, level: 1, adminFee, investment, cashOut, active: !cashOut, skipCount: 0, user: userid })
            }
            console.log('Entries Completed: ', count)
            count += 1
        }

        console.log('Starting to Update USers Referal Codes')
        updateUsers()
    }


    const updateUsers = async () => {
        const usersRef =  await db().collection('users').get()
        const userDocs = usersRef.docs
        let count = 0

        for(const doc of userDocs){
            const userData = doc.data()
            let num = userData.refBy || ""

            const entryRef = await db().collection('memberships').where('listNumber','==',+num).get()
            const entryDocs = entryRef.docs
            
            if (entryDocs.length != 0){
                const referrer = entryDocs[0].data().user
                console.log('Matched')
                await db().collection('users').doc(doc.id).update({referralCode: referrer})
            }
            console.log(count)
            count++
        }

        console.log('Updating CashOuts')
        updateCashOutEntries()
    }



    const updateCashOutEntries = async () => {
        const entryRef = await db().collection('memberships').where('cashOut','==',true).get()
        let lvlOneCount = 520
        let lvlTwoCount = 1
        const entryDocs = entryRef.docs
        let position = 0

        for(const doc of entryDocs){
            const user = doc.data().user
            const levelOneData = {level: 1, listNumber: lvlOneCount, skipCount: 0, adminFee: false, investment: false, cashOut: false, active: true, user}
            const levelTwoData = {level: 2, listNumber: lvlTwoCount, skipCount: 0, adminFee: false, investment: false, cashOut: false, active: true, user}

            await db().collection('memberships').add(levelOneData)
            await db().collection('memberships').add(levelTwoData)

            lvlOneCount += 1
            lvlTwoCount += 1
            position += 1
            console.log('cashOut', position)
        }
        
        console.log('Completed...')
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