# SponsorTimesDB

- [vipUsers](#vipusers)
- [sponsorTimes](#sponsortimes)
- [userNames](#usernames)
- [categoryVotes](#categoryvotes)
- [lockCategories](#lockcategories)
- [warnings](#warnings)
- [shadowBannedUsers](#shadowbannedusers)
- [videoInfo](#videoinfo)
- [unlistedVideos](#unlistedvideos)
- [config](#config)
- [archivedSponsorTimes](#archivedsponsortimes)
- [ratings](#ratings)
- [userFeatures](#userFeatures)
- [shadowBannedIPs](#shadowBannedIPs)
- [titles](#titles)
- [titleVotes](#titleVotes)
- [thumbnails](#thumbnails)
- [thumbnailTimestamps](#thumbnailTimestamps)
- [thumbnailVotes](#thumbnailVotes)

### vipUsers
| Name | Type | |
| -- | :--: | -- |
| userID | TEXT | not null, primary key |
| createdAt | INTEGER | not null |

| index | field |
| -- | :--: |
| vipUsers_index | userID |

### sponsorTimes  

| Name | Type | |
| -- | :--: | -- |
| videoID | TEXT | not null |
| startTime | REAL | not null |
| endTime | REAL | not null |
| votes | INTEGER | not null |
| locked | INTEGER | not null, default '0' |
| incorrectVotes | INTEGER | not null, default 1 |
| UUID | TEXT | not null, unique, primary key |
| userID | TEXT | not null |
| timeSubmitted | INTEGER | not null |
| views | INTEGER | not null |
| category | TEXT | not null, default 'sponsor' |
| actionType | TEXT | not null, default 'skip' |
| service | TEXT | not null, default 'YouTube' |
| videoDuration | INTEGER | not null, default '0' |
| hidden | INTEGER | not null, default '0' |
| reputation | REAL | not null, default '0' |
| shadowHidden | INTEGER | not null |
| hashedVideoID | TEXT | not null, default '', sha256 |
| userAgent | TEXT | not null, default '' |
| description | TEXT | not null, default '' |
| updatedAt | INTEGER | not null |

| index | field |
| -- | :--: |
| sponsorTime_timeSubmitted | timeSubmitted |
| sponsorTime_userID | userID |
| sponsorTimes_UUID | UUID |
| sponsorTimes_hashedVideoID | service, hashedVideoID, startTime |
| sponsorTimes_videoID | service, videoID, startTime |
| sponsorTimes_videoID_category | videoID, category |
| sponsorTimes_description_gin | description, category |

### userNames

| Name | Type | |
| -- | :--: | -- |
| userID | TEXT | not null, primary key |
| userName | TEXT | not null |
| locked | INTEGER | not nul, default '0' |
| createdAt | INTEGER | not null |
| updatedAt | INTEGER | not null |

| index | field |
| -- | :--: |
| userNames_userID | userID |

### categoryVotes

| Name | Type | |
| -- | :--: | -- |
| UUID | TEXT | not null |
| category | TEXT | not null |
| votes | INTEGER | not null, default 0 |
| id | SERIAL | primary key
| createdAt | INTEGER | not null |
| updatedAt | INTEGER | not null |

| index | field |
| -- | :--: |
| categoryVotes_UUID_public | UUID, category |

### lockCategories  

| Name | Type | |
| -- | :--: | -- |
| videoID | TEXT | not null |
| userID | TEXT | not null |
| actionType | TEXT | not null, default 'skip' |
| category | TEXT | not null |
| hashedVideoID | TEXT | not null, default '' |
| reason | TEXT | not null, default '' |
| service | TEXT | not null, default 'YouTube' |
| id | SERIAL | primary key
| createdAt | INTEGER | not null |
| updatedAt | INTEGER | not null |

| index | field |
| -- | :--: |
| lockCategories_videoID | videoID, service, category |

### warnings  

| Name | Type | |
| -- | :--: | -- |
| userID | TEXT | not null |
| issueTime | INTEGER | not null |
| issuerUserID | TEXT | not null |
| enabled | INTEGER | not null |
| reason | TEXT | not null, default '' |
| type | INTEGER | default 0 |

| constraint | field |
| -- | :--: |
| PRIMARY KEY | userID, issueTime |

| index | field |
| -- | :--: |
| warnings_index | userID, issueTime, enabled |
| warnings_issueTime | issueTime |

### shadowBannedUsers  

| Name | Type | |
| -- | :--: | -- |
| userID | TEXT | not null, primary key |

| index | field |
| -- | :--: |
| shadowBannedUsers_index | userID |

### videoInfo  

| Name | Type | |
| -- | :--: | -- |
| videoID | TEXT | not null |
| channelID | TEXT | not null |
| title | TEXT | not null |
| published | REAL | not null |

| index | field |
| -- | :--: |
| videoInfo_videoID | videoID |
| videoInfo_channelID | channelID |

### unlistedVideos  

| Name | Type | |
| -- | :--: | -- |
| videoID | TEXT | not null |
| year | TEXT | not null |
| views | TEXT | not null |
| channelID | TEXT | not null |
| timeSubmitted | INTEGER | not null |
| service | TEXT | not null, default 'YouTube' |
| id | SERIAL | primary key

### config

| Name | Type | |
| -- | :--: | -- |
| key | TEXT | not null, unique, primary key |
| value | TEXT | not null |

### archivedSponsorTimes

| Name | Type | |
| -- | :--: | -- |
| videoID | TEXT | not null |
| startTime | REAL | not null |
| endTime | REAL | not null |
| votes | INTEGER | not null |
| locked | INTEGER | not null, default '0' |
| incorrectVotes | INTEGER | not null, default 1 |
| UUID | TEXT | not null, unique, primary key |
| userID | TEXT | not null |
| timeSubmitted | INTEGER | not null |
| views | INTEGER | not null |
| category | TEXT | not null, default 'sponsor' |
| actionType | TEXT | not null, default 'skip' |
| service | TEXT | not null, default 'YouTube' |
| videoDuration | INTEGER | not null, default '0' |
| hidden | INTEGER | not null, default '0' |
| reputation | REAL | not null, default '0' |
| shadowHidden | INTEGER | not null |
| hashedVideoID | TEXT | not null, default '', sha256 |
| userAgent | TEXT | not null, default '' |
| description | TEXT | not null, default '' |

### ratings  

| Name | Type | |
| -- | :--: | -- |
| videoID | TEXT | not null |
| service | TEXT | not null, default 'YouTube' |
| type | INTEGER | not null |
| count | INTEGER | not null |
| hashedVideoID | TEXT | not null |
| id | SERIAL | primary key

| index | field |
| -- | :--: |
| ratings_hashedVideoID_gin | hashedVideoID |
| ratings_hashedVideoID | hashedVideoID, service |
| ratings_videoID | videoID, service |

### userFeatures
| Name | Type | |
| -- | :--: | -- |
| userID | TEXT | not null |
| feature | INTEGER | not null |
| issuerUserID | TEXT | not null |
| timeSubmitted | INTEGER | not null |

| constraint | field |
| -- | :--: |
| primary key | userID, feature |

| index | field |
| -- | :--: |
| userFeatures_userID | userID, feature |

### shadowBannedIPs

| Name | Type | |
| -- | :--: | -- |
| hashedIP | TEXT | not null, primary key |

### titles

| Name | Type | |
| -- | :--: | -- |
| videoID | TEXT | not null |
| title | TEXT | not null |
| original | INTEGER | default 0 |
| userID | TEXT | not null
| service | TEXT | not null |
| hashedVideoID | TEXT | not null |
| timeSubmitted | INTEGER | not null |
| UUID | TEXT | not null, primary key

| index | field |
| -- | :--: |
| titles_timeSubmitted | timeSubmitted |
| titles_userID_timeSubmitted | videoID, service, userID, timeSubmitted |
| titles_videoID | videoID, service |
| titles_hashedVideoID_2 | service, hashedVideoID, timeSubmitted |

### titleVotes

| Name | Type | |
| -- | :--: | -- |
| UUID | TEXT | not null, primary key |
| votes | INTEGER | not null, default 0 |
| locked | INTEGER | not null, default 0 |
| shadowHidden | INTEGER | not null, default 0 |
| verification | INTEGER | default 0 |
| downvotes | INTEGER | default 0 |
| removed | INTEGER | default 0 |
| createdAt | INTEGER | not null |
| updatedAt | INTEGER | not null |

| constraint | field |
| -- | :--: |
| foreign key | UUID references "titles"("UUID")

| index | field |
| -- | :--: |
| titleVotes_votes | UUID, votes

### thumbnails

| Name | Type | |
| -- | :--: | -- |
| original | INTEGER | default 0 |
| userID | TEXT | not null |
| service | TEXT | not null |
| hashedVideoID | TEXT | not null |
| timeSubmitted | INTEGER | not null |
| UUID | TEXT | not null, primary key |

| index | field |
| -- | :--: |
| thumbnails_timeSubmitted | timeSubmitted |
| thumbnails_votes_timeSubmitted | videoID, service, userID, timeSubmitted |
| thumbnails_videoID | videoID, service |
| thumbnails_hashedVideoID_2 | service, hashedVideoID, timeSubmitted |

### thumbnailTimestamps

| index | field |
| -- | :--: |
| UUID | TEXT | not null, primary key
| timestamp | INTEGER | not null, default 0

| constraint | field |
| -- | :--: |
| foreign key | UUID references "thumbnails"("UUID")

### thumbnailVotes

| Name | Type | |
| -- | :--: | -- |
| UUID | TEXT | not null, primary key |
| votes | INTEGER | not null, default 0 |
| locked | INTEGER |not null, default 0 |
| shadowHidden | INTEGER | not null, default 0 |
| downvotes | INTEGER | default 0 |
| removed | INTEGER | default 0 |

| constraint | field |
| -- | :--: |
| foreign key | UUID references "thumbnails"("UUID")

| index | field |
| -- | :--: |
| thumbnailVotes_votes | UUID, votes

# Private 

- [votes](#votes)
- [categoryVotes](#categoryVotes)
- [sponsorTimes](#sponsorTimes)
- [config](#config)
- [ratings](#ratings)
- [tempVipLog](#tempVipLog)
- [userNameLogs](#userNameLogs)

### votes

| Name | Type | |
| -- | :--: | -- |
| UUID | TEXT | not null |
| userID | TEXT | not null |
| hashedIP | TEXT | not null |
| type | INTEGER | not null |
| originalVoteType | INTEGER | not null | # Since type was reused to also specify the number of votes removed when less than 0, this is being used for the actual type
| id | SERIAL | primary key |

| index | field |
| -- | :--: |
| votes_userID | UUID |

### categoryVotes

| Name | Type | |
| -- | :--: | -- |
| UUID | TEXT | not null |
| userID | TEXT | not null |
| hashedIP | TEXT | not null |
| category | TEXT | not null |
| timeSubmitted | INTEGER | not null |
| id | SERIAL | primary key |

| index | field |
| -- | :--: |
| categoryVotes_UUID | UUID, userID, hashedIP, category |

### sponsorTimes  

| Name | Type | |
| -- | :--: | -- |
| videoID | TEXT | not null |
| hashedIP | TEXT | not null |
| timeSubmitted | INTEGER | not null |
| service | TEXT | not null, default 'YouTube' |
| id | SERIAL | primary key |

| index | field |
| -- | :--: |
| privateDB_sponsorTimes_v4 | videoID, service, timeSubmitted |

### config  

| Name | Type | |
| -- | :--: | -- |
| key | TEXT | not null, primary key |
| value | TEXT | not null |

### ratings  

| Name | Type | |
| -- | :--: | -- |
| videoID | TEXT | not null |
| service | TEXT | not null, default 'YouTube' |
| userID | TEXT | not null |
| type | INTEGER | not null |
| timeSubmitted | INTEGER | not null |
| hashedIP | TEXT | not null |
| id | SERIAL | primary key |

| index | field |
| -- | :--: |
| ratings_videoID | videoID, service, userID, timeSubmitted |

### tempVipLog
| Name | Type | |
| -- | :--: | -- |
| issuerUserID | TEXT | not null |
| targetUserID | TEXT | not null |
| enabled | BOOLEAN | not null |
| updatedAt | INTEGER | not null |
| id | SERIAL | primary key |

### userNameLogs

| Name | Type | |
| -- | :--: | -- |
| userID | TEXT | not null |
| newUserName | TEXT | not null |
| oldUserName | TEXT | not null |
| updatedByAdmin | BOOLEAN | not null |
| updatedAt | INTEGER | not null |
| id | SERIAL | primary key |