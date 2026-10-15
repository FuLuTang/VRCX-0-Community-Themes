# P2B-4 资产变量抽取：核对与语义等价报告

## 汇总：变量、data URI 字节数与样式文件

| 变量名 | data URI 字节数（UTF-8） | 所属 style 文件 |
|---|---:|---|
| `--jk-asset-number-stepper-minus` | 161 | `06-panels-and-settings.css` |
| `--jk-asset-number-stepper-plus` | 172 | `06-panels-and-settings.css` |
| `--jk-asset-switch-knob-off-x` | 349 | `06-panels-and-settings.css` |
| `--jk-asset-switch-knob-off-x-2` | 349 | `06-panels-and-settings.css` |
| `--jk-asset-switch-knob-off-x-3` | 349 | `06-panels-and-settings.css` |
| `--jk-asset-switch-knob-off-x-4` | 349 | `06-panels-and-settings.css` |
| `--jk-asset-switch-knob-off-x-5` | 370 | `06-panels-and-settings.css` |
| `--jk-asset-switch-knob-on-heart` | 369 | `06-panels-and-settings.css` |
| `--jk-asset-switch-thumb-off` | 3208 | `06-panels-and-settings.css` |
| `--jk-asset-switch-thumb-on-heart` | 2107 | `06-panels-and-settings.css` |
| `--jk-asset-scrollbar-thumb-vertical` | 258 | `06-panels-and-settings.css` |
| `--jk-asset-scrollbar-thumb-horizontal` | 618 | `06-panels-and-settings.css` |
| `--jk-asset-scroll-area-thumb-vertical` | 258 | `06-panels-and-settings.css` |
| `--jk-asset-scroll-area-thumb-horizontal` | 618 | `06-panels-and-settings.css` |
| `--jk-asset-progress-pink-cells` | 316 | `06-panels-and-settings.css` |
| `--jk-asset-lace-tile` | 894 | `08-chrome-r7.css` |
| `--jk-asset-user-dialog-banner-hem-lace` | 264 | `10-login-and-dialogs.css` |
| `--jk-asset-loader-pixel-sheet` | 28602 | `12-loader-and-forms.css` |
| `--jk-asset-user-dialog-banner-hem-lace-2` | 2690 | `15-late-components.css` |
| `--jk-asset-pixel-heart` | 450 | `15-late-components.css` |
| `--jk-asset-pixel-heart-2` | 463 | `15-late-components.css` |
| `--jk-asset-pixel-heart-3` | 548 | `15-late-components.css` |
| `--jk-asset-lace-tile-2` | 510 | `15-late-components.css` |
| `--jk-asset-lace-tile-3` | 208 | `15-late-components.css` |
| `--jk-asset-toast-face` | 554 | `16-final-navigation.css` |
| `--jk-asset-toast-face-2` | 494 | `16-final-navigation.css` |
| `--jk-asset-toast-face-3` | 370 | `16-final-navigation.css` |
| `--jk-asset-toast-face-4` | 366 | `16-final-navigation.css` |
| `--jk-asset-toast-shock` | 550 | `16-final-navigation.css` |
| `--jk-asset-toast-shock-2` | 762 | `16-final-navigation.css` |
| `--jk-asset-toast-face-5` | 374 | `16-final-navigation.css` |
| `--jk-asset-toast-face-6` | 374 | `16-final-navigation.css` |
| `--jk-asset-phone-pixel-art` | 206 | `16-final-navigation.css` |
| `--jk-asset-phone-pixel-art-2` | 218 | `16-final-navigation.css` |
| `--jk-asset-phone-pixel-art-3` | 442 | `16-final-navigation.css` |
| `--jk-asset-phone-pixel-art-4` | 266 | `16-final-navigation.css` |
| `--jk-asset-phone-pixel-art-5` | 310 | `16-final-navigation.css` |
| `--jk-asset-phone-pixel-art-6` | 310 | `16-final-navigation.css` |

共 38 个定义及 38 个样式引用。data URI 字节数统计 URI 本身，不含 url(...) 包装。

## 逐替换点完整清单

每行对应一个被抽出的变量引用。行号为当前改造后 style 文件中的变量引用位置；声明列将变量展开回完整原始 url(...)。长 URI 仅在单元格中段截断，保留开头、结尾并标注省略及 URI 实际 UTF-8 字节数。

