# 头像框 / 图标替换：真实 DOM 与纯 CSS 可行性调研

调研目标：判断在「主题只能注入一个纯 CSS 文件、不能加 HTML、不能跑 JS」的约束下，
头像（方形 / 像素切角 / 描边 / 外框装饰 / 状态点方块）与图标（lucide 换图）能否用 CSS 做，
并给出每一处的可用选择器与证据行号。

- 主程序源码（只读快照）：`/home/fulutang/Documents/Github/VRCX-0-jirai`
- 已有布局调研：`../../vrcx-layout-reference.md`
- 调研时间：本会话；**主程序正在 git merge，本报告完全基于只读读取，未修改任何主程序文件、未构建、未执行 git 写操作。**

---

## 0. 方法与证据等级

| 证据等级 | 说明 | 本报告中的用法 |
| --- | --- | --- |
| A：真实渲染输出 | 用仓库内 `node_modules` 的 `react-dom/server` 渲染 React 组件，得到真实 HTML 字符串 | lucide `<svg>` 的 class、base-ui Avatar 的元素结构 |
| B：已构建产物 | `dist/` 下已存在的构建结果（2026-10-10 04:05 构建） | Tailwind v4 编译后的 CSS（`@layer`、`rounded-full` 展开值）、lucide class 拼接的逻辑片段 |
| C：源码静态分析 | JSX + 组件源码逐行阅读（JSX 决定 DOM，Tauri/React 无运行时改写结构） | 五个头像位置的组件链、尺寸、`overflow`、`z-index` |
| D：外部规范/文档 | MDN 等 | `mask` / `background-color` 的适用范围 |
| E：未确认 | 无证据或无法在本机验证 | 见 §5 |

本机**没有** Chromium / WebView2 / Playwright，因此没有「真实 DOM 快照」。凡涉及浏览器渲染行为（§3.6）均标注置信度。
验证 A 所用的命令（不落盘，`node -e` 直接执行）：

```bash
cd /home/fulutang/Documents/Github/VRCX-0-jirai
node --input-type=module -e "
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { BellIcon } from 'lucide-react';
console.log(renderToStaticMarkup(createElement(BellIcon, { className: 'size-4' })));
"
```

---

## 1. 两条全局前提（先看这个，它决定主题要不要 `!important`）

### 1.1 应用全部 CSS 都在 `@layer` 里 → 主题的「未分层 CSS」天然胜出

- Tailwind v4.3.3 输出（`dist/assets/index-Cckb3vVG.css:1` 头部）：`@layer properties` / `theme` / `base` / `components` / `utilities`。
- `src/styles/globals.css:537` = `@layer base {`（到 `:594` 结束）；`src/styles/globals.css:596` = `@layer components {`（到 `:1370` 结束）。
- 主题 CSS（`installed-theme` 层）是**原样文本**塞进 `<style>`，**不包 `@layer`**（`src/services/vrcx0CssLayerService.ts:50-53`）。

CSS 层叠规则：**未分层样式 > 分层样式**（同特异性时）。所以主题里写

```css
[data-slot="avatar"] { border-radius: 0; }
```

不需要 `!important` 就能压过 Tailwind 的 `.rounded-full`（两者特异性同为 0-1-0，但主题未分层）。

### 1.2 注入顺序与资源约束

- 五个 layer 的注入顺序：`background-image` → `installed-theme` → `local-theme-preview` → `user-override` → `vrcx-0-rgb`（`src/services/vrcx0CssLayerService.ts:7-13`），每个 layer 一个 `<style>` 追加到 `document.head` 末尾（`:44-54`），因此主题 CSS 在 `<link rel=stylesheet>` 之后。
- CSP（`src-tauri/tauri.conf.json:15-29`）只限制 `img-src` / `worker-src`，`img-src` 白名单含 `'self' https: data: blob: asset:`。
  → 主题 CSS 里用 **data URI 图片是允许的**；`https:` 远程图需要 manifest `remoteAssets: true`（见主题仓库 `CONTRIBUTING.md:73,85`）。
  → 没有 `default-src` / `style-src` 限制，内联 `<style>` 注入不受影响。
- **相对路径 `url()` 在安装主题里不可用**：重写函数 `rewriteLocalThemeAssetUrls`（`src/services/community-theme/styleLayers.ts:50-76`）只被本地预览调用（`src/services/community-theme/localPreview.ts:40`），安装主题的 CSS 快照直接注入，不做 base 解析。`shouldRewriteCssUrl`（`styleLayers.ts:43-48`）只重写「无 scheme、非 `/`、非 `\\`」的 URL，即 `data:` / `https:` 原样保留。

---

## 2. 头像

### 2.1 应用里有**两套**头像实现

#### A. shadcn `Avatar`（`src/ui/shadcn/avatar.tsx`，基于 `@base-ui/react/avatar` v1.8.0）

元素与 class 来源：

| 部件 | 元素 | `data-slot` | 关键 class（`avatar.tsx` 行号） |
| --- | --- | --- | --- |
| Root | `<span>` | `avatar` | `group/avatar after:border-border relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border`（`:14-22`）+ `data-size` |
| Image | `<img>` | `avatar-image` | `animate-in fade-in-0 aspect-square size-full rounded-full object-cover ...`（`:28-35`） |
| Fallback | `<span>` | `avatar-fallback` | `bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm ...`（`:44-50`） |
| Badge | `<span>` | `avatar-badge` | `bg-primary ... rounded-full bg-blend-color ring-2 ...`（`:57-67`，本仓库未见使用） |

