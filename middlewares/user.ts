// function verifyUser(request, response, next) {
    
//     const loggedIn = request.cookies.loggedIn

//     console.log(loggedIn, typeof loggedIn)
//     if (loggedIn || loggedIn.length > 0){
//         next()
//     }

//     else{
//         return response.status(401).json({error: "User not logged in"})
//     }

// }

// module.exports = {  //brckets can hold multiple exports items
//     verifyUser
// }