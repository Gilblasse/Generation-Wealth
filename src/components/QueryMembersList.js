import React, { useState, useEffect, useRef } from 'react'
import MemeberRow from '../components/MemberRow/MemeberRow'
import ReactLoading from 'react-loading';
import { Modal , makeStyles } from '@material-ui/core';
import { sendingSkipMessages } from '../config/SMS/smsActions';
// import {db} from '../config/firebaseApp';

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));











// queryMembers,  selectedLvlMembers
function QueryMembersList({allMembers, handleFilters, inputFilter, dropDownVal, updateMember, setInputFilter}) {
    const [expanded, setExpanded] = useState(false);
    const [queryMembers, setQueryMembers] = useState([]);
    const [openModal, setOpenModal] = useState(false)
    const [queryDropDownVal, setQueryDropDownVal] = useState([])
    const selectQueryLevelRef = useRef()

    // MODAL VARIABLES 
    const classes = useStyles()
    const [modalStyle] = React.useState(getModalStyle);
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
        const skipedMemberUpdatedListNum = { listNumber: associatedMembers.splice(-1)[0].listNumber + 1 }
        const {listNumber} = skipMember
        const userMembership = { level, listNumber, user, adminFee: false, cashOut: false, investment: false, active: true, skipCount: 0}
        const remainingMemberInfo = {name,phoneNumber,cashApp,referralCode }
        // skipCount: skipMember.skipCount + 1
 
        updateMember({ 
            type: 'UPDATE AND NEW ENTRY' , 
            payload: {
                newEntry: userMembership, userInfo: remainingMemberInfo, 
                update:{data: skipedMemberUpdatedListNum, id: skipMember.memberShipID}
            },
        })

        handleModalClose()
        setExpanded(false)

        sendingSkipMessages({
            skipMember: {
                ...skipedMemberUpdatedListNum, 
                level: skipMember.level, 
                phoneNumber: skipMember.phoneNumber
            },

            auctionWinner: {
                listNumber: skipMember.listNumber,
                level: targetMember.level,
                phoneNumber: targetMember.phoneNumber
            } 
        })
    }

    const skipMemberToBottom = ()=> {
        const skipedMemberUpdatedListNum = { listNumber: associatedMembers.splice(-1)[0].listNumber + 1 }
        updateMember({ type: 'UPDATE ENTRY' , payload: {updating: skipedMemberUpdatedListNum, id: skipMember.memberShipID, userEdit: true} })
        handleModalClose()
    }

    
    const replaceMember = ()=>{
        const targetUpdatedListNum = { listNumber: skipMember.listNumber }
        const skipedMemberUpdatedListNum = { listNumber: associatedMembers.splice(-1)[0].listNumber + 1}
        
        const updateEntries = [
            {updating: targetUpdatedListNum, id: targetMember.memberShipID},
            {updating: skipedMemberUpdatedListNum, id: skipMember.memberShipID}
        ]
 
        updateMember({ type: 'BULK UPDATE' , payload: updateEntries })
        handleModalClose()
        setExpanded(false)

        debugger
        sendingSkipMessages({
            skipMember: {
                ...skipedMemberUpdatedListNum, 
                level: skipMember.level, 
                phoneNumber: skipMember.phoneNumber
            },

            auctionWinner: {
                ...targetUpdatedListNum,
                level: targetMember.level,
                phoneNumber: targetMember.phoneNumber
            } 
        })
    }


    const goToBottom = (num) => {
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


    useEffect(() => {
        console.log('QUERY LIST MEMBERS UPDATED: => ', queryMembers)
    }, [queryMembers])


    useEffect(() => {
        console.log('QUERY MEMBERS UPDATING')
        const sortedMembers = handleFilters(+selectQueryLevelRef.current?.value)
        setQueryMembers(sortedMembers)
        console.log('Set QueryMembersList with Updated Sorted MEMBERS')
    }, [inputFilter, allMembers, queryDropDownVal])


    const getReferredBy = (member) =>{
        const referredBy = allMembers.filter(mem => mem.user === member.referralCode)

        if(referredBy.length != 0){
            return referredBy[0]?.user
        }else{
            return 'NOTHING'
        }

    }





    


    return (
        <div>

            Find Member: <input type="text" value={inputFilter} onChange={e => setInputFilter(e.target.value)}/>
            <select onChange={(e)=> setQueryDropDownVal(e.target.value)} ref={selectQueryLevelRef} name="levels" >
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
                <option value="all">All</option>
            </select>

            {
                allMembers.length == 0 
                ? 
                    <div>
                        {/* <ReactLoading type='spin' color='#e7ddff' height={'20%'} width={'20%'} /> */}
                        Search Not Found:  
                    </div> 
                : (
                    <div style={{height: 600, overflow: 'scroll'}}>
                        {/* POPUP SKIP NOTIFICATION */}
                        <div>
                            <Modal
                                open={openModal}
                                onClose={handleModalClose} 
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                                >
                                <div style={{width:800, height: 300, margin: '25vh auto', backgroundColor: 'white'}}>
                                    <div>
                                        Skipping {skipMember.name} with List Number {skipMember.listNumber} || TARGET: {targetMember?.name}
                                        <button onClick={createNewEntry}>New Entry</button> <button onClick={replaceMember}>Replace</button>
                                    </div>
                                    <select onChange={handleModalSelect}>
                                        {/* <option value={targetMember.memberShipID}>{targetMember.name}</option> */}
                                        {
                                            associatedMembers.map(mem => <option value={mem.memberShipID}>{mem.name}</option>)
                                        }
                                    </select>
                                </div>
                            </Modal>
                        </div>
                        
                        

                        {
                            queryMembers.map((member,i) => {
                                

                                return (
                                    <MemeberRow 
                                        key={i} 
                                        allMembers={sortedAllMembers()} 
                                        member={{...member, referredBy: getReferredBy(member)}} 
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
