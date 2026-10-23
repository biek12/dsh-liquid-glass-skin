// Verified from DeepSeek's pricing page and Beijing's 2026 public holiday calendar.
export const PRICING_SOURCE = 'https://api-docs.deepseek.com/quick_start/pricing/';
export const HOLIDAY_SOURCE = 'https://english.beijing.gov.cn/workinginbeijing/laborrights/publicholidays/';
export const VERIFIED_AT = '2026-10-23';
const holidays = new Set([
  '01-01','01-02','01-03','02-15','02-16','02-17','02-18','02-19','02-20','02-21','02-22','02-23',
  '04-04','04-05','04-06','05-01','05-02','05-03','05-04','05-05','06-19','06-20','06-21',
  '09-25','09-26','09-27','10-01','10-02','10-03','10-04','10-05','10-06','10-07',
].map(day=>`2026-${day}`));
const chinaDate = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'});
function periodAt(now) {
  const day=now.getUTCDay(), hour=now.getUTCHours()+now.getUTCMinutes()/60;
  const holiday=holidays.has(chinaDate.format(now));
  return day>=1&&day<=5&&!holiday&&((hour>=1&&hour<4)||(hour>=6&&hour<10))?'peak':'offPeak';
}
export function officialRate(now = new Date()) {
  // A new year's holidays must be verified before displaying its billing clock.
  if (Number(chinaDate.format(now).slice(0,4))!==2026) return null;
  const period=periodAt(now); let next;
  for(let day=0;day<=9&&!next;day++) for(const hour of [0,1,4,6,10,16]){
    const at=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()+day,hour));
    if(at<=now||periodAt(at)===period)continue;
    next=at.getTime();break;
  }
  return {period,nextSwitch:next,source:PRICING_SOURCE,verifiedAt:VERIFIED_AT};
}
export function countdown(until, now = Date.now()) {
  if(!Number.isFinite(until))return '';
  const total=Math.max(0,Math.ceil((until-now)/1000));
  const hours=Math.floor(total/3600),minutes=Math.floor(total%3600/60),seconds=total%60;
  return [hours,minutes,seconds].map(n=>String(n).padStart(2,'0')).join(':');
}
