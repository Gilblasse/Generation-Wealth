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
        console.log('Getting All Entries: ', total)
        
        for(const membershipDoc of membershipRef.docs){
            // <LoadingPageModal percent={Math.floor((membersArr.length / total) * 100)}/>
            const membershipData = membershipDoc.data()
            
            const userDoc = await db().collection('users').doc(membershipData.user).get()
            const user = userDoc.data()
            const memberInfo = {...membershipData, memberShipID: membershipDoc.id, ...user, userID: userDoc.id}
            
            membersArr.push(memberInfo)

            setPercent(Math.floor((membersArr.length / total) * 100))
        }

        console.log('Completed ', total)
        setApplicationLoading(false)
        setMembers(membersArr)
    }

  

    useEffect(() =>{
        console.log('MEMBERS UPDATED SIZE => ', members.length)
        console.log('MEMBERS UPDATED => ', members)
        // selectedLvlMembers()
    },[members])
   

    // // ADMIN LOG OUT SECTION
    // const handleLogout = ()=>{
    //     auth().signOut()
    //     props.history.push('/gw-admin')
    // }


    // FILTERS SECTION
    const handleFilters = (queryDropDownVal) => {
        console.log('Query Members List Calling ON Hanldle Filter')
        console.log('Members Size Querying on => ', members.length)
        console.log('Members Querying on => ', members)

        let copyofMembers = [...members] 
        let memberResults;

        if(inputFilter != ''){
            if(isNumber(inputFilter)){
                memberResults = copyofMembers.filter(member => +member.listNumber === +inputFilter)
    
            }else{
                const query = inputFilter.toUpperCase()
                const byName = copyofMembers.filter(member => member.name.toUpperCase().indexOf(query) > -1 )
                const byCashApp = copyofMembers.filter(member => member.cashApp.toUpperCase().indexOf(query) > -1 )
                const byPhone = copyofMembers.filter(member => member.phoneNumber.toUpperCase().indexOf(query) > -1 )
                const membersQuerys = [...byName,...byCashApp,...byPhone] 
                const membersQueryResults = {};
    
                memberResults = membersQuerys.filter(member => !membersQueryResults[member['memberShipID']] && (membersQueryResults[member['memberShipID']] = true) )
            }
        }else{
            memberResults = [...members]
        }

        // const sameLevel = memberResults.filter(e => e.level === queryDropDownVal).filter(e=> e.active == true)
        // const sortedOnSameLvl = sameLevel.sort((a,b) =>  (+a.listNumber < +b.listNumber) ? -1 : (+a.listNumber > +b.listNumber) ? 1 : 0 )
        const filteredMembers = selectedLvlMembers(memberResults, queryDropDownVal)()
        // console.log('Handle Filter Returns MEMBERS => ', sortedOnSameLvl)
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

    const updateMembersInfo = async (id, data) => {
        await db().collection('memberships').doc(id).update(data)
    }

   const cashingOutDB = async (arrOfEntries) => {
       for(const entry of arrOfEntries){
           const {deactivateMemeber: id, newEntryCurrentLVL, newLvlListNum } = entry
            await db().collection('memberships').doc(id).update({active: false})
            await db().collection('memberships').add(newEntryCurrentLVL)
            await db().collection('memberships').add(newLvlListNum)
       }
   }
    

   const updateBulkEntries = async (bulkEntries) =>{
        for(const entry of bulkEntries){
            let {memberShipID: id, active, adminFee, cashOut, investment, level, listNumber, skipCount, user} = entry
            skipCount = skipCount || 0
            const updatedEntry = {active, adminFee, cashOut, investment, level, listNumber, skipCount, user}
            
            await db().collection('memberships').doc(id).update(updatedEntry)
        }
    }





    const updateMember = ({type , payload}) => {

        let updatedQueryArr = []

        switch (type) {
            case 'CASHINGOUT':
                let updatedMems = []
                let cashingOutDBarr = []
                // let prepareMessages = []
                const cashOutIDS = payload.map(mem => mem.deactivateMemeber.id)
                const reaminingMembers = members.filter(mem => !cashOutIDS.includes( mem.memberShipID ) )

                
                payload.forEach( memberUpdate => {
                    const {deactivateMemeber, newEntryCurrentLVL, newLvlListNum, remainingMemberInfo} = memberUpdate
                    const bottomOfListLVLs = [{...newEntryCurrentLVL, ...remainingMemberInfo}, {...newLvlListNum, ...remainingMemberInfo} ]
                    // prepareMessages[] 
                    updatedMems.push(...bottomOfListLVLs)
                    // DB Actions
                    cashingOutDBarr.push({deactivateMemeber: deactivateMemeber.id, newEntryCurrentLVL, newLvlListNum})
                })

                
                updatedQueryArr.push(...reaminingMembers, ...updatedMems)
                cashingOutDB(cashingOutDBarr)
                // sendCashingOutSMS(cashingOutDBarr)
            break;
            

            case 'UPDATE ENTRY':  
                // debugger      
                let currentMEM = {}
                const updatedMembers = members.map(mem => {
                    if(mem.memberShipID === payload.id){
                        mem = { ...mem, ...payload.updating }
                        currentMEM = mem
                    }
                   return mem
                })
                
                let {active, adminFee, cashOut, investment, level, listNumber, skipCount} = currentMEM
                skipCount = skipCount || 0
                let updateData = {active, adminFee, cashOut, investment, level, listNumber, skipCount}
                // debugger
                updatedQueryArr = [...updatedMembers]

                // db Actions
                if(payload.userEdit){
                    updateMembersInfo(payload.id, updateData)
                } 
            break;

    
            case 'ADD NEW ENTRY':
               updatedQueryArr = [...members, {...payload.newEntry, ...payload.userInfo}]
                // db Actions
                addedNewEntry(payload.newEntry)
            break


            case 'UPDATE AND NEW ENTRY': 
                console.log('Originial members => ', members.length)
                const memObj = members.find(e=> e.memberShipID === payload.update.id)
                const updateMemObj = {...memObj, ...payload.update.data}
                const leftOvers = members.filter(e=> e.memberShipID != payload.update.id)
                const newEntryInfo = {...payload.newEntry, ...payload.userInfo}
                
                updatedQueryArr = [...leftOvers, newEntryInfo, updateMemObj]
                
                addedNewEntry(payload.newEntry)
                updateMembersInfo(payload.update.id, payload.update.data)
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
                debugger
                updatedQueryArr = [...restOfMembers,...currentEntries]

                updateBulkEntries(currentEntries)
            break;
        

            default:
            break;
        }

        setMembers(updatedQueryArr)
    }




    

    return (
        <div className='admin'>
            <NavigationBar/>

            {/* <LoadingPageModal loading={applicationLoading} percent={percent}/> */}


            
            <Grid container spacing={2}>

                
                <Grid item xs={3}>
                    <select onChange={(e)=> setDropDownVal(e.target.value)} ref={selectLevelRef} name="levels" >
                        {/* <option value="all">All</option> */}
                        <option value="1">Level 1</option>
                        <option value="2">Level 2</option>
                        <option value="3">Level 3</option>
                        <option value="4">Level 4</option>
                    </select>


                    <CashingOutProcess allMembers={members} selectedLvlMembers={selectedLvlMembers()} updateMember={(memberAction) => updateMember(memberAction)}/>
                </Grid>

                <Grid item xs={4}>
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

                <Grid item xs={4}>
                    <ReferredCounts members={members}/>
                </Grid>
            </Grid>



        </div>
    );
}

export default withRouter(AdminPage);