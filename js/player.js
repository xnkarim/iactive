class Player{
  constructor(rootId,src,title){
    this.player = new Audio()
    this.timeMouseDown = false
    this.volumeMouseDown = false
    this.isRateListActive = false
    this.isVolumeControlActive = false
    this.src = src
    this.player.loop = true
    this.rootPrefix = rootId.slice(1)
    this.root = document.querySelector(rootId)
    this._title = this.root.querySelector('.title')
    this.btnPlay = this.root.querySelector('.play')
    this.btnVolume = this.root.querySelector('.volume')
    this.btnDownload = this.root.querySelector('.download')
    this.btnUpload = this.root.querySelector('.upload')
    this.volumeLine = this.root.querySelector('.volume_progress_bar')
    this.volumeProgress = this.root.querySelector('.volume_control')
    this.volumeProgressLine = this.root.querySelector('.volume_progress_line')
    this.volumeControl = this.root.querySelector('.volume_progress_control')
    this.timeProgress = this.root.querySelector('.progress')
    this.timeLine = this.root.querySelector('.progress_line')
    this.timeControl = this.root.querySelector('.progress_control')
    this.pastTime = this.root.querySelector('.past_time')
    this.restTime = this.root.querySelector('.rest_time')
    this.currentRate = this.root.querySelector('.current_rate')
    this.rateList = this.root.querySelector('.rate_list')
    this.rateRadio = this.root.getElementsByClassName('radio_input')
    this.title = title

    this.initPlayer();
  }
  get title(){
    return this._title;
  }
  set title(value){
    this._title.innerHTML = value
  }
  get src(){
    return this.player.src
  }
  set src(value){
    this.player.src = value
  }
  initListeners(){
    this.btnPlay.addEventListener('click', this.play.bind(this))
    this.btnVolume.addEventListener('click',this.showVolumeControl.bind(this))
    this.btnDownload.addEventListener('click',this.download.bind(this))
    this.btnUpload.addEventListener('click',this.upload.bind(this))
    this.timeProgress.addEventListener('mousedown', this.setTimeClick.bind(this))
    this.timeProgress.addEventListener('mousedown', ()=>{this.timeMouseDown = true})
    this.timeProgress.addEventListener('mousemove', this.setTimeMove.bind(this))
    this.volumeProgress.addEventListener('mousedown',this.setVolumeClick.bind(this))
    this.volumeProgress.addEventListener('mousedown', ()=>{this.volumeMouseDown = true})
    this.volumeProgress.addEventListener('mousemove', this.setVolumeMove.bind(this))
    document.addEventListener('mouseup', ()=>{  this.timeMouseDown = this.volumeMouseDown = false})
    this.currentRate.addEventListener('click',this.showRateList.bind(this))
    this.player.addEventListener('timeupdate',this.updateTime.bind(this))
    for(let i=0; i< this.rateRadio.length;i++){
      this.rateRadio[i].addEventListener('click',this.setRate.bind(this))
    }
  }
  play(event){
    event.preventDefault();
    if(this.player.paused){
      let btnClassList = this.btnPlay.querySelector('.fa-play').classList
      btnClassList.remove('fa-play')
      btnClassList.add('fa-pause')
      this.player.play()
    }else if(this.player.ended){
      alert("asd")
    }else{
      let btnClassList = this.btnPlay.querySelector('.fa-pause').classList
      btnClassList.remove('fa-pause')
      btnClassList.add('fa-play')
      this.player.pause()
    }
  }
  setTimeClick(event){
    this.setTime(event)
  }
  setTimeMove(event){
    if(this.timeMouseDown)
      this.setTime(event)
  }
  onTimeUp(event){
    this.timeMouseDown = false
  }
  setTime(event){
    let x
    let timeProgressWidth = this.timeProgress.offsetWidth

    if (event.pageX) {
        x = event.pageX
    } else {
        x = event.clientX
    }

    let nowWidth = x - this.timeProgress.getBoundingClientRect().left
    let setWidth = (nowWidth * 100) / timeProgressWidth

    this.timeLine.style.width = setWidth + '%'
    this.timeControl.style.left = setWidth+'%'
    this.player.currentTime = (setWidth * this.player.duration) / 100
  }
  setVolumeClick(event){
    this.setVolume(event)
  }
  setVolumeMove(event){
    if(this.volumeMouseDown)
      this.setVolume(event)
  }
  setVolume(event){
    let x
    let volumeLineWidth = this.volumeLine.offsetWidth

    if (event.pageX) {
        x = event.pageX
    } else {
        x = event.clientX
    }

    let nowWidth = x - this.volumeLine.getBoundingClientRect().left
    let setWidth = (nowWidth * 100) / volumeLineWidth
    setWidth = (setWidth>100)? 100:setWidth;
    setWidth = (setWidth<0)? 0:setWidth;
    this.volumeProgressLine.style.width = setWidth + '%'
    this.volumeControl.style.left = (setWidth-12)+'%'
    this.player.volume = setWidth / 100
  }
  updateTime(){
    let percentPastTime = this.player.currentTime*100/this.player.duration

    this.timeLine.style.width = percentPastTime + '%'
    this.timeControl.style.left = percentPastTime+'%'

    let pastMinutes = Math.floor(this.player.currentTime/60)
    let pastSeconds = Math.floor(this.player.currentTime-pastMinutes*60)
    let restMinutes = Math.floor((this.player.duration-this.player.currentTime)/60)
    let restSeconds = Math.floor((this.player.duration-this.player.currentTime) - restMinutes*60)
    if(pastMinutes<10) pastMinutes = "0"+pastMinutes
    if(pastSeconds<10) pastSeconds = "0"+pastSeconds
    if(restMinutes<10) restMinutes = "0"+restMinutes
    if(restSeconds<10) restSeconds = "0"+restSeconds
    this.pastTime.innerHTML = pastMinutes+":"+pastSeconds
    this.restTime.innerHTML = restMinutes+":"+restSeconds
  }
  setRate(event){
    debugger
    this.player.playbackRate = event.target.value
    this.currentRate.innerHTML = event.target.value+"x"
    this.showRateList();
  }
  showRateList(){
    debugger
    if(!this.isRateListActive){
      this.rateList.classList.add('active');
      this.isRateListActive = true
    }else{
      this.rateList.classList.remove('active');
      this.isRateListActive = false
    }
  }
  showVolumeControl(event){
    event.preventDefault()
    if(!this.isVolumeControlActive){
      this.volumeProgress.classList.add('active')
      this.isVolumeControlActive = true
    }else{
      this.volumeProgress.classList.remove('active')
      this.isVolumeControlActive = false
    }
  }
  download(event){
    event.preventDefault()
    window.location.href = this.player.src
  }
  upload(event){
    event.preventDefault()
    alert('uploading file')
  }
  static create(rootId){
    let rootElement = document.querySelector(rootId)
    const rootPrefix = rootId.slice(1)
    const radioClass = rootPrefix+'_'+'radio_input'

    rootElement.innerHTML = `<div class="player">
    <div class="title" oncopy="return false">Название дорожки</div>
    <div class="controls">
      <a href="#" class="play"><i class="fa fa-play"></i></a>
      <span class="time past_time">00:00</span>
      <div class="progress">
        <div class="progress_bar" data-progress="6rem">
          <div class="progress_line"></div>
          <div class="progress_control"></div>
        </div>
      </div>
      <span class="time rest_time">00:00</span>
      <div class="rate_picker">
        <div class="rate_list">
          <div class="radio">
            <input class="radio_input" name="rate" id="${rootPrefix}_rate05" type="radio" value="0.5">
            <label class="radio_label" for="${rootPrefix}_rate05">0.5x</label>
          </div>
          <div class="radio">
            <input checked class="radio_input" name="rate" id="${rootPrefix}_rate1" type="radio" value="1">
            <label class="radio_label" for="${rootPrefix}_rate1">Normal</label>
          </div>
          <div class="radio">
            <input class="radio_input" name="rate" id="${rootPrefix}_rate125" type="radio" value="1.25">
            <label class="radio_label" for="${rootPrefix}_rate125">1.25x</label>
          </div>
          <div class="radio">
            <input class="radio_input" name="rate" id="${rootPrefix}_rate15" type="radio" value="1.5">
            <label class="radio_label" for="${rootPrefix}_rate15">1.5x</label>
          </div>
          <div class="radio">
            <input class="radio_input" name="rate" id="${rootPrefix}_rate175" type="radio" value="1.75">
            <label class="radio_label" for="${rootPrefix}_rate175">1.75x</label>
          </div>
          <div class="radio">
            <input class="radio_input" name="rate" id="${rootPrefix}_rate2" type="radio" value="2">
            <label class="radio_label" for="${rootPrefix}_rate2">2x</label>
          </div>
          <div class="radio">
            <input class="radio_input" name="rate" id="${rootPrefix}_rate25" type="radio" value="2.5">
            <label class="radio_label" for="${rootPrefix}_rate25">2.5x</label>
          </div>
        </div>
      </div>
      <span class="current_rate">1x</span>
      <div class="sub-controls">
        <a href="#" class="volume"><i class="fa fa-volume-up"></i></a>
        <div class="volume_control">
          <div class="volume_progress_bar">
            <div class="volume_progress_line"></div>
            <div class="volume_progress_control"></div>
          </div>
        </div>
        <a href="#" class="upload"><i class="fa fa-eject"></i></a>
        <a href="#" class="download"><i class="fa fa-download"></i></a>
      </div>
    </div>
  </div>`
  }
  initPlayer() {
    this.initListeners()
  }
}