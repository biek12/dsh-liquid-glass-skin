import { writeFile } from 'node:fs/promises';
// Original soft two-note bell, generated locally; no downloaded audio or autoplay dependency.
const rate=44100, duration=.8, count=Math.floor(rate*duration), wav=Buffer.alloc(44+count*2);
wav.write('RIFF',0);wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(count*2,40);
for(let i=0;i<count;i++){
 const t=i/rate;let value=0;
 for(const [start,freq] of [[0,659.25],[.18,880]]){
  const age=t-start;if(age<0)continue;
  const envelope=Math.min(1,age/.018)*Math.exp(-age*7)*Math.min(1,(duration-t)/.06);
  value+=(Math.sin(2*Math.PI*freq*age)+.18*Math.sin(2*Math.PI*freq*2*age))*envelope*.14;
 }
 wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value))*32767),44+i*2);
}
await writeFile('lib/notification-chime.wav',wav);
