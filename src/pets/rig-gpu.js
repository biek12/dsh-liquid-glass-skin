import { RIGS } from './rig.js';

const f = n => Number(n).toFixed(5);
const vec = a => `vec${a.length}(${a.map(f).join(',')})`;
// The shader uses the same inverse local deformation as the CPU QA renderer.
// Its texture coordinates always address the fixed reference, never a fitted frame.
export function createGpuRig(id, base, closed) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false, preserveDrawingBuffer: true });
  if (!gl) return null;
  const rig = RIGS[id], pin = id === 'nori' ? [145, 183] : id === 'yuki' ? [149, 176] : [100, 210];
  const vertex = 'attribute vec2 a;varying vec2 uv;void main(){uv=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
  const weights = rig.parts.map((p, i) => `float w${i}=1.-ease((length((p-${vec(p.slice(0,2))})/${vec(p.slice(2,4))})-.25)/.85);w${i}*=pinned;`).join('\n');
  const moves = rig.parts.map((p, i) => `s-=vec2(-(p.y-${f(p[5])}),p.x-${f(p[4])})*w${i}*angles[${i+1}];`).join('\n');
  const eyes = rig.eyes.map(e => `{
    vec2 d=s-${vec(e.center)};d.y-=d.x*${f(e.slope)};
    float r=length(d/${vec(e.radius)});
    if(r<1.){
      float aperture=max(.001,1.-blink);
      float inside=(1.-ease((abs(d.y)/${f(e.radius[1])}-aperture*.78)/.12))*(1.-ease((blink-.9)/.1));
      vec2 lidPoint=${vec(e.source)}+d*${vec(e.sourceRadius.map((n,i)=>n/e.radius[i]))};lidPoint.y+=d.x*${f(e.slope)};
      vec2 eyePoint=vec2(s.x,${f(e.center[1])}+d.y/max(.08,aperture)+d.x*${f(e.slope)});
      float mask=(1.-ease((r-.78)/.22))*ease(blink/.18);
      vec3 eye=texture2D(openTex,(eyePoint+.5)/256.).rgb;
      vec3 lid=texture2D(closedTex,(lidPoint+.5)/256.).rgb;
      color.rgb=mix(color.rgb,mix(lid,eye,inside),mask);
    }
  }`).join('\n');
  const fragment = `precision highp float;varying vec2 uv;uniform sampler2D openTex;uniform sampler2D closedTex;uniform float angles[6];uniform float blink;uniform float reach;
    float ease(float v){v=clamp(v,0.,1.);return v*v*(3.-2.*v);}
    void main(){vec2 p=uv*256.-.5;float pinned=ease((length(p-${vec(pin)})-7.)/9.);
      float head=(1.-ease((p.y-${f(rig.head[2])})/${f(rig.head[3]-rig.head[2])}))*pinned*${id==='mizu'?'.35':'1.'};
      ${weights}
      vec2 s=p-vec2(-(p.y-${f(rig.head[1])}),p.x-${f(rig.head[0])})*head*angles[0];
      ${moves}
      s.y-=max(w3,w4)*reach;
      vec4 color=texture2D(openTex,(s+.5)/256.);
      if(blink>0.){${eyes}}
      gl_FragColor=color;
    }`;
  function shader(type, source) {
    const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
    if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  let program, buffer; const textures=[], shaders=[];
  try {
    program=gl.createProgram(); shaders.push(shader(gl.VERTEX_SHADER,vertex),shader(gl.FRAGMENT_SHADER,fragment));
    for(const s of shaders)gl.attachShader(program,s);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const a=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    for(const [i,pixels] of [base,closed].entries()){
      const tex=gl.createTexture();textures.push(tex);gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,tex);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,256,256,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(pixels));
      gl.uniform1i(gl.getUniformLocation(program,i?'closedTex':'openTex'),i);
    }
  } catch {
    dispose(); return null;
  }
  const angle=gl.getUniformLocation(program,'angles[0]'), blink=gl.getUniformLocation(program,'blink'), reach=gl.getUniformLocation(program,'reach');
  function dispose(){for(const tex of textures)gl.deleteTexture(tex);for(const s of shaders)gl.deleteShader(s);if(program)gl.deleteProgram(program);if(buffer)gl.deleteBuffer(buffer);gl.getExtension('WEBGL_lose_context')?.loseContext();}
  return { canvas, draw(pose){if(gl.isContextLost())throw new Error('Pet GPU context lost');gl.uniform1fv(angle,[pose.head,pose.earLeft,pose.earRight,pose.tail,pose.paw,pose.otherPaw]);gl.uniform1f(blink,pose.blink);gl.uniform1f(reach,pose.reach);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}, dispose };
}
