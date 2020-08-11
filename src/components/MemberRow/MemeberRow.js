import React, {useState, useRef, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Accordion,AccordionDetails,AccordionSummary,Typography,Grid,Divider,AccordionActions,
    Button,Checkbox, TextField, Select, MenuItem, Modal
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { db } from '../../config/firebaseApp'


const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    column: {
      flexBasis: '50.33%',
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    columnEven:{
      backgroundColor: 'grey'
    },
    columnOdd:{
      backgroundColor: '#F0F0F0'
    }
  
  }));



  const MemeberRow = ({member, i, expanded, setExpanded, handleChange, allMembers, handleModalOpen, handleModalClose}) => {

    // const [expanded, setExpanded] = useState(false);
    const [editUser, setEditUser] = useState(false)
    const [btnType, setBtnType] = useState('Edit')
    const [listNumber, setListNumber] = useState(member.listNumber)
    // const [adminFee, setAdminFee] = useState(member.adminFee)
    // const [investment, setInvestment] = useState(member.investment)
    // const [cashOut, setCashOut] = useState(member.cashOut)
    const [level, setLevel] = useState(member.level)
    const [skipCount, setSkipCount] = useState(member.skipCount)
    const [availableListNums, setAvailableListNums ] = useState([])
    const actionBtn = useRef()
    const classes = useStyles();
    const dropDownLvlVALUE = useRef()
    

    useEffect(() => {
        findAvaliableListNums()
        // setAdminFee(member.adminFee)
        // setInvestment(member.investment)
        // setCashOut(member.cashOut)
    }, [])

    useEffect(() => {
        if(editUser){
            console.log('Finding List nums for LvL: ', level)
            setListNumber('')
            findAvaliableListNums()
        }
    }, [level,editUser])

    useEffect(() => {
        if(!editUser){
            completedEdit()
        }
    }, [listNumber])



    const findAvaliableListNums = () => {
        const allListNums = allMembers.filter(mem => mem.level == level).map(m => +m.listNumber)
        let availableNums;

        if(allListNums.length != 0){
            const maxNum = Math.max(...allListNums) + 1
            let minNum = Math.min(...allListNums) // Starting Point We Can ALSO START AT Zero for a full list of available numbers from 1 - infinity
            const availableListNumbers = []

            while(minNum != maxNum){
                if(!allListNums.includes(++minNum)){
                   availableListNumbers.push(minNum)
                }
            }

            availableNums = [...availableListNumbers]
        }else{
            availableNums = []
        }
        setAvailableListNums(availableNums)
    }



    const handleInputChange = (e)=> {
        const feilds = {
            listNumber: {setFunc: setListNumber, value: e.target.value},
            // adminFee: {setFunc: setAdminFee, value: e.target.checked},
            // investment: {setFunc: setInvestment, value: e.target.checked},
            // cashOut: {setFunc: setCashOut, value: e.target.checked},
            level: {setFunc: setLevel, value: e.target.value}
        }

        const setFunction = feilds[e.target.name]['setFunc']
        const value = feilds[e.target.name]['value']

        console.log('UPDATING LEVEL: ',member.level, ' To LVL: ',e.target.value)
        setFunction(value)
    }




    const completedEdit = ()=>{
        if(listNumber != ''){
            const membershipFeilds = { listNumber: +listNumber,  level }
            setExpanded(false)
            db().collection('memberships').doc(member.memberShipID).update(membershipFeilds)
            
        }else{
            setListNumber(member.listNumber)
            setLevel(member.level)
            // alert('Error: List Number Should Not Be Blank')
        }

        setEditUser(false)
        setBtnType('EDIT')
    }

    

    const handleClick = e => {
        const btnValue = e.target.innerText
        
        switch (btnValue) {
            case 'EDIT':
                setEditUser(true)
                setBtnType('DONE')
                console.log('Original Lvl: ', level)
                setLevel(member.level)
                break;

            case 'AUCTION':
                handleModalOpen(member)
                // skipMember()
                break;
            
            case 'DONE':
                completedEdit()
                break;
        
            default:
                break;
        }
    }


    return (
        <>
        <Accordion expanded={expanded === `panel${i+1}`} onChange={handleChange(`panel${i+1}`)}>
            
        <AccordionSummary
         expandIcon={<ExpandMoreIcon />}
         aria-controls="panel1bh-content"
         id="panel1bh-header"
         >
             <Typography className={classes.heading}>{member.listNumber}</Typography>
             <Typography className={classes.heading}>{member.name}</Typography>
             <Typography className={classes.heading}>{member.cashApp}</Typography>
        </AccordionSummary>


            <AccordionDetails>


               <Grid container spacing={2}>
                   <Grid item className={classes.columnOdd} xs={6}>Phone Number</Grid>
                   <Grid item className={classes.columnOdd} xs={6}> {member.phoneNumber}</Grid>

                   <Grid item xs={6}>Level </Grid>
                   <Grid item xs={6}> 
                        { 
                            editUser ? (
                                <Select
                                    labelId="demo-simple-select-outlined-label"
                                    id="demo-simple-select-outlined"
                                    name='level'
                                    defaultValue={member.level}
                                    onChange={handleInputChange}
                                    ref={dropDownLvlVALUE}
                                    label="Level"
                                    >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                </Select>
                            ) : member.level
                        }
                   </Grid>

                   <Grid item className={classes.columnOdd} xs={6}>List Number</Grid>
                   
                   <Grid item className={classes.columnOdd} xs={6}> 
                        { 
                            editUser ? <Select
                                labelId="demo-simple-select-outlined-label-1"
                                id="demo-simple-select-outlined-1"
                                name='listNumber'
                                onChange={handleInputChange}
                                label="listNumber"
                                >
                                {
                                    availableListNums.length == 0 
                                    ? 
                                        <MenuItem value={1}>1</MenuItem> 
                                    : 
                                        availableListNums.map(num => <MenuItem value={num}>{num}</MenuItem> )
                                }
                            </Select> : member.listNumber
                        }
                   </Grid>

                   
                   
                   

                </Grid>

            </AccordionDetails>
                <Divider />
                <AccordionActions>
                    <div onClick={handleClick} ref={actionBtn}>
                        <Button size="small" >{btnType}</Button>
                        <Button size="small" color="primary">AUCTION</Button>
                    </div>
                </AccordionActions>
     </Accordion>
    </>
    )
}

export default MemeberRow