base-ui 的元素类型有官方注释可证：`node_modules/@base-ui/react/avatar/root/AvatarRoot.d.ts`（`Renders a <span> element`）、`image/AvatarImage.d.ts`（`Renders an <img> element`）、`fallback/AvatarFallback.d.ts`（`Renders a <span> element`）。

证据 A（真实渲染，`new Avatar.Root > Avalar.Image + Avatar.Fallback`）：

```html
<span data-slot="avatar" data-size="default" class="group/avatar relative flex size-8 shrink-0 rounded-full select-none">
  <span data-slot="avatar-fallback" class="bg-muted flex size-full items-center justify-center rounded-full">FB</span>
</span>
```

> 注：SSR 阶段 `<img data-slot="avatar-image">` 不渲染（base-ui 用 `useImageLoadingStatus` 预加载，加载成功后才挂载 img）。浏览器里加载成功后 DOM 是 `span[data-slot=avatar] > img[data-slot=avatar-image]`。这是 base-ui 行为，未在本机运行时验证（等级 C+E）。

三个关键事实：

1. **Root 没有 `overflow-hidden`** → Root 上的伪元素、`box-shadow`、外扩装饰**不会被裁**。
2. **Root 的 `::after` 已经被占用**（画那圈 1px 边框，`after:border-border after:inset-0 after:rounded-full`）→ 主题还可以用 `::before`。
3. **圆角在两处**：Root 的 `rounded-full` + Image 的 `rounded-full`。
   Tailwind v4 编译值（证据 B，`dist/assets/index-Cckb3vVG.css`）：`.rounded-full{border-radius:2147483647px}`。
   → 只改 Root 不够，Image 自己也是圆的（因为 img 的 `border-radius` 会裁自己的内容）。

#### B. `UserStatusAvatar`（项目自定义，**不是** shadcn Avatar，`src/components/UserStatusAvatar.tsx:19-52`）

```html
<span class="relative flex size-9 shrink-0 items-center justify-center overflow-visible">   <!-- :20-25 外层 -->
  <span class="bg-muted relative z-0 flex size-full items-center justify-center overflow-hidden rounded-full border"> <!-- :26 内层裁切框 -->
    <img class="size-full object-cover" ... />            <!-- FadeInImage，:28-38 -->
    <!-- 或 fallback: <svg class="lucide lucide-user"> -->
  </span>
  {frame}  <!-- ProfileAvatarFrame：<span class="pointer-events-none block absolute -inset-[18.75%] z-5"><img class="size-full object-contain"></span> -->
  <span class="user-status-indicator online ... absolute -right-0.5 -bottom-0.5 z-10 size-3.75 border-background rounded-full border-3"></span> <!-- :47-50 -->
</span>
```

| 事实 | 证据 |
| --- | --- |
| 外层 `overflow-visible` → 伪元素/外扩装饰**不被裁** | `UserStatusAvatar.tsx:20-25` |
| 内层 `overflow-hidden rounded-full border` → 圆角与 1px 描边在这里，伪元素会被裁到框内 | `UserStatusAvatar.tsx:26` |
| 头像框（VRChat 装饰）是**真实 DOM 元素**（`span > img`），不是伪元素 | `ProfileDecorations.tsx:112-126`（`ProfileAvatarFrame` → `DecorationImage`），class 在 `:124` = `absolute -inset-[18.75%] z-5` |
| 状态点是**独立元素**（外层 span 的直接子级），不是头像内部的角标 | `UserStatusAvatar.tsx:47-50` |
| 外层容器是 `display:flex` → 伪元素必须 `position:absolute` 才不会变成 flex item | `UserStatusAvatar.tsx:21`（`relative flex`） |
| 内层是 `z-0`，frame 是 `z-5`，状态点 `z-10` → 主题伪元素想盖住图片需 `z-index` 位于两者之间 | `UserStatusAvatar.tsx:26,47` + `ProfileDecorations.tsx:124` |

### 2.2 五个指定位置的实际情况

