const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Keep the full card inside the viewport. Space next to the pet never dictates text height. */
export function placeBubble({ anchor, screen, width, height, preferred }) {
  const margin=12, gap=44;
  width=Math.max(1,Math.min(width,screen.width-margin*2));
  height=Math.max(1,Math.min(height,screen.height-margin*2));
  const petSize=anchor.bottom-anchor.top, petLeft=anchor.x-petSize/2, petRight=anchor.x+petSize/2;
  const positions={
    above:{left:anchor.x-width/2,top:anchor.top-gap-height},
    below:{left:anchor.x-width/2,top:anchor.bottom+gap},
    left:{left:petLeft-gap-width,top:(anchor.top+anchor.bottom-height)/2},
    right:{left:petRight+gap,top:(anchor.top+anchor.bottom-height)/2},
  };
  const order=[...new Set([preferred,'above','below','left','right'].filter(Boolean))];
  const candidates=order.map((side,priority)=>{
    const desired=positions[side];
    const left=clamp(desired.left,margin,Math.max(margin,screen.width-margin-width));
    const top=clamp(desired.top,margin,Math.max(margin,screen.height-margin-height));
    const overlapX=Math.max(0,Math.min(left+width,petRight)-Math.max(left,petLeft));
    const overlapY=Math.max(0,Math.min(top+height,anchor.bottom)-Math.max(top,anchor.top));
    const shift=Math.abs(left-desired.left)+Math.abs(top-desired.top);
    return {side,left,top,width,height,score:overlapX*overlapY*100+shift*10+priority};
  });
  return candidates.reduce((best,item)=>item.score<best.score?item:best);
}
