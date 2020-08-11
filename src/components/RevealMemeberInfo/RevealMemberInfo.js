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
  const { id, user } = props.history.location.state
  const classes = useStyles();



  return (
        <div className='revealMemberInfo'>
            {
                !props.history.location.state ?  <Redirect to='/signup'/> : (
                    
                  <div style={{marginTop: '20vh'}}>
                    <h1 style={{textAlign: 'center', color:'green'}}>Success!</h1>
                    <div style={{textAlign: 'center'}}>Your Number In Line is:  <h2>{user.listNumber}</h2></div>
                                        
                    <hr style={{width: 500}} />

                    <div style={{width: 700, margin: '30px auto'}}>
                      <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Your Name</TableCell>
                              <TableCell align="right">Your Membership Level </TableCell>
                              <TableCell align="right">My Referral Code</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>

                              <TableRow key={id}>
                                <TableCell component="th" scope="row">{user.name}</TableCell>
                                <TableCell align="right">{user.level}</TableCell>
                                <TableCell align="center">{id}</TableCell>
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