import React, {useState, useEffect} from 'react';
import MemeberRow from '../components/MemeberRow/MemeberRow'
import { db } from '../config/firebaseApp'




function AdminPage(props) {
    const [members, setMembers] = useState([]) 


    const getMembers = async ()=>{
        const snapshot = await db().collection('members').get()
        const membersDocs = snapshot.docs
        const membersInfo = membersDocs.map(doc => doc.data()) 
        const membersData = membersInfo.filter(member => +member.listNumber !== 0 )

        setMembers(membersData)
    }

    useEffect(() => {
        getMembers()
    },[])

    return (
        <div>
            AdminPage ONLY


            <h1>GW Members</h1>

            Find Member: <input type="text"/>
            <select name="" id="">
                <option value="">All</option>
                <option value="">Level 1</option>
                <option value="">Level 2</option>
                <option value="">Level 3</option>
                <option value="">Level 4</option>
            </select>

            <ul>
                {
                    members.map(member => {
                        return (
                            <MemeberRow member={member}/>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default AdminPage;