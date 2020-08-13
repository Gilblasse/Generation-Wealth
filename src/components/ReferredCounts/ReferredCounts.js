import React from 'react'
import {Grid, List, ListItem, ListItemIcon, ListItemText, Tooltip, Checkbox} from '@material-ui/core'


function ReferredCounts({members}) {

    const reduceMembers = () => {
        let dict = {}
        
        for(const entry of members){
            if(!dict[entry.cashApp]){
                const referred = members.filter(e => e.referralCode == entry.user).map(m=>m.cashApp)
                dict[entry.cashApp] = [
                    referred.length == 0 ? [] : referred,
                    entry.name 
                ]
            }else{
                const refered = members.filter(e => e.referralCode == entry.user).map(m=>m.cashApp)
                dict[entry.cashApp][0] += refered.length == 0 ? [] : refered
            }
        }
        
        return Object.values(dict).map(e=> [new Set(e[0]).size,e[1]]).sort((a,b) =>  (+a[0] > +b[0]) ? -1 : (+a[0] < +b[0]) ? 1 : 0 )
        
        
        // return Object.values(dict).sort((a,b) =>  (+a[0] > +b[0]) ? -1 : (+a[0] < +b[0]) ? 1 : 0 )
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
