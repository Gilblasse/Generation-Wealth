import React, {useState, useEffect, useRef} from 'react';
// import MemeberRow from '../components/MemberRow/MemeberRow'
import { db, auth } from '../config/firebaseApp'
import {withRouter} from 'react-router-dom';
// import ReactLoading from 'react-loading';
import QueryMembersList from '../components/QueryMembersList'
import CashingOutProcess from '../components/CashingOutProcess/CashingOutProcess';



function AdminPage(props) {
    const [queryMembers, setQueryMembers] = useState([])
    const [lookUpMembers, setLookUpMembers] = useState({})
    // const [listNumbers, setListNumbers] = useState([])
    const [members, setMembers] = useState([]) 
    // const [expanded, setExpanded] = useState(false);
    const [dropDownVal, setDropDownVal] = useState('1');
    const [inputFilter, setInputFilter] = useState('');
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
    //             const memberInfo = {...membershipData, memberShipID: membershipDoc.id, ...user}
                
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

        for(const membershipDoc of membershipRef.docs){
            const membershipData = membershipDoc.data()
            const userDoc = await db().collection('users').doc(membershipData.user).get()
            const user = userDoc.data()
            const memberInfo = {...membershipData, memberShipID: membershipDoc.id, ...user}
            
            membersArr.push(memberInfo)
        }
        
        console.log('ALL MEMBERS FROM DB: ', membersArr)
        setMembers(membersArr)
    }

  

    useEffect(() =>{
        selectedLvlMembers()
    },[members])
   

    // ADMIN LOG OUT SECTION
    const handleLogout = ()=>{
        auth().signOut()
        props.history.push('/gw-admin')
    }


    // FILTERS SECTION
    const handleFilters = (queryDropDownVal) => {
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

        const filteredMembers = selectedLvlMembers(memberResults, queryDropDownVal)

        return filteredMembers
    }


    const selectedLvlMembers = (mem=false, selectedLVL=false) => {
        const selectedMembers = mem || members
        const dropDwnLVLval = selectedLVL || +selectLevelRef.current?.value
        const associatedMembers = isNaN(selectedLVL) ? selectedMembers : selectedMembers.filter(mem => +mem.level == dropDwnLVLval )
        const activeMembers = associatedMembers.filter(mem => mem.active === true)
        const sortedMembers = ()=> activeMembers.sort((a,b) =>  (+a.listNumber < +b.listNumber) ? -1 : (+a.listNumber > +b.listNumber) ? 1 : 0 )

        return sortedMembers
    }



    const addedNewEntry = async (entry) => {
        await db().collection('memberships').add(entry)
    }

    const updateMembersInfo = async (id, data) => {
        await db().collection('memberships').doc(id).update(data)
    }

   const cashingOutDB = async (id, newEntryCurrentLVL, newLvlListNum) => {
        await db().collection('memberships').doc(id).update({active: false})
        await db().collection('memberships').add(newEntryCurrentLVL)
        await db().collection('memberships').add(newLvlListNum)
   }
    

    const updateMember = ({type , payload}) => {

        let updatedQueryArr = []

        switch (type) {
            case 'CASHINGOUT':
                let updatedMems = []
                let cashingOutDBarr = []
                
                const reaminingMembers = members.filter(mem => {
                    for(const cashOutMember in payload){
                        debugger
                        if(mem.memberShipID != cashOutMember.deactivateMemeber.id){
                            return false
                        }
                        return true
                    }
                })  
                debugger
                payload.forEach( memberUpdate => {
                    const {deactivateMemeber, newEntryCurrentLVL, newLvlListNum, remainingMemberInfo} = memberUpdate
                    const bottomOfListLVLs = [{...newEntryCurrentLVL, ...remainingMemberInfo}, {...newLvlListNum, ...remainingMemberInfo} ]
                    
                    updatedMems.push(...bottomOfListLVLs)
                    // DB Actions
                    cashingOutDBarr.push({deactivateMemeber: deactivateMemeber.id, newEntryCurrentLVL, newLvlListNum})
                    // cashingOutDB(deactivateMemeber.id,newEntryCurrentLVL,newLvlListNum)
                })

                debugger
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
                const updateData = {active, adminFee, cashOut, investment, level, listNumber, skipCount}
                // debugger
                updatedQueryArr = [...updatedMembers]

                // db Actions
                if(payload.userEdit){
                    // debugger
                    updateMembersInfo(payload.id, updateData)
                } 
            break;

    
            case 'ADD NEW ENTRY':
               updatedQueryArr = [...members, {...payload.newEntry, ...payload.userInfo}]
                // db Actions
                addedNewEntry(payload.newEntry)
            break
        
            default:
                break;
        }

        setMembers(updatedQueryArr)
    }




    

    return (
        <div style={{width: 750, margin: '25px auto 0'}}>
            AdminPage ONLY  <button onClick={handleLogout}>Log Out</button>


            <h1>GW Members</h1>


            <div>
                <select onChange={(e)=> setDropDownVal(e.target.value)} ref={selectLevelRef} name="levels" >
                    {/* <option value="all">All</option> */}
                    <option value="1">Level 1</option>
                    <option value="2">Level 2</option>
                    <option value="3">Level 3</option>
                    <option value="4">Level 4</option>
                </select>


                <CashingOutProcess allMembers={members} selectedLvlMembers={selectedLvlMembers()} updateMember={(memberAction) => updateMember(memberAction)}/>

                <QueryMembersList 
                    allMembers={members}  
                    handleFilters={handleFilters}
                    inputFilter={inputFilter}
                    dropDownVal={dropDownVal}
                    setInputFilter={setInputFilter}
                    // queryMembers={queryMembers} 
                    // selectedLvlMembers={selectedLvlMembers()} 
                    updateMember={(memberAction) => updateMember(memberAction)} 
                />
            </div>



        </div>
    );
}

export default withRouter(AdminPage);