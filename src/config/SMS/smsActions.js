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





export const sendCashingOutSMS = async ({phoneNumber}, entries)=>{

    for (const entry of entries){
        const {listNumber, level} = entry
        const message = cashingOutMessage(level, listNumber)

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

    for (const investor of investors){
        const {phoneNumber} = investor

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