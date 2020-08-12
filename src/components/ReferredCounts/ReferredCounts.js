import React from 'react'
import {Grid, List, ListItem, ListItemIcon, ListItemText, Tooltip, Checkbox} from '@material-ui/core'


function ReferredCounts({members}) {

    const reduceMembers = () => {
        const dict = {}
        
        for(const entry of members){
            if(!dict[entry.cashApp]){
                dict[entry.cashApp] = [
                    members.filter(e => e.referralCode == entry.user).length,
                    entry.name 
                ]
            }else{
                dict[entry.cashApp][0] += members.filter(e => e.referralCode == entry.user).length
            }
        }
        
        return Object.values(dict).sort((a,b) =>  (+a[0] > +b[0]) ? -1 : (+a[0] < +b[0]) ? 1 : 0 )
    }



    return (
        <div>
            {
                reduceMembers().map(member => {

                    return (
                        <List>
                            <ListItem>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        {member[1]}
                                    </Grid>
                                    <Grid item xs={6}>
                                        {member[0]}
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
