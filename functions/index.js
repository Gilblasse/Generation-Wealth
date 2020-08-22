const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express')
const {ApolloServer, gql, ApolloError, ValidationError} = require('apollo-server-express')

var serviceAccount = require("./generational-wealth-firebase-adminsdk-tltb6-67f85ec78c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://generational-wealth.firebaseio.com"
});

const db = admin.firestore()


const typeDefs = gql`
    type Memberships {
        active: Boolean!
        adminFee: Boolean!
        cashOut: Boolean!
        investment: Boolean!
        level: Int!
        listNumber: Int!
        paidCashOutMember: Boolean!
        skipCount: Int!
        user: User!
    }

    type User {
        name: String!
        phoneNumber: Int!
        cashApp: String!
        referralCode: String!
        notes: String!
        entries: [Memberships]!
    }

    type Query {
        entries: [Memberships]
        user(id: String): User
    }
`

const resolvers = {
    User: {
        async entries(user){
            try {
                const userEntries = await db.collection('memberships').where('user','==', user.id).get()
                const entries = userEntries.docs.map(e => e.data() )
                // const users = await db.collection('users').get()
                // const userIds = users.docs.map(u => u.id)
                
                // for (const id of userIds) {
                //     await db.collection('users').doc(id).update({id})
                // }
                
                return entries

            } catch (error) {
                throw new ApolloError(`Resolvers USER: ${JSON.stringify(user)}  ERROR: ${error}`)
            }
        }
    },


    Memberships: {
        async user(entry){
            try {
                const entryUser = await db.collection('users').doc(entry.user).get()
                return entryUser.data()

            } catch (error) {
                throw new ApolloError(`Resolver Memberships: Entry.User => ${JSON.stringify(entry.user)} ERROR: ${error}`)
            }
        }
    },


    Query: {
        async entries() {
            const entires = await db.collection('memberships').get()
            return entires.docs.map(e => e.data())
        },

        async user(_,argsID) {
           try {
                const userDoc = await db.collection('users').doc(argsID.id).get()
                const user = userDoc.data()
                return user || new ValidationError('User ID Not Found')
                
           } catch (error) {
                throw new ApolloError(`You did ${JSON.stringify(argsID.id)} Error: ${error}`)
           }
        }
    }
    

}





const app = express()
const server = new ApolloServer({
    typeDefs,
    resolvers
})


// server.listen().then(({ url }) => {
//     console.log(`Server ready at ${url}`)
// })



server.applyMiddleware({app, path: '/', cors: true})

exports.memberships = functions.https.onRequest(app)