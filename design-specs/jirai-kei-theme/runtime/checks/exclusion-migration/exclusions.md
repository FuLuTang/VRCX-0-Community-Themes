# 排除规则迁移清单 / context-exclusion migration ledger

生成时间：2026-10-13T20:09:59.323Z  
分析快照：`exclusions.before.json`（tag=`before`，解析 801 条规则，其中 135 条带上下文排除）  
基线主题：`/tmp/exclusion-migration/out-baseline/jirai-kei-theme/theme.css`  
应用源码：`/tmp/vrcx-win-src-r9/src`

本表逐条记录 `规则 × 上下文` 三元组的裁决：**保留（Keep，含人工裁定）**、**释放**（Drop）。

## 1. 汇总

| 类别 | 条数 |
| --- | ---: |
| class = Drop | 306 |
| class = Keep | 5 |
| class = Partial | 2 |
| remove, no visible effect (stage 2) | 233 |
| remove, visible release (stage 3) | 75 |
| keep (clause preserved) | 5 |
| **合计（规则×上下文）** | **313** |

| 上下文 | 合计 | Keep | Drop | Partial | 其中 vacuous |
| --- | ---: | ---: | ---: | ---: | ---: |
| login-page | 96 | 1 | 93 | 2 | 56 |
| entity-dialog | 135 | 4 | 131 | 0 | 95 |
| settings rail | 82 | 0 | 82 | 0 | 9 |

## 2. 逐文件清单

### `avatars-status-r9.css`

| 行 | 上下文 | 主体 | 裁决 | 替代规则 / 说明 |
| ---: | --- | --- | --- | --- |
| 199 | entity-dialog | `[data-slot==avatar]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 203 | entity-dialog | `[data-slot==avatar]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 207 | entity-dialog | `:is([data-slot="avatar-image"],[data-slot="avatar-` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |

### `buttons-badges-r10.css`

