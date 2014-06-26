USE Berf
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME= 'MVC')
BEGIN
	DROP TABLE MVC
END
GO
CREATE TABLE dbo.MVC
	(
	MVCID uniqueidentifier primary key nonclustered NOT NULL default NEWID(),
	[Action] nvarchar(max) NOT NULL,
	Controller nvarchar(max) NOT NULL,
	Area nvarchar(max) NOT NULL,
	ActionStart datetime NOT NULL,
	ActionEnd datetime NOT NULL,
	ResultStart datetime NOT NULL,
	ResultEnd datetime NOT NULL,
	ActionDuration float NOT NULL,
	ResultDuration float NOT NULL,
	BerfSessionID uniqueidentifier NOT NULL,
	Created datetime NOT NULL,
	ClientIPAddress nvarchar(39) NOT NULL,
	UserName nvarchar(max) NOT NULL,
	UserAgent nvarchar(MAX) NOT NULL,
	Browser nvarchar(max) NULL,
	BrowserVersion nvarchar(max) NULL,
	HostMachineName nvarchar(MAX) NOT NULL,
	Headers nvarchar(max) NULL,
	InputStream nvarchar(max) NULL,
	Url nvarchar(max) NULL
	) 
GO

USE Berf
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME= 'Client')
BEGIN
	DROP TABLE Client
END
GO
CREATE TABLE dbo.Client
	(
	ClientID uniqueidentifier primary key nonclustered NOT NULL default NEWID(),
	BerfSessionID uniqueidentifier NOT NULL,
	unloadEventStart float NULL,
	unloadEventEnd float NULL,
	linkNegotiationStart float NULL,
	linkNegotiationEnd float NULL,
	redirectStart float NULL,
	redirectEnd float NULL,
	fetchStart float NULL,
	domainLookupStart float NULL,
	domainLookupEnd float NULL,
	connectStart float NULL,
	connectEnd float NULL,
	secureConnectionStart float NULL,
	requestStart float NULL,
	responseStart float NULL,
	responseEnd float NULL,
	domLoading float NULL,
	domInteractive float NULL,
	domContentLoadedEventStart float NULL,
	domContentLoadedEventEnd float NULL,
	domComplete float NULL,
	loadEventStart float NULL,
	loadEventEnd float NULL,
	prerenderSwitch float NULL,
	redirectCount int null,
	initiatorType nvarchar(max) NULL,
	name nvarchar(MAX) NULL,
	entryType nvarchar(MAX) NULL,
	startTime float NULL,
	duration float NULL,
	navigationStart float NULL,
	Url nvarchar(max),
	Source nvarchar(MAX) NULL,
	Created datetime NOT NULL,
	UserName nvarchar(max) NOT NULL,
	ClientIPAddress nvarchar(39) NOT NULL,
	UserAgent nvarchar(MAX) NOT NULL,
	Browser nvarchar(max) NULL,
	BrowserVersion nvarchar(max) NULL,
	HostMachineName nvarchar(MAX) NOT NULL
	) 
GO