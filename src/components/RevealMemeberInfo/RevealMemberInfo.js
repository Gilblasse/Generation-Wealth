import React from 'react';
import { Redirect } from 'react-router-dom';
import { Table , TableBody , TableCell  , TableContainer , TableHead , TableRow ,Paper} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './RevealMemberInfo.css'



const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});



function RevealMemberInfo(props) {
  const data = props.history.location.state
  const classes = useStyles();



  return (
        <div className='revealMemberInfo'>
            {
                !props.history.location.state ?  <Redirect to='/signup'/> : (
                    
                  <div style={{marginTop: '20vh'}}>

                    <div>Your Number In Line is:  <h2>{data.member.listNumber}</h2></div>
                                        
                    <div style={{width: 700, margin: '30px auto'}}>
                      <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Member Name</TableCell>
                              <TableCell align="right">Membership Level </TableCell>
                              <TableCell align="right">Referral Code</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>

                              <TableRow key={data.id}>
                                <TableCell component="th" scope="row">{data.member.name}</TableCell>
                                <TableCell align="right">{data.member.memberLevel}</TableCell>
                                <TableCell align="right">{data.id}</TableCell>
                              </TableRow>

                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>


                  </div>

                    
                )
            }
        </div>
    );
}

export default RevealMemberInfo;