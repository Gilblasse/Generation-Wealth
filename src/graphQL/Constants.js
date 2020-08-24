export const GRAPHQL_API = 'https://us-central1-generational-wealth.cloudfunctions.net/memberships'

export const GET_USER_ENTRIES_QUERY = `
query Entires($level: Int, $paid: Boolean, $listNumber: Int){
  entries(level: $level, paid: $paid, listNumber: $listNumber){
    active
    level
    listNumber
    adminFee
    investment
    cashOut
    paidCashOutMember
    user{
      id
      name
      phoneNumber
      cashApp
       referralCode{
        id
        name
      }
    }
  }
}
` 