| 行 | 上下文 | 主体 | 裁决 | 替代规则 / 说明 |
| ---: | --- | --- | --- | --- |
| 5 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 5 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 5 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=6 latent=3）→ 保留子句，删除无可见变化 |
| 10 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 10 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 10 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=0 latent=1）→ 保留子句，删除无可见变化 |
| 11 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 11 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 11 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=0 latent=1）→ 保留子句，删除无可见变化 |
| 12 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 12 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 12 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=1）→ 保留子句，删除无可见变化 |
| 13 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 13 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 13 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=1）→ 保留子句，删除无可见变化 |
| 14 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 14 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 14 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=1）→ 保留子句，删除无可见变化 |
| 15 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 15 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 15 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=1）→ 保留子句，删除无可见变化 |
| 16 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 16 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 16 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 17 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 17 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 17 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 18 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 18 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 18 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 19 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 19 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 19 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 20 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 20 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 20 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=6 latent=3）→ 保留子句，删除无可见变化 |
| 21 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 21 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 21 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=6 latent=3）→ 保留子句，删除无可见变化 |
| 22 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 22 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 22 | settings rail | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 25 | login-page | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 25 | entity-dialog | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 25 | settings rail | `[data-slot==badge]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=4）→ 保留子句，删除无可见变化 |
| 26 | login-page | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 26 | entity-dialog | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 26 | settings rail | `[data-slot==badge]` | Drop → stage 2 | 真实 DOM 不触发（reach real=0 latent=1）→ 保留子句，删除无可见变化 |
| 27 | login-page | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 27 | entity-dialog | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 27 | settings rail | `[data-slot==badge]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 28 | login-page | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 28 | entity-dialog | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 28 | settings rail | `[data-slot==badge]` | Drop → stage 2 | 真实 DOM 不触发（reach real=0 latent=1）→ 保留子句，删除无可见变化 |
| 29 | login-page | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 29 | entity-dialog | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 29 | settings rail | `[data-slot==badge]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 30 | login-page | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 30 | entity-dialog | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 30 | settings rail | `[data-slot==badge]` | Drop → stage 2 | 真实 DOM 不触发（reach real=0 latent=1）→ 保留子句，删除无可见变化 |
| 31 | login-page | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 31 | entity-dialog | `[data-slot==badge]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 31 | settings rail | `[data-slot==badge]` | Drop → stage 2 | 真实 DOM 不触发（reach real=0 latent=1）→ 保留子句，删除无可见变化 |
| 35 | login-page | `[data-slot==pagination-link]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 35 | entity-dialog | `[data-slot==pagination-link]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 35 | settings rail | `[data-slot==pagination-link]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=0）→ 保留子句，删除无可见变化 |
| 36 | login-page | `[data-slot==pagination-link]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 36 | entity-dialog | `[data-slot==pagination-link]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 36 | settings rail | `[data-slot==pagination-link]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 37 | login-page | `[data-slot==pagination-link]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 37 | entity-dialog | `[data-slot==pagination-link]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 37 | settings rail | `[data-slot==pagination-link]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=0）→ 保留子句，删除无可见变化 |
| 40 | login-page | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 40 | entity-dialog | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 40 | settings rail | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 41 | login-page | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 41 | entity-dialog | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 41 | settings rail | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 42 | login-page | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 42 | entity-dialog | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 42 | settings rail | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 43 | login-page | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 43 | entity-dialog | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 43 | settings rail | `[data-slot==tabs-list]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 46 | login-page | `[data-slot==alert]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 46 | entity-dialog | `[data-slot==alert]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 46 | settings rail | `[data-slot==alert]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=0）→ 保留子句，删除无可见变化 |
| 47 | login-page | `[data-slot==alert]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 47 | entity-dialog | `[data-slot==alert]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 47 | settings rail | `[data-slot==alert]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 48 | login-page | `[data-slot==alert-title]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 48 | entity-dialog | `[data-slot==alert-title]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 48 | settings rail | `[data-slot==alert-title]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=0）→ 保留子句，删除无可见变化 |
| 49 | login-page | `[data-slot==alert-description]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 49 | entity-dialog | `[data-slot==alert-description]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 49 | settings rail | `[data-slot==alert-description]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=0）→ 保留子句，删除无可见变化 |
| 52 | login-page | `div` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 52 | entity-dialog | `div` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 52 | settings rail | `div` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 53 | login-page | `div` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 53 | entity-dialog | `div` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 53 | settings rail | `div` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 54 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 54 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 54 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 55 | login-page | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 55 | entity-dialog | `[data-slot==button]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 55 | settings rail | `[data-slot==button]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 58 | login-page | `[data-slot==separator]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 58 | entity-dialog | `[data-slot==separator]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 58 | settings rail | `[data-slot==separator]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 59 | login-page | `[data-slot==separator]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 59 | entity-dialog | `[data-slot==separator]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 59 | settings rail | `[data-slot==separator]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |

### `dialog-header-r97.css`

| 行 | 上下文 | 主体 | 裁决 | 替代规则 / 说明 |
| ---: | --- | --- | --- | --- |
| 3 | login-page | `[data-slot$==dialog-header]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 3 | entity-dialog | `[data-slot$==dialog-header]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 4 | login-page | `[data-slot$==title]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 4 | entity-dialog | `[data-slot$==title]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 5 | login-page | `:is(button,.text-muted-foreground)` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 5 | entity-dialog | `:is(button,.text-muted-foreground)` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 8 | login-page | `.size-2.rounded-full` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 8 | entity-dialog | `.size-2.rounded-full` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 9 | login-page | `button` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 9 | entity-dialog | `button` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |

### `dialogs-r9.css`

