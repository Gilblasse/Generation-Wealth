import React from 'react'
import {Grid, List, ListItem, ListItemIcon, ListItemText, Tooltip, Checkbox, CardContent, Card, CardHeader, Avatar, IconButton, makeStyles, Typography, Divider} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert';



const useStyles = makeStyles( theme => ({
    root: {
        padding: 0
      },
    small: {
        minWidth: theme.spacing(5),
        height: theme.spacing(5),
    },
    action: {
        marginTop: 0,
        marginRight: 0,
    },

    card: {
        marginTop: 45,
        height: 645
    }
}));




function ReferredCounts({members}) {

    const classes = useStyles();

    const reduceMembers = () => {
        let dict = {}
        let users = members.forEach(e=> !dict[e.user] && (dict[e.user]={userName:e.name, userCashApp:e.cashApp, referred:{} }))

        members.forEach(e=> {
            if(dict[e.referralCode]){
                dict[e.referralCode]['referred'][e.user] = true
            }
        })
        
        return Object.values(dict).sort((a,b) =>  ( Object.keys(a['referred']).length > Object.keys(b['referred']).length ) ? -1 : (Object.keys(a['referred']).length < Object.keys(b['referred']).length) ? 1 : 0 )
    }



    return (
        <Card className={classes.card}>
            <CardContent >
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h6" color="textPrimary">
                            Referrals
                        </Typography>
                    </Grid>

                    <Grid item>
                        <Typography variant="subtitle1" color="textPrimary">
                            Members: {reduceMembers().length}
                        </Typography>
                    </Grid>
                </Grid>

                <Divider/>
                <List dense style={{height: '600px', overflow: 'scroll'}}>
                    {
                        reduceMembers().map(user => {

                            return (
                                    <ListItem>
                                        <Grid container spacing={2} direction="row" justify="space-between" alignItems="center">
                                            <Grid item>
                                                <Grid container direction="column">
                                                    <Grid item>
                                                        <Typography variant="subtitle1" color="textPrimary">
                                                            {user.userName}
                                                        </Typography>
                                                    </Grid>

                                                    <Grid item>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            {user.userCashApp}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                        
                                            <Grid item>
                                                <Typography variant="subtitle1" color="textPrimary">
                                                    {Object.keys(user.referred).length}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                            )
                        })
                    }
                </List>
            </CardContent>
        </Card>
    )
}

export default ReferredCounts