| 序号 | 所在 style 文件 | 行号 | 完整选择器 | 被替换声明的完整原文（URI 超长时标记中段省略） | 变量名 |
|---:|---|---:|---|---|---|
| 1 | `06-panels-and-settings.css` | 226 | `[data-slot=progress-indicator]` | `background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 8' shape-rendering='cri…[中间省略；data URI 316 B]…8v1h-8zM0 6h8v1h-8z'/%3E%3Cpath fill='%23b35aa0' d='M0 7h8v1h-8z'/%3E%3C/svg%3E") 0 50%/10px 8px repeat-x` | `--jk-asset-progress-pink-cells` |
| 2 | `06-panels-and-settings.css` | 222 | `[data-orientation=horizontal]>[data-slot=scroll-area-thumb]` | `background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 6' shape-rendering='cris…[中间省略；data URI 618 B]…h-1zM4 4h1v1h-1zM7 4h1v1h-1zM1 5h1v1h-1zM4 5h1v1h-1zM7 5h1v1h-1z'/%3E%3C/svg%3E")` | `--jk-asset-scroll-area-thumb-horizontal` |
| 3 | `06-panels-and-settings.css` | 221 | `[data-slot=scroll-area-thumb]` | `background:#ff7fcf url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 8' shape-rendering='cris…[中间省略；data URI 258 B]…%3Cpath fill='%23fdf4ff' d='M0 1h6v1h-6zM0 4h6v1h-6zM0 7h6v1h-6z'/%3E%3C/svg%3E") 50% 50%/6px 8px no-repeat` | `--jk-asset-scroll-area-thumb-vertical` |
| 4 | `06-panels-and-settings.css` | 209 | `::-webkit-scrollbar-thumb:horizontal` | `background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 6' shape-rendering='cris…[中间省略；data URI 618 B]…h-1zM4 4h1v1h-1zM7 4h1v1h-1zM1 5h1v1h-1zM4 5h1v1h-1zM7 5h1v1h-1z'/%3E%3C/svg%3E")` | `--jk-asset-scrollbar-thumb-horizontal` |
| 5 | `06-panels-and-settings.css` | 208 | `::-webkit-scrollbar-thumb` | `background:#ff7fcf url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 8' shape-rendering='cris…[中间省略；data URI 258 B]…%3Cpath fill='%23fdf4ff' d='M0 1h6v1h-6zM0 4h6v1h-6zM0 7h6v1h-6z'/%3E%3C/svg%3E") 50% 50%/6px 8px no-repeat` | `--jk-asset-scrollbar-thumb-vertical` |
| 6 | `06-panels-and-settings.css` | 198 | `[data-slot=switch-thumb][data-checked]` | `background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' shape-rendering='cr…[中间省略；data URI 2107 B]…4 7h1v1h-1zM13 8h1v1h-1zM13 9h1v1h-1zM12 10h1v1h-1zM9 13h1v1h-1z'/%3E%3C/svg%3E")` | `--jk-asset-switch-thumb-on-heart` |
| 7 | `06-panels-and-settings.css` | 197 | `[data-slot=switch-thumb]` | `background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' shape-rendering='cr…[中间省略；data URI 3208 B]…1v1h-1z'/%3E%3Cpath fill='%23fbeed4' d='M8 8h2v1h-2zM8 9h2v1h-2z'/%3E%3C/svg%3E") 0 0/18px 18px no-repeat` | `--jk-asset-switch-thumb-off` |
| 8 | `06-panels-and-settings.css` | 194 | `[data-slot=switch][data-checked]::before` | `background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 5' shape-rendering='cris…[中间省略；data URI 369 B]…h-1zM5 3h1v1h-1zM8 3h1v1h-1zM1 4h2v1h-2zM5 4h1v1h-1zM8 4h1v1h-1z'/%3E%3C/svg%3E") 0 0/9px 5px no-repeat` | `--jk-asset-switch-knob-on-heart` |
| 9 | `06-panels-and-settings.css` | 193 | `[data-slot=switch]::before` | `background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 5' shape-rendering='cri…[中间省略；data URI 370 B]…h-1zM5 3h1v1h-1zM9 3h1v1h-1zM1 4h2v1h-2zM5 4h1v1h-1zM9 4h1v1h-1z'/%3E%3C/svg%3E") 0 0/12px 5px no-repeat` | `--jk-asset-switch-knob-off-x-5` |
| 10 | `06-panels-and-settings.css` | 189 | `:root` | `--pc-rt:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' shape-rendering='cr…[中间省略；data URI 349 B]…0e8' d='M2 2h10v10H2z'/%3E%3Cpath d='M6 4h1v1h1v1h1v2H8v1H7v1H6z'/%3E%3C/svg%3E")` | `--jk-asset-switch-knob-off-x-4` |
| 11 | `06-panels-and-settings.css` | 189 | `:root` | `--pc-lt:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' shape-rendering='cr…[中间省略；data URI 349 B]…0e8' d='M2 2h10v10H2z'/%3E%3Cpath d='M5 6h1V5h1V4h1v6H7V9H6V8H5z'/%3E%3C/svg%3E")` | `--jk-asset-switch-knob-off-x-3` |
| 12 | `06-panels-and-settings.css` | 189 | `:root` | `--pc-dn:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' shape-rendering='cr…[中间省略；data URI 349 B]…0e8' d='M2 2h10v10H2z'/%3E%3Cpath d='M4 6h6v1H9v1H8v1H6V8H5V7H4z'/%3E%3C/svg%3E")` | `--jk-asset-switch-knob-off-x-2` |
| 13 | `06-panels-and-settings.css` | 189 | `:root` | `--pc-up:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 14' shape-rendering='cr…[中间省略；data URI 349 B]…0e8' d='M2 2h10v10H2z'/%3E%3Cpath d='M6 5h2v1h1v1h1v1H4V7h1V6h1z'/%3E%3C/svg%3E")` | `--jk-asset-switch-knob-off-x` |
| 14 | `06-panels-and-settings.css` | 138 | `[data-slot=number-field-increment]::before` | `mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 3h4v2H2zM3 2h2v4H3z'/%3E%3C/svg%3E")` | `--jk-asset-number-stepper-plus` |
| 15 | `06-panels-and-settings.css` | 137 | `[data-slot=number-field-decrement]::before,[data-slot=number-field-increment]::before` | `mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8' shape-rendering='crispEdges'%3E%3Cpath fill='%23000' d='M2 3h4v2H2z'/%3E%3C/svg%3E") 0 0/8px 8px no-repeat` | `--jk-asset-number-stepper-minus` |
| 16 | `08-chrome-r7.css` | 37 | `:root` | `--r8-lace-tile: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2…[中间省略；data URI 894 B]…TEyIDZoMXYxaC0xek0xNSA2aDF2MWgtMXpNOCA3aDF2MWgtMXpNMTEgN2gxdjFoLTF6Ii8+PC9zdmc+")` | `--jk-asset-lace-tile` |
| 17 | `10-login-and-dialogs.css` | 304 | `.entity-dialog [data-slot="card-header"] > div.relative > [data-slot="button"][class*="aspect-[4/3]"] > span.relative.size-full::after` | `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6…[中间省略；data URI 264 B]…5H8V1.5H9V0.5H10' fill='none' stroke='%23F3ADD9' stroke-width='1'/%3E%3C/svg%3E")` | `--jk-asset-user-dialog-banner-hem-lace` |
| 18 | `12-loader-and-forms.css` | 8 | `:root` | `--jk-loader-sheet: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmgAAABICAMAAAB1AvlkAAADAFBMVEVMaXFgR2zq4uvv7fLu8vabsN…[中间省略；data URI 28602 B]…n+t4XT7/jUu17E1rQhFLavPuTeN2P8ThLbLDVqW/odoa2vdkhDgHwGyzNa2yWt5AAAAAElFTkSuQmCC")` | `--jk-asset-loader-pixel-sheet` |
| 19 | `15-late-components.css` | 139 | `:root` | `--jk-r97-lace-px:url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 8' shape-rendering='crispEdges'><path d='M0 0h16v3H0M1 3h14v1H1M1 4h6v1H1M9 4h6v1H9M2 5h5v1H2M9 5h5v1H9M3 6h10v1H3M5 7h6v1H5'/></svg>")` | `--jk-asset-lace-tile-3` |
| 20 | `15-late-components.css` | 138 | `:root` | `--jk-r97-card-charm:url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 8' shape-rendering='crisp…[中间省略；data URI 510 B]…13 5h2v1H13M9 6h5v1H9'/><path fill='%23d97fc6' d='M7 5h1v1H7M2 6h6v1H2'/></svg>")` | `--jk-asset-lace-tile-2` |
| 21 | `15-late-components.css` | 74 | `.vrcx-0-titlebar[data-app-titlebar]` | `--jk-r97-heart-l:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='9' shape-rendering='…[中间省略；data URI 548 B]…1v1h-1z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h2v1h-2zM1 2h1v1h-1z'/%3E%3C/svg%3E")` | `--jk-asset-pixel-heart-3` |
| 22 | `15-late-components.css` | 74 | `.vrcx-0-titlebar[data-app-titlebar]` | `--jk-r97-heart-m:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='8' shape-rendering='…[中间省略；data URI 463 B]…2v1h-2z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h2v1h-2zM1 2h1v1h-1z'/%3E%3C/svg%3E")` | `--jk-asset-pixel-heart-2` |
| 23 | `15-late-components.css` | 74 | `.vrcx-0-titlebar[data-app-titlebar]` | `--jk-r97-heart-s:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='7' shape-rendering='c…[中间省略；data URI 450 B]…3v1h-3zM4 5h1v1h-1z'/%3E%3Cpath fill='%23fdf4ff' d='M1 1h1v2h-1z'/%3E%3C/svg%3E")` | `--jk-asset-pixel-heart` |
| 24 | `15-late-components.css` | 2 | `.entity-dialog [data-slot="card-header"]>div.relative:has(>button[class*="aspect-[4/3]"][aria-label]):has(>.absolute.bottom-3.left-3.z-30.size-16)` | `--r96-banner-frame-image:url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMjgiIGhlaW…[中间省略；data URI 2690 B]…iIvPjxyZWN0IHg9IjMyMSIgeT0iMjQxIiB3aWR0aD0iMiIgaGVpZ2h0PSIyIi8+PC9nPjwvc3ZnPg==")` | `--jk-asset-user-dialog-banner-hem-lace-2` |
| 25 | `16-final-navigation.css` | 124 | `:root` | `--r10-phone-glow-bright-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAiU…[中间省略；data URI 310 B]…ZlfiRGkNLLwi0iTO7KsaVnbkzti69cDkL+qW3k4e4avEmuwEjsP/y1DgjLYhIEAAAAASUVORK5CYII=")` | `--jk-asset-phone-pixel-art-6` |
| 26 | `16-final-navigation.css` | 123 | `:root` | `--r10-phone-glow-dim-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAANCAYAAACZ3F9/AAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAiE…[中间省略；data URI 310 B]…ysxgpRGFn4RaXJHljUta3tyR2z9egDyV3UrD2fP8FViDVZi5wEUSjRIvXPXfgAAAABJRU5ErkJggg==")` | `--jk-asset-phone-pixel-art-5` |
| 27 | `16-final-navigation.css` | 122 | `:root` | `--r10-phone-front-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAMCAMAAACZS1ciAAAAOVBMVEX48PpbtOJmc6p7X4CHpdmlfu…[中间省略；data URI 266 B]…NpjYGBmBiEmBgYOZg4GBkZmBjBgYeADUZ9YGBh+gRhMEGGiaZg5AI2eAjg3jxg8AAAAAElFTkSuQmCC")` | `--jk-asset-phone-pixel-art-4` |
| 28 | `16-final-navigation.css` | 121 | `:root` | `--r10-phone-char-back-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAOVBMVEX48PpbtOJmc6p7X4CHpdmlfu…[中间省略；data URI 442 B]…bR5BloNiZa/uHfIT8KW2dyiw8uJgL/bm9iLuLlOWy7foL4Kk2/2A6G2RQ0tdWSWAAAAAElFTkSuQmCC")` | `--jk-asset-phone-pixel-art-3` |
| 29 | `16-final-navigation.css` | 120 | `:root` | `--r10-phone-gaze-forward-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAYAAACzzX7wAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAARElEQVQImWOojm/4n1a86n9kyuT/X7bfBGNkMYZHTx/8b1968395z6H//1//gmOYGFjB7rv/wRhZAUyM4e/fvygS6BgABRFtDO096wwAAAAASUVORK5CYII=")` | `--jk-asset-phone-pixel-art-2` |
| 30 | `16-final-navigation.css` | 119 | `:root` | `--r10-phone-gaze-mid-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAECAYAAACzzX7wAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAPElEQVQImWOojm/4n1a8Coy/bL8JxshiDI+ePvjfvvQmGP9//QuOYWJgBbvv/gdjZAUwMYa/f/+iSKBjAFkPbfLX39LgAAAAAElFTkSuQmCC")` | `--jk-asset-phone-pixel-art` |
| 31 | `16-final-navigation.css` | 94 | `:root` | `--r10-toast-warning-ring-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAuU…[中间省略；data URI 374 B]…Zcf0dayB4y2llaAnrXaMDWDtRWgB32ua/vMgWqmZDoEOfvc6e0GTu4KRqxySbcAAAAASUVORK5CYII=")` | `--jk-asset-toast-face-6` |
| 32 | `16-final-navigation.css` | 93 | `:root` | `--r10-toast-info-ring-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAuU…[中间省略；data URI 374 B]…y4/oq1lDxhtLa0APWu1YWoGKytAD/pc1/aZA9VMyXQIcva509sN2LAGU+4btdMAAAAASUVORK5CYII=")` | `--jk-asset-toast-face-5` |
| 33 | `16-final-navigation.css` | 61 | `:root` | `--r10-toast-shock-ring-mask: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABgCAYAAADm4nCVAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAB3U…[中间省略；data URI 762 B]…EfA/yqNhpXZfJXu7gPaPTCZzWPn7gPaPTCZzWPn7gPaPTCZzbPrAyVApOVXHmSVAAAAAElFTkSuQmCC")` | `--jk-asset-toast-shock-2` |
| 34 | `16-final-navigation.css` | 60 | `:root` | `--r10-toast-shock-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAABPU…[中间省略；data URI 550 B]…oAwPBQDqfpqEiQXzahAmziApYqBEqrZH9m3+DDWnupn/e0wf82OYBkkii6CAXMAAAAASUVORK5CYII=")` | `--jk-asset-toast-shock` |
| 35 | `16-final-navigation.css` | 9 | `:root` | `--r10-toast-error-ring-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAs0…[中间省略；data URI 366 B]…ggYYa16wNPWygzQs5Y1Uz1YmgF6UJtn64YNVU8Jaw/ZQXad271doLh4+prx93AAAAAASUVORK5CYII=")` | `--jk-asset-toast-face-4` |
| 36 | `16-final-navigation.css` | 8 | `:root` | `--r10-toast-success-ring-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAAtU…[中间省略；data URI 370 B]…/edTW5bIEKOKZvk/Vp2mXKrkgnooXac5YVO/BHqXQttnnun+QH56DcU93KK1wAAAABJRU5ErkJggg==")` | `--jk-asset-toast-face-3` |
| 37 | `16-final-navigation.css` | 5 | `:root` | `--r10-toast-error-face-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAABEk…[中间省略；data URI 494 B]…bMgEBrcxEFX+AOaPsC6DZgmGKQoXz2arg3ejKW7+qB/O9SvtTd4eyFNZRXZ3gAAAABJRU5ErkJggg==")` | `--jk-asset-toast-face-2` |
| 38 | `16-final-navigation.css` | 4 | `:root` | `--r10-toast-success-face-png: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAAACXBIWXMAAAPoAAAD6AG1e1JrAAABP0…[中间省略；data URI 554 B]…pCnMwRNdcMkYXVg3QLMqQNbb0BTXlcY23sxTl3Vb/q3w/y17QjDXyUWZSx1OwAAAABJRU5ErkJggg==")` | `--jk-asset-toast-face` |