| 行 | 上下文 | 主体 | 裁决 | 替代规则 / 说明 |
| ---: | --- | --- | --- | --- |
| 18 | login-page | `:is([data-slot="dialog-content"], [data-slot="aler` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 18 | entity-dialog | `:is([data-slot="dialog-content"], [data-slot="aler` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 51 | login-page | `:is([data-slot="dialog-header"], [data-slot="alert` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 51 | entity-dialog | `:is([data-slot="dialog-header"], [data-slot="alert` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 64 | login-page | `:is([data-slot="dialog-title"], [data-slot="alert-` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 64 | entity-dialog | `:is([data-slot="dialog-title"], [data-slot="alert-` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 88 | login-page | `:is([data-slot="dialog-title"], [data-slot="alert-` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 88 | entity-dialog | `:is([data-slot="dialog-title"], [data-slot="alert-` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 100 | login-page | `[data-slot==dialog-close]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 100 | entity-dialog | `[data-slot==dialog-close]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 121 | login-page | `[data-slot==dialog-close]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 121 | entity-dialog | `[data-slot==dialog-close]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 126 | login-page | `[data-slot==dialog-close]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 126 | entity-dialog | `[data-slot==dialog-close]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 133 | login-page | `:is([data-slot="dialog-footer"], [data-slot="alert` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 133 | entity-dialog | `:is([data-slot="dialog-footer"], [data-slot="alert` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 140 | login-page | `:is([data-slot="dialog-footer"], [data-slot="alert` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 140 | entity-dialog | `:is([data-slot="dialog-footer"], [data-slot="alert` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |

### `fields-toolbar-r10.css`

