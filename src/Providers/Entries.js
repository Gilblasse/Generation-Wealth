import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {GRAPHQL_API, GET_USER_ENTRIES_QUERY} from '../graphQL/Constants'
import QueryMembersList from '../components/QueryMembersList';

export const EntriesContext = React.createContext();

export const EntiresProvider = ({ children }) => {
    const [entriesList, setEntriesList] = useState([]);

    useEffect(()=> {
        console.log('Getting ALL Entires With Users')
        getUserEntriesList()
    }, [])



    const getUserEntriesList = async ()=> {
        const query = {query: GET_USER_ENTRIES_QUERY, variables: {level: 1} }
        const userEntryQueryResults = await axios.post(GRAPHQL_API, query)
        const usersEntries = userEntryQueryResults.data.data.entries

        console.log({usersEntries})
        setEntriesList(usersEntries)
    }


    

    return (

        <EntriesContext.Provider value={ {entriesList, getUserEntriesList} }>
            {children}
        </EntriesContext.Provider>
    )
}