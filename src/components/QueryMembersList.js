import React, { useState, useEffect, useRef } from 'react'
import MemeberRow from '../components/MemberRow/MemeberRow'
import ReactLoading from 'react-loading';
import { Modal} from '@material-ui/core';
// import {db} from '../config/firebaseApp';

// queryMembers,  selectedLvlMembers
function QueryMembersList({allMembers, handleFilters, inputFilter, dropDownVal, updateMember, setInputFilter}) {
    const [expanded, setExpanded] = useState(false);
    const [queryMembers, setQueryMembers] = useState([]);
    const [openModal, setOpenModal] = useState(false)
    const [queryDropDownVal, setQueryDropDownVal] = useState([])
    const selectQueryLevelRef = useRef()

    // MODAL VARIABLES 
    const [skipMember, setSkipMember] = useState({})
    const [associatedMembers, setAssociatedMembers ] = useState([])
    const [targetMember, setTargetMember] = useState({})


    useEffect(() => {
        setTargetMember(associatedMembers[0])
    }, [associatedMembers])

    useEffect(() => {
        const sameLvl = allMembers.filter(m => m.level === skipMember.level && m.active === true)
        const availableMembers = sameLvl.filter(m => m.cashApp != skipMember.cashApp && m.name != skipMember.name)
        setAssociatedMembers(availableMembers)
    }, [skipMember])


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }
    
    const createNewEntry = ()=> {
        const {level, user, name,phoneNumber,cashApp,referralCode,memberShipID } = targetMember
        const {listNumber} = skipMember
        const userMembership = { level, listNumber, user, adminFee: false, cashOut: false, investment: false }
        const remainingMemberInfo = {name,phoneNumber,cashApp,referralCode,memberShipID }

        updateMember({ type: 'ADD NEW ENTRY' , payload: {newEntry: userMembership, userInfo: remainingMemberInfo} })
        goToBottom(1)
    }


    const switchMember = ()=>{
        const updatedListNum = { listNumber: skipMember.listNumber }
        updateMember({ type: 'UPDATE ENTRY' , payload: {updating: updatedListNum, id: targetMember.memberShipID} })
        goToBottom(2)
    }


    const goToBottom = (num) => {
        // debugger
        const lastAvailablePostion = associatedMembers.length + 1 + num
        const updatedListNum = { listNumber:  lastAvailablePostion}
        updateMember({ type: 'UPDATE ENTRY' , payload: {updating: updatedListNum, id: skipMember.memberShipID} })
        handleModalClose()
    }


    const handleModalClose = () => setOpenModal(false);


    const handleModalOpen = (selectedMember) => {
        setSkipMember(selectedMember)
        setOpenModal(true)
    };

    
    const handleModalSelect = (e) => {
        const selectedMember = associatedMembers.filter(m => m.memberShipID == e.target.value)
        setTargetMember(selectedMember[0])
    }


    

    const sortedAllMembers = ()=> allMembers.sort((a,b) =>  (+a.listNumber < +b.listNumber) ? -1 : (+a.listNumber > +b.listNumber) ? 1 : 0 )


    // useEffect(() => {
    //     setMembers(queryMembers)
    // }, [queryMembers])


    useEffect(() => {
        setQueryMembers(handleFilters(+selectQueryLevelRef.current?.value))
    }, [inputFilter, allMembers, queryDropDownVal])







    


    return (
        <div style={{height: 400, overflow: 'scroll'}}>

            {
                allMembers.length == 0 
                ? 
                    <div>
                        {/* <ReactLoading type='spin' color='#e7ddff' height={'20%'} width={'20%'} /> */}
                        Search Not Found: 
                    </div> 
                : (
                    <div>
                        {/* POPUP SKIP NOTIFICATION */}
                        <Modal
                            open={openModal}
                            onClose={handleModalClose} 
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            >
                            <div>
                                <div>
                                    Skipping {skipMember.name} with List Number {skipMember.listNumber} || TARGET: {targetMember?.name}
                                    <button onClick={createNewEntry}>New Entry</button> <button onClick={switchMember}>Switch</button>
                                </div>
                                <select onChange={handleModalSelect}>
                                    {/* <option value={targetMember.memberShipID}>{targetMember.name}</option> */}
                                    {
                                        associatedMembers.map(mem => <option value={mem.memberShipID}>{mem.name}</option>)
                                    }
                                </select>
                            </div>
                        </Modal>
                        
                        Find Member: <input type="text" value={inputFilter} onChange={e => setInputFilter(e.target.value)}/>
                        <select onChange={(e)=> setQueryDropDownVal(e.target.value)} ref={selectQueryLevelRef} name="levels" >
                            <option value="1">Level 1</option>
                            <option value="2">Level 2</option>
                            <option value="3">Level 3</option>
                            <option value="4">Level 4</option>
                            <option value="all">All</option>
                        </select>

                        {
                            queryMembers.map((member,i) => {
                                return (
                                    <MemeberRow 
                                        key={i} 
                                        allMembers={sortedAllMembers()} 
                                        member={member} 
                                        i={i} 
                                        expanded={expanded} 
                                        setExpanded={setExpanded} 
                                        handleChange={handleChange}
                                        handleModalOpen={mem => handleModalOpen(mem)}
                                        handleModalClose={handleModalClose}
                                        updateMember={updateMember}
                                    />
                                )
                            })

                        }
                    </div>
                )
            }
        </div>
    )
}

export default QueryMembersList
