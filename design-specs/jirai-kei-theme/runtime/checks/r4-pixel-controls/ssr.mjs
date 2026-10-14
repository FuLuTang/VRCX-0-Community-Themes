/* R4 SSR attribute probe — NOT WINDOWS. Real @base-ui/react from app node_modules. */
import {createRequire} from 'node:module';
const req=createRequire('/home/fulutang/Documents/Github/VRCX-0-jirai/package.json');
const React=req('react'),{renderToStaticMarkup:r}=req('react-dom/server'),h=React.createElement;
const {Switch}=req('@base-ui/react/switch'),{Progress}=req('@base-ui/react/progress'),{ScrollArea}=req('@base-ui/react/scroll-area');
const sw=p=>h(Switch.Root,{'data-slot':'switch','data-size':'default',...p},h(Switch.Thumb,{'data-slot':'switch-thumb'}));
const pr=v=>h(Progress.Root,{'data-slot':'progress',value:v},h(Progress.Track,{'data-slot':'progress-track'},h(Progress.Indicator,{'data-slot':'progress-indicator'})));
const out={version:req('@base-ui/react/package.json').version,
 swOff:r(sw({})),swOn:r(sw({defaultChecked:true})),swDis:r(sw({disabled:true,defaultChecked:true})),
 pr0:r(pr(0)),pr45:r(pr(45)),pr100:r(pr(100)),prNull:r(pr(null)),
 sa:r(h(ScrollArea.Root,{'data-slot':'scroll-area'},h(ScrollArea.Viewport,{'data-slot':'scroll-area-viewport'},'x'),h(ScrollArea.Scrollbar,{'data-slot':'scroll-area-scrollbar','data-orientation':'vertical',orientation:'vertical',keepMounted:true},h(ScrollArea.Thumb,{'data-slot':'scroll-area-thumb'}))))};
for(const[k,v]of Object.entries(out))console.log(k+': '+v);