| # | 位置 | 组件链（行号） | 头像 DOM 与尺寸 | 圆角来源 | `overflow-hidden`？ | 状态点 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **好友侧栏行头像** | `FriendsSidebarFriendRow.tsx:243-266`（`button[data-slot=button][data-variant=ghost][data-size=default]`，class 含 `relative isolate ... p-1.5`）→ `UserDetailContent`（`UserDetailTile.tsx:18-31`）→ `UserStatusAvatar` | 自定义 span 结构；默认 **`size-9` = 36px** | 内层 span `rounded-full` + 1px `border` | 外层 visible / 内层 hidden | 有，`.user-status-indicator`，`absolute -right-0.5 -bottom-0.5 z-10 size-3.75`（15px）+ `border-3 border-background` |
| 2 | **侧栏自己行头像** | `SidePanelSelfHeader.tsx:225-241`（`button.rounded-full.cursor-pointer` > `UserStatusAvatar className="size-10"`），整行根节点 `.vrcx-0-side-panel-self`（`:208`） | 自定义 span；**`size-10` = 40px** | 同上 | 同上 | 同上（`resolveSidebarStatusDotClassName`，`SidePanelSelfHeader.tsx:232-235`） |
| 3 | **好友动态表玩家头像** | 两种：`FeedTableParts.tsx:92`（`FeedUserLink` 定义）/ 渲染分支 `:157-224`，与 `:375`（`FeedUserAvatarButton`）/ 渲染分支 `:409-448`；尺寸 `avatarSize` 由密度决定（`:94` 默认 28 / `:376` 默认 32；实际 `FeedColumnItem.tsx:107` 传 `densityConfig.avatarSize`，compact=**32**、dense=隐藏，`src/features/feed/feedColumnsDensity.ts:38,51`） | **shadcn Avatar**：`span[data-slot=avatar]`（`size-8` 被 inline `style{height,width}` 覆盖）> `img[data-slot=avatar-image]` / `span[data-slot=avatar-fallback]`（内含 `svg.lucide-user`，`:204`/`:438`） | Root + Image 各自的 `rounded-full`，Root 另有 `::after` 1px 边框 | **都没有**（外层 Button 也无） | 无状态点 |
| 4 | **用户详情弹窗大头像** | `UserDialogHeaderMedia.tsx:87-114`：`div.absolute.bottom-3.left-3.z-30.size-16` > `Button.bg-background/90.relative.z-0.size-full.overflow-hidden.rounded-full.p-0.shadow-md`（有 frame 时 `border-0`，否则 `border-2 border-white`，`:96`）> `img.size-full.object-cover`（`:100-104`）；frame 装饰 `UserDialogProfileDecorationImage` `absolute -inset-3 z-10`（`:107-111`） | **裸 `<img>`**（FadeInImage），**64px（`size-16`）** | Button 的 `rounded-full` | **Button 有 `overflow-hidden`**（`:95`）；外层 `div.size-16` 没有 | 无（弹窗内的状态点另在标题行，`UserDialogHeaderSection.tsx:720-729`，`variant="inline"`，`size-2.5`） |
| 5 | **好友列表页头像** | `FriendListColumns.tsx:158-206`（列 id `avatar`，固定宽 90），cell 内直接 `<FadeInImage className="size-6 rounded-full object-cover">`（`:182`），无 wrapper；无图时 `<div class="bg-muted ... size-6 rounded-full"><svg class="lucide lucide-user size-3">` | **裸 `<img>`，24px（`size-6`）** | img 自身 `rounded-full` | 无 | 列内另有状态点，`FriendListColumns.tsx:279` |

补充：`UserStatusAvatar` 还被用于 `UserDetailTile`（世界弹窗实例列表 `WorldDialogInstanceUsers.tsx:269`、用户弹窗实体列表 `UserDialogEntityList.tsx:151`）与 `user-hover-card`（`UserHoverCardContent.tsx:184,220`）。

### 2.3 可行性判定

| 目标 | 判定 | 原因 / 坑 |
| --- | --- | --- |
| 方形 / 像素切角头像（`clip-path`） | **可行** | 但 `clip-path` 与 `border-radius` 是**取交集**：圆角还在，切角出不来。必须同时清掉圆角（Root/内层 span 的 `border-radius:0`，以及 Image 自己的 `rounded-full`）。见 §2.4 片段 |
| 外框描边 | **可行** | `border` / `box-shadow` / `outline` 画在盒子外沿，**不受 `overflow` 裁剪影响**。注意 `border` 参与盒模型（`box-sizing:border-box` 下会挤压内容），`box-shadow`/`outline` 不占布局，更适合加厚描边。shadcn Avatar 的 Root 已有 `::after` 1px 边框可直接改色/加粗 |
| 外框装饰（伪元素） | **分位置，部分可行** | ① shadcn Avatar Root：✅（无 overflow，`::after` 已被占用 → 用 `::before`）② `UserStatusAvatar` 外层 span：✅（`overflow-visible`，但要 `position:absolute`，因为父级是 flex）③ `UserStatusAvatar` 内层 span：❌ **会被 `overflow-hidden` 裁掉**（超出框的部分不可见）④ 弹窗大头像：挂在 `div.size-16` 上 ✅，挂在 Button 上 ❌（Button 有 `overflow-hidden`）⑤ 好友列表页裸 `<img>`：❌ **替换元素，`::before/::after` 不可靠**（规范上 replaced element 不生成可靠子内容），只能改 img 自身属性或用 `filter: drop-shadow()` |
| 状态点改像素方块 | **可行** | 状态点是**独立 span**，class 里有语义钩子 `.user-status-indicator` + `.online/.joinme/.askme/.busy/.offline`（`src/shared/utils/friendStatus.ts:13-31`、`src/domain/friends/presence.ts:79-115`），只需覆盖 `border-radius` / `border-width` / 尺寸。注意「active（hollow）」状态会渲染成**嵌套双层 span**（外层 `border-background rounded-full border-3`，内层 `absolute inset-0 rounded-full border-2`，`UserStatusDot.tsx:40-56`，内层在 `:51`）——要一起改才不会是「方块里套圆点」 |

### 2.4 每处的可用选择器

> 全部基于 class/属性，不依赖哈希类。`.vrcx-0-*` 是应用自有的 hook class（`VRCX-0-Themes-VSCode/docs/css-hooks.md` 收录了 `vrcx-0-side-panel` / `vrcx-0-data-table`；`vrcx-0-side-panel-self`、`vrcx-0-side-panel-rail` 未在该文档列出，属于源码内钩子：`SidePanelSelfHeader.tsx:208`、`SidePanel.tsx:499`）。

**(1)+(2) 侧栏行 / 自己行（`UserStatusAvatar`）** — 用「状态点是外层容器的直接子级」当锚点最稳：

```css
/* 头像外层容器（overflow-visible，可挂伪元素） */
.vrcx-0-side-panel span:has(> .user-status-indicator),
.vrcx-0-side-panel-self span:has(> .user-status-indicator) { /* 36px / 40px */ }

/* 内层圆形容器（真正裁切图片的那层） */
.vrcx-0-side-panel span:has(> .user-status-indicator) > span:not(.user-status-indicator) { }
```

更直白的写法（依赖 Tailwind 类名，稳定但不算契约）：

