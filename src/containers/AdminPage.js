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



    useEffect(() => {
        const unsubscribe = db().collection('memberships').onSnapshot(async (snapShot) =>{
            const membersArr = []
            const dict = {}

            for(const membershipDoc of snapShot.docs){
                const membershipData = membershipDoc.data()
                const userDoc = await db().collection('users').doc(membershipData.user).get()
                const user = userDoc.data()
                const memberInfo = {...membershipData, memberShipID: membershipDoc.id, ...user}
                
                membersArr.push(memberInfo)
            }

            const membersObjects = membersArr.filter(memberObj => +memberObj.listNumber !== 0 )

            for(const mem of membersObjects){
                dict[mem.memberShipID] = mem
            }

            setLookUpMembers(dict)
            setMembers(membersObjects)
            console.log('PULLING FROM DB ON CHANGE')
        })

        return unsubscribe
    },[])


    // UsEffect Depending On InputFilter | Members | DropDownVal
    useEffect(() => {
        handleFilters()
    }, [inputFilter,  dropDownVal])

    useEffect(() =>{
        selectedLvlMembers()
    },[members])
   

    // ADMIN LOG OUT SECTION
    const handleLogout = ()=>{
        auth().signOut()
        props.history.push('/gw-admin')
    }


    // FILTERS SECTION

    const handleFilters = () => {
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

        const filteredMembers = selectedLvlMembers(memberResults)
        setQueryMembers(filteredMembers)
    }


    const selectedLvlMembers = (mem=false) => {
        const selectedMembers = mem || members
        const associatedMembers = selectedMembers.filter(mem => +mem.level == +selectLevelRef.current.value )
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
                const {deactivateMemeber, newEntryCurrentLVL, newLvlListNum, remainingMemberInfo} = payload
                const remaining = members.filter(mem => mem.memberShipID != deactivateMemeber.id)
                const bottomOfListLVLs = [...remaining, {...newEntryCurrentLVL, ...remainingMemberInfo}, {...newLvlListNum, ...remainingMemberInfo} ]
                 
                updatedQueryArr = [...bottomOfListLVLs]
                // DB Actions
                cashingOutDB(deactivateMemeber.id,newEntryCurrentLVL,newLvlListNum)
            break;
            

            case 'UPDATE ENTRY':        
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

                updatedQueryArr = [...updatedMembers]

                // db Actions
                updateMembersInfo(payload.id, updateData)
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
                Find Member: <input type="text" value={inputFilter} onChange={e => setInputFilter(e.target.value)}/>
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
                    queryMembers={queryMembers} 
                    selectedLvlMembers={selectedLvlMembers()} 
                    updateMember={(memberAction) => updateMember(memberAction)} 
                />
            </div>




        </div>
    );
}

export default withRouter(AdminPage);