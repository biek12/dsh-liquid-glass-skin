import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRigRenderer, samplePose, RIGS } from '../src/pets/rig.js';
const out = new URL('../artifacts/pets/rig-v3/', import.meta.url);
await mkdir(out,{recursive:true});
for (const id of Object.keys(RIGS)) {
  const render=createRigRenderer(id,await readFile(new URL(`${id}-base.rgba`,out)),await readFile(new URL(`${id}-closed.rgba`,out)));
  for(const state of ['idle','hover','drag','land']) {
    const length=state==='idle'?RIGS[id].cycle:state==='hover'?2400:state==='drag'?2400:1000;
    const frames=[];for(let time=0;time<length;time+=50)frames.push(Buffer.from(render(samplePose(id,state,time))));
    await writeFile(new URL(`${id}-${state}-sequence.rgba`,out),Buffer.concat(frames));
  }
}
