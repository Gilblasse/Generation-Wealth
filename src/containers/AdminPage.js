import React from 'react';
import { db } from '../config/firebaseApp'


const members = db().collection('members').onSnapshot()


function AdminPage(props) {


    const getMembers = async ()=>{
        const membersDB = await db().collection('members')
        const membersDocs = await membersDB.onSnapshot( snapShot => {
            let changes = snapShot.docChanges()
            changes.forEach(change => {
                console.log(change.doc.data())
            })
        })
    }


    return (
        <div>
            AdminPage ONLY


            <h1>GW Members</h1>
            <ul>
                {
                    getMembers.map(memberInfo => {
                        return (
                            <li> {memberInfo.name} </li>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default AdminPage;