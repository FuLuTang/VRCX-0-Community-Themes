/* R4 side-panel, step 1: SSR proof of the real tab DOM.
   DOM FIXTURE / NOT WINDOWS — renders the real Base UI Tabs primitives with the
   app's own wrapper contract copied verbatim from src/ui/shadcn/tabs.tsx,
   src/components/sidebar/SidePanel.tsx (rail block, lines 499-640) and
   src/ui/shadcn/tooltip.tsx, then dumps the markup so every selector the theme
   uses can be traced back to a real attribute instead of a class guess. */
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';

const app = '/home/fulutang/Documents/Github/VRCX-0-jirai';
const req = createRequire(app + '/package.json');
const React = req('react');
const { renderToStaticMarkup } = req('react-dom/server');
const { Tabs } = req('@base-ui/react/tabs');
const { Tooltip } = req('@base-ui/react/tooltip');
const { ContextMenu } = req('@base-ui/react/context-menu');
const { Button } = req('@base-ui/react/button');
const { UserSearchIcon, UsersIcon, PlusIcon, SquareUserIcon } = req('lucide-react');
const h = React.createElement;

/* verbatim from src/lib/segmented-control (layout/size class maps) */
const segmentedControlItemLayoutClassName =
    'data-[orientation=horizontal]:flex-1 data-[orientation=vertical]:w-full';
const segmentedControlItemSizeClassNames = {
    default: 'h-8 gap-1.5 px-3 text-xs',
    sm: 'h-7 gap-1 px-2.5 text-xs',
    xs: 'h-6 gap-1 px-2 text-[11px]'
};

/* TabsList: src/ui/shadcn/tabs.tsx:53-66, TabsTab: :86-96 */
const TabsList = ({ variant = 'default', className = '', children }) =>
    h(
        Tabs.List,
        {
            className: [
                'text-muted-foreground relative z-0 flex w-fit items-center justify-center gap-x-0.5',
                'data-[orientation=vertical]:flex-col',
                variant === 'default'
                    ? 'text-muted-foreground/72 rounded-lg bg-(--state-pressed-surface) p-0.5'
                    : 'data-[orientation=horizontal]:py-1 data-[orientation=vertical]:px-1',
                className
            ].join(' '),
            'data-size': 'default',
            'data-slot': 'tabs-list'
        },
        children,
        h(Tabs.Indicator, {
            className:
                'absolute bottom-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) -translate-y-(--active-tab-bottom) transition-[width,translate] duration-200 ease-in-out bg-foreground z-10 data-[orientation=horizontal]:h-0.5 data-[orientation=horizontal]:translate-y-px data-[orientation=vertical]:w-0.5 data-[orientation=vertical]:-translate-x-px',
            'data-slot': 'tab-indicator'
        })
    );

const TabsTab = ({ className = '', ...props }) =>
    h(Tabs.Tab, {
        className: [
            'hover:text-muted-foreground focus-visible:ring-ring data-active:text-foreground relative flex shrink-0 grow cursor-pointer items-center justify-center rounded-md border border-transparent text-base font-medium whitespace-nowrap transition-[color,background-color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-inset data-disabled:pointer-events-none data-disabled:opacity-64 data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start sm:text-sm',
            segmentedControlItemLayoutClassName,
            segmentedControlItemSizeClassNames.default,
            className
        ].join(' '),
        'data-size': 'default',
        'data-slot': 'tabs-tab',
        ...props
    });

/* One rail trigger, copied from SidePanel.tsx:504-602 (Tooltip > TooltipTrigger
   render= ContextMenuTrigger render= TabsTrigger). */
const railTrigger = (value, active, Icon, count) =>
    h(
        ContextMenu.Root,
        { key: value },
        h(
            Tooltip.Root,
            null,
            h(Tooltip.Trigger, {
                'data-slot': 'tooltip-trigger',
                render: h(ContextMenu.Trigger, {
                    render: h(TabsTab, {
                        value,
                        'data-active': active ? '' : undefined,
                        className:
                            'data-active:bg-secondary h-auto w-full flex-col justify-center gap-0.5 px-0 py-1.5 sm:h-auto'
                    })
                })
            }, [
                h(Icon, { key: 'i', className: 'size-4.5', 'data-icon': 'icon' }),
                h('span', { key: 's', className: 'sr-only' }, value),
                count == null
                    ? null
                    : h(
                          'span',
                          {
                              key: 'c',
                              className: 'text-[10px] leading-none tabular-nums'
                          },
                          count
                      )
            ])
        )
    );

