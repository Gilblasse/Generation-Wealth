import React from 'react'
import {Grid, IconButton , Menu, MenuItem, Typography} from '@material-ui/core'
import { db, auth } from '../../config/firebaseApp'
import {withRouter} from 'react-router-dom';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import './NavigationBar.css'


function NavigationBar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleClick = (event) => setAnchorEl(true)

    const handleClose = () => setAnchorEl(false)

    // ADMIN LOG OUT SECTION
    const handleLogout = ()=>{
        handleClose()
        auth().signOut()
        props.history.push('/gw-admin')
    }



    return (
        <nav className='navigationBar'>
            <div className='navigationBar__profileSection'>
                <div className='navigationBar__profile'>
                    <Typography color='textPrimary' style={{paddingTop: 15}}>
                        Welcome Admin
                    </Typography>
                    <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                        <AccountCircleTwoToneIcon style={{ fontSize: 30 }}/>
                    </IconButton>
                </div>
            
                {/* Hidden Menu */}
                <Menu anchorEl={anchorEl} keepMounted open={anchorEl} onClose={handleClose} >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </div>
        </nav>
    )
}

export default withRouter(NavigationBar)
