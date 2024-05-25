import { apolloClient } from './ApolloClient';
import { gql } from '@apollo/client'

export async function queryExample (q) {
  const response = await apolloClient.query({
   query: gql(q),
 })
 return (response.data)
}

// query Profile {
//   profile(request: {forHandle: "lens/krishn_14"}) {
//     id
//     ownedBy {
//       address
//     }
//     handle {
//       fullHandle
//       localName
//     }
//   }
// }