import React, { useState, useEffect, useRef } from 'react'
import {Grid, List, ListItem, ListItemIcon, ListItemText, Card, CardActions, CardContent, Button, Typography, makeStyles,Divider,
CardHeader, Avatar, IconButton} from '@material-ui/core'
import { sendCashingOutSMS } from '../../config/SMS/smsActions';
import CashingOutList from './CashingOutList';
import {sendingSelectedCashOutSMS, sendingInvestorsSMS} from '../../config/SMS/smsActions'
import './CashingOutProcess.css'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InvestorsList from './InvestorsList/InvestorsList'


const useStyles = makeStyles({
    root: {
      minWidth: 175,
      height: 250
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });




function CashingOutProcess({selectedLvlMembers, allMembers, updateMember, selectLevelRef}) {

    const selectionNumbers = [1,2,3,4,5,6,7,8,9,10]
    const [numOfCashOuts, setNumOfCashOuts] = useState(1)
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [entryID, setEntryID] = useState()
    const [investors, setInvestors] = useState([]);
    const [findInvestors, setfindInvestors] = useState({})
    const [isCashingOut, setIsCashingOut] = useState(false)
    const [isSendingNotifications, setIsSendingNotifications] = useState(false)


    const classes = useStyles();

    useEffect(()=>{
        if(entryID && selectedIndex){
            handleListItemClick(null, selectedIndex, entryID)
        }
    },[allMembers,numOfCashOuts, selectLevelRef])

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
        setEntryID(memberShipID)
        setInvestors(findInvestors[memberShipID])
    };


    const handleSelect = e => {
        setNumOfCashOuts(e.target.value)
    }

    
    const getAssociatedInvestors = ()=>{
        const cashingOut = selectedLvlMembers().slice(0,numOfCashOuts)
        const investorsArry = []
        const dict = {}
        const availableInvestors = selectedLvlMembers().filter(i => i.paidCashOutMember == false )
        
        let num = 0
        let sum;
       
        for (const mem in cashingOut){
          sum = num + 7
          investorsArry.push(availableInvestors.slice(num, sum))
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
                
                if(associatedInvestors.every(i => i.investment == true)){
                    
                    if(adminFee && investment && cashOut){  
                        const bottomListNumCurrentLVL = findBottomOfList(level)
                        let newEntryCurrentLVL = {adminFee: false, investment: true, cashOut: false, listNumber: bottomListNumCurrentLVL, level , user, active: true, skipCount: 0, paidCashOutMember: false}
                        let remainingMemberInfo = {name,phoneNumber,cashApp,referralCode } //memberShipID
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
    
                        cashoutUpdates.push({newEntryCurrentLVL, deactivateMemeber, newLvlListNum, remainingMemberInfo,associatedInvestors})
    
                    }else{
                        // alert(`Entry:  ${cashingOutmember.listNumber}. ${cashingOutmember.name} is Missing Either Admin Fee | Investment | Checkout`)
                    }
                }else{
                    alert('Please Make Sure All Investors Paid Their Investment')
                }

            }else{
                alert(`Entry:  ${cashingOutmember.listNumber}. ${cashingOutmember.name} Needs more Members In Order to Cash Out`)
            }

            // debugger 
        }
        // debugger
        setIsCashingOut(false)
        cashoutUpdates.length != 0 && updateMember( { type: 'CASHINGOUT', payload: cashoutUpdates } )
        // debugger
        cashoutUpdates.length != 0 && sendCashingOutSMS(cashoutUpdates)
    }


    const handleSendNotification = async ()=>{
        await sendingSelectedCashOutSMS(selectedLvlMembers().slice(0,numOfCashOuts))
        
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


            <Grid container spacing={2}>


                {/*=============  CASHING OUT MEMBERS  =======*/}
                <Grid item xs={12} lg={5}>
                    <Card className={classes.root} className='cashingOutProcess__listContainer'>
                        <CardContent>
                            <Typography variant="body1">
                                Cashing Out
                            </Typography>
                            <Divider />
                            <List component="nav" dense style={{height: '180px', overflow: 'scroll'}}>
                                {
                                    selectedLvlMembers().slice(0,numOfCashOuts).map((mem,i) => {
                                        return (
                                        
                                            <CashingOutList mem={mem} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick} i={i} updateMember={updateMember}/>
                                        
                                        )
                                    })
                                }
                            </List>
                        </CardContent>
                    </Card>
                </Grid>


                {/*=============  INVESTORS RESPONSIBLE FOR PAYING CASHING OUT MEMBERS  =======*/}
                
                <Grid item xs={12} lg={4}>
                     <Card className={classes.root} className='cashingOutProcess__listContainer'>
                        <CardContent>
                            <Typography variant="body1">
                                Paying Cashing Out Members
                            </Typography>
                            <Divider />
                                <List component="nav" dense style={{height: '180px', overflow: 'scroll'}}>
                                    {   
                                        selectedLvlMembers().length != 0 && (
                                            (
                                                investors && investors.length === 7) && (
                                                <>

                                                    {
                                                    investors.slice(0,-2).map(investor => {
                                                        return (
                                                            <InvestorsList investor={investor} numOfCashOuts={numOfCashOuts} updateMember={updateMember} allMembers={allMembers} updateMember={updateMember} selectLevelRef={selectLevelRef}/>
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

                <Grid item xs={12} lg={3}>
                     <Card className={classes.root} className='cashingOutProcess__listContainer'>
                        <CardContent>
                            <Typography variant="body1">
                                Paying Generational Wealth  
                            </Typography>
                            <Divider />
                                <List component="nav" dense style={{height: '180px', overflow: 'scroll'}}>
                                    {   
                                        selectedLvlMembers().length != 0 && (
                                            (
                                                investors && investors.length === 7) && (
                                                <>

                                                    {
                                                    investors.slice(-2).map(investor => {
                                                        return (
                                                            <InvestorsList investor={investor} updateMember={updateMember}/>
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
