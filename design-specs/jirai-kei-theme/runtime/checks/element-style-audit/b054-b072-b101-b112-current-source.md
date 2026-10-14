- B054 components/dialogs/AvatarDialogTabbedView.tsx:226 [EntityOverviewCard > div]
  <Button type="button" variant="ghost" disabled={!imageClickable} onClick={onImageClick} className={cn( 'bg-muted aspect-[4/3] h-auto w-full overflow-hidden rounded-lg border p-0 disabled:pointer-events-none', imageClickable ? 'cursor-pointer' : 'cursor-default' )} >
   {imageUrl ? ( <FadeInImage src={imageUrl} alt={ avatar.name || avatar.id || avatarFallbackLabel } className="size-full object-cover" /> ) : ( <span className="flex size-full items-center justify-center"> <PersonStandingIcon className="text-muted-foreground size-10" /> </span> )} 
- B054 components/dialogs/AvatarDialogTabbedView.tsx:263 [EntityOverviewCard > div > Tooltip > TooltipTrigger]
  <Button type="button" variant="ghost" disabled={!avatar.name} className="h-auto min-w-0 justify-start overflow-hidden p-0 text-left text-lg leading-tight font-semibold whitespace-normal hover:bg-transparent disabled:pointer-events-none disabled:opacity-100" onClick={avatar.name ? onTitleClick : undefined} >
   <span className="line-clamp-2 min-w-0 break-words"> {avatar.name || avatarFallbackLabel} </span> 
- B054 components/dialogs/AvatarDialogTabbedView.tsx:279 [EntityOverviewCard > div]
  <Button type="button" variant="ghost" disabled={!avatar.authorId} className="text-muted-foreground hover:text-foreground h-auto max-w-full min-w-0 justify-start overflow-hidden p-0 text-left text-sm hover:bg-transparent disabled:pointer-events-none disabled:opacity-100" onClick={avatar.authorId ? onAuthorClick : undefined} >
   <span className="truncate">{avatar.authorName}</span> 
- B054 components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:232 [EntityOverviewCard]
  <Button type="button" variant="ghost" disabled={!iconUrl || !onPreviewIcon} onClick={iconUrl ? onPreviewIcon : undefined} className="bg-muted mx-auto aspect-square h-auto w-full max-w-64 overflow-hidden rounded-lg border p-0 disabled:pointer-events-none disabled:opacity-100" >
   <Avatar className="size-full rounded-lg after:rounded-lg"> {iconUrl ? ( <AvatarImage src={iconUrl} alt={group.name || 'Group'} className="rounded-lg object-cover" /> ) : null} <AvatarFallback className="rounded-lg [&>svg]:size-10"> <UsersRoundIcon /> </AvatarFallback> </Avatar> 
- B054 components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:261 [EntityOverviewCard > div > div > CardTitle > Tooltip > TooltipTrigger]
  <Button type="button" variant="ghost" className="h-auto min-w-0 flex-1 justify-start overflow-hidden p-0 text-left text-lg leading-tight font-semibold whitespace-normal hover:bg-transparent" onClick={onCopyGroupName} >
   <span className="line-clamp-2 min-w-0 break-words"> {groupTitle} </span> 
- B054 components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:300 [EntityOverviewCard > div > div > Tooltip > TooltipTrigger]
  <Button type="button" variant="ghost" className="text-muted-foreground hover:text-foreground h-auto max-w-full justify-start gap-1 p-0 text-xs font-normal hover:bg-transparent" onClick={onOpenOwner} >
   <UserIcon data-icon="inline-start" /> <span className="truncate"> {t('dialog.group.label.owner')}{' '} {ownerLinkLabel} </span> 
- B054 components/dialogs/group-dialog/GroupDialogTabPanels.tsx:96 [div > div]
  <Button type="button" variant="ghost" className="h-auto shrink-0 p-0" aria-label={t('accessibility.preview_image', { item: announcement.title || t('accessibility.announcement') })} onClick={() => onPreviewImage( convertFileUrlToImageUrl( announcement.imageUrl, 1024 ), announcement.title || t('dialog.group.info.announcement') ) } >
   <FadeInImage src={convertFileUrlToImageUrl( announcement.imageUrl, 128 )} alt="" className="size-16 rounded-md object-cover" /> 
- B054 components/dialogs/group-dialog/GroupDialogTabPanels.tsx:272 [EntityDialogTabs > EntityDialogTabContent]
  <Button type="button" variant="ghost" className="bg-muted h-auto w-full overflow-hidden rounded-md p-0" aria-label={t('dialog.group.overview.preview_banner', { value: groupTitle })} onClick={() => onPreviewImage(bannerUrl, groupTitle)} >
   <FadeInImage src={bannerUrl} alt={group.name || 'Group banner'} className="aspect-[6/1] w-full object-cover" onError={() => setBannerFailed(true)} /> 
