const N=14;
// 5-wide strips, rounded caps (drop the two outermost corner pixels of each end)
const inA=(x,y)=>{if(x<0||y<0||x>=N||y>=N)return false;const v=x-y,u=x+y;if(Math.abs(v)>2)return false;if(u<2||u>24)return false;if((u<=3||u>=23)&&Math.abs(v)===2)return false;return true;};
const inB=(x,y)=>{if(x<0||y<0||x>=N||y>=N)return false;const v=x+y-13,u=x-y;if(Math.abs(v)>2)return false;if(u<-11||u>11)return false;if((u<=-10||u>=10)&&Math.abs(v)===2)return false;return true;};
const n4=(f,x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>f(x+a,y+b));
const dotsA=new Set(['3,2','2,3','4,4','11,10','10,11','9,9'].map(String)),dotsB=new Set(['10,2','11,3','9,4','2,10','3,11','4,9']);
const g=[];
for(let y=0;y<N;y++){let r='';for(let x=0;x<N;x++){let c='.';const k=x+','+y;
 if(inA(x,y)){ const v=x-y,cv=x+y-13; if(Math.abs(cv)<=2&&Math.abs(v)<=1) c=(Math.abs(cv)===2||Math.abs(v)===1&&Math.abs(cv)===2)?'G':(Math.abs(cv)===2?'G':'g'); else if(dotsA.has(k)) c='d'; else c=v===-2?'h':(v===2?'s':'t'); }
 else if(n4(inA,x,y)) c='o';
 else if(inB(x,y)){ const v=x+y-13; if(dotsB.has(k)) c='d'; else c=v===-2?'H':(v===2?'S':'b'); }
 else if(n4(inB,x,y)) c='o';
 r+=c;}g.push(r);}

export default g;
