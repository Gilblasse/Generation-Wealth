import React, { useState, useEffect, useRef } from 'react'
import {Grid, List, ListItem, ListItemIcon, ListItemText, Card, CardActions, CardContent, Button, Typography, makeStyles,Divider} from '@material-ui/core'
import { sendCashingOutSMS } from '../../config/SMS/smsActions';
import CashingOutList from './CashingOutList';
import {sendingSelectedCashOutSMS, sendingInvestorsSMS} from '../../config/SMS/smsActions'
import './CashingOutProcess.css'



const useStyles = makeStyles({
    root: {
      minWidth: 275,
      height: 250
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });




function CashingOutProcess({selectedLvlMembers, allMembers, updateMember}) {

    const selectionNumbers = [1,2,3,4,5,6,7,8,9,10]
    const [numOfCashOuts, setNumOfCashOuts] = useState(1)
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [investors, setInvestors] = useState([]);
    const [findInvestors, setfindInvestors] = useState({})
    const [isCashingOut, setIsCashingOut] = useState(false)
    const [isSendingNotifications, setIsSendingNotifications] = useState(false)
    // const [editCheckBoxes , setEditCheckBoxes ] = useState(false)
    // const adminRef = useRef()
    // const [adminFee, setAdminFee] = useState()
    // const [investment, setInvestment] = useState()
    // const [cashOut, setCashOut] = useState()

    // useEffect(() => {
    //     // setSelectedIndex(0)
    //     setInvestors( findInvestors[selectedLvlMembers()[0]?.memberShipID] )
    // },[findInvestors])

    const classes = useStyles();

    useEffect(() => {
        if(isCashingOut){
            handleCashOutProcess()
        }
    }, [isCashingOut])

    useEffect(() => {
        getAssociatedInvestors()
    }, [numOfCashOuts, selectedLvlMembers])



    const findBottomOfList = (lvl) => {
       const presentMembers = allMembers.filter(mem => mem.level == lvl)

       if(presentMembers.length != 0){
            const lvlListNums = presentMembers.map(mem => +mem.listNumber)
            const maxListNum = Math.max(...lvlListNums) + 1

            return maxListNum
       }
       
       return 1
    }


    const handleListItemClick = (event, index, memberShipID) => {
        setSelectedIndex(index);
        setInvestors(findInvestors[memberShipID])
    };


    const handleSelect = e => {
        setNumOfCashOuts(e.target.value)
    }

    
    const getAssociatedInvestors = ()=>{
        const cashingOut = selectedLvlMembers().slice(0,numOfCashOuts)
        
        const investorsArry = []
        const dict = {}
      
        let num = 1
        let sum;
       
        for (const mem in cashingOut){
          sum = num + 7
          investorsArry.push(selectedLvlMembers().slice(num, sum))
      
          num = sum
        }
      
        for(let i=0; i < investorsArry.length; i++){
          dict[cashingOut[i].memberShipID] = investorsArry[i]
        }
        
      
        setfindInvestors(dict)
    }



    const handleCashOutProcess = async() => {
        const cashingOut = selectedLvlMembers().slice(0,numOfCashOuts)
        const cashoutUpdates = []

        for(let cashingOutmember of cashingOut) {
            const { memberShipID, adminFee, investment, cashOut, listNumber, level, user, name,phoneNumber, cashApp, referralCode} = cashingOutmember
            const associatedInvestors = findInvestors[memberShipID]

            if(associatedInvestors?.length === 7){
                
                if(adminFee && investment && cashOut){  
                    const bottomListNumCurrentLVL = findBottomOfList(level)
                    let newEntryCurrentLVL = {adminFee: false, investment: true, cashOut: false, listNumber: bottomListNumCurrentLVL, level , user, active: true, skipCount: 0}
                    let remainingMemberInfo = {name,phoneNumber,cashApp,referralCode,memberShipID }
                    let deactivateMemeber = {id: memberShipID}
                    let newLvlListNum;
                    let newBottomListNum;
                   
                    switch (level) {
                        case 1:
                            console.log('Hit 1')
                            newBottomListNum = findBottomOfList(2)
                            newLvlListNum = {...newEntryCurrentLVL, investment: false, listNumber: newBottomListNum, level: 2} 
                            break;
                        
                        case 2:
                            console.log('Hit 2')
                            newBottomListNum = findBottomOfList(3)
                            newLvlListNum = {...newEntryCurrentLVL, investment: false, listNumber: newBottomListNum, level: 3} 
                            break;

                        case 3:
                            console.log('Hit 3')
                            newBottomListNum = findBottomOfList(4)
                            newLvlListNum = {...newEntryCurrentLVL, investment: false, listNumber: newBottomListNum, level: 4}
                            break;

                        case 4:
                            console.log('Hit 4')
                            newBottomListNum = findBottomOfList(1)
                            newLvlListNum = {...newEntryCurrentLVL, investment: false, listNumber: newBottomListNum, level: 1} 
                            break;
                    
                        default:
                        break;
                    }

                    // await sendCashingOutSMS(remainingMemberInfo, [newEntryCurrentLVL, newLvlListNum])
                    cashoutUpdates.push({newEntryCurrentLVL, deactivateMemeber, newLvlListNum, remainingMemberInfo})

                }else{
                    // alert(`Entry:  ${cashingOutmember.listNumber}. ${cashingOutmember.name} is Missing Either Admin Fee | Investment | Checkout`)
                }
            }else{
                alert(`Entry:  ${cashingOutmember.listNumber}. ${cashingOutmember.name} Needs more Members In Order to Cash Out`)
            }

            // debugger 
        }
        // debugger
        setIsCashingOut(false)
        cashoutUpdates.length != 0 && updateMember( { type: 'CASHINGOUT', payload: cashoutUpdates } )
        debugger
        cashoutUpdates.length != 0 && sendCashingOutSMS(cashoutUpdates)
    }


    const handleSendNotification = async ()=>{
        // await sendingSelectedCashOutSMS(selectedLvlMembers().slice(0,numOfCashOuts))
        
        await sendingInvestorsSMS(Object.values(findInvestors).flat())
    }










    return (
        <div>
            Select Number Of CashOuts: 
            <select onChange={handleSelect}>
                {
                    selectionNumbers.map(number => <option value={number}>{number}</option> )
                }
            </select>


                {/* ===============  CASHING OUT BUTTONS ====================*/}
            {
                isCashingOut 
                    ? 
                        <button disabled>Loading...</button> 
                    :
                      <button  onClick={() => setIsCashingOut(true)}>Complete CashOut</button>
            }

            {
                isSendingNotifications 
                    ? 
                        <button disabled>Loading...</button> 
                    :
                      <button  onClick={handleSendNotification}>Notify Entries</button>
            }

{/* setIsSendingNotifications(true) */}


            <Grid container direction="column" spacing={2}>


                {/*=============  CASHING OUT MEMBERS  =======*/}
                <Grid item>
                    <List component="nav">
                        {
                            selectedLvlMembers().slice(0,numOfCashOuts).map((mem,i) => {
                                return (
                                
                                    <CashingOutList mem={mem} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick} i={i} updateMember={updateMember}/>
                                
                                )
                            })
                        }
                    </List>
                </Grid>


                {/*=============  INVESTORS RESPONSIBLE FOR PAYING CASHING OUT MEMBERS  =======*/}
                
                <Grid item>
                     <Card className={classes.root} classeName='cashingOutProcess__listContainer'>
                        <CardContent>
                            <Typography variant="h6">
                                Investors Paying Cashing Out Members
                            </Typography>
                            <Divider />
                                <List component="nav" dense className='cashingOutProcess__listOfInvestors'>
                                    {   
                                        selectedLvlMembers().length != 0 && (
                                            (
                                                investors && investors.length === 7) && (
                                                <>

                                                    {
                                                    investors.slice(0,-2).map(investor => {
                                                        return (
                
                                                            <ListItem>
                                                                <ListItemText primary={
                                                                    <>
                                                                        <ListItemIcon>
                                                                        {investor?.listNumber}.
                                                                        </ListItemIcon>
                                                                        {investor?.name}
                                                                    </>
                                                                } />

   
                                                                <ListItemIcon>
                                                                    {investor?.cashApp}
                                                                </ListItemIcon>
                                                            </ListItem>
                
                                                        )
                                                    })
                                                    }
                                                </>
                                            )

                                        )
                                    }
                                </List>
                        </CardContent>

                    </Card>
                </Grid>



                
                {/*=============  INVESTORS RESPONSIBLE FOR PAYING GW  =======*/}

                <Grid item>
                     <Card className={classes.root}>
                        <CardContent>
                            <Typography variant="h6">
                                Paying Generational Wealth
                            </Typography>
                            <Divider />
                                <List component="nav" dense>
                                    {   
                                        selectedLvlMembers().length != 0 && (
                                            (
                                                investors && investors.length === 7) && (
                                                <>

                                                    {
                                                    investors.slice(-2).map(investor => {
                                                        return (
                
                                                            <ListItem>
                                                                <ListItemText primary={
                                                                    <>
                                                                        <ListItemIcon>
                                                                        {investor?.listNumber}.
                                                                        </ListItemIcon>
                                                                        {investor?.name}
                                                                    </>
                                                                } />

   
                                                                <ListItemIcon>
                                                                    {investor?.cashApp}
                                                                </ListItemIcon>
                                                            </ListItem>
                
                                                        )
                                                    })
                                                    }
                                                </>
                                            )

                                        )
                                    }
                                </List>
                        </CardContent>

                    </Card>
                </Grid>
                


            </Grid>
            


        </div>
    )
}

export default CashingOutProcess
