#!/usr/bin/env python3
"""Build the R3 body subset without changing the smaller chrome-only originals."""
from pathlib import Path
import base64, json
from fontTools import subset
from fontTools.ttLib import TTFont
HERE=Path(__file__).resolve().parent
FONTS=HERE.parent/'fonts'
SOURCE=Path('/tmp/pixfont/dl/fus12p-ttf/fusion-pixel-12px-proportional-zh_hans.ttf')
base={ord(c) for c in (FONTS/'charset.txt').read_text() if c not in '\r\n'}
# Curated practical corpus: UI charset, GB2312, common Big5, both JIS levels,
# Latin/IPA, punctuation and Japanese syllabaries. Intersect with source cmap below.
requested=set(base)
def decode_grid(codec, rows, cols):
    for row in rows:
        for col in cols:
            try:
                text=bytes((row,col)).decode(codec)
                requested.update(map(ord,text))
            except UnicodeDecodeError:
                pass
# GB2312 all characters (level 1 + level 2)
decode_grid('gb2312',range(0xB0,0xF8),range(0xA1,0xFF))
# Big5 common characters
decode_grid('big5',range(0xA4,0xC7),list(range(0x40,0x7F))+list(range(0xA1,0xFF)))
# JIS X 0208 first and second levels
decode_grid('euc_jp',range(0xB0,0xF5),range(0xA1,0xFF))
for start,end in [(0x0020,0x007E),(0x00A0,0x024F),(0x2000,0x206F),(0x3000,0x30FF),(0xFF01,0xFF9F)]:
    requested.update(range(start,end+1))
font=TTFont(SOURCE)
source_points=set(font.getBestCmap())
selected=requested & source_points
options=subset.Options()
options.flavor='woff2';options.hinting=False;options.desubroutinize=True
worker=subset.Subsetter(options=options)
worker.populate(unicodes=sorted(selected));worker.subset(font)
font.flavor='woff2'
out=FONTS/'fusion-pixel-body-subset.woff2'
font.save(out)
actual=set(TTFont(out).getBestCmap())
assert selected <= actual
(FONTS/'charset-body.txt').write_text(''.join(chr(n) for n in sorted(selected))+'\n')
ascii_bytes=(FONTS/'silkscreen-ascii.woff2').read_bytes()
body_bytes=out.read_bytes()
css='/* R3 expanded body font subset; Fusion Pixel / Silkscreen, SIL OFL 1.1. Full notices embedded by build-runtime.mjs. */\n'
for name,data in [('WD Pixel',ascii_bytes),('WD Pixel CJK',body_bytes)]:
    css+='@font-face{font-family:"'+name+'";font-style:normal;font-weight:400;font-display:swap;src:url("data:font/woff2;base64,'+base64.b64encode(data).decode()+'") format("woff2");}\n'
# Strict estimate from the last validated theme, replacing only font data; allow CSS additions 24 KiB.
previous=json.loads((HERE/'build-report.json').read_text())
# The previous package already embeds fonts-body.css once built; subtract the section actually used.
font_section=next((s['bytes'] for s in previous.get('sections',[]) if s['name']=='fonts'),None)
licenses=sum(len(('/*! Bundled font license\n'+(FONTS/n).read_text().replace('*/','* /')+'\n*/').encode()) for n in ['OFL-Fusion-Pixel.txt','OFL-Silkscreen.txt'])+2
old_font_css=font_section-licenses if font_section else (FONTS/'fonts.css').stat().st_size
estimate=previous['cssBytes']-old_font_css+len(css.encode())+24576
report={'source':str(SOURCE),'requestedPoints':len(requested),'sourceAvailableSelected':len(selected),'woff2Bytes':len(body_bytes),'cssBytes':len(css.encode()),'estimatedThemeBytesWith24KiBReserve':estimate,'hardLimit':1048576,'fitsBudgetWithReserve':estimate<=1048576,'samples':{s:{'missingAfterSubset':''.join(c for c in s if ord(c) not in actual and not(32<=ord(c)<=126))} for s in ['二階堂アコ','雪之夏萌心','冷風','皮卡丘','・','あいうえおカキクケコ','àâæçéèêëîïôœùûüÿ ÀÇÉŒ «»','abcdefghijklmnopqrstuvwxyz','ƒǎǐǒǔ']},'missingRequestedFromSourceCount':len(requested-source_points)}
(HERE/'body-font-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
if estimate>1048576:
    raise RuntimeError('Full BMP subset does not fit; do not integrate it. Narrow ranges and rebuild.')
(FONTS/'fonts-body.css').write_text(css)
print(json.dumps(report,ensure_ascii=False,indent=2))
