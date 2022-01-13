const users=[]
const passwords=[]
const addUser=({id,username,room,password,confirm_password})=>{
  username=username.trim().toLowerCase()
  room=room.trim().toLowerCase()
  if(!username || !room){
    return {
      error:'Username and room are required'
    }
  }
    if(password!==confirm_password && confirm_password){
      return {
        error:'Please type same password'
      }
    }
  if(!confirm_password && password){
    const check_pass=passwords.find((user)=> user.room===room && user.password===password)
    if(!check_pass){
      return {
        error:'Incorrect Password'
      }
    }
  }
const existingUser=users.find((user)=>{
  return user.room===room && user.username===username
})
 if(existingUser){
   return {
     error:'User of this name is already present!'
   }
 }
const user={id,username,room}
users.push(user)
const addPassword={room,password}
passwords.push(addPassword)
return {user}
}
const removeUser=(id)=>{
  const index=users.findIndex((user)=> user.id===id )
  console.log("index",index);
  if(index!==-1){
    return users.splice(index,1)[0]
  }
}
const getUser=(id)=>{
  return users.find((user)=> user.id===id)
}
const getUsersInRoom=(room)=>{
  return users.filter((user)=>user.room===room)
}
module.exports={
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,

}