const tree = h(
    'div',
    { className: 'vrcx-0-app-root', 'data-vrcx-0-surface': 'app-root' },
    h(
        'div',
        { className: 'vrcx-0-main-shell flex h-full min-h-0 min-w-0 flex-col overflow-hidden' },
        h(
            'div',
            {
                className: 'vrcx-0-workspace flex min-h-0 min-w-0 flex-1 overflow-hidden',
                'data-vrcx-0-surface': 'workspace'
            },
            h(
                'div',
                {
                    className: 'vrcx-0-main-content flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden',
                    'data-vrcx-0-surface': 'main-content'
                },
                h('div', { className: 'vrcx-0-page-scaffold' }, 'DOM FIXTURE / NOT WINDOWS')
            ),
            h('div', {
                'data-vrcx-0-resize': 'side-panel',
                className:
                    'z-20 w-(--vrcx-0-side-panel-resizer-width) shrink-0 cursor-ew-resize bg-transparent select-none'
            }),
            h(
                'aside',
                {
                    className:
                        'vrcx-0-side-panel flex min-h-0 w-80 shrink-0 flex-col overflow-hidden',
                    'data-vrcx-0-surface': 'side-panel',
                    style: { width: '320px' }
                },
                h(
                    'div',
                    { className: 'vrcx-0-side-panel-self ml-2 flex shrink-0 items-center pt-4 pb-2 pl-2' },
                    h('span', null, 'FIXTURE SELF')
                ),
                h(
                    Tabs.Root,
                    {
                        orientation: 'vertical',
                        value: 'tracked-nonfriends',
                        className: 'flex min-h-0 min-w-0 flex-1 gap-0 overflow-hidden'
                    },
                    h(
                        'div',
                        { className: 'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pb-2 pl-2' },
                        h(
                            'div',
                            { className: 'shrink-0 pt-1 pr-1.5 pb-2 pl-0.5' },
                            h('input', { 'aria-label': 'filter', className: 'h-7 w-full' })
                        ),
                        h(
                            Tabs.Panel,
                            {
                                value: 'tracked-nonfriends',
                                className: 'min-h-0 flex-1 overflow-hidden data-hidden:hidden',
                                'data-slot': 'tabs-content'
                            },
                            h('div', { className: 'text-xs' }, 'panel body')
                        )
                    ),
                    h(
                        'div',
                        { className: 'vrcx-0-side-panel-rail flex w-9 shrink-0 flex-col items-center gap-0.5 py-1.5' },
                        h(
                            TabsList,
                            {
                                variant: 'underline',
                                className:
                                    'w-full flex-col gap-0.5 p-0 [&>[data-slot=tab-indicator]]:hidden'
                            },
                            railTrigger('tracked-nonfriends', true, UserSearchIcon, '21'),
                            railTrigger('friends', false, SquareUserIcon, '15'),
                            railTrigger('groups', false, UsersIcon, '60')
                        ),
                        h(
                            Button,
                            {
                                'data-slot': 'button',
                                'data-variant': 'ghost',
                                'data-size': 'icon',
                                type: 'button',
                                className: 'text-muted-foreground shrink-0',
                                'aria-label': 'configure'
                            },
                            h(PlusIcon, { 'data-icon': 'icon' })
                        )
                    )
                )
            )
        )
    )
);

const html = renderToStaticMarkup(h(Tooltip.Provider, null, tree));
const rail = html.slice(html.indexOf('vrcx-0-side-panel-rail'));
await fs.writeFile(new URL('./r4-side-panel-rail-dom.html', import.meta.url), '<!doctype html>\n' + rail.replace(/></g, '>\n<') + '\n');
console.log('=== rail block (real primitives, SSR) ===');
console.log(rail.replace(/></g, '>\n<'));
