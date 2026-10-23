import React, { useState } from 'react';
import { PETS } from '../src/pets/catalog.js';
import { PetSprite } from '../src/pets/animation.jsx';

export function PetLab() {
  const [state, setState] = useState('idle'), [scrub, setScrub] = useState(null);
  return <main style={{ padding: 32, color: '#42485c', background: '#edf0f7', minHeight: '100vh', boxSizing: 'border-box', font: '14px/1.6 system-ui' }}>
    <h1>宠物动作检查 · 固定基准 v3</h1>
    <p>身体固定；眼睑、头、耳、尾巴与鳍局部运动。拖动和松手过渡在主预览中检查。</p>
    <nav style={{ display: 'flex', gap: 12 }}>{['idle', 'hover', 'drag', 'land'].map(value => <button key={value} aria-pressed={state === value} onClick={() => { setState(value); setScrub(0); }}>{value}</button>)}<button onClick={() => setScrub(null)}>播放</button><button onClick={() => setScrub(0)}>暂停到起点</button></nav>
    <label>时间（毫秒） <input aria-label="动作时间" type="number" min="0" max="10000" step="50" value={scrub ?? 0} onChange={e => setScrub(Number(e.target.value))}/></label>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, marginTop: 24 }}>{PETS.map(pet => <article key={pet.id} data-pet={pet.id} style={{ padding: 20, background: '#f8f9fc', borderRadius: 24 }}><strong>{pet.name}</strong><div style={{ width: 256, height: 256 }}><PetSprite pet={pet} state={state} scrub={scrub}/></div><p>{pet.moves}</p></article>)}</div>
    <p><a href="/?qa-rig-v3">打开真实交互预览</a></p>
  </main>;
}
