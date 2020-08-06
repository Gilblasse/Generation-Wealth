import React from 'react'

function MemeberRow({ member:{name, cashApp, listNumber, memberLevel, phoneNumber, referralCode} }) {
    return (
        <div>
            <div>{name} - {cashApp} - {listNumber} - {memberLevel} - {phoneNumber} - {referralCode}</div>
        </div>
    )
}

export default MemeberRow
