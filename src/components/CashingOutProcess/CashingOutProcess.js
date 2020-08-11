import React, { useState, useEffect } from 'react'
import {Grid, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core'
import { db } from '../../config/firebaseApp';


function CashingOutProcess({selectedLvlMembers, allMembers, updateMember}) {

    const selectionNumbers = [1,2,3,4,5,6,7,8,9,10]
    const [numOfCashOuts, setNumOfCashOuts] = useState(1)
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [investors, setInvestors] = useState([]);
    const [findInvestors, setfindInvestors] = useState({})
    const [isCashingOut, setIsCashingOut] = useState(false)
    const [isSendingNotifications, setIsSendingNotifications] = useState(false)
    // const [adminFee, setAdminFee] = useState()
    // const [investment, setInvestment] = useState()
    // const [cashOut, setCashOut] = useState()

    useEffect(() => {
        setSelectedIndex(0)
        setInvestors( findInvestors[selectedLvlMembers()[0]?.memberShipID] )
    },[findInvestors])

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


            console.table({return: 'RETURNING ',lvl, maxListNum})
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
        
        for(let cashingOutmember of cashingOut) {
            const { memberShipID, adminFee, investment, cashOut, listNumber, level, user, name,phoneNumber, cashApp, referralCode} = cashingOutmember
            const associatedInvestors = findInvestors[memberShipID]

            if(associatedInvestors?.length === 7){
                
                if(adminFee && investment && cashOut){  
                    const bottomListNumCurrentLVL = findBottomOfList(level)
                    let newEntryCurrentLVL = {adminFee: false, investment: false, cashOut: false, listNumber: bottomListNumCurrentLVL, level , user, active: true, skipCount: 0}
                    let remainingMemberInfo = {name,phoneNumber,cashApp,referralCode,memberShipID }
                    let deactivateMemeber = {id: memberShipID}
                    let newLvlListNum;
                    let newBottomListNum;
                   
                    switch (level) {
                        case 1:
                            console.log('Hit 1')
                            newBottomListNum = findBottomOfList(2)
                            newLvlListNum = {...newEntryCurrentLVL, listNumber: newBottomListNum, level: 2} 
                            break;
                        
                        case 2:
                            console.log('Hit 2')
                            newBottomListNum = findBottomOfList(3)
                            newLvlListNum = {...newEntryCurrentLVL, listNumber: newBottomListNum, level: 3} 
                            break;

                        case 3:
                            console.log('Hit 3')
                            newBottomListNum = findBottomOfList(4)
                            newLvlListNum = {...newEntryCurrentLVL, listNumber: newBottomListNum, level: 4}
                            break;

                        case 4:
                            console.log('Hit 4')
                            newBottomListNum = findBottomOfList(1)
                            newLvlListNum = {...newEntryCurrentLVL, listNumber: newBottomListNum, level: 1} 
                            break;
                    
                        default:
                            break;
                    }

                    updateMember( { type: 'CASHINGOUT', payload: {newEntryCurrentLVL, deactivateMemeber, newLvlListNum, remainingMemberInfo} } )

                }else{
                    alert(`Entry:  ${cashingOutmember.listNumber}. ${cashingOutmember.name} is Missing Either Admin Fee | Investment | Checkout`)
                }
            }else{
                alert(`Entry:  ${cashingOutmember.listNumber}. ${cashingOutmember.name} Needs more Members In Order to Cash Out`)
            }
        }

        setIsCashingOut(false)
    }


    const handleCheck = (e,id) => {

        updateMember({ 
            type:'UPDATE ENTRY', 
            payload: { 
                updating: {[e.target.name]: e.target.checked}, id
            } 
        })
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
                      <button  disabled onClick={() => setIsSendingNotifications(true)}>Notify Entries</button>
            }




            <Grid container spacing={2}>



                {/*=============  CASHING OUT MEMBERS  =======*/}
                <Grid item>
                    <List component="nav">
                        {
                            selectedLvlMembers().slice(0,numOfCashOuts).map((mem,i) => {
                                return (
                                
                                    <ListItem button selected={selectedIndex === i} onClick={(event) => handleListItemClick(event, i, mem.memberShipID)}>
                                        <ListItemIcon>
                                            {mem.listNumber}.
                                        </ListItemIcon>

                                        <ListItemText primary={mem.name} />


                                        {/* CHECK BOXES */}
                                        <ListItemIcon>
                                            <input type="checkbox" name='adminFee' checked={mem.adminFee ? true :  false} onChange={ e => handleCheck(e, mem.memberShipID)}/>
                                        </ListItemIcon>

                                        <ListItemIcon>
                                            <input type="checkbox" name='investment' checked={mem.investment ? true :  false} onChange={e => handleCheck(e, mem.memberShipID)}/>
                                        </ListItemIcon>

                                        <ListItemIcon>
                                            <input type="checkbox" name='cashOut' checked={mem.cashOut ? true :  false} onChange={e => handleCheck(e, mem.memberShipID)}/>
                                        </ListItemIcon>
                                    </ListItem>

                                
                                )
                            })
                        }
                    </List>
                </Grid>


                {/*=============  INVESTORS RESPONSIBLE FOR PAYING CASHING OUT MEMBERS  =======*/}
                
                <Grid item style={{border: '1px solid black'}}>
                <h5>PAYING CASHING OUT MEMBERS</h5>
                    <List component="nav" style={{overflow: 'scroll', height: 200}}>
                        {   
                            selectedLvlMembers().length != 0 && (
                                (
                                    investors && investors.length === 7) && (
                                    <>
                                        {/* <h5>PAYING CASHING OUT MEMBERS</h5> */}
                                        {
    
                                        investors.slice(0,-2).map(investor => {
                                            return (
    
                                                <ListItem>
                                                    <ListItemIcon>
                                                        {investor?.listNumber}.
                                                    </ListItemIcon>
                                                    <ListItemText primary={investor?.name} />
                                                </ListItem>
    
                                            )
                                        })
                                        }
                                    </>
                                )

                            )
                        }
                    </List>
                </Grid>



                
                {/*=============  INVESTORS RESPONSIBLE FOR PAYING GW  =======*/}

                <Grid item>
                    <List component="nav">
                        {
                            selectedLvlMembers().length != 0 && (
                                (investors && investors.length === 7) && (
                                    <>
                                        <h5>PAYING GW</h5>
                                        {

                                        investors.slice(-2).map(investor => {
                                            return (

                                                <ListItem>
                                                    <ListItemIcon>
                                                        {investor?.listNumber}.
                                                    </ListItemIcon>
                                                    <ListItemText primary={investor?.name} />
                                                </ListItem>

                                            )
                                        })
                                        }
                                    </>
                                )
                            )
                        }
                    </List>
                </Grid>



            </Grid>
            


        </div>
    )
}

export default CashingOutProcess
