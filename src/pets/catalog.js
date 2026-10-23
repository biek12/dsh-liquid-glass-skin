import nori from '../../assets/pets/nori.png';
import yuki from '../../assets/pets/yuki.png';
import mizu from '../../assets/pets/mizu.png';
import noriBase from '../../assets/pets/rig/nori-base.png';
import yukiBase from '../../assets/pets/rig/yuki-base.png';
import mizuBase from '../../assets/pets/rig/mizu-base.png';
import noriClosed from '../../assets/pets/rig/nori-closed.png';
import yukiClosed from '../../assets/pets/rig/yuki-closed.png';
import mizuClosed from '../../assets/pets/rig/mizu-closed.png';
const noriSheet = { base: noriBase, closed: noriClosed };
const yukiSheet = { base: yukiBase, closed: yukiClosed };
const mizuSheet = { base: mizuBase, closed: mizuClosed };

export const PETS = [
  { id: 'nori', name: '糯米', subtitle: '奶油小猫 · 温柔陪伴', image: nori, clips: noriSheet, accent: '#cf9d86', moves: '短眨眼 · 歪头轻招 · 提起垂爪', lines: ['喵～你来啦，今天也陪着你。', '摸摸头，再一起把事情做好。', '我把尾巴收好，给你的灵感让位置。', '不着急，先伸个懒腰吧。'], dragLines: ['喵呜！轻一点，我的爪爪～', '被你拎起来啦，尾巴也要跟上！', '这里看得更远一点，喵。'], landLines: ['爪爪着地，继续陪你。', '这里不错，我就坐这儿啦。'] },
  { id: 'yuki', name: '月白', subtitle: '云朵小狐 · 安静灵动', image: yuki, clips: yukiSheet, accent: '#a69acb', moves: '闭眼浅笑 · 侧耳歪头 · 收爪摆尾', lines: ['听见你来啦，耳朵都竖起来了。', '尾巴很软，要靠一会儿吗？', '慢慢来，我陪你把思路理顺。', '今天的灵感，藏在哪里呢？'], dragLines: ['尾巴收好～我们要飞去哪里？', '耳朵迎着风，尾巴跟着你。', '抱紧小爪爪，准备换个地方。'], landLines: ['落在这里，刚刚好。', '尾巴铺好了，继续听你说。'] },
  { id: 'mizu', name: '泡泡', subtitle: '蓝色小鲸 · 轻盈自在', image: mizu, clips: mizuSheet, accent: '#87b7d7', moves: '鳍尾轻摆 · 眨眼挥鳍 · 提起划鳍', lines: ['噗噜～灵感准备好出航了吗？', '给你挥挥小鳍，今天也加油。', '累了就漂一会儿，我替你守着。', '慢一点游，也能到想去的地方。'], dragLines: ['哇！小鳍划起来，出发！', '转个弯，我们向灵感游过去。', '鼓起小脸，漂浮加速～'], landLines: ['到站啦，小鳍歇一会儿。', '这里风平浪静，适合陪着你。'] },
];
