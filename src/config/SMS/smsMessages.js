export const welcomeMessage = (name) => {
    return `
    Welcome ${name} to GW ‼️
    When your $100 is needed (or you are up for cash out) you will be texted through this automated system. 🗣

    1st STEPS:
    1. Please put your List number next to your name on telegram (not your username) Go to settings, edit, and change it there 
    2. Join this thread for important updates: https://t.me/joinchat/AAAAAE_Lit5NNg2UM2hMRQ
    3. PAYMENTS & CashOuts: https://t.me/joinchat/AAAAAFfektr0mg3I-RFljg
    4. Join The secret chat: https://t.me/joinchat/SOoNHxrV9kHOzA1o45YdDw
    
    🚨Remember to pop in at least once a day or so esp when it’s your turn. If we can’t contact you and it’s your turn to pay someone out we WILL skip you!! If this happens you have to go to the bottom of the list🚨
   `
}  

export const welcomeDetails = (level, listNumber, referralCode)=> {
    return ` Level: ${level} \n List Number: ${listNumber} \n ReferralCode: ${referralCode}`
}



export const cashingOutSoonMessage = `
    Wake up! It’s your turn!!! \n 
    Time to get your money🗣‼️ \n 
    You are being cashed out! \n 
    Please head to the secret chat and make sure to post screenshots as payments come in!
`


export const messageForInvestors = `
    Wake up! It’s your turn!!! \n 
    Time to invest 🗣‼️ \n 
`


export const cashingOutMessage = (level, listNumber) => {
    return `
        🎊🎈 CONGRTUALTIONS 🎊🎈 \n
        Your New Level: ${level} \n
        Your New List Number: ${listNumber}
    `
}