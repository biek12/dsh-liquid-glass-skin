import { createDesktopPet } from '../src/pets/desktop-host.js';
import { createStateHandler } from '../src/http.js';
import { emptyState } from '../src/model.js';
let state=emptyState();state.preferences.petDesktop=true;
const handler=createStateHandler({read:()=>state,write:async next=>{state=next;desktop.sync(next.preferences);},catalog:()=>[]});
const desktop=createDesktopPet({stateHandler:handler,read:()=>state,getBalance:async()=>null,assets:new URL('../lib/desktop/',import.meta.url)});
await desktop.start();console.log('Desktop pet demo started with isolated preferences and no account.');
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await desktop.stop();process.exit(0);});
