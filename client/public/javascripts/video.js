/**
 * video player part
 */

 const controlParam= {
  action: '',
  time: '',
}

const player = document.getElementById('video-player');

player.addEventListener('pause', (e)=>{
  e.preventDefault();
  controlParam.action = 'pause';
  controlParam.time = player.currentTime;
  controlParam.user = user_id;
  sendMessage(controlParam);
})

player.addEventListener('play', (e)=>{
  e.preventDefault();
  controlParam.action = 'play';
  controlParam.time = player.currentTime;
  controlParam.user = user_id;
  sendMessage(controlParam);
})

function sendMessage(controlParam){
  const params = JSON.stringify(controlParam)
  socket.emit('video-control', params);
}

function seekVideo(){
  this.player.pause();
  this.controlParam.action = 'seek';
  this.controlParam.time = player.currentTime;
  this.controlParam.user = user_id;
  sendMessage(controlParam);
}

socket.on('video-control', (res) =>{
  const result = JSON.parse(res);
  if (result.user !== user_id) {
      const {action} = result;
      if(action === 'play'){
          player.currentTime = result.time+ 0.2; //播放时+0.2秒，抵消网络延迟
          player.play();
      }
      else if(action === 'pause'){
          // console.log('pause');
          player.currentTime = result.time;
          player.pause();
      }
  }
})
