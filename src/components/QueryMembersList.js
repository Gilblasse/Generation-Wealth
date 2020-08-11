import React, { useState, useEffect } from 'react'
import MemeberRow from '../components/MemberRow/MemeberRow'
import ReactLoading from 'react-loading';
import { Modal} from '@material-ui/core';
import {db} from '../config/firebaseApp';

function QueryMembersList({queryMembers, allMembers, selectedLvlMembers, updateMember}) {
    const [expanded, setExpanded] = useState(false);
    const [members, setMembers] = useState([]);
    const [openModal, setOpenModal] = useState(false)


    // MODAL VARIABLES 
    const [skipMember, setSkipMember] = useState({})
    const [associatedMembers, setAssociatedMembers ] = useState([])
    const [targetMember, setTargetMember] = useState({})


    useEffect(() => {
        setTargetMember(associatedMembers[0])
    }, [associatedMembers])

    useEffect(() => {
        const availableMembers = selectedLvlMembers().filter(m => m.cashApp != skipMember.cashApp && m.name != skipMember.name)
        setAssociatedMembers(availableMembers)
    }, [skipMember])


    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    const createNewEntry = ()=> {
        const {level, user } = targetMember
        const {listNumber} = skipMember
        const userMembership = { level, listNumber, user, adminFee: false, cashOut: false, investment: false }
        // console.log('New Entry: ', userMembership)
        db().collection('memberships').add(userMembership)
        updateMember()
        goToBottom(1)
    }


    const switchMember = ()=>{
        const updatedListNum = { listNumber: skipMember.listNumber }
        db().collection('memberships').doc(targetMember.memberShipID).update(updatedListNum)
        goToBottom(2)
    }


    const goToBottom = (num) => {
        const lastAvailablePostion = associatedMembers.length + 1 + num
        const updatedListNum = { listNumber:  lastAvailablePostion}
        db().collection('memberships').doc(skipMember.memberShipID).update(updatedListNum)
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


    useEffect(() => {
        setMembers(queryMembers)
    }, [queryMembers])
    
     


    


    return (
        <div style={{height: 400, overflow: 'scroll'}}>

            {
                members.length == 0 
                ? 
                    <div>
                        <ReactLoading type='spinningBubbles' color='#e7ddff' height={'20%'} width={'20%'} />
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
