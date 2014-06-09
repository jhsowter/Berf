if exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'Berf')
begin
	drop table Berf
end
go 

create table Berf
(
	BerfId uniqueidentifier							not null default(newid()),
	navigationStart					bigint			not null default(0),
    unloadEventStart				bigint			not null default(0),
    unloadEventEnd					bigint			not null default(0),
    redirectStart					bigint			not null default(0),
    redirectEnd						bigint			not null default(0),
    fetchStart						bigint			not null default(0),
    domainLookupStart				bigint			not null default(0),
    domainLookupEnd					bigint			not null default(0),
    connectStart					bigint			not null default(0),
    connectEnd						bigint			not null default(0),
    secureConnectionStart			bigint			not null default(0),
    requestStart					bigint			not null default(0),
    responseStart					bigint			not null default(0),
    responseEnd						bigint			not null default(0),
    domLoading						bigint			not null default(0),
    domInteractive					bigint			not null default(0),
    domContentLoadedEventStart		bigint			not null default(0),
    domContentLoadedEventEnd		bigint			not null default(0),
    domComplete						bigint			not null default(0),
    loadEventStart					bigint			not null default(0),
    loadEventEnd					bigint			not null default(0),
    [type]							bigint			not null default(0),
    [redirectCount]					bigint			not null default(0),

	[Url]							[varchar](600)	NULL default('-'),


	[SigTestId]						[varchar](200)	NULL default('-'),
	[SigId]							[varchar](200)	NULL default('-'),
	[Time]							[float]			NULL default(0),

	[ActionTime]					[float]			NULL default(0),
	[ViewTime]						[float]			NULL default(0),
	[ControllerAction]				[varchar](200)	NULL default('-'),

	[Count]							[int]			NULL default(0),
	[EventDt]						[datetime]		NULL default(getdate()),
	[ServerEventDt]					[varchar](200)	NULL default('-'),
	[BrowserEventDt]				[varchar](200)	NULL default('-'),
	[ClientSig]						[varchar](200)	NULL default('-'),
	[ClientSigVer]					[varchar](200)  NULL default('-'),
	[IP]							[varchar](50)	NULL default('-'),
	[UserId]						[varchar](100)	NULL default('-'),
	[Browser]						[varchar](100)	NULL default('-'),
	[BrowserVersion]				[varchar](100)	NULL default('-'),
	[Server]						[varchar](100)	NULL default ('-'),
	[UserScore]						[varchar](100)	NULL default('0'),
	[UserScoreType]					[varchar](100)	NULL default ('0'),
)
alter table Berf add constraint pkBerf primary key nonclustered(BerfID) 
go 
-- ~~~~~~~~~~~~~~~~~~~~~~~~
truncate table Berf ; 
go 

--INSERT INTO Berf (BerfId, NavigationStart) VALUES ( newid() , 3)
select * from Berf ;
-- ------------------------

