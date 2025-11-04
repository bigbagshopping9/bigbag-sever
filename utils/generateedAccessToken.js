import jwt from 'jsonwebtoken'


// export function generatedAccessToken(userId){
   
//   return jwt.sign(
//     {id: userId},
//     process.env.SECRET_KEY_ACCESS_TOKEN,
//     {expiresIn : '7d'}
//   )

// }

// export async function generatedAccessToken(userId) {
//   jwt.sign(
//     {id: userId},
//     process.env.SECRET_KEY_ACCESS_TOKEN,
//     {expiresIn : '7d'},
//     (error, token)=>{
//       if(error) throw error;
//       return token;
//     }
//   )
// // 

const generatedAccessToken =  (userId) =>{
  const token = jwt.sign({id: userId},
    process.env.SECRET_KEY_ACCESS_TOKEN,
    {expiresIn : '365d'}
  )

  return token
}

export default generatedAccessToken;