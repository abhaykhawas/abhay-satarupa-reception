'use strict';
const stars=document.querySelector('.sparkles');
for(let i=0;i<20;i++){const dot=document.createElement('span');dot.className='sparkle';dot.style.cssText=`left:${8+(i*37%85)}%;top:${20+(i*19%62)}%;animation-delay:-${i*.53}s`;stars.append(dot);}
const dialog=document.getElementById('calendar-dialog');
document.getElementById('calendar-button').addEventListener('click',()=>dialog.showModal());
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
const calendarParams=new URLSearchParams({action:'TEMPLATE',text:'Abhay & Satarupa — Wedding Reception',dates:'20261213T133000Z/20261213T133000Z',ctz:'Asia/Kolkata',location:'Jalsa Marriage Garden, Dhanbad, Jharkhand',details:'Join us for an evening of love, laughter and new memories. Reception starts at 7:00 PM IST.\nVenue: https://maps.app.goo.gl/BVMMUKogsKH8GNff9\nGuest assistance: +91 7779991571'});
document.getElementById('google-calendar').href='https://calendar.google.com/calendar/render?'+calendarParams;
// Original piano-like music. Try autoplay; browsers may require a first interaction.
let audio,master,reverb,timer,playing=false,step=0;
const chords=[[48,55,60,64],[45,52,57,60],[53,60,65,69],[43,50,55,59]];
const melody=[76,74,72,67,69,72,76,74,72,71,69,64,67,69,72,71,69,67,65,60,64,65,69,67,67,71,74,72,71,67,62,67];
function initAudio(){audio=new(window.AudioContext||window.webkitAudioContext)();master=audio.createGain();master.gain.value=.65;master.connect(audio.destination);reverb=audio.createConvolver();const length=audio.sampleRate*3,impulse=audio.createBuffer(2,length,audio.sampleRate);for(let c=0;c<2;c++){const data=impulse.getChannelData(c);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/length,3)*.25;}reverb.buffer=impulse;reverb.connect(master);}
function note(midi,velocity=.1){const t=audio.currentTime,f=440*2**((midi-69)/12),voice=audio.createGain();voice.gain.setValueAtTime(0,t);voice.gain.linearRampToValueAtTime(velocity,t+.008);voice.gain.exponentialRampToValueAtTime(.0001,t+3.2);voice.connect(master);voice.connect(reverb);[[1,1],[2,.25],[3,.08],[4,.025]].forEach(([harmonic,level])=>{const osc=audio.createOscillator(),gain=audio.createGain();osc.type='sine';osc.frequency.value=f*harmonic;gain.gain.value=level;osc.connect(gain);gain.connect(voice);osc.start(t);osc.stop(t+3.3);});setTimeout(()=>voice.disconnect(),3500);}
function tick(){const chord=chords[Math.floor(step/8)%4];note(chord[[0,1,2,3,2,1,2,3][step%8]],.055);if(step%2===0)note(melody[Math.floor(step/2)%melody.length],.065);step++;}
async function stopMusic(){
 playing=false;
 clearInterval(timer);
 if(audio)await audio.suspend();
}
async function startMusic(){
 if(playing||document.hidden)return;
 try{
  if(!audio)initAudio();
  await audio.resume();
  if(playing||document.hidden||audio.state!=='running')return;
  playing=true;
  tick();
  timer=setInterval(tick,560);
 }catch{
  // Autoplay can be blocked until a guest interacts with the page.
 }
}
// Keep the fallback within a real user gesture for mobile autoplay policies.
for(const event of ['pointerdown','touchend','keydown']){
 document.addEventListener(event,startMusic,{passive:true});
}
document.addEventListener('visibilitychange',()=>{
 if(document.hidden)stopMusic();else startMusic();
});
startMusic();
