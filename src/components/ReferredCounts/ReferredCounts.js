import React from 'react'
import {Grid, List, ListItem, ListItemIcon, ListItemText, Tooltip, Checkbox} from '@material-ui/core'


function ReferredCounts({members}) {

    

    const reduceMembers = () => {
        let dict = {}
        let users = members.forEach(e=> !dict[e.user] && (dict[e.user]={userName:e.name, referred:{} }))

        members.forEach(e=> {
            if(dict[e.referralCode]){
                dict[e.referralCode]['referred'][e.user] = true
            }
        })
        
        return Object.values(dict).sort((a,b) =>  ( Object.keys(a['referred']).length > Object.keys(b['referred']).length ) ? -1 : (Object.keys(a['referred']).length < Object.keys(b['referred']).length) ? 1 : 0 )
    }



    return (
        <div>
            Referrals
            {
                reduceMembers().map(user => {

                    return (
                        <List dense>
                            <ListItem>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        {user.userName}
                                    </Grid>
                                    <Grid item xs={6}>
                                        {Object.keys(user.referred).length}
                                    </Grid>
                                </Grid>
                            </ListItem>
                        </List>
                    )
                })
            }
        </div>
    )
}

export default ReferredCounts
