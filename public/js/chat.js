const socket=io()
//elements
const $messageForm=document.querySelector('#message-form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton=$messageForm.querySelector('button')
const $sendLocationButton=document.querySelector('#send-location')
const $leaveRoom=document.querySelector('#leave-room')
const $sendFileButton=document.querySelector('#send-file')
const $messages=document.querySelector('#messages')

//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationMessageTemplate=document.querySelector('#location-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML
const imageTemplate=document.querySelector('#image-template').innerHTML


const {username,room,password,confirm_password}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = () => {
 // New message element
 const $newMessage = $messages.lastElementChild
 // Height of the new message
 const newMessageStyles = getComputedStyle($newMessage)
 const newMessageMargin = parseInt(newMessageStyles.marginBottom)
 const newMessageHeight = $newMessage.offsetHeight + newMessageMargin
 // Visible height
 const visibleHeight = $messages.offsetHeight
 // Height of messages container
 const containerHeight = $messages.scrollHeight
 // How far have I scrolled?
 const scrollOffset = $messages.scrollTop + visibleHeight
 if (containerHeight - newMessageHeight <= scrollOffset) {
 $messages.scrollTop = $messages.scrollHeight
 }
}
socket.on('message',(message)=>{
  const html=Mustache.render(messageTemplate,{
    username:message.username,
    message:message.text,
    createdAt:moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend',html)
  autoscroll()
})
socket.on('locationMessage',(message)=>{
  const html=Mustache.render(locationMessageTemplate,{
    username:message.username,
    url:message.url,
    createdAt:moment(message.createdAt).format('h:mm a')
  })
  $messages.insertAdjacentHTML('beforeend',html)
  autoscroll()
})

socket.on('imageURL',(image)=>{
  const html=Mustache.render(imageTemplate,{
    username:image.username,
    src:image.src,
    createdAt:moment(image.createdAt).format('h:mm:a')
  })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
  const html=Mustache.render(sidebarTemplate,{
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML=html
})
document.querySelector('#message-form').addEventListener('submit',(e)=>{
  e.preventDefault()
  $messageFormButton.setAttribute('disabled','disabled')
  const message=document.querySelector('input').value
  socket.emit('sendMessage',message,(error)=>{
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''
    $messageFormButton.focus()

    if(error){
      console.log(error);
    }
    console.log('Message delivered')
  })

})
let eventFire=false;
$sendFileButton.addEventListener('change',(event)=>{
  $sendFileButton.setAttribute('disabled','disabled')
  const fileList=event.target.files
  const reader=new FileReader
  reader.addEventListener('load',(event)=>{
    console.log("1",eventFire);
    eventFire=true
    console.log("2",eventFire);
    const file=event.target.result
    socket.emit('sendImage',file,()=>{
      $sendFileButton.removeAttribute('disabled')
      console.log("Image shared");
    })
  })
  reader.readAsDataURL(fileList[0])
})
$sendLocationButton.addEventListener('click',()=>{
  if(!navigator.geolocation){
    return alert("Geolocation is not supported by your browser")
  }
  $sendLocationButton.setAttribute('disabled','disabled')
  navigator.geolocation.getCurrentPosition((pos)=>{
    console.log("pos",pos);
  socket.emit('sendLocation',{
    latitude:pos.coords.latitude,
    longitude:pos.coords.longitude
  },()=>{
    $sendLocationButton.removeAttribute('disabled')
    console.log('Location Shared');
  })
  })
})

socket.emit('join',{username,room,password,confirm_password},(error)=>{
  if(error){
    alert(error)
    location.href='/'
  }
})
