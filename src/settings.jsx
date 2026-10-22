import React, { useState } from 'react';
import { Icon, useSource } from './ui.jsx';
import { PRESENTATION_DEFAULTS } from './model.js';

export function Settings({ controller, skin, appearance }) {
  const runtime = useSource(controller); const p = runtime.state.preferences;
  const theme = useSource(appearance); const [appearanceError, setAppearanceError] = useState('');
  const busy = runtime.saving || runtime.loading;
  const set = patch => controller.mutate({ type: 'preferences', patch }).catch(() => {});
  const toggle = (key, title, hint, change) => <label className="lg-setting-row" key={key}><span>{title}<small>{hint}</small></span><input type="checkbox" checked={p[key]} disabled={busy} onChange={e => change ? change(e.target.checked).catch(() => {}) : set({ [key]: e.target.checked })}/></label>;
  const select = (key, title, hint, choices) => <label className="lg-setting-row"><span>{title}<small>{hint}</small></span><select value={p[key]} disabled={busy} onChange={e => set({ [key]: e.target.value })}>{choices.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
  return <section className="lg-settings" aria-label="Liquid Glass 主题设置">
    <header><Icon name="glass" size={22}/><div><h2>Liquid Glass</h2><p>外观调整即时生效，并保存在本机。</p></div></header>
    <fieldset><legend>外观与目录</legend>
      {toggle('theme', '启用主题', '使用 Liquid Glass 玻璃材质与动效。', value => skin.choose(value))}
      <div className="lg-setting-row lg-appearance-row"><span>外观模式<small>与 DSH 外观同步；跟随系统时自动切换。</small></span><div className="lg-appearance-modes" role="group" aria-label="外观模式">{[['light', '明亮'], ['dark', '暗黑'], ['system', '跟随系统']].map(([mode, label]) => <button type="button" key={mode} aria-pressed={theme.preference === mode} disabled={busy || theme.changing} onClick={async () => { try { await appearance.select(mode); setAppearanceError(''); } catch (error) { setAppearanceError(error.message); } }}>{label}</button>)}</div></div>
      {select('glass', '玻璃材质', '侧栏和菜单的透光程度。', [['frosted', '通透磨砂'], ['solid', '实色清晰']])}
      {toggle('tree', '工作区子目录', '关闭后使用原生工作区视图，已存分类保留。')}
      {select('density', '目录密度', '紧凑模式可展示更多会话。', [['comfortable', '舒适'], ['compact', '紧凑']])}
      {toggle('showTags', '展示行内标签', '只调整展示，标签和筛选条件仍保留。')}
      {toggle('showCounts', '展示目录会话数', '控制目录行右侧的数量。')}
    </fieldset>
    <fieldset><legend>动态效果</legend>
      {select('motion', '动效强度', '系统启用“减少动态效果”时，优先使用静态效果。', [['full', '流动'], ['soft', '轻柔'], ['off', '关闭']])}
      {toggle('orb', '主页光球', '关闭后主页保留标题与输入框。')}
      {toggle('statusGlow', '思考与工具状态动效', '控制等待栏的渐变文字、文字切换与轮换圆点动画。')}
      {toggle('hoverLine', '会话悬停光线', '光线从会话下方中间向两侧展开。')}
    </fieldset>
    <footer><button className="lg-secondary" disabled={busy} onClick={() => set({ ...PRESENTATION_DEFAULTS })}>恢复外观默认</button><span role="status">{runtime.saving ? '正在保存…' : '分类、标记与主题启用状态不会被重置。'}</span></footer>
    {runtime.error && <p role="alert" className="lg-error">{runtime.error}</p>}
    {appearanceError && <p role="alert" className="lg-error">{appearanceError}</p>}
  </section>;
}
export function FooterToggle({ controller, wide = true }) {
  const { state, saving, loading } = useSource(controller);
  const label = state.preferences.tree ? '返回默认' : '返回目录树';
  return <button className={`lg-utility-action ${!wide ? 'lg-utility-rail' : ''}`} title={label} aria-label={label} disabled={saving || loading} onClick={() => controller.mutate({ type: 'preferences', patch: { tree: !state.preferences.tree } }).catch(() => {})}><Icon name="folder" size={16}/>{wide && label}</button>;
}
