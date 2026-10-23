import createUpstream from './vendor/context-client.cjs';
const CONFIG_IDS = ['super-nexusx-local', 'super-nexusx', 'dsh-super-nexusx', 'liquid-glass-local', 'liquid-glass', 'dsh-liquid-glass'];
export function contextPlugin() {
  const wrap = ctx => new Proxy(ctx, { get(target, key) {
    if (key === 'inject') return (deps, callback) => target.inject(deps, scope => callback(wrap(scope)));
    if (key === 'configForms') {
      const forms = target.configForms;
      const namespace = () => {
        const served = forms.describe?.().getSnapshot()?.view?.namespaces?.map(item => item.ns) ?? [];
        return CONFIG_IDS.find(id => served.includes(id)) ?? 'super-nexusx';
      };
      return new Proxy(forms, { get(form, prop) {
        if (prop === 'get') return id => id === 'dsh-context' ? new Proxy({}, {get: (_, method) => (...args) => form.get(namespace())[method](...args)}) : form.get(id);
        if (prop === 'whileServed') return (ids, callback) => form.whileServed(ids.flatMap(id => id === 'dsh-context' ? CONFIG_IDS : [id]), callback);
        const value = form[prop]; return typeof value === 'function' ? value.bind(form) : value;
      }});
    }
    if (key === 'slots') return new Proxy(target.slots, { get(slots, prop) {
      if (prop === 'register') return (options, component) => slots.register(options.name === 'plugins.bundle.config' && options.key === 'dsh-context' ? {...options,key:'dsh-super-nexusx'} : options, component);
      const value = slots[prop]; return typeof value === 'function' ? value.bind(slots) : value;
    }});
    if (key === 'get') return name => {
      const value = target.get(name);
      if (name !== 'pluginNavigation' || !value) return value;
      return new Proxy(value, {get: (nav, prop) => prop === 'openBundle' ? id => nav.openBundle(id === 'dsh-context' ? 'dsh-super-nexusx' : id) : nav[prop]});
    };
    const value = target[key]; return typeof value === 'function' ? value.bind(target) : value;
  }});
  return {name:'liquid-glass-context', inject:['slots','locale'], apply(ctx) {
    if (ctx.slots.entries('conversation.chat.assistant-actions').some(entry => entry.options.id === 'context-jump')) return;
    const existing = new Set(document.querySelectorAll('style[data-plugin="dsh-context"]'));
    const upstream = createUpstream();
    const owned = [...document.querySelectorAll('style[data-plugin="dsh-context"]')].filter(tag => !existing.has(tag));
    ctx.effect(() => () => owned.forEach(tag => tag.remove()));
    upstream.apply(wrap(ctx));
  }};
}
