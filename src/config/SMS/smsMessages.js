export const welcomeMessage = (name) => {
    return `Welcome to GW ‼️
    We are so excited to meet you ❤️
    
    When your $100 is needed (or you are up for cash out) you will be texted through this automated system. 🗣
    
    1st STEPS:
    
    1. Download the Telegram App & Please put this number next to your name (not your username) Go to settings, edit, and change it there 
    
    2. Make sure you finished this survery: https://docs.google.com/forms/d/1qXk1x83-f2P7WaSdr-AJPXnsN55opdqvclznb4EbjnM
    
    3. After downloading the Telegram App - Join this chat for the next instructions: https://t.me/joinchat/SOoNHxfjhUIrjJg75UJTPQ
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


export const cashingOutMessage = (name,oldLvl,oldLvlNewListNum, newLvl, newLvlNewListNum) => {
    return `
        🎊🎈 CONGRATULATIONS ${name} on Cashing out 🎊🎈 \n
        Below is your Updated list numbers for their Corresponding Levels.\n
        Level: ${oldLvl} => List Number: ${oldLvlNewListNum} \n
        Level: ${newLvl} => List Number: ${newLvlNewListNum}
    `
}


export const skipMessage = (lvl,listNum) => {
    return`Due to inactivity and not being present when we called on you for your payment..
     You have been skipped. If this happens again we will have to let you go. 
     Please hold onto this new number and answer when we reach out for you to pay
     
     BELOW IS YOUR UPDATED INFO:
     Level: ${lvl} => List Number: ${listNum}`

}


export const wonAuctionMessage = (lvl,listNum) => {
    return `You won the auction
     and your New Entry is:
     Level: ${lvl} => List Number: ${listNum}`
}