```css
.vrcx-0-side-panel span.overflow-visible > span.overflow-hidden.rounded-full,
.vrcx-0-side-panel-self span.overflow-visible > span.overflow-hidden.rounded-full { }
```

**(3) 好友动态表（shadcn Avatar）**：

```css
.vrcx-0-data-table [data-slot="avatar"]            /* Root，可挂 ::before 装饰 */
.vrcx-0-data-table [data-slot="avatar-image"]      /* img */
.vrcx-0-data-table [data-slot="avatar-fallback"]
```

**(4) 用户详情弹窗大头像**（无专用 hook，用 dialog content 作用域）：

```css
[data-slot="dialog-content"] .size-16 > button[data-slot="button"]      /* 圆形容器（有 overflow-hidden） */
[data-slot="dialog-content"] .size-16                                    /* 64px 定位容器，可挂伪元素 */
```

**(5) 好友列表页头像（裸 img）**：

```css
.vrcx-0-data-table [data-slot="table-cell"] img.rounded-full,
.vrcx-0-data-table [data-slot="table-cell"] img.size-6
```

**(6) 状态点（全应用）**：

```css
.user-status-indicator { border-radius: 0; }                 /* 方块化 */
.user-status-indicator > span { border-radius: 0; }          /* active 状态的内层 */
```

如果要限定在头像上，就加前缀 `.vrcx-0-side-panel` 等。

### 2.5 可复制的骨架片段（切角 + 描边 + 伪元素角标）

```css
/* 内层裁切框：清圆角 + 像素切角 */
.vrcx-0-side-panel span:has(> .user-status-indicator) > span:not(.user-status-indicator) {
  border-radius: 0;
  border: 2px solid var(--vrcx-0-jirai-frame, #7fd0ff);
  clip-path: polygon(25% 0, 75% 0, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0 75%, 0 25%);
}
/* 图片自身也是圆的，必须一起改 */
.vrcx-0-side-panel span:has(> .user-status-indicator) img { border-radius: 0; }

/* 外层容器挂装饰（不会被裁） */
.vrcx-0-side-panel span:has(> .user-status-indicator)::before {
  content: '';
  position: absolute;          /* 父级是 flex，必须脱离文档流 */
  inset: -3px;
  z-index: 6;                  /* 内层 z-0 / frame z-5 / 状态点 z-10 */
  pointer-events: none;
  background: linear-gradient(135deg, #7fd0ff, transparent 60%);
  clip-path: polygon(/* 角标形状 */);
}

/* shadcn Avatar（动态表） */
[data-slot="avatar"],
[data-slot="avatar-image"] { border-radius: 0; }
[data-slot="avatar"] { clip-path: polygon(20% 0, 80% 0, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0 80%, 0 20%); }
[data-slot="avatar"]::after { border-radius: 0; border-color: #7fd0ff; border-width: 2px; }  /* 覆盖已有描边伪元素 */
```

> 与 VRChat 自带头像框的关系：`ProfileAvatarFrame` 是 `z-5` 的 `span>img`，在 `UserStatusAvatar` 内部（`UserStatusAvatar.tsx:46` 的 `{frame}`）。
> 主题伪元素若 `z-index < 5` 会被玩家自带头像框盖住；`> 5` 则盖住它。**主题装饰不该无条件压过玩家自己的装饰**，建议 `z-index:1`（在图片之上、头像框之下）。

---

## 3. 图标

### 3.1 图标库与版本（有版本漂移，注意）

| 来源 | 值 |
| --- | --- |
| `package.json:96` 声明 | `"lucide-react": "^1.53.0"` |
| `package-lock.json:7002-7004` | 解析到 `1.53.0` |
| **`node_modules/lucide-react/package.json` 实际** | **`1.46.0`**（`node_modules/lucide-react` 是软链 → `node_modules/.pnpm/lucide-react@1.46.0_react@19.3.0/node_modules/lucide-react`） |
| `node_modules/.ignored/lucide-react` | `1.42.0`（pnpm 忽略目录，未被解析） |

**结论：本报告的行号/行为以实际安装的 1.46.0 为准。** 若将来重装依赖升到 1.53.x，class 拼接逻辑需重新确认（1.x 系列在 `buildLucideIconNode` 里统一处理，属于同一实现族，但未验证 1.53 源码）。

### 3.2 `<svg>` 上的 class 到底长什么样（有 `lucide-<kebab-name>`）

拼接逻辑（源码行号）：

- `dist/esm/createLucideIcon.mjs:13-27`：`createLucideIcon(iconDataOrName, ...)` → 组件把 `className` 透传给 `Icon`。
- `dist/esm/Icon.mjs:44-54`：`buildLucideIconForReact(icon, { ... className: mergeClasses(contextClass, className) ... })`。
- `dist/esm/shared/src/build/buildLucideIconNode.mjs:19-22`：
  ```js
  const aliasClassNames = icon.aliases?.filter(...).map((alias) => `lucide-${alias}`) ?? [];
  const iconClassNames = [...icon.name ? [`lucide-${icon.name}`] : [], ...aliasClassNames];
  const classNamesFromClassName = params.className?.split(" ").filter(Boolean) ?? [];
  const className = params.includeDefaultClasses === false
    ? mergeClasses(...classNamesFromClassName)
    : mergeClasses("lucide", ...iconClassNames, ...classNamesFromClassName);
  ```
- `icon.name` 是 **kebab-case**：`dist/esm/icons/bell.mjs` 里 `name: "bell"`；`dist/esm/createLucideIcon.mjs:14` + `shared/src/utils/toLucideIconData.mjs:15`（`name: toKebabCase(iconName)`）。
- `dist/esm/shared/src/utils/mergeClasses.mjs:29-31`：去空、去重、空格连接。