## 方法与验证结果

验证脚本 `refactor/tools/verify-asset-vars.mjs` 读取 08 变量定义、遍历全部 style 文件并按变量逐一展开；原始基准从 `git show HEAD:design-specs/jirai-kei-theme/runtime/preview-package/jirai-kei-theme/theme.css` 读取，在内存中按 extract-style 的冻结资源/keyframes 精确锚点剔除，未写入临时目录或覆盖任何 CSS。

1. 数量：原始样式层 data URI 38 处；展开后 38 处；变量定义/引用 38/38。数量均为 38：**通过**。
2. 多重集（包括重复值及出现次数）完全相同：**通过**；逐项比较完整 URI 字符串，data URI 内容逐字节相同：**通过**。
3. 规范化 hash：各 URI 以 UTF-8 字节长度前缀编码后排序、以 LF 连接再算 SHA-256。改造前 5a155a848acc56b2526b1a2cc15e1a3e5b60e3c093cd0abe86cbdcde7bfaadf9；变量展开后 5a155a848acc56b2526b1a2cc15e1a3e5b60e3c093cd0abe86cbdcde7bfaadf9；相等：**是**。
4. 规则上下文：选择器从规则块前置文本提取，先剔除 CSS 注释，再从嵌套规则栈跳过 at-rule 前置层；不使用贪婪正则。非规则块替换点：0。全部落在规则块内；其中 :root 下自定义属性声明按真实 :root 选择器列出。

5. 幂等性：对全部 16 个 src/style CSS、08-asset-vars.css 及本报告，在二次执行前后分别计算 SHA-256；摘要集合相同：**是**。二次执行实际输出：`Already extracted; no inline data URI remains.`。因此这是脚本识别到无内联 data URI 后的真实 no-op，未改动这些文件。

结论：语义等价验证 **通过**。未发现需标记的不等价替换点。
