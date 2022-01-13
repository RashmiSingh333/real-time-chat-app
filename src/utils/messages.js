const generateMessage=(username,text)=>{
  return {
    username,
    text,
    createdAt:new Date().getTime()
  }
}
const generateLocationMessage=(username,url)=>{
  return {
    username,
    url,
    createdAt:new Date().getTime()
  }
}
const generateImage=(username,src)=>{
  return {
    username,
    src,
    createdAt:new Date().getTime()
  }
}
module.exports={
  generateMessage,
  generateLocationMessage,
  generateImage
}
