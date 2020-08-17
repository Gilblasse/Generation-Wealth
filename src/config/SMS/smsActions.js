import {welcomeMessage, welcomeDetails, cashingOutSoonMessage, cashingOutMessage, messageForInvestors, skipMessage, wonAuctionMessage} from './smsMessages'


const baseURL = "http://localhost:3001/api/notifications/"



export const sendWelcomeSMS = async ({name, phoneNumber, listNumber, level, user: referralCode})=>{
    let welcomeMessages = [welcomeMessage(name), welcomeDetails(listNumber,level,referralCode)]

        const config = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ welcomeMessages, phoneNumber })
        }

        fetch(`${baseURL}/welcome`, config)
}





export const sendCashingOutSMS = async (cashingOutArr)=>{

    const data = []
    let count = 0

    for(const cashingOut of cashingOutArr){
        const {newEntryCurrentLVL, newLvlListNum, remainingMemberInfo} = cashingOut
        const {listNumber: oldLvlNewListNum , level: oldLvl} = newEntryCurrentLVL
        const {listNumber: newLvlNewListNum, level: newLvl} = newLvlListNum
        const {name, phoneNumber} = remainingMemberInfo

        const message = cashingOutMessage(name,oldLvl,oldLvlNewListNum + count, newLvl, newLvlNewListNum + count)

        data.push({message, phoneNumber})
        count += 1
    }

    const config = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ data })
    }

    // debugger
    fetch(`${baseURL}/cashingOut`, config)

}




export const sendingSelectedCashOutSMS = async (users)=>{
    const message = cashingOutSoonMessage

    const config = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ message, users })
    }

    fetch(`${baseURL}/cashingOutSoon`, config)
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



export const sendingSkipMessages = async ({skipMember, auctionWinner})=>{
    const data = [
        {phoneNumber: skipMember?.phoneNumber, message: skipMessage(skipMember.level, skipMember.listNumber)}, 
        {phoneNumber: auctionWinner?.phoneNumber, message: wonAuctionMessage(skipMember.level,skipMember.listNumber)}
    ]
    
    const config = {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ data })
    }

    fetch(`${baseURL}/auction`, config)
}