**证据 A（真实渲染输出）**：

```
BellIcon className="size-4" → <svg ... class="lucide lucide-bell size-4" aria-hidden="true">
MapPinnedIcon             → <svg ... class="lucide lucide-map-pinned" aria-hidden="true">
RssIcon data-icon="icon"  → <svg ... class="lucide lucide-rss" aria-hidden="true" data-icon="icon">
CircleIcon                → <svg ... class="lucide lucide-circle" aria-hidden="true">
```

**证据 B（已构建产物）**：`dist/assets/jsx-runtime-D25Iby2f.js` 内含同一逻辑 `o=e.aliases?.filter(...).map(e=>\`lucide-${e}\`)...s=[...e.name?[\`lucide-${e.name}\`]:[]...`。

**证据 C（应用自己就依赖这个 class）**：
- `src/components/layout/app-nav-menu/AppNavMenuIcons.tsx:13-14`：`navMenuLucideClassName = '[&_.lucide]:text-sidebar-foreground [&_.lucide]:opacity-65 hover:[&_.lucide]:...'`
- `src/lib/segmented-control.ts:13`：`[&_svg:not(.lucide):not([class*='opacity-'])]:opacity-80 [&_.lucide]:text-muted-foreground ...`
- `dist/assets/index-Cckb3vVG.css` 里 Tailwind 编译出的选择器仍以 `.lucide` 结尾（形如 `... :where([data-active]:not([data-active=false])) .lucide{...}`）。

→ **`svg.lucide-<name>` 是稳定可用的主题选择器**（`aria-hidden="true"` 也总是存在，因为 lucide 默认给无 a11y 属性的图标加 `aria-hidden`：`buildLucideIconNode.mjs:47-49`）。

**别名陷阱（很重要）**：部分图标 `name` 与 alias 不同，会输出两个 class。实测（等级 A）：

| 组件 | 实际 class |
| --- | --- |
| `HistoryIcon` | `lucide lucide-rotate-ccw-clock lucide-history` |
| `SquareTerminalIcon` | `lucide lucide-square-terminal lucide-terminal-square` |
| `UserRoundIcon` | `lucide lucide-user-round lucide-user-2` |
| `UserRoundCheckIcon` | `lucide lucide-user-round-check lucide-user-check-2` |
| `UsersRoundIcon` | `lucide lucide-users-round lucide-users-2` |
| `ContactRoundIcon` | `lucide lucide-contact-round lucide-contact-2` |
| `ChartBarIcon` | `lucide lucide-chart-bar lucide-bar-chart-horizontal` |
| `HouseIcon` | `lucide lucide-house lucide-home` |
| `SmileIcon` | `lucide lucide-face-slightly-smiling lucide-smile` |
| `PanelLeftIcon` | `lucide lucide-panel-left lucide-sidebar` |
| `SparklesIcon` | `lucide lucide-sparkles lucide-stars` |

→ 覆盖「历史」图标时 `.lucide-history` 和 `.lucide-rotate-ccw-clock` 都能命中；**不要**凭 icon key 猜 kebab 名。

### 3.3 左侧导航每一项实际渲染的图标

定义来源：`src/shared/constants/ui.ts:3-152`（`navDefinitions`，每项 `icon: 'lucide:XXX'`）+ `src/shared/constants/tools.ts`（`navIcon`）+ 默认布局与文件夹 `src/components/layout/navMenuModel.ts:138-176`。
注册表：`src/components/layout/navIconRegistry.ts:71-133`；白名单：`src/shared/constants/navIcons.ts:13-74`。

默认导航顺序（`navMenuModel.ts:138-176`）与图标：

| # | key | icon key | 渲染出的 class | 备注 |
| --- | --- | --- | --- | --- |
| 1 | `feed` | `Rss` | `lucide-rss` | |
| 2 | `friends-locations` | `MapPin` | `lucide-map-pin` | |
| 3 | `game-log` | `History` | `lucide-rotate-ccw-clock` `lucide-history` | 有别名 |
| 4 | `instance-history` | `TextSearch` | `lucide-text-search` | |
| 5 | `player-list` | `Gamepad2` | `lucide-gamepad-2` | |
| 6 | `search` | `Search` | `lucide-search` | |
| 7 | `browse-history` | `Footprints` | `lucide-footprints` | |
| 8 | 文件夹「收藏」 | `Star` | `lucide-star` | 文件夹图标，`navMenuModel.ts:152` |
| 8a | `favorite-friends` | `UserStar` | `lucide-user-star` | |
| 8b | `favorite-groups` | `UsersRound` | `lucide-users-round` `lucide-users-2` | 别名 |
| 8c | `favorite-worlds` | `MapPinned` | `lucide-map-pinned` | |
| 8d | `favorite-avatars` | `PersonStanding` | `lucide-person-standing` | |
| 9 | 文件夹「社交」 | `ContactRound` | `lucide-contact-round` `lucide-contact-2` | `navMenuModel.ts:165` |
| 9a | `friend-log` | `Logs` | `lucide-logs` | |
| 9b | `friend-list` | `UserRoundCheck` | `lucide-user-round-check` `lucide-user-check-2` | 别名 |
| 9c | `moderation` | `ShieldUser` | `lucide-shield-user` | |
| 10 | `notification` | `Bell` | `lucide-bell` | |
| 11 | `my-avatars` | `PersonStanding` | `lucide-person-standing` | |
| 12 | `activity` | `Activity` | `lucide-activity` | |
| 13 | `charts-mutual` | `Waypoints` | `lucide-waypoints` | |
| 14 | `charts-two-person` | `ArrowLeftRight` | **`lucide-circle`** ⚠️ | 见下 |
| 15 | `charts-timeline` | `TrendingUp` | **`lucide-circle`** ⚠️ | 见下 |
| 16 | `tools` | `Wrench` | `lucide-wrench` | |
| — | 自定义 dashboard 项 | `LayoutDashboard`（默认） | `lucide-layout-dashboard` | `src/shared/constants/dashboard.ts:3`；用户可自选白名单图标 |

