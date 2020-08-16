import {welcomeMessage, welcomeDetails, cashingOutSoonMessage, cashingOutMessage, messageForInvestors} from './smsMessages'


const baseURL = "http://localhost:3001/api/notifications/"

export const sendWelcomeSMS = async ({name, phoneNumber, listNumber, level, user: referralCode})=>{
    let textMessages = [welcomeDetails(listNumber,level,referralCode), welcomeMessage(name)]

    for (const message of textMessages){

        const config = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ message, phoneNumber })
        }

        await fetch(baseURL, config)
    }
}





export const sendCashingOutSMS = async (cashingOutArr)=>{

    for(const cashingOut of cashingOutArr){
        const {newEntryCurrentLVL, newLvlListNum, remainingMemberInfo} = cashingOut
        const {listNumber: oldLvlNewListNum , level: oldLvl} = newEntryCurrentLVL
        const {listNumber: newLvlNewListNum, level: newLvl} = newLvlListNum
        const {name, phoneNumber} = remainingMemberInfo
        const message = cashingOutMessage(name,oldLvl,oldLvlNewListNum, newLvl, newLvlNewListNum)

        const config = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ message, phoneNumber })
        }

        // debugger
        await fetch(baseURL, config)
    }

}




export const sendingSelectedCashOutSMS = async (users)=>{
    const message = cashingOutSoonMessage

    for (const user of users){
        const {phoneNumber} = user

        const config = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ message, phoneNumber })
        }

        await fetch(baseURL, config)
    }
}





export const sendingInvestorsSMS = async (investors)=>{
    const message = messageForInvestors

    const config = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ data:{message,investors} })
    }

    fetch(`${baseURL}/investors`, config)
}