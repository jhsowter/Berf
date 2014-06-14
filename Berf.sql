if exists (select * from INFORMATION_SCHEMA.TABLES where TABLE_NAME = 'BerfTimer')
begin
	drop table BerfTimer
end
go 

create table BerfTimer
(
	--**************************************************
	BerfTimerId							uniqueidentifier							not null default(newid()),
	BerfSessionId						[varchar](200)	NULL default('-'),
	[EventDt]							[datetime]		NULL default(getdate()),

	[BerfType]							[int]			NULL default(0),

	--**************************************************
	[SigId]							[varchar](200)	NULL default('-'),
	[SigTestId]						[varchar](200)	NULL default('-'),
	[Time]							[float]			NULL default(0),

	[ActionTime]					[float]			NULL default(0),
	[ViewTime]						[float]			NULL default(0),
	[ControllerAction]				[varchar](200)	NULL default('-'),

	[Count]							[int]			NULL default(0),
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

	--**************************************************
	-- TimingResource
	--connectEnd: 1.6406110861237808
    --connectEnd						float			not null default(0),
	--connectStart: 1.6406110861237808
    --connectStart					float			not null default(0),
	--domainLookupEnd: 1.6406110861237808
    --domainLookupEnd					float			not null default(0),
	--domainLookupStart: 1.6406110861237808
    --domainLookupStart				float			not null default(0),
	--duration: 0.5149737834272623
    duration					float			not null default(0),
	--entryType: "resource"
	[entryType]					[varchar](200)	NULL default('-'),
	--fetchStart: 1.6406110861237808
	--initiatorType: "link"
	[initiatorType]					[varchar](200)	NULL default('-'),
	--name: "http://localhost:48213/Content/css?v=m8KdMFOCcNeZrATLbCQ_9gxex1_Ma7rE5iJzJXojUIk1"
	[name]					[varchar](200)	NULL default('-'),
	--redirectEnd: 0
    --redirectEnd						float			not null default(0),
	--redirectStart: 0
    --redirectStart					float			not null default(0),
	--requestStart: 1.6406110861237808
    --requestStart					float			not null default(0),
	--responseEnd: 1.7239245469830566
    --responseEnd						float			not null default(0),
	--responseStart: 1.6406110861237808
    --responseStart					float			not null default(0),
	--startTime: 1.2089507635557943
	startTime						float			not null default(0),

	-- Timing
	navigationStart					float			not null default(0),
    unloadEventStart				float			not null default(0),
    unloadEventEnd					float			not null default(0),
    redirectStart					float			not null default(0),
    redirectEnd						float			not null default(0),
    fetchStart						float			not null default(0),
    domainLookupStart				float			not null default(0),
    domainLookupEnd					float			not null default(0),
    connectStart					float			not null default(0),
    connectEnd						float			not null default(0),
    secureConnectionStart			float			not null default(0),
    requestStart					float			not null default(0),
    responseStart					float			not null default(0),
    responseEnd						float			not null default(0),
    domLoading						float			not null default(0),
    domInteractive					float			not null default(0),
    domContentLoadedEventStart		float			not null default(0),
    domContentLoadedEventEnd		float			not null default(0),
    domComplete						float			not null default(0),
    loadEventStart					float			not null default(0),
    loadEventEnd					float			not null default(0),
    [type]							float			not null default(0),
    [redirectCount]					float			not null default(0),

	[Url]							[varchar](600)	NULL default('-'),



)
alter table BerfTimer add constraint pkBerfTimer primary key nonclustered(BerfTimerID) 
go 
-- ~~~~~~~~~~~~~~~~~~~~~~~~
truncate table BerfTimer ; 
go 

--INSERT INTO Berf (BerfId, NavigationStart) VALUES ( newid() , 3)
select * from BerfTimer ;
-- ------------------------



/*
// TimingResource
//connectEnd: 1.6406110861237808
//connectStart: 1.6406110861237808
//domainLookupEnd: 1.6406110861237808
//domainLookupStart: 1.6406110861237808
//duration: 0.5149737834272623
//entryType: "resource"
//fetchStart: 1.6406110861237808
//initiatorType: "link"
//name: "http://localhost:48213/Content/css?v=m8KdMFOCcNeZrATLbCQ_9gxex1_Ma7rE5iJzJXojUIk1"
//redirectEnd: 0
//redirectStart: 0
//requestStart: 1.6406110861237808
//responseEnd: 1.7239245469830566
//responseStart: 1.6406110861237808
//startTime: 1.2089507635557943


*/