⚠️ **`charts-two-person` / `charts-timeline` 实际画的是 `lucide-circle`**：
`ui.ts:132,139` 给的 `lucide:ArrowLeftRight` / `lucide:TrendingUp` **不在**白名单 `navIcons.ts:13-74` 里，`normalizeNavIconKey`（`navIcons.ts:101-116`）返回空串；`navMenuModel.ts:440-447` 拿到 `''`，渲染时 `NavIcon` 的 fallback 是 `DEFAULT_NAV_ICON_KEY` = `lucide:Circle`（`AppNavMenuIcons.tsx:23-31`、`navIcons.ts:3`）。
（交叉校验：`ui.ts`/`tools.ts`/`sidebarTabLayout.ts` 用到的 42 个 icon key 中，只有这两个不在注册表与白名单里。）

`tools` 页面里的工具项（`src/shared/constants/tools.ts:117-446`，会被 `...toolNavDefinitions` 追加进导航）用的是：
`Camera` `Images` `Package` `Folder` `Image` `Database` `ServerCog` `FileText` `DatabaseBackup` `Plug` `Archive` `SlidersHorizontal` `SquareTerminal`（别名 `lucide-terminal-square`）`ListChecks` `Rocket` `CalendarDays` `UsersRound` `MessageSquareText` `ShieldUser` `Users` `Contact` `Download` `Bot`。

完整白名单（用户可自选，主题可能遇到，全部实测 class 见下表）：Activity / Archive / Bell / BookOpen / Bot / Box / Boxes / CalendarDays / Camera / ChartBar / Circle / Compass / Contact / ContactRound / Cuboid / Database / DatabaseBackup / Download / FileText / Folder / Footprints / Gamepad2 / Gauge / Globe / Heart / History / House / Image / Images / LayoutDashboard / List / ListChecks / Logs / MapPin / MapPinned / MessageSquareText / Package / Palette / PanelLeft / PersonStanding / Plug / Rocket / Rss / Search / ServerCog / Settings / ShieldAlert / ShieldUser / SlidersHorizontal / Smile / SquareTerminal / Star / Tags / TextSearch / UserRound / UserRoundCheck / UserStar / Users / UsersRound / Waypoints / Wrench。

### 3.4 标题栏右侧按钮的图标

| 顺序/位置 | 图标组件 | class | 证据 |
| --- | --- | --- | --- |
| 快速搜索（宽按钮） | `SearchIcon` | `lucide-search` | `useTitleBarActions.tsx:487` |
| 通知 | `BellIcon` | `lucide-bell` | `useTitleBarActions.tsx:378` |
| 助手 | `SparklesIcon` | `lucide-sparkles` `lucide-stars` | `:513` |
| 主题切换 | `AnimatedThemeToggler`（内部 svg，见 `src/ui/shadcn/animated-theme-toggler.tsx`） | 未逐一确认，**非 lucide 包装**（组件自带 svg） | `:418-438` |
| 置顶 | `PinIcon` | `lucide-pin` | `:278` |
| 右栏开关 | `PanelRightIcon` / `PanelRightOpenIcon` | `lucide-panel-right` / `lucide-panel-right-open` | `:522-526` |
| 侧栏窗口模式 | `ArrowLeftFromLineIcon` / `ArrowRightToLineIcon` | `lucide-arrow-left-from-line` / `lucide-arrow-right-to-line` | `:290-294` |
| 更新按钮 | `TitleBarUpdateButton`（自带图标，见 `TitleBarUpdateButton.tsx`） | 未确认 | `:455-470` |
| 最小化 | `MinusIcon` | `lucide-minus` | `AppTitleBar.tsx:148` |
| 最大化/还原 | `SquareIcon` / `CopyIcon` | `lucide-square` / `lucide-copy` | `AppTitleBar.tsx:83,157` |
| 关闭 | `XIcon` | `lucide-x` | `AppTitleBar.tsx:170` |
| 侧栏窗口模式的工具条 | `SearchIcon` + 同上若干 | `lucide-search` | `AppTitleBar.tsx:129` |
| 快捷键提示面板内 | `SearchIcon` `CompassIcon` `PanelRight*` `KeyboardIcon` | `lucide-search` `lucide-compass` `lucide-panel-right*` `lucide-keyboard` | `useTitleBarActions.tsx:535-560` |

作用域钩子：标题栏节点是 `header[data-app-titlebar="true"][data-vrcx-0-surface="titlebar"].vrcx-0-titlebar`（`AppTitleBar.tsx:90-96`），窗口控制按钮带 `data-vrcx-0-control="toolbar"`（`:483`）。

### 3.5 侧栏 rail 的图标

两处都列上，避免歧义：

**（a）右侧好友侧栏的竖向 rail**（`.vrcx-0-side-panel-rail`，`SidePanel.tsx:499`）：