| 行 | 上下文 | 主体 | 裁决 | 替代规则 / 说明 |
| ---: | --- | --- | --- | --- |
| 29 | login-page | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:29 去掉排除后全局生效） |
| 29 | entity-dialog | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:29 去掉排除后全局生效） |
| 29 | settings rail | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 2 | 真实 DOM 不触发（reach real=4 latent=0）→ 保留子句，删除无可见变化 |
| 33 | login-page | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:33 去掉排除后全局生效） |
| 33 | entity-dialog | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:33 去掉排除后全局生效） |
| 33 | settings rail | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 2 | 真实 DOM 不触发（reach real=4 latent=0）→ 保留子句，删除无可见变化 |
| 34 | login-page | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:34 去掉排除后全局生效） |
| 34 | entity-dialog | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:34 去掉排除后全局生效） |
| 34 | settings rail | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 2 | 真实 DOM 不触发（reach real=4 latent=0）→ 保留子句，删除无可见变化 |
| 35 | login-page | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 35 | entity-dialog | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 35 | settings rail | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 36 | login-page | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 36 | entity-dialog | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 36 | settings rail | `:is([data-slot="input"],[data-slot="textarea"],tex` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 37 | login-page | `[data-slot==input-group]` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:37 去掉排除后全局生效） |
| 37 | entity-dialog | `[data-slot==input-group]` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:37 去掉排除后全局生效） |
| 37 | settings rail | `[data-slot==input-group]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=3）→ 保留子句，删除无可见变化 |
| 38 | login-page | `[data-slot==input-group]` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:38 去掉排除后全局生效） |
| 38 | entity-dialog | `[data-slot==input-group]` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:38 去掉排除后全局生效） |
| 38 | settings rail | `[data-slot==input-group]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=3）→ 保留子句，删除无可见变化 |
| 39 | login-page | `[data-slot==field-label]` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:39 去掉排除后全局生效） |
| 39 | entity-dialog | `[data-slot==field-label]` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:39 去掉排除后全局生效） |
| 39 | settings rail | `[data-slot==field-label]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=0）→ 保留子句，删除无可见变化 |
| 40 | login-page | `[data-slot==field-description]` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:40 去掉排除后全局生效） |
| 40 | entity-dialog | `[data-slot==field-description]` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:40 去掉排除后全局生效） |
| 40 | settings rail | `[data-slot==field-description]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 41 | login-page | `[data-slot==field-error]` | **Keep** | 替代规则：login-r8.css:225 |
| 41 | entity-dialog | `[data-slot==field-error]` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:41 去掉排除后全局生效） |
| 41 | settings rail | `[data-slot==field-error]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 78 | login-page | `[data-slot==kbd]` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:78 去掉排除后全局生效） |
| 78 | entity-dialog | `[data-slot==kbd]` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:78 去掉排除后全局生效） |
| 78 | settings rail | `[data-slot==kbd]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=1）→ 保留子句，删除无可见变化 |
| 82 | login-page | `[data-slot==kbd-group]` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:82 去掉排除后全局生效） |
| 82 | entity-dialog | `[data-slot==kbd-group]` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:82 去掉排除后全局生效） |
| 82 | settings rail | `[data-slot==kbd-group]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 83 | login-page | `[data-slot==input-otp-slot]` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:83 去掉排除后全局生效） |
| 83 | entity-dialog | `[data-slot==input-otp-slot]` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:83 去掉排除后全局生效） |
| 83 | settings rail | `[data-slot==input-otp-slot]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=0）→ 保留子句，删除无可见变化 |
| 87 | login-page | `[data-slot==input-otp-slot]` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:87 去掉排除后全局生效） |
| 87 | entity-dialog | `[data-slot==input-otp-slot]` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:87 去掉排除后全局生效） |
| 87 | settings rail | `[data-slot==input-otp-slot]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 90 | login-page | `input` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:90 去掉排除后全局生效） |
| 90 | entity-dialog | `input` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:90 去掉排除后全局生效） |
| 90 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=0）→ 保留子句，删除无可见变化 |
| 93 | login-page | `input` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 93 | entity-dialog | `input` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 93 | settings rail | `input` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 94 | login-page | `input` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:94 去掉排除后全局生效） |
| 94 | entity-dialog | `input` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:94 去掉排除后全局生效） |
| 94 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=0）→ 保留子句，删除无可见变化 |
| 95 | login-page | `input` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:95 去掉排除后全局生效） |
| 95 | entity-dialog | `input` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:95 去掉排除后全局生效） |
| 95 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 96 | login-page | `input` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:96 去掉排除后全局生效） |
| 96 | entity-dialog | `input` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:96 去掉排除后全局生效） |
| 96 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 97 | login-page | `input` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:97 去掉排除后全局生效） |
| 97 | entity-dialog | `input` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:97 去掉排除后全局生效） |
| 97 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 98 | login-page | `input` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:98 去掉排除后全局生效） |
| 98 | entity-dialog | `input` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:98 去掉排除后全局生效） |
| 98 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 103 | login-page | `input` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:103 去掉排除后全局生效） |
| 103 | entity-dialog | `input` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 fields-toolbar-r10.css:103 去掉排除后全局生效） |
| 103 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |

### `form-controls-r9.css`

| 行 | 上下文 | 主体 | 裁决 | 替代规则 / 说明 |
| ---: | --- | --- | --- | --- |
| 3 | login-page | `:is([data-slot="checkbox"],input[type="checkbox"])` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 form-controls-r9.css:3 去掉排除后全局生效） |
| 3 | entity-dialog | `:is([data-slot="checkbox"],input[type="checkbox"])` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 form-controls-r9.css:3 去掉排除后全局生效） |
| 3 | settings rail | `:is([data-slot="checkbox"],input[type="checkbox"])` | Drop → stage 2 | 真实 DOM 不触发（reach real=0 latent=4）→ 保留子句，删除无可见变化 |
| 19 | login-page | `:is([data-slot="checkbox"],input[type="checkbox"])` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 form-controls-r9.css:19 去掉排除后全局生效） |
| 19 | entity-dialog | `:is([data-slot="checkbox"],input[type="checkbox"])` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 form-controls-r9.css:19 去掉排除后全局生效） |
| 19 | settings rail | `:is([data-slot="checkbox"],input[type="checkbox"])` | Drop → stage 2 | 真实 DOM 不触发（reach real=0 latent=2）→ 保留子句，删除无可见变化 |
| 24 | login-page | `[data-slot==checkbox]` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 form-controls-r9.css:24 去掉排除后全局生效） |
| 24 | entity-dialog | `[data-slot==checkbox]` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 form-controls-r9.css:24 去掉排除后全局生效） |
| 24 | settings rail | `[data-slot==checkbox]` | Drop → stage 2 | 真实 DOM 不触发（reach real=0 latent=2）→ 保留子句，删除无可见变化 |
| 32 | login-page | `[data-slot==checkbox-indicator]` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 form-controls-r9.css:32 去掉排除后全局生效） |
| 32 | entity-dialog | `[data-slot==checkbox-indicator]` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 form-controls-r9.css:32 去掉排除后全局生效） |
| 32 | settings rail | `[data-slot==checkbox-indicator]` | Drop → stage 2 | 真实 DOM 不触发（reach real=0 latent=1）→ 保留子句，删除无可见变化 |
| 33 | login-page | `:is([data-slot="checkbox"],input[type="checkbox"])` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 form-controls-r9.css:33 去掉排除后全局生效） |
| 33 | entity-dialog | `:is([data-slot="checkbox"],input[type="checkbox"])` | Drop → stage 3 | 释放 4 个元素，通用规则接管（本条自身 form-controls-r9.css:33 去掉排除后全局生效） |
| 33 | settings rail | `:is([data-slot="checkbox"],input[type="checkbox"])` | Drop → stage 2 | 真实 DOM 不触发（reach real=0 latent=4）→ 保留子句，删除无可见变化 |
| 37 | login-page | `input` | Drop → stage 3 | 释放 5 个元素，通用规则接管（本条自身 form-controls-r9.css:37 去掉排除后全局生效） |
| 37 | entity-dialog | `input` | **Keep**（人工裁定） | 替代规则：user-dialog-r8.css:32 |
| 37 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=4）→ 保留子句，删除无可见变化 |
| 45 | login-page | `input` | Drop → stage 3 | 释放 5 个元素，通用规则接管（本条自身 form-controls-r9.css:45 去掉排除后全局生效） |
| 45 | entity-dialog | `input` | **Keep** | 替代规则：user-dialog-r8.css:39 |
| 45 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=4）→ 保留子句，删除无可见变化 |
| 50 | login-page | `input` | Drop → stage 3 | 释放 5 个元素，通用规则接管（本条自身 form-controls-r9.css:50 去掉排除后全局生效） |
| 50 | entity-dialog | `input` | **Keep** | 替代规则：user-dialog-r8.css:45 |
| 50 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=4）→ 保留子句，删除无可见变化 |
| 56 | login-page | `input` | Drop → stage 3 | 释放 5 个元素，通用规则接管（本条自身 form-controls-r9.css:56 去掉排除后全局生效） |
| 56 | entity-dialog | `input` | Drop → stage 3 | 释放 5 个元素，通用规则接管（本条自身 form-controls-r9.css:56 去掉排除后全局生效） |
| 56 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=4）→ 保留子句，删除无可见变化 |
| 60 | login-page | `input` | Drop → stage 3 | 释放 5 个元素，通用规则接管（本条自身 form-controls-r9.css:60 去掉排除后全局生效） |
| 60 | entity-dialog | `input` | Drop → stage 3 | 释放 5 个元素，通用规则接管（本条自身 form-controls-r9.css:60 去掉排除后全局生效） |
| 60 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=4）→ 保留子句，删除无可见变化 |
| 64 | login-page | `input` | Drop → stage 3 | 释放 5 个元素，通用规则接管（本条自身 form-controls-r9.css:64 去掉排除后全局生效） |
| 64 | entity-dialog | `input` | **Keep** | 替代规则：user-dialog-r8.css:55 |
| 64 | settings rail | `input` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=4）→ 保留子句，删除无可见变化 |
| 68 | login-page | `[data-slot==slider-track]` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:68 去掉排除后全局生效） |
| 68 | entity-dialog | `[data-slot==slider-track]` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:68 去掉排除后全局生效） |
| 68 | settings rail | `[data-slot==slider-track]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=2）→ 保留子句，删除无可见变化 |
| 73 | login-page | `[data-slot==slider-range]` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:73 去掉排除后全局生效） |
| 73 | entity-dialog | `[data-slot==slider-range]` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:73 去掉排除后全局生效） |
| 73 | settings rail | `[data-slot==slider-range]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=2）→ 保留子句，删除无可见变化 |
| 76 | login-page | `[data-slot==slider-thumb]` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:76 去掉排除后全局生效） |
| 76 | entity-dialog | `[data-slot==slider-thumb]` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:76 去掉排除后全局生效） |
| 76 | settings rail | `[data-slot==slider-thumb]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=2）→ 保留子句，删除无可见变化 |
| 81 | login-page | `[data-slot==slider-thumb]` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:81 去掉排除后全局生效） |
| 81 | entity-dialog | `[data-slot==slider-thumb]` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:81 去掉排除后全局生效） |
| 81 | settings rail | `[data-slot==slider-thumb]` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=2）→ 保留子句，删除无可见变化 |
| 84 | login-page | `:is([data-slot="select-trigger"],[data-slot="combo` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:84 去掉排除后全局生效） |
| 84 | entity-dialog | `:is([data-slot="select-trigger"],[data-slot="combo` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:84 去掉排除后全局生效） |
| 84 | settings rail | `:is([data-slot="select-trigger"],[data-slot="combo` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=2）→ 保留子句，删除无可见变化 |
| 89 | login-page | `:is([data-slot="select-trigger"],[data-slot="combo` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:89 去掉排除后全局生效） |
| 89 | entity-dialog | `:is([data-slot="select-trigger"],[data-slot="combo` | Drop → stage 3 | 释放 3 个元素，通用规则接管（本条自身 form-controls-r9.css:89 去掉排除后全局生效） |
| 89 | settings rail | `:is([data-slot="select-trigger"],[data-slot="combo` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=2）→ 保留子句，删除无可见变化 |
| 92 | login-page | `svg` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 92 | entity-dialog | `svg` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 92 | settings rail | `svg` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 96 | login-page | `select` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 form-controls-r9.css:96 去掉排除后全局生效） |
| 96 | entity-dialog | `select` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 form-controls-r9.css:96 去掉排除后全局生效） |
| 96 | settings rail | `select` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 105 | login-page | `select` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 form-controls-r9.css:105 去掉排除后全局生效） |
| 105 | entity-dialog | `select` | Drop → stage 3 | 释放 1 个元素，通用规则接管（本条自身 form-controls-r9.css:105 去掉排除后全局生效） |
| 105 | settings rail | `select` | Drop → stage 2 | 真实 DOM 不触发（reach real=1 latent=0）→ 保留子句，删除无可见变化 |
| 107 | login-page | `[data-slot==spinner]` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 form-controls-r9.css:107 去掉排除后全局生效） |
| 107 | entity-dialog | `[data-slot==spinner]` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 form-controls-r9.css:107 去掉排除后全局生效） |
| 107 | settings rail | `[data-slot==spinner]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=0）→ 保留子句，删除无可见变化 |
| 112 | login-page | `[data-slot==spinner]` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 form-controls-r9.css:112 去掉排除后全局生效） |
| 112 | entity-dialog | `[data-slot==spinner]` | Drop → stage 3 | 释放 2 个元素，通用规则接管（本条自身 form-controls-r9.css:112 去掉排除后全局生效） |
| 112 | settings rail | `[data-slot==spinner]` | Drop → stage 2 | 真实 DOM 不触发（reach real=2 latent=0）→ 保留子句，删除无可见变化 |

### `overlays-r10.css`

| 行 | 上下文 | 主体 | 裁决 | 替代规则 / 说明 |
| ---: | --- | --- | --- | --- |
| 6 | entity-dialog | `[data-slot==tooltip-content]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 22 | entity-dialog | `div` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 27 | entity-dialog | `[data-slot==hover-card-content]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |

### `popups-r9.css`

| 行 | 上下文 | 主体 | 裁决 | 替代规则 / 说明 |
| ---: | --- | --- | --- | --- |
| 4 | entity-dialog | `:is([data-slot$="menu-content"],[data-slot$="menu-` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 16 | entity-dialog | `[data-slot==menu-positioner]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 17 | entity-dialog | `:is([data-slot$="menu-content"],[data-slot$="menu-` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 19 | entity-dialog | `:is([data-slot$="menu-label"],[data-slot="select-l` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 26 | entity-dialog | `:is([data-slot$="menu-item"],[data-slot$="menu-che` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 35 | entity-dialog | `:is([data-slot$="menu-item"],[data-slot$="menu-che` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 41 | entity-dialog | `:is(.text-muted-foreground,[data-slot$="menu-short` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 42 | entity-dialog | `:is([data-variant="destructive"],[data-variant="de` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 43 | entity-dialog | `:is(:hover,:focus-visible,[data-highlighted])` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 46 | entity-dialog | `*` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 48 | entity-dialog | `:is([data-disabled],[aria-disabled="true"],:disabl` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 51 | entity-dialog | `.text-muted-foreground` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 52 | entity-dialog | `:is([data-slot$="menu-separator"],[data-slot="sele` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 57 | entity-dialog | `[data-slot==avatar]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 58 | entity-dialog | `[data-slot==avatar]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 59 | entity-dialog | `:is([data-slot="avatar-image"],[data-slot="avatar-` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 60 | entity-dialog | `:is([data-slot="avatar-image"],[data-slot="avatar-` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 63 | entity-dialog | `:is([data-slot$="menu-item"],[data-slot="button"])` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 66 | entity-dialog | `span` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 69 | entity-dialog | `[data-slot==avatar-image]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 72 | entity-dialog | `:is([data-slot$="menu-content"],[data-slot$="menu-` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 77 | entity-dialog | `:is([data-slot="menubar-content"],[data-slot="menu` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 89 | entity-dialog | `[data-slot==menubar-label]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 96 | entity-dialog | `:is([data-slot="menubar-item"],[data-slot="menubar` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 103 | entity-dialog | `:is([data-slot="menubar-item"],[data-slot="menubar` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 109 | entity-dialog | `:is(.text-muted-foreground,[data-slot="menubar-sho` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 110 | entity-dialog | `[data-variant="destructive"]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 111 | entity-dialog | `:is(:hover,:focus-visible,[data-highlighted])` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 113 | entity-dialog | `:is([data-disabled],[aria-disabled="true"],:disabl` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 114 | entity-dialog | `:is([data-slot="menubar-separator"])` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 115 | entity-dialog | `[data-slot==menubar-shortcut]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 122 | entity-dialog | `[data-slot==tooltip-content]` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |
| 139 | entity-dialog | `div` | Drop → stage 2 / vacuous | 真实 DOM 不触发（reach real=0 latent=0）→ 保留子句，删除无可见变化 |

## 3. 保留（Keep）逐条理由

- **`form-controls-r9.css:37` × entity-dialog** — class=`Keep`（人工裁定）  
  主体 `input`  
  替代规则：`user-dialog-r8.css:32`  
  未覆盖属性：`accent-color`、`margin-top`、`margin-right`、`margin-bottom`、`margin-left`  
  使用点：`components/dialogs/user-dialog/components/UserDialogStatusDistribution.tsx:307`、`components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:832`  
  理由：replacement rules cover only some of the released properties/states: uncovered=[accent-color,margin-top,margin-right,margin-bottom,margin-left]
- **`form-controls-r9.css:45` × entity-dialog** — class=`Keep`  
  主体 `input`  
  替代规则：`user-dialog-r8.css:39`  
  未覆盖属性：—  
  使用点：`components/dialogs/user-dialog/components/UserDialogStatusDistribution.tsx:307`、`components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:832`  
  理由：a context-specific rule covers every released property with a deliberately different look
- **`form-controls-r9.css:50` × entity-dialog** — class=`Keep`  
  主体 `input`  
  替代规则：`user-dialog-r8.css:45`  
  未覆盖属性：—  
  使用点：`components/dialogs/user-dialog/components/UserDialogStatusDistribution.tsx:307`、`components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:832`  
  理由：a context-specific rule covers every released property with a deliberately different look
- **`form-controls-r9.css:64` × entity-dialog** — class=`Keep`  
  主体 `input`  
  替代规则：`user-dialog-r8.css:55`  
  未覆盖属性：—  
  使用点：`components/dialogs/user-dialog/components/UserDialogStatusDistribution.tsx:307`、`components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:832`  
  理由：a context-specific rule covers every released property with a deliberately different look
- **`fields-toolbar-r10.css:41` × login-page** — class=`Keep`  
  主体 `[data-slot==field-error]`  
  替代规则：`login-r8.css:225`  
  未覆盖属性：—  
  使用点：—  
  理由：a context-specific rule covers every released property with a deliberately different look