- B054 components/dialogs/group-dialog/GroupMembersPanel.tsx:162 []
  <Button type="button" variant="ghost" className="box-border h-auto w-full min-w-0 justify-start gap-2.5 p-1.5 text-left text-sm font-normal" onClick={() => { if (userId) { openUserDialog({ userId, title: user?.displayName || undefined, seedData: user }); } }} >
   {image ? ( <FadeInImage src={image} alt="" className="size-9 shrink-0 rounded-full object-cover" /> ) : ( <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-full"> <UserIcon className="text-muted-foreground" /> </div> )} <span className="min-w-0 flex-1 overflow-hidden"> <span className="flex min-w-0 items-center gap-1 leading-5 font-medium"> <span className="truncate">{label}</span> {row.isRepresenting ? ( <Tooltip> <TooltipTrigger render={ <span className="inline-flex shrink-0" /> } > <TagIcon className="text-muted-foreground size-3.5" /> </TooltipTrigger> <Too
- B054 components/dialogs/group-dialog/GroupModerationLogsPanel.tsx:304 []
  <Button type="button" variant="ghost" className="h-auto w-full min-w-0 justify-start truncate p-0 text-left font-medium hover:bg-transparent" onClick={() => openGroupAuditLogActor(row.original)} >
   {actorArgs.title} 
- B054 components/dialogs/group-dialog/GroupRowList.tsx:107 []
  <Button type="button" variant="ghost" className="h-auto max-w-full justify-start gap-1 p-0 text-left text-xs hover:bg-transparent" onClick={() => openUserDialog({ userId, title: displayName, seedData: queriedUser || knownUser || null }) } >
   {label} <span className="text-foreground truncate font-medium"> {displayName} </span> 
- B054 components/dialogs/group-dialog/GroupRowList.tsx:160 [div > div > div]
  <Button type="button" variant="ghost" className="mr-1.5 h-auto p-0 align-top" aria-label={t( 'accessibility.preview_image', { item: title } )} onClick={() => onPreviewImage?.(image, title) } >
   <FadeInImage src={convertFileUrlToImageUrl( image, 128 )} alt="" className="size-16 rounded-md object-cover" /> 
- B054 components/dialogs/group-dialog/GroupRowList.tsx:331 [Tabs > TabsContent > div]
  <Button key={`${getGroupRowLabel(row)}:${index}`} type="button" variant="ghost" className="h-auto w-full flex-col items-stretch overflow-hidden rounded-md border p-0 text-left text-sm" onClick={() => onPreviewImage?.( getGroupRowRawImage(row), getGroupRowLabel(row) ) } >
   {image ? ( <FadeInImage src={image} alt={getGroupRowLabel(row)} className="max-h-52 w-full object-contain" /> ) : ( <div className="bg-muted flex h-52 w-full items-center justify-center"> <ImageIcon className="text-muted-foreground" /> </div> )} 
- B054 components/dialogs/group-dialog/useGroupModerationColumns.tsx:173 []
  <Button type="button" variant="ghost" className="h-auto w-full min-w-0 justify-start truncate p-0 text-left font-medium hover:bg-transparent" onClick={() => onOpenUser(row.original)} >
   {label} 
- B054 components/dialogs/user-dialog/components/UserDialogEntityList.tsx:243 [div]
  <Button key={rowKey} type="button" variant="ghost" className="h-auto min-w-0 justify-start gap-2 px-1.5 py-1.5 text-left font-normal active:not-aria-[haspopup]:translate-y-0" onClick={() => openRow(row, kind)} >
   {content} 
- B054 components/dialogs/user-dialog/components/UserDialogGroupCard.tsx:78 []
  <Button type="button" variant="ghost" className="box-border h-auto w-full min-w-0 justify-start gap-2.5 p-1.5 text-left text-sm font-normal" onClick={() => openRow(group, 'group')} >
   <Avatar className="size-9 rounded-md after:rounded-md"> {image ? ( <AvatarImage src={image} alt="" className="rounded-md" /> ) : null} <AvatarFallback className="rounded-md [&>svg]:size-4"> <UsersRoundIcon aria-hidden="true" /> </AvatarFallback> </Avatar> <span className="min-w-0 flex-1 overflow-hidden"> <span className="flex min-w-0 items-center gap-1 leading-5 font-medium"> <span className="truncate">{label || '—'}</span> {isOwner ? ( <MarkerIcon icon={CrownIcon} label={t('dialog.group.label.owner_2')} className="text-amber-400" /> ) : null} {isMutual ? ( <MarkerIcon icon={Link2Icon} label=
- B054 components/dialogs/user-dialog/components/UserDialogHeaderMedia.tsx:55 [div]
  <Button type="button" variant="ghost" aria-label={bannerAlt} disabled={!displayedBannerUrl || !onBannerClick} onClick={onBannerClick} className={cn( 'bg-muted aspect-[4/3] h-auto w-full overflow-hidden rounded-lg border p-0 disabled:pointer-events-none disabled:opacity-100', displayedBannerUrl ? 'cursor-pointer' : 'cursor-default' )} >
   {bannerUrl ? ( <span className="relative size-full"> {[previousBannerUrl, bannerUrl] .filter(Boolean) .map((url) => ( <FadeInImage key={url} src={url} alt={url === bannerUrl ? bannerAlt : ''} className="absolute inset-0 size-full object-cover" fallback={ url === bannerUrl ? fallbackImage : null } onLoad={() => setLoadedBannerUrl(url)} /> ))} </span> ) : ( fallbackImage )} 
- B054 components/dialogs/user-dialog/components/UserDialogHeaderMedia.tsx:89 [div > div]
  <Button type="button" variant="ghost" aria-label={userIconLabel} title={userIconLabel} className={cn( 'bg-background/90 relative z-0 size-full overflow-hidden rounded-full p-0 shadow-md', hasIconFrame ? 'border-0' : 'border-2 border-white' )} onClick={onOpenUserIcon} >
   <FadeInImage src={userIconUrl} alt="" className="size-full object-cover" /> 
- B054 components/dialogs/user-dialog/components/UserDialogHeaderSection.tsx:740 [EntityOverviewCard > div > div > div > CardTitle > Tooltip > TooltipTrigger]
  <Button type="button" variant="ghost" className="h-auto min-w-0 flex-1 shrink justify-start overflow-hidden p-0 text-left text-lg leading-tight font-semibold shadow-none hover:bg-transparent hover:text-inherit hover:shadow-none dark:hover:bg-transparent" onClick={() => onCopyDisplayName( copyableDisplayName ) } >
   <AutoFitDisplayName text={profileTitle} /> 
- B054 components/dialogs/user-dialog/components/UserDialogHeaderSection.tsx:911 [EntityOverviewCard]
  <Button type="button" variant="ghost" className="text-muted-foreground hover:text-foreground h-auto max-h-24 w-full min-w-0 justify-start overflow-auto p-0 text-left text-sm whitespace-pre-wrap hover:bg-transparent" title={t('dialog.user.actions.edit_status')} onClick={onEditSelfStatus} >
   <span className="flex min-w-0 items-start gap-2"> <HeaderRowIcon icon={<PencilIcon />} className="mt-0.5" /> <span className="min-w-0"> {typeof profile.statusDescription === 'string' ? profile.statusDescription : ''} </span> </span> 
- B054 components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:241 []
  <Button type="button" variant="ghost" className="group/info-stat h-auto w-full justify-start px-2 py-1.5 text-left" onClick={onClick} >
   {body} 
- B054 components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:567 [InfoPanel > InfoStat]
  <Button type="button" variant="ghost" className="hover:text-foreground h-auto max-w-full justify-start gap-2 p-0 text-left text-xs font-normal whitespace-normal text-inherit hover:bg-transparent" onClick={() => openGroupDialog({ groupId: representedGroup.groupId, title: representedGroup.name || undefined, seedData: buildRepresentedGroupSeedData( representedGroup ) }) } >
   {representedGroup.iconUrl ? ( <FadeInImage src={convertFileUrlToImageUrl( representedGroup.iconUrl, 128 )} alt="" className="size-10 shrink-0 rounded-md object-cover" /> ) : null} <span className="min-w-0"> <span className="block truncate"> {representedGroup.ownerId === profile.id ? 'Owner - ' : ''} {representedGroup.name || 'Group'} </span> <span className="text-muted-foreground block truncate"> {representedGroup.memberCount ? `${representedGroup.memberCount} members` : ''} </span> </span> 
- B054 components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:984 [Popover > PopoverTrigger]
  <Button variant="ghost" className="group/info-stat h-auto w-full justify-start p-0 text-left" />
  
- B054 components/dialogs/world-dialog/WorldDialogHeaderSection.tsx:493 [EntityOverviewCard]
  <Button type="button" variant="ghost" disabled={!imageUrl || !onOpenImage} onClick={onOpenImage} className={cn( 'bg-muted aspect-[4/3] h-auto w-full overflow-hidden rounded-lg border p-0 disabled:pointer-events-none', imageUrl && onOpenImage ? 'cursor-pointer' : 'cursor-default' )} >
   {imageUrl ? ( <FadeInImage src={imageUrl} alt={world.name || world.id || 'World'} className="size-full object-cover" /> ) : ( <span className="flex size-full items-center justify-center"> <GlobeIcon className="text-muted-foreground size-10" /> </span> )} 
- B054 components/dialogs/world-dialog/WorldDialogHeaderSection.tsx:548 [EntityOverviewCard > div > div > Tooltip > TooltipTrigger]
  <Button type="button" variant="ghost" disabled={!world.name} className="h-auto min-w-0 flex-1 justify-start overflow-hidden p-0 text-left text-lg leading-tight font-semibold whitespace-normal hover:bg-transparent disabled:pointer-events-none disabled:opacity-100" onClick={ world.name ? onCopyWorldName : undefined } >
   <span className="line-clamp-2 min-w-0 break-all"> {world.name || 'World'} </span> 
- B054 components/dialogs/world-dialog/WorldDialogHeaderSection.tsx:569 [EntityOverviewCard > div]
  <Button type="button" variant="ghost" disabled={!world.authorId} className="text-muted-foreground hover:text-foreground h-auto max-w-full min-w-0 justify-start overflow-hidden p-0 text-left text-sm hover:bg-transparent disabled:pointer-events-none disabled:opacity-100" onClick={world.authorId ? onOpenAuthor : undefined} >
   <span className="truncate">{world.authorName}</span> 
- B055 components/dialogs/EntityDialogScaffold.tsx:278 [DropdownMenu > DropdownMenuTrigger]
  <Button type="button" size="icon-lg" variant={dangerous ? 'destructive' : 'outline'} aria-label={'Open entity actions'} className="relative" >
   {busy ? ( <Spinner data-icon="inline-start" /> ) : ( <MoreHorizontalIcon data-icon="inline-start" /> )} {indicator ? ( <span className="bg-primary absolute top-1.5 right-1.5 size-2 rounded-full" /> ) : null} 
- B056 components/dialogs/EntityDialogScaffold.tsx:405 [div > div]
  <Button type="button" size="sm" variant="outline" onClick={async () => { await copyTextToClipboard( JSON.stringify(rawValue, null, 2) ); }} >
   <CopyIcon data-icon="inline-start" /> {t('common.actions.copy')} 
- B056 components/dialogs/WorldDialogContentWorkflow.tsx:321 [WorldDialogEmptyState]
  <Button type="button" variant="outline" size="sm" onClick={() => { worldActions.copyUnavailableWorldId(); }} >
   <CopyIcon data-icon="inline-start" /> {t('dialog.world.info.copy_id')} 
- B056 components/dialogs/avatar-dialog/components/AvatarDialogGalleryTab.tsx:52 [EntityDialogTabContent > EntityInfoGrid > EntityInfoBlock > div]
  <Button type="button" size="sm" variant="outline" disabled={ actionStatus === 'gallery-upload' || galleryStatus === 'idle' || galleryStatus === 'running' } onClick={onUploadGallery} >
   <UploadIcon data-icon="inline-start" /> {t('dialog.screenshot_metadata.upload')} 
- B056 components/dialogs/avatar-dialog/components/AvatarDialogGalleryTab.tsx:94 [EntityDialogTabContent > EntityInfoGrid > EntityInfoBlock > div > div > div]
  <Button type="button" size="sm" variant="outline" disabled={galleryImages.length <= 1} onClick={() => onGalleryIndexChange( (currentIndex) => (currentIndex + galleryImages.length - 1) % galleryImages.length ) } >
   {t('table.pagination.previous')} 
- B056 components/dialogs/avatar-dialog/components/AvatarDialogGalleryTab.tsx:115 [EntityDialogTabContent > EntityInfoGrid > EntityInfoBlock > div > div > div]
  <Button type="button" size="sm" variant="outline" disabled={galleryImages.length <= 1} onClick={() => onGalleryIndexChange( (currentIndex) => (currentIndex + 1) % galleryImages.length ) } >
   {t('table.pagination.next')} 
- B056 components/dialogs/group-dialog/GroupDialogEvents.tsx:219 [div > div]
  <Button type="button" size="sm" variant="outline" disabled={loading} onClick={onRefresh} >
   {loading ? ( <Spinner data-icon="inline-start" /> ) : ( <RefreshCwIcon data-icon="inline-start" /> )} {t('common.actions.refresh')} 
- B056 components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:164 [div > div > DropdownMenu > DropdownMenuTrigger]
  <Button type="button" size="sm" variant="outline" disabled={busy || !canAssignRoles} className="w-fit" >
   {selectedRoleIds.length ? t( 'dialog.group_member_moderation.roles_count', { count: selectedRoleIds.length } ) : t( 'dialog.group_member_moderation.choose_roles_placeholder' )} 
- B056 components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:224 [div > div]
  <Button type="button" size="sm" variant="outline" disabled={ busy || !selectedRoleIds.length || !canAssignRoles } onClick={() => onAddRoles?.(selectedRoleIds)} >
   {t('dialog.group_member_moderation.add_roles')} 
- B056 components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:250 [div > div]
  <Button type="button" size="sm" variant="outline" disabled={busy || !canManageMembers} onClick={() => onSaveNote?.(note)} >
   {t('dialog.group_member_moderation.save_note')} 
- B056 components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:259 [div > div]
  <Button type="button" size="sm" variant="outline" disabled={busy || !canRemoveMembers} onClick={onKick} >
   {t('dialog.group_member_moderation.kick')} 
- B056 components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:268 [div > div]
  <Button type="button" size="sm" variant="outline" disabled={busy || !canManageBans} onClick={onBan} >
   {t('dialog.group_member_moderation.ban')} 
- B056 components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:279 [div > div]
  <Button type="button" size="sm" variant="outline" disabled={busy || !canManageBans} onClick={onUnban} >
   {t('dialog.group_member_moderation.unban')} 
- B056 components/dialogs/group-dialog/GroupModerationLogsPanel.tsx:416 [TabsContent > div > div]
  <Button type="button" size="sm" variant="outline" disabled={loading} onClick={onReload} >
   <RefreshCwIcon data-icon="inline-start" /> {t('common.actions.refresh')} 
- B056 components/dialogs/group-dialog/GroupModerationLogsPanel.tsx:426 [TabsContent > div > div]
  <Button type="button" size="sm" variant="outline" disabled={!rows.length} onClick={() => downloadJsonFile(`${group.id}_logs.json`, rows) } >
   <DownloadIcon data-icon="inline-start" /> JSON 
- B056 components/dialogs/group-dialog/GroupModerationLogsPanel.tsx:438 [TabsContent > div > div]
  <Button type="button" size="sm" variant="outline" disabled={!rows.length} onClick={onExport} >
   <DownloadIcon data-icon="inline-start" /> {t('dialog.group_member_moderation.export_logs')} 
- B056 components/dialogs/group-dialog/GroupModerationLogsPanel.tsx:452 [TabsContent > div > div > DropdownMenu > DropdownMenuTrigger]
  <Button type="button" size="sm" variant="outline" disabled={loading} >
   <ListFilterIcon data-icon="inline-start" /> {filterLabel} 
- B056 components/dialogs/group-dialog/GroupModerationTabPanel.tsx:177 [TabsContent > div > div]
  <Button type="button" size="sm" variant="outline" disabled={loading} onClick={onReload} >
   <RefreshCwIcon data-icon="inline-start" /> {t('common.actions.refresh')} 
- B056 components/dialogs/group-dialog/GroupModerationTabPanel.tsx:187 [TabsContent > div > div]
  <Button type="button" size="sm" variant="outline" disabled={!rows.length} onClick={() => downloadJsonFile( `${group.id}_${tab.value}.json`, rows ) } >
   <DownloadIcon data-icon="inline-start" /> JSON 
- B056 components/dialogs/group-dialog/GroupModerationTabPanel.tsx:390 [TabsContent > div]
  <Button type="button" size="sm" variant="outline" disabled={!server.hasMore || server.loadingMore} onClick={server.onLoadMore} >
   {server.loadingMore ? ( <Loader2Icon data-icon="inline-start" className="animate-spin" /> ) : null} {t('common.load_more')} 
- B056 components/dialogs/group-dialog/GroupModerationWorkspace.tsx:293 [div > Tabs > GroupModerationTabPanel]
  <Button type="button" size="sm" variant="outline" onClick={() => setBanImportOpen(true)} >
   <UploadIcon data-icon="inline-start" /> {t( 'dialog.group_member_moderation.import_bans' )} 
- B056 components/dialogs/user-dialog/components/UserDialogGroupQuickModerationDialog.tsx:171 [div]
  <Button size="sm" variant="outline" onClick={onRetry}>
   {retryLabel} 
- B056 components/dialogs/user-dialog/components/UserDialogGroupsTab.tsx:121 [EntityDialogTabContent > UserDialogSearchHeader]
  <Button type="button" size="sm" variant="outline" onClick={() => { closeDialog(); navigate('/tools/my-groups'); }} >
   {t('dialog.user.groups.manage')} 
- B056 components/dialogs/world-dialog/WorldDialogTabPanels.tsx:398 [EntityDialogTabs > EntityDialogTabContent > div]
  <Button type="button" variant="outline" size="sm" disabled={screenshotsRefreshDisabled} onClick={onRefreshScreenshots} >
   {screenshotsRefreshDisabled ? ( <Spinner data-icon="inline-start" /> ) : ( <RefreshCwIcon data-icon="inline-start" /> )} {t('common.actions.refresh')} 
- B057 components/dialogs/EntityDialogScaffold.tsx:511 [Tooltip > TooltipTrigger]
  <Button type="button" aria-label={label} size="icon-xs" variant="ghost" onClick={onClick} >
   <Icon /> 
- B057 components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:816 [TranslatableText > InfoPanel > div]
  <Button key={link} type="button" variant="ghost" size="icon-xs" aria-label={t( 'dialog.user.info.open_bio_link', { link } )} title={link} onClick={() => openExternalLink(link)} >
   <BioLinkFavicon link={link} fallback={ <ExternalLinkIcon data-icon="inline-start" /> } /> 
- B057 components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:906 [InfoPanel]
  <Button type="button" variant="ghost" size="icon-xs" disabled={!currentUserId || !profile.id || loading} aria-label={t( 'dialog.user.info.refresh_status_distribution' )} title={t('dialog.user.info.refresh_status_distribution')} onClick={load} >
   {loading ? ( <Spinner className="size-3" /> ) : ( <RefreshCwIcon /> )} 
- B058 components/dialogs/avatar-dialog/components/AvatarDialogGalleryTab.tsx:74 [EntityDialogTabContent > EntityInfoGrid > EntityInfoBlock > div > div]
  <Button type="button" disabled={!currentGalleryImage} variant="outline" className="bg-muted/20 h-52 w-full overflow-hidden p-0" onClick={onOpenGalleryPreview} >
   {currentGalleryImage ? ( <FadeInImage src={currentGalleryImage} alt="" className="size-full object-contain" /> ) : ( <span className="text-muted-foreground flex size-full items-center justify-center [&>svg]:size-8"> <ImageIcon /> </span> )} 
- B058 components/dialogs/user-dialog/components/UserDialogGroupQuickModerationDialog.tsx:202 [div]
  <Button type="button" variant="outline" disabled={busy} onClick={onCancel} >
   {cancelLabel} 
- B058 components/hosts/LaunchDialogHost.tsx:160 []
  <Button type="button" variant="outline" disabled={disabled} onClick={onClick} className="h-auto flex-col gap-1.5 px-2 py-3 whitespace-normal" >
   {pending ? ( <Spinner className="size-5" /> ) : ( <Icon className="size-5" /> )} <span className="text-sm leading-none font-medium">{label}</span> {hint ? ( <span className="text-muted-foreground text-[10px] leading-tight"> {hint} </span> ) : null} 
- B059 components/dialogs/avatar-dialog/components/AvatarDialogHeaderActions.tsx:99 []
  <Button type="button" variant={canSelectAvatar ? 'default' : 'outline'} className="min-w-0 flex-1" aria-label={selectLabel} disabled={!canSelectAvatar || actionStatus === 'selecting'} onClick={onSelect} >
   <SelectIcon data-icon="inline-start" /> <span className="truncate">{selectLabel}</span> 
- B059 components/dialogs/group-dialog/GroupDialogHeaderSection.tsx:576 [EntityOverviewCard]
  <Button type="button" className="w-full" variant={primaryAction.variant} disabled={primaryAction.disabled} onClick={primaryAction.onClick} >
   <PrimaryIcon data-icon="inline-start" /> <span className="truncate">{primaryAction.label}</span> 
- B059 components/dialogs/world-dialog/WorldDialogHeaderSection.tsx:256 [div]
  <Button type="button" className="min-w-0 flex-1" disabled={actionStatus === 'new-instance'} onClick={onNewInstance} >
   <FlagIcon data-icon="inline-start" /> <span className="truncate"> {t('dialog.world.actions.new_instance')} </span> 
- B060 components/dialogs/avatar-dialog/components/AvatarDialogPerformanceTab.tsx:229 []
  <Button type="button" variant="outline" size="xs" onClick={onRefresh}>
   <RefreshCwIcon data-icon="inline-start" /> {t('common.actions.refresh')} 
- B060 components/dialogs/group-dialog/GroupDialogTabPanels.tsx:373 [EntityDialogTabs > EntityDialogTabContent > GroupOverviewSection]
  <Button type="button" size="xs" variant="outline" onClick={() => onChangeTab('events')} >
   {t('dialog.group.overview.open_events')} 
- B060 components/dialogs/world-dialog/WorldDialogHeaderSection.tsx:605 [EntityOverviewCard > div]
  <Button type="button" size="xs" variant="outline" className="rounded-full" onClick={() => onChangeTab('info')} >
   {t('dialog.world.tags.restrictions_count', { count: restrictions.length })} 
- B060 components/dialogs/world-dialog/WorldSidebarPinButton.tsx:54 []
  <Button type="button" variant="outline" size="xs" className="ml-auto" disabled={!worldId || !hydrated} onClick={toggle} >
   {pinned ? ( <PinOffIcon data-icon="inline-start" /> ) : ( <PinIcon data-icon="inline-start" /> )} {pinned ? t('dialog.world.instances.unpin_from_sidebar') : t('dialog.world.instances.pin_to_sidebar')} 
- B061 components/dialogs/avatar-dialog/components/AvatarDialogPerformanceTab.tsx:341 [EntityDialogTabContent > div > Tabs > div]
  <Button type="button" variant="link" size="xs" className="text-muted-foreground hover:text-foreground ml-auto h-auto p-0" onClick={() => { void openExternalLink( performanceDocsUrl( activePlatform.key ) ); }} >
   <ExternalLinkIcon data-icon="inline-start" /> {t( activePlatform.key === 'pc' ? 'dialog.avatar.performance.pc_rules' : 'dialog.avatar.performance.mobile_rules' )} 
- B061 components/dialogs/group-dialog/GroupDialogTabPanels.tsx:453 [EntityDialogTabs > EntityDialogTabContent > GroupOverviewSection > EntityInfoGrid > EntityInfoBlock > div]
  <Button key={link} type="button" variant="link" size="xs" className="h-auto max-w-full min-w-0 justify-start p-0 text-left break-all whitespace-normal" onClick={() => onOpenLink(link)} >
   <ExternalLinkIcon data-icon="inline-start" /> <span className="min-w-0 break-all"> {link} </span> 
- B062 components/dialogs/group-dialog/GroupMembersPanel.tsx:421 [div > div > div > DropdownMenu > DropdownMenuTrigger]
  <Button type="button" size="icon-sm" variant="ghost" aria-label={t('accessibility.more')} />
  
- B062 components/dialogs/group-dialog/GroupRowList.tsx:204 [div > div > div]
  <Button type="button" size="icon-sm" variant="ghost" aria-label={t('common.actions.edit')} onClick={() => onEditPost?.(post)} >
   <PencilIcon data-icon="inline-start" /> 
- B062 components/dialogs/group-dialog/GroupRowList.tsx:213 [div > div > div]
  <Button type="button" size="icon-sm" variant="ghost" className="text-destructive" aria-label={t('common.actions.delete')} onClick={() => onDeletePost?.(post)} >
   <MessageSquareIcon data-icon="inline-start" /> 
- B062 components/dialogs/user-dialog/components/UserDialogMutualGraphImpl.tsx:128 [div > div > Popover > PopoverTrigger]
  <Button type="button" variant="ghost" size="icon-sm" className="absolute top-2 right-2 z-10" aria-label={t( 'view.charts.mutual_friend.settings.title' )} >
   <Settings2Icon /> 
- B062 components/hosts/DialogHost.tsx:110 [Dialog > DialogContent > div]
  <Button type="button" variant="ghost" size="icon-sm" aria-label={t('common.actions.back')} onClick={() => popToBreadcrumb(currentBreadcrumbIndex - 1) } >
   <ArrowLeftIcon data-icon="inline-start" /> 
- B063 components/dialogs/group-dialog/GroupMembersPanel.tsx:529 [div > div > div]
  <Button type="button" size="sm" variant="ghost" disabled={members.isLoadingMore} onClick={onLoadMore} >
   {t('common.load_more')} 
- B063 components/dialogs/user-dialog/components/UserDialogHeaderSection.tsx:327 [EntityFactRow]
  <Button type="button" variant="ghost" size="sm" aria-pressed={checked} disabled={disabled} onClick={onToggle} className="text-muted-foreground hover:text-foreground h-auto min-w-0 px-1 py-0 text-xs" >
   <span className="min-w-0 truncate text-right">{value}</span> 
- B064 components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:124 [div > div]
  <Button type="button" size="icon-sm" variant="outline" className="rounded-full" disabled={busy} onClick={onClear} aria-label={t('common.actions.delete')} >
   <Trash2Icon /> 
- B064 components/dialogs/user-dialog/components/UserDialogFeedTab.tsx:117 [div > div > Tooltip > TooltipTrigger]
  <Button type="button" variant="outline" size="icon-sm" className="ml-auto" aria-label={openFeedLabel} onClick={onOpenFullFeed} >
   <ArrowUpRightIcon className="size-4" /> 
- B064 components/dialogs/user-dialog/components/UserDialogSearchHeader.tsx:46 [div > div]
  <Button type="button" size="icon-sm" variant="outline" disabled={running} aria-label={t('common.actions.refresh')} onClick={() => { loadTab(tab, { force: true }); }} >
   {running ? ( <Spinner data-icon="inline-start" /> ) : ( <RefreshCwIcon data-icon="inline-start" /> )} <span className="sr-only"> {t('common.actions.refresh')} </span> 
- B065 components/dialogs/group-dialog/GroupModerationBulkPanel.tsx:237 [div > div]
  <Button type="button" size="sm" variant="secondary" disabled={ busy || !selectedRoleIds.length || !canAssignRoles } onClick={() => onRemoveRoles?.(selectedRoleIds)} >
   {t('dialog.group_member_moderation.remove_roles')} 
- B066 components/dialogs/group-dialog/SavedGroupFavoriteButton.tsx:97 [DropdownMenu > DropdownMenuTrigger]
  <Button type="button" size="icon-lg" variant={favoriteCollection ? 'secondary' : 'outline'} disabled={busy} aria-label={t('saved_group_favorites.toggle', { defaultValue: '群组收藏' })} >
   <StarIcon className={favoriteCollection ? 'fill-current' : ''} /> 
- B067 components/dialogs/group-dialog/useGroupModerationColumns.tsx:305 [div]
  <Button key={action.key} type="button" size="sm" variant={ DANGER_ACTION_KEYS.has(action.key) ? 'destructive' : action.destructive ? 'outline' : 'secondary' } className="transition-transform duration-[140ms] ease-out active:scale-[0.97]" disabled={Boolean(actionKey)} onClick={() => onRunAction(action, row.original) } >
   {isRunning ? '...' : action.label} 
- B068 components/dialogs/user-dialog/components/UserDialogGroupQuickModerationDialog.tsx:193 [div]
  <Button type="button" variant="destructive" disabled={busy} onClick={onConfirm} >
   {busy ? <LoaderCircleIcon className="animate-spin" /> : null} {confirmLabel} 
- B069 components/dialogs/user-dialog/components/UserDialogHeaderBadges.tsx:325 [Popover > PopoverTrigger]
  <Button type="button" variant="ghost" size={badgeImageUrl ? 'icon' : 'sm'} aria-label={badgeTitle} title={badgeTitle} className={cn( 'transition-transform duration-150 ease-out active:scale-[0.97] [@media(hover:hover)]:hover:scale-110', badgeImageUrl ? 'size-8 rounded-sm p-0' : 'h-8 max-w-full rounded-sm px-2 text-xs', !isBadgeVisible && 'opacity-60' )} onClick={(event) => event.stopPropagation()} >
   {badgeImageUrl ? ( <FadeInImage src={badgeImageUrl} alt={badge.badgeName || ''} className={cn( 'size-8 rounded-sm object-cover', !isBadgeVisible && 'grayscale' )} /> ) : ( <span className="max-w-32 truncate"> {badgeName || badge.badgeId} </span> )} 
- B070 components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:710 [TranslatableText > InfoPanel > div]
  <Button type="button" variant={showHistory ? 'secondary' : 'ghost'} size="icon-xs" aria-label={t('dialog.user.info.bio_history')} title={t('dialog.user.info.bio_history')} onClick={() => setShowHistory((value) => !value) } >
   <HistoryIcon /> 
- B071 components/dialogs/user-dialog/components/UserDialogInfoTab.tsx:727 [TranslatableText > InfoPanel > div > Tooltip > TooltipTrigger]
  <Button type="button" size="icon-xs" variant="outline" aria-label={editLabel} onClick={onEditBio} >
   <PencilIcon data-icon="inline-start" /> 
- B072 components/dialogs/user-dialog/components/UserDialogProfileBackgroundPicker.tsx:115 [div > div]
  <Button type="button" size="sm" className="ms-auto" disabled={pending || !gradientChanged} onClick={() => onUpdateBackground( 'gradient', buildGradientBackgroundUpdate( gradientTop, gradientBottom ) ) } >
   {t('dialog.inventory.apply_gradient')} 
- B102 features/auth/components/LoginFormCard.tsx:58 [Card > CardHeader]
  <Button type="button" variant="link" className="text-muted-foreground h-auto w-fit p-0 text-xs" onClick={onBackToSavedAccounts} >
   <ArrowLeftIcon data-icon="inline-start" /> {t('view.login.backToSavedAccounts')} 
- B102 features/auth/components/LoginFormCard.tsx:180 [Card > CardContent > div]
  <Button type="button" variant="link" className="text-muted-foreground h-auto p-0 text-xs" onClick={onOpenRegister} >
   {t('view.login.register')} 
- B102 features/auth/components/LoginFormCard.tsx:189 [Card > CardContent > div]
  <Button type="button" variant="link" className="text-muted-foreground h-auto p-0 text-xs" onClick={onOpenForgotPassword} >
   {t('view.login.forgotPassword')} 
- B102 features/auth/components/LoginPageFooter.tsx:17 [div > div]
  <Button type="button" variant="link" className="text-muted-foreground/75 h-auto p-0 text-[0.7rem]" onClick={onOpenGithub} >
   GitHub 
- B102 features/auth/components/LoginPageFooter.tsx:28 [div > div]
  <Button type="button" variant="link" className="text-muted-foreground/75 h-auto p-0 text-[0.7rem]" onClick={onOpenDiscord} >
   Discord 
- B103 features/auth/components/LoginFormCard.tsx:163 [Card > CardContent > form]
  <Button type="submit" size="lg" className="mt-auto w-full" disabled={busy} >
   {submitting ? ( <> <Spinner data-icon="inline-start" /> {t('view.login.signingIn')} </> ) : ( t('view.login.login') )} 
- B104 features/auth/components/LoginPageUtilities.tsx:28 [div]
  <Button type="button" variant="outline" onClick={onOpenProxyDialog}>
   <NetworkIcon data-icon="inline-start" /> {t('view.login.proxy_settings')} 
- B104 features/auth/components/LoginPageUtilities.tsx:32 [div]
  <Button type="button" variant="outline" disabled={disabled || isValidatingRestore} onClick={onRestoreProfileBackup} >
   {isValidatingRestore ? ( <Spinner data-icon="inline-start" /> ) : ( <ArchiveRestoreIcon data-icon="inline-start" /> )} {t('profile_backup.restore_from_backup')} 
- B104 features/auth/components/LoginPageUtilities.tsx:46 [div]
  <Button type="button" variant="outline" className="sm:col-span-2" disabled={disabled} onClick={onMigrateLegacyVrcxData} >
   <DatabaseIcon data-icon="inline-start" /> {t( 'view.settings.advanced.advanced.database_cleanup.legacy_migration' )} 
- B105 features/auth/components/LoginServerStatusAlert.tsx:38 [Alert > AlertDescription]
  <Button type="button" variant="link" size="xs" onClick={onOpenStatusPage} >
   {t('status_bar.view_status')} <ExternalLinkIcon data-icon="inline-end" /> 
- B106 features/auth/components/SavedAccountsCard.tsx:68 [Card > CardContent > div > div]
  <Button type="button" variant="ghost" className="bg-muted/40 hover:bg-muted h-auto min-w-0 flex-1 justify-start gap-3 p-2 text-left font-normal" disabled={isAuthBusy || isDeleting} onClick={() => { if (canUseSavedCredentials) { onLogin(entry); } else { onUseOtherAccount(entry); } }} >
   <Avatar size="lg"> {avatarUrl ? ( <AvatarImage src={avatarUrl} alt="" /> ) : null} <AvatarFallback> {getSavedAccountFallback( entry.user )} </AvatarFallback> </Avatar> <div className="min-w-0 flex-1"> <div className="truncate text-sm font-medium"> {getUserDisplayName(entry.user)} </div> <div className="text-muted-foreground truncate text-xs"> {entry.user.username || userId} </div> </div> {isRelogging ? ( <Spinner data-icon="inline-end" className="text-muted-foreground shrink-0" /> ) : null} 
- B107 features/auth/components/SavedAccountsCard.tsx:109 [Card > CardContent > div > div]
  <Button type="button" variant="ghost" size="icon-sm" aria-label={t( 'view.login.saved_account_remove.description', { name: getUserDisplayName(entry.user) } )} disabled={isDeleting || isAuthBusy} onClick={() => { onCancelAutoLogin(); onDeleteStart(entry); }} >
   <Trash2Icon data-icon="inline-start" /> 
- B108 features/auth/components/SavedAccountsCard.tsx:131 [Card > CardContent]
  <Button type="button" variant="secondary" className="w-full" disabled={isAuthBusy || isDeleting} onClick={() => { onUseOtherAccount(); }} >
   {t('view.login.useOtherAccount')} 
- B109 features/privacy-lock/PrivacyLockOverlay.tsx:121 [div > div]
  <Button type="button" variant="outline" size="sm" disabled={pendingAction !== null} onClick={() => void runAction( 'background', startBackgroundModeForCurrentSession ) } >
   {pendingAction === 'background' ? ( <Spinner data-icon="inline-start" /> ) : null} {t('privacy_lock.action.background_mode')} 
- B109 features/privacy-lock/PrivacyLockOverlay.tsx:138 [div > div]
  <Button type="button" variant="outline" size="sm" disabled={pendingAction !== null} onClick={() => void runAction('logout', logoutWithoutConfirmation) } >
   {pendingAction === 'logout' ? ( <Spinner data-icon="inline-start" /> ) : null} {t('privacy_lock.action.logout')} 
- B110 features/privacy-lock/PrivacyLockOverlay.tsx:227 [div]
  <Button type="button" variant="link" className="text-muted-foreground h-auto p-0 text-xs" onClick={onForgot} >
   {t('privacy_lock.action.forgot')} 
- B110 features/privacy-lock/PrivacyLockOverlay.tsx:291 [form]
  <Button type="button" variant="link" className="text-muted-foreground h-auto p-0 text-xs" onClick={onBack} >
   {t('privacy_lock.action.back')} 
- B111 features/privacy-lock/PrivacyLockOverlay.tsx:283 [form]
  <Button type="submit" className="w-full" disabled={submitting || !password} >
   {submitting ? <Spinner data-icon="inline-start" /> : null} {t('privacy_lock.action.clear_and_unlock')} 