| rail 项 | 图标 | class | 证据 |
| --- | --- | --- | --- |
| 已跟踪非好友 | `UserSearchIcon` | `lucide-user-search` | `SidePanel.tsx:519-522` |
| 好友 tab | `lucide:UserRound` | `lucide-user-round` `lucide-user-2` | `sidebarTabLayout.ts:57-64,321-327` |
| 群组 tab | `lucide:UsersRound` | `lucide-users-round` `lucide-users-2` | `sidebarTabLayout.ts:66-71,321-327` |
| 收藏集合 tab | `lucide:UserStar` | `lucide-user-star` | `sidebarTabLayout.ts:248,321` |
| 世界房间 tab | **没有 lucide 图标**，用 `WorldRoomsTabRail` → `WorldRoomsCover`（世界封面**图片**）+ 房间计数 | — | `SidePanel.tsx:576-598`、`src/components/sidebar/world-rooms/WorldRoomsTabRail.tsx` |
| rail 底部设置 | `SlidersHorizontalIcon` | `lucide-sliders-horizontal` | `SidePanel.tsx:630` |
| rail 底部新增 | `PlusIcon` | `lucide-plus` | `SidePanel.tsx:654` |
| 面板内搜索/关闭 | `SearchIcon` / `XIcon` | `lucide-search` / `lucide-x` | `SidePanel.tsx:433-436` |

**（b）左侧主导航折叠成 icon rail 时**：用的是同一批 `lucide-*`（`Sidebar collapsible="icon"`，`AppSidebar.tsx:185-193`；折叠态图标尺寸由 `[&_svg]:size-4` 控制，`src/ui/shadcn/sidebar.tsx:539`），另有顶部「+ 新建 dashboard」`PlusIcon`（`AppNavMenuSections.tsx:58`，class `lucide-plus`）与设置 `SettingsIcon`（`AppNavMenuSections.tsx:192`）。

### 3.6 用 CSS 换图标：可行性与依据

目标写法（用户提出的方案）：

```css
svg.lucide-bell {
  background: currentColor;
  mask: url("data:image/svg+xml,...") center / contain no-repeat;
}
svg.lucide-bell > * { display: none; }
```

| 子问题 | 结论 | 依据 |
| --- | --- | --- |
| `lucide-react` 输出带 `lucide-<name>` class | **确认** | §3.2（源码行号 + 真实渲染 + dist） |
| 给内联 `<svg>` 根元素设 `background-color` / `background-image` 是否生效 | **高置信度：生效**。`background-color` 的规范适用范围是「all elements」，`<svg>` 根在 HTML 中是一个正常的 CSS 盒子（项目自身给 svg 加 `border`/`size` 类就是这个道理）。未在本机 WebView2 实测（本机无 Chromium/WebView2）。 | MDN `background-color`：<https://developer.mozilla.org/en-US/docs/Web/CSS/background-color>（"sets the background color of an element box"，适用范围未在页面上显式展开）；项目内 `svg` 被当普通盒子处理的证据：`src/ui/shadcn/sidebar.tsx:539` `[&_svg]:size-4`、`button.tsx:7` `[&_svg:not([class*='size-'])]:size-4` |
| 给 `<svg>` 根元素设 `mask` / `mask-image` 是否生效 | **高置信度：生效**。`mask` 适用范围同样是「all elements」，且**应用内已有 CSS mask 换图形的先例**。 | MDN `mask`：<https://developer.mozilla.org/en-US/docs/Web/CSS/mask>；**项目自身先例**：`src/styles/globals.css:1150-1164`（`.accessible-status-indicators i.x-user-status.joinme { mask: url('../assets/masks/joinme.svg') center / contain no-repeat; }`，同文件还有 `askme.svg` / `busy.svg`），这段规则位于 `@layer components`（`globals.css:596`–`1370`）。这些资产文件真实存在：`src/assets/masks/{busy,joinme,askme}.svg` |
| 隐藏子元素后背景是否仍绘制 | **是**（背景绘制在元素盒子上，与子元素无关；`display:none` 只移除子元素的生成盒） | `svg > *` 命中 lucide 的 `path`/`circle` 等直接子元素（证据 A 的渲染输出里子元素都是直接子级） |
| 主题 CSS 里能否用 `data:` 的 mask 图 | **可以** | CSP `img-src` 含 `data:`（`src-tauri/tauri.conf.json:16-29`）；`url(data:...)` 不会被主题的 URL 重写逻辑改动（`styleLayers.ts:43-48` 判定有 scheme 就不重写） |

**已知坑（按重要性）**：

1. **`mask` 与 `border-radius`/`overflow` 叠加**：mask 作用于整个元素渲染结果，包括背景与（未隐藏的）子元素。所以**必须先 `svg > * { display: none }`**，否则原图标会跟背景叠在一起。
2. **`#` 在 data URI 里必须转义成 `%23`**（否则被当作 fragment）。写 `mask-image: url("data:image/svg+xml,%3Csvg ... fill='%23fff' .../%3E")`。用 UTF-8 直接嵌 SVG（`%3C` = `<`）比 base64 可读性好。
3. **`background` 与 `mask` 都建议显式写 `-webkit-` 前缀**（Chromium 现在两者都支持无前缀，但保险起见双写；`globals.css` 里用的是无前缀 `mask`，说明当前 WebView2 基线可接受）。
4. **颜色用 `currentColor` 时要注意继承来源**：`svg` 上只有 `stroke="currentColor"` 属性，`color` 是从祖先继承的（例如 `navMenuLucideClassName` 的 `[&_.lucide]:text-sidebar-foreground` 让它变成 sidebar 前景色），所以 `background: currentColor` 会自动跟随主题色 ✅。
5. **尺寸**：svg 的宽高由工具类给出（`[&_svg]:size-4`、`size-4.5`、`size-3` 等），`mask-size: contain` 会自动适配，不用手写尺寸。
6. **性能/可维护性**：每个图标一条规则，且 `.lucide-*` 版本升级有别名变动风险（§3.2 表）。建议只替换少数关键图标（品牌感最重要那几个），不要全量替换。
7. **`mask` 简写会重置 `mask-border-*`、`mask-composite`**，一般无副作用；用 `mask-image` + `mask-size` 分开写更可控。

