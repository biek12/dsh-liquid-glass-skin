export const DESKTOP_PATH = '/plugins/dsh-liquid-glass/v1/desktop';
export async function desktopRequest(action) {
  const response = await fetch(DESKTOP_PATH,{method:action?'POST':'GET',headers:{'X-DSH-Liquid-Glass':'1',...(action?{'Content-Type':'application/json'}:{})},...(action?{body:JSON.stringify({action})}:{})});
  const value=await response.json();if(!response.ok)throw new Error(value.error||'桌面窗口暂时不可用');return value;
}
