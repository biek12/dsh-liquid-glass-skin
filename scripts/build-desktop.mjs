import {mkdir} from 'node:fs/promises';
import {spawn} from 'node:child_process';
await mkdir('lib/desktop',{recursive:true});
if(process.platform!=='darwin')throw new Error('macOS 桌面模块需要在 macOS 上编译');
const compiler=spawn('swiftc',['desktop/PetCompanion.swift','-O','-framework','AppKit','-framework','WebKit','-o','lib/desktop/PetCompanion'],{stdio:'inherit'});
compiler.on('exit',code=>{process.exitCode=code ?? 1;});