---

## 4. 非 lucide 的图标 / 图形

| 类别 | 位置 | 是什么 | 主题能否替换 |
| --- | --- | --- | --- |
| 内联自定义 `<svg>` | `src/components/reui/gantt/gantt-view.tsx:3223`、`src/ui/shadcn/number-field.tsx:146`、`src/features/charts/RelationshipTimelinePageImpl.tsx:195` | 手写 svg（不是 lucide，**没有 `lucide` class**） | 能选到（结构/class 选择器），但除非有 class 否则选择器不稳；gantt/图表属于局部 UI |
| 世界封面图 | `src/components/sidebar/world-rooms/WorldRoomsCover.tsx`（经 `WorldRoomsTabRail`） | `<img>`（缩略图） | 可改用 `filter` / 形状裁切，换图不可行（内容来自 VRChat） |
| 链接 favicon | `src/components/media/BioLinkFavicon.tsx:22-40` | `<img>`（`getFaviconUrl`），出现在 `FriendListColumns.tsx`、`PlayerListColumns.tsx`、`UserDialogInfoTab.tsx` | 是内容图，不建议替换 |
| 平台圆点 | `src/components/avatars/AvatarPlatformDots.tsx:4-31` | `<span class="size-2.5 rounded-full bg-platform-pc|quest|ios">`（**纯色 span，不是图标**） | ✅ 可改成方块/菱形 |
| 用户状态点 | `UserStatusDot.tsx:20-66` | `<span class="user-status-indicator ...">`（**纯色 span**） | ✅ 见 §2.3 |
| 应用自带的 mask 形状资产 | `src/assets/masks/{busy,joinme,askme}.svg`，被 `globals.css:1150-1164` 使用 | SVG 文件（CSS mask 图） | 主题**不能引用相对路径**（§1.2）；可以把自己的形状做成 data URI 覆盖同样的选择器 |
| 图标字体 | — | **不存在**。`@fontsource-variable/geist` 是文本字体；全仓库无 iconfont / material-icons / font-awesome | 不适用 |
| 图片类图标 | 头像之外的 `img` 都在内容区（封面、横幅、表情、截图） | — | 不适用 |

结论：**应用里的 UI 图标基本 100% 是 lucide**（`package.json` 依赖里没有第二个图标库），例外只有 3 处手写 svg + 图片类内容。

---

## 5. 未确认 / 需要实测的清单

1. **`svg` 根元素上 `background` + `mask` 组合**在目标 WebView2 的实际效果 —— 规范与项目先例都支持，但本机无浏览器，**未实测**。建议在主题里先小范围试 1–2 个图标验证。
2. **`mask-image` 的 URL 在 CSP 中归入哪个指令**（`img-src` vs `default-src`）——本报告按 `img-src` 理解（白名单里有 `data:`/`https:`），未找到权威逐条依据，标为未确认（影响极小：CSP 没有 `default-src`）。
3. **shadcn Avatar 客户端挂载后的真实 DOM**（`img[data-slot=avatar-image]` 何时出现）——只验证了 SSR 输出，运行时挂载顺序未实测。
4. **`AnimatedThemeToggler` 与 `TitleBarUpdateButton` 内部 svg 的 class**（是否 lucide）——未逐一读取，标为未确认。
5. **lucide-react 升到 1.53.x 后的 class 拼接**——node_modules 实际是 1.46.0，未读取 1.53 源码。
6. **`UserStatusAvatar` 外层 `span:has(> .user-status-indicator)` 选择器**在无状态（`statusDotClassName` 为空 → `UserStatusDot` 返回 `null`）时不会命中，此时头像不会被主题改到。若需覆盖这种情形，得改用 `.overflow-visible > .overflow-hidden.rounded-full` 这类 fallback 选择器。
7. **`data-slot="avatar"` 的 `::after`** 是 base-ui 的描边伪元素（`avatar.tsx:18`）；覆盖它属于「改应用内部实现」，未来可能变。

---

## 6. 一页速查

- 主题 CSS **未分层**，压 Tailwind 不用 `!important`（§1.1）。
- 头像有两套：**shadcn Avatar**（`[data-slot=avatar]`，Root 无 overflow，`::after` 已用作 1px 描边）与**自定义 `UserStatusAvatar`**（外层 `overflow-visible` 可挂装饰、内层 `overflow-hidden rounded-full` 负责裁切，状态点是同级的独立 span）。
- 五个位置：好友侧栏行 36px、自己行 40px、动态表 32px（compact，dense 隐藏头像）、用户弹窗大 64px、好友列表 24px（裸 img）。
- **切角必须同时清掉 `border-radius`**（`clip-path` 与圆角取交集）；**描边用 `box-shadow`/`outline` 更安全**；**伪元素只能挂在不 overflow:hidden 的那层**；**裸 img 上不能挂伪元素**。
- 图标 = lucide-react，`<svg class="lucide lucide-<kebab>">`（含别名 class，实测见 §3.2 表）。导航里 `charts-two-person` / `charts-timeline` 实际是 `lucide-circle`（白名单过滤 fallback）。
- 纯 CSS 换图标：`svg.lucide-x { background: currentColor; mask: url(data:...) center/contain no-repeat } svg.lucide-x > * { display: none }` —— 依据充分（规范适用范围 + 应用自身 `globals.css:1150-1164` 的 mask 先例 + CSP 允许 `data:`），但**未在真实 WebView2 里实测**。
