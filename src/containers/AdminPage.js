import React, {useState, useEffect, useRef} from 'react';
// import MemeberRow from '../components/MemberRow/MemeberRow'
import { db, auth } from '../config/firebaseApp'
import {withRouter} from 'react-router-dom';
// import ReactLoading from 'react-loading';
import QueryMembersList from '../components/QueryMembersList'
import CashingOutProcess from '../components/CashingOutProcess/CashingOutProcess';
import LoadingPageModal from '../components/LoadingPageModal/LoadingPageModal';
import ReferredCounts from '../components/ReferredCounts/ReferredCounts';
import {Grid} from '@material-ui/core'
import NavigationBar from './NavigationBar/NavigationBar';
import './AdminPage.css'


function AdminPage(props) {
    const [queryMembers, setQueryMembers] = useState([])
    const [lookUpMembers, setLookUpMembers] = useState({})
    // const [listNumbers, setListNumbers] = useState([])
    const [members, setMembers] = useState([]) 
    // const [expanded, setExpanded] = useState(false);
    const [dropDownVal, setDropDownVal] = useState('1');
    const [inputFilter, setInputFilter] = useState('');
    const [percent, setPercent] = useState()
    const [applicationLoading, setApplicationLoading] = useState(true)
    const selectLevelRef = useRef()
    const isNumber = (n) => { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }




    // INSTEAD OF ONSNAPSHOT USE GET     
    // 
    // THIS WOULD MAKE THINGS EVEN FASTER SINCE YOU ARE ALREADY CONTROLLING ALL THE MEMBERSHIP OBJECTS WITH JAVASCRIPT
    // useEffect(() => {
    //     const unsubscribe = db().collection('memberships').onSnapshot(async (snapShot) =>{
    //         const membersArr = []
    //         // console.log('SnapShot Changes: ', snapShot.docChanges())
    //         for(const membershipDoc of snapShot.docs){
    //             const membershipData = membershipDoc.data()
    //             const userDoc = await db().collection('users').doc(membershipData.user).get()
    //             const user = userDoc.data()
    //             const memberInfo = {...membershipData, memberShipID: membershipDoc.id, ...user, userID: userDoc.id}
                
    //             membersArr.push(memberInfo)
    //         }
            
    //         // const membersObjects = membersArr.filter(memberObj => +memberObj.listNumber !== 0 )

 
    //         setMembers(membersArr)
    //         console.log('PULLING FROM DB ON CHANGE')
    //     })

    //     return unsubscribe
    // },[])


    useEffect(()=>{
        getAllEntries()
    },[])

    const getAllEntries = async ()=>{
        const membersArr = []
        const membershipRef = await db().collection('memberships').get()
        const total = membershipRef.docs.length
        // console.log('Getting All Entries: ', total)
        
        for(const membershipDoc of membershipRef.docs){
            const membershipData = membershipDoc.data()
            const userDoc = await db().collection('users').doc(membershipData.user).get()
            const user = userDoc.data()
            const memberInfo = {...membershipData, memberShipID: membershipDoc.id, ...user, userID: userDoc.id}
            
            membersArr.push(memberInfo)

            setPercent(Math.floor((membersArr.length / total) * 100))
            // console.log('Percentage: ', Math.floor((membersArr.length / total) * 100))
        }

        console.log('Completed ', total)
        setApplicationLoading(false)
        setMembers(membersArr)
    }

  

    // useEffect(() =>{
    //     console.log('MEMBERS UPDATED SIZE => ', members.length)
    //     console.log('MEMBERS UPDATED => ', members)
    //     // selectedLvlMembers()
    // },[members])
   


    // FILTERS SECTION
    const handleFilters = (queryDropDownVal) => {

        let copyofMembers = [...members] 
        const query = inputFilter.toUpperCase()
        let memberResults;

        if(inputFilter != ''){
            if(isNumber(inputFilter)){
                // debugger
                const byPhone = copyofMembers.filter(e => e?.phoneNumber?.toUpperCase()?.indexOf(query) > -1 )
                const byListNumber = copyofMembers.filter(e => +e.listNumber === +inputFilter)
                const numberQueries = [...byPhone,...byListNumber] 
                const numberQueryResults = {};

                memberResults = numberQueries.filter(member => !numberQueryResults[member['memberShipID']] && (numberQueryResults[member['memberShipID']] = true) )
                
            }else{
                // const query = inputFilter.toUpperCase()
                const byName = copyofMembers.filter(member => member?.name?.toUpperCase()?.indexOf(query) > -1 )
                const byCashApp = copyofMembers.filter(member => member?.cashApp?.toUpperCase()?.indexOf(query) > -1 )
                // const byPhone = copyofMembers.filter(member => member.phoneNumber.toUpperCase().indexOf(query) > -1 )
                const membersQuerys = [...byName,...byCashApp] 
                const membersQueryResults = {};
    
                memberResults = membersQuerys.filter(member => !membersQueryResults[member['memberShipID']] && (membersQueryResults[member['memberShipID']] = true) )
            }
        }else{
            memberResults = [...members]
        }

        const filteredMembers = selectedLvlMembers(memberResults, queryDropDownVal)()

        return filteredMembers
    }


    const selectedLvlMembers = (mem=false, selectedLVL=false) => {
        const selectedMembers = mem || members
        const dropDwnLVLval = selectedLVL || +selectLevelRef.current?.value
        const associatedMembers = isNaN(selectedLVL) ? selectedMembers : selectedMembers.filter(mem => +mem.level == dropDwnLVLval )
        const activeMembers = associatedMembers.filter(mem => mem.active === true).filter(e=> e.skipCount < 2)
        const sortedMembers = ()=> activeMembers.sort((a,b) =>  (+a.listNumber < +b.listNumber) ? -1 : (+a.listNumber > +b.listNumber) ? 1 : 0 )

        return sortedMembers
    }



    const addedNewEntry = async (entry) => {
        await db().collection('memberships').add(entry)
    }

    const updateMembersInfo = async ({membershipId, userId}, {memberShipData, userData}) => {
        await db().collection('memberships').doc(membershipId).update(memberShipData)
        await db().collection('users').doc(userId).update(userData)
    }

    const updateAndNewEntry = async ({update, newEntry, userInfo},updateMemObj, leftovers) => {
        debugger
        await db().collection('memberships').doc(update.id).update(update.data)
        const newMembershipEntry = await db().collection('memberships').add(newEntry)

        const newEntryDoc = await newMembershipEntry.get()
        const newEntryData = newEntryDoc.data()

        const updatedNewEntry = {memberShipID: newEntryDoc.id, ...newEntryData, ...userInfo}
        
       setMembers([...leftovers, updatedNewEntry, updateMemObj])
    }



   const cashingOutDB = async (arrOfEntries, reaminingMembers) => {
       let updatedEntries = []
       let removeEntries = []
       let assocs = []
       let count = 0 

       for(const entry of arrOfEntries){
           const {deactivateMemeber: id, newEntryCurrentLVL, newLvlListNum, remainingMemberInfo, associatedInvestors } = entry
           const membershipInfo = await db().collection('memberships').doc(id).update({active: false})

            const investorIds = associatedInvestors.map(i => i.memberShipID)
            removeEntries.push(investorIds)

            for(const investorId of investorIds ){
                await db().collection('memberships').doc(investorId).update({paidCashOutMember: true})
            }

        // Retrive New Entry IDs HERE
           const oldLVLEntry = await db().collection('memberships').add(newEntryCurrentLVL)
           const newLVLEntry =  await db().collection('memberships').add(newLvlListNum)
           const oldLvlEntryDoc = await oldLVLEntry.get()
           const newLVLEntryDoc = await newLVLEntry.get()
           const oldData = oldLvlEntryDoc.data()
           const newData = newLVLEntryDoc.data()

           const newEntryOldLVL = {memberShipID: oldLvlEntryDoc.id, ...oldData, ...remainingMemberInfo}
           const newEntryNewLVL = {memberShipID: newLVLEntryDoc.id, ...newData, ...remainingMemberInfo}
 
            updatedEntries.push(newEntryOldLVL,newEntryNewLVL,...associatedInvestors)
       }

       for(const removeEntry of removeEntries){
            reaminingMembers = reaminingMembers.filter(e => !removeEntry.includes(e.memberShipID))
       }
       
       setMembers([...reaminingMembers, ...updatedEntries])
   }
    




   const updateBulkEntries = async (bulkEntries) =>{
        for(const entry of bulkEntries){
            let {memberShipID: id, active, adminFee, cashOut, investment, level, listNumber, skipCount, user} = entry
            skipCount = skipCount || 0
            const updatedEntry = {active, adminFee, cashOut, investment, level, listNumber, skipCount, user}
            
            await db().collection('memberships').doc(id).update(updatedEntry)
        }
    }

    const addedNewMemberShipEntry = async (payload) => {
        const newMembershipEntry = await db().collection('memberships').add(payload.newEntry)
        const newEntryDoc = await newMembershipEntry.get()
        const newEntryData = newEntryDoc.data()
        const updatedNewEntry = {memberShipID: newEntryDoc.id, ...newEntryData, ...payload.userInfo}
            
        setMembers([...members, updatedNewEntry])
    }



    const updateMember = ({type , payload}) => {

        let updatedQueryArr = []

        switch (type) {
            case 'CASHINGOUT':
                let updatedMems = []
                let cashingOutDBarr = []
                const cashOutIDS = payload.map(mem => mem.deactivateMemeber.id)
                const reaminingMembers = members.filter(mem => !cashOutIDS.includes( mem.memberShipID ) )
                let count = 0
                
                payload.forEach( (memberUpdate, increment) => {
                    let {deactivateMemeber, newEntryCurrentLVL, newLvlListNum, remainingMemberInfo, associatedInvestors} = memberUpdate
                    newEntryCurrentLVL = {...newEntryCurrentLVL, listNumber: newEntryCurrentLVL.listNumber + increment, paidCashOutMember: false}
                    newLvlListNum = {...newLvlListNum, listNumber: newLvlListNum.listNumber + increment , paidCashOutMember: false}
                    associatedInvestors = associatedInvestors.map(i => ({...i, paidCashOutMember: true}) )
                    cashingOutDBarr.push({deactivateMemeber: deactivateMemeber.id, newEntryCurrentLVL, newLvlListNum, remainingMemberInfo, associatedInvestors})
                })


                cashingOutDB(cashingOutDBarr, reaminingMembers)
            break;
            

            case 'UPDATE ENTRY':  
                let currentMEM = {}

                const updatedMembers = members.map(mem => {
                    if(mem.user == payload.updating.user){
                        mem = {...mem, cashApp: payload.updating.cashApp, name: payload.updating.name, phoneNumber: payload.updating.phoneNumber}
                        
                        if(mem.memberShipID === payload.id){
                            mem = { ...mem, ...payload.updating }
                            currentMEM = mem
                        }
                    }
                   return mem
                })

                
                let {active, adminFee, cashOut, investment, level, listNumber, phoneNumber, cashApp, name, skipCount, user} = currentMEM
                skipCount = skipCount || 0

                let updateData = {memberShipData: {active, adminFee, cashOut, investment, level, listNumber, skipCount}, userData: {phoneNumber, cashApp, name} }

                setMembers([...updatedMembers])

                // db Actions
                if(payload.userEdit){
                    updateMembersInfo({membershipId: payload.id, userId: user}, updateData)
                } 
            break;

    
            case 'ADD NEW ENTRY':
                addedNewMemberShipEntry(payload)
            break


            case 'UPDATE AND NEW ENTRY': 
                console.log('Originial members => ', members.length)
                const memObj = members.find(e=> e.memberShipID === payload.update.id)
                const updateMemObj = {...memObj, ...payload.update.data}
                const leftOvers = members.filter(e=> e.memberShipID != payload.update.id)

                updateAndNewEntry({update: {id: payload.update.id, data: payload.update.data} ,newEntry: payload.newEntry, userInfo: payload.userInfo}, updateMemObj,leftOvers)
            break;


            case 'BULK UPDATE':
                const ids = payload.map(e=>e.id)
                const restOfMembers = members.filter(m=> !ids.includes(m.memberShipID))
                const currentEntries = []
                let entry;
                
                payload.forEach(e=>{
                    entry = members.find(m => m.memberShipID == e.id)
                    entry && currentEntries.push({...entry, ...e.updating})
                })
                
                setMembers([...restOfMembers,...currentEntries])

                updateBulkEntries(currentEntries)
            break;
        

            default:
            break;
        }

        // setMembers(updatedQueryArr)
    }




    

    return (
        <div className='admin'>
            <NavigationBar/>

            {/* <LoadingPageModal loading={applicationLoading} percent={percent}/> */}


            <div style={{backgroundColor: '#f3f3f3'}}>
                <Grid container spacing={2}>
                
                <Grid item xs={9}>
                        <Grid container direction="column" spacing={3}>
                            
                            <Grid item xs={12}>
                                <select onChange={(e)=> setDropDownVal(e.target.value)} ref={selectLevelRef} name="levels" >
                                    <option value="1">Level 1</option>
                                    <option value="2">Level 2</option>
                                    <option value="3">Level 3</option>
                                    <option value="4">Level 4</option>
                                </select>


                                <CashingOutProcess allMembers={members} selectLevelRef={selectLevelRef} selectedLvlMembers={selectedLvlMembers()} updateMember={(memberAction) => updateMember(memberAction)}/>
                            </Grid>


                            <Grid item xs={12}>
                                <QueryMembersList 
                                    allMembers={members}  
                                    handleFilters={handleFilters}
                                    inputFilter={inputFilter}
                                    dropDownVal={dropDownVal}
                                    setInputFilter={setInputFilter}
                                    // queryMembers={queryMembers} 
                                    selectedLvlMembers={selectedLvlMembers()} 
                                    updateMember={(memberAction) => updateMember(memberAction)} 
                                />
                            </Grid>

                        </Grid>
                </Grid>
                

                    

                    <Grid item xs={3}>
                        <ReferredCounts members={members}/>
                    </Grid>
                </Grid>
            </div>


        </div>
    );
}

export default withRouter(AdminPage);