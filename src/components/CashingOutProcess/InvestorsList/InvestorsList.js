import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { CardHeader, Avatar, IconButton, makeStyles, Checkbox} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert';




const useStyles = makeStyles( theme => ({
    root: {
        padding: 0
      },
    small: {
        minWidth: theme.spacing(5),
        height: theme.spacing(5),
    },
}));

function InvestorsList ({investor, updateMember, numOfCashOuts, allMembers, selectLevelRef}) {

    const classes = useStyles();
    const [investment, setInvestment] = useState(investor?.investment)
    const [edit, setEdit] = useState(false)
    const [memID, setMemID] = useState(false)


    useEffect(()=>{
        setInvestment(investor?.investment)
    },[])

    useEffect(()=>{
        setInvestment(investor?.investment)
    },[investor, allMembers, selectLevelRef, numOfCashOuts])


    useEffect(()=>{

        if(edit){
            updateMember({ 
                type:'UPDATE ENTRY', 
                payload: { 
                    updating: { 
                        investment: investment, 
                        user: investor?.user,
                        cashApp: investor?.cashApp,
                        name: investor?.name,
                        phoneNumber: investor?.phoneNumber
                    }, 
                    id: memID,
                    userEdit: true
                } 
            })
        }

        setEdit(false)
    }, [investment])


    
    const handleInputChange = (id) =>{
        setMemID(id)
        setInvestment(!investment)
        setEdit(true)
    }




    return (
        <>
            <CardHeader
                className={classes.root} 
                avatar={
                <div style={{color: 'rgba(0, 0, 0, 0.54)', fontSize: '0.875rem'}}>
                   {investor?.listNumber}.
                </div>
                }
                action={
                <IconButton>
                    <Checkbox checked={investment} onChange={() => handleInputChange(investor?.memberShipID)} name="investment" />
                </IconButton>
                }
                title={investor?.name}
                subheader={investor?.cashApp}
            />
        </>
    );
}


export default InvestorsList;