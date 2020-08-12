import React, { useState, useEffect } from 'react'
import {Grid, List, ListItem, ListItemIcon, ListItemText, Tooltip, Checkbox} from '@material-ui/core'





function CashingOutList({ mem, selectedIndex, handleListItemClick, i , updateMember}) {

    const [editCheckBoxes , setEditCheckBoxes ] = useState(false)
    const [adminFee, setAdminFee] = useState(mem.adminFee)
    const [investment, setInvestment] = useState(mem.investment)
    const [cashOut, setCashOut] = useState(mem.cashOut)
    const [buttonText, setButtonText] = useState('Edit')


    useEffect(()=>{
        setAdminFee(mem.adminFee)
        setInvestment(mem.investment)
        setCashOut(mem.cashOut)

        return () => {
            setAdminFee('')
            setInvestment('')
            setCashOut('')
        }

    }, [mem])

    const handleCheck = (e,id) => {
        const fields = {
            adminFee: setAdminFee,
            investment: setInvestment,
            cashOut: setCashOut,
        }

        fields[e.target.name](e.target.checked)

        updateMember({ 
            type:'UPDATE ENTRY', 
            payload: { 
                updating: {
                        [e.target.name]: e.target.checked
                    }, 
                id,
                userEdit: !editCheckBoxes
            } 
        })
    }



    const handleButtonClick = (e) => {
    
        if(e.target.innerText == 'Edit'){
            setEditCheckBoxes(true)
            setButtonText('Done')
        }else{
            handleDone(e, mem.memberShipID)
            setButtonText('Edit')
        }
    }


    const handleDone = (e,id) => {
        
        updateMember({ 
            type:'UPDATE ENTRY', 
            payload: { 
                updating: { adminFee, investment, cashOut}, 
                id,
                userEdit: editCheckBoxes
            } 
        })

        setEditCheckBoxes(false)
    }














    return (
        <ListItem button selected={selectedIndex === i} onClick={(event) => handleListItemClick(event, i, mem.memberShipID)}>
            <ListItemIcon>
                {mem.listNumber}.
            </ListItemIcon>

            <ListItemText primary={mem.name} />

                {/* CHECK BOXES */}
                <Tooltip title="Paid Admin Fee" arrow>
                    <ListItemIcon>
                            <Checkbox checked={adminFee} onChange={ e => handleCheck(e, mem.memberShipID)} name="adminFee" disabled={!editCheckBoxes} />
                    </ListItemIcon>
                </Tooltip>

                <Tooltip title="Paid Investment" arrow>
                    <ListItemIcon>
                            <Checkbox checked={investment} onChange={ e => handleCheck(e, mem.memberShipID)} name="investment" disabled={!editCheckBoxes} />
                    </ListItemIcon>
                </Tooltip>

                <Tooltip title="Ready To Cash Out" arrow>
                    <ListItemIcon>
                            <Checkbox checked={cashOut} onChange={ e => handleCheck(e, mem.memberShipID)} name="cashOut" disabled={!editCheckBoxes} />
                    </ListItemIcon>
                </Tooltip>

                <ListItemIcon onClick={handleButtonClick}>
                    <button>{buttonText}</button>
                </ListItemIcon>

        </ListItem>
    )
}

export default CashingOutList
