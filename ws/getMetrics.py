#Standard Libraries
import cgitb, os, cgi, json
cgitb.enable()

MAX_RESULTS = 10

from pymongo import MongoClient
from collections import Counter
from datetime import datetime

try: 
	fields = cgi.FieldStorage()

	candidateName = fields['candidate'].value.title()
	dateFromStr = fields['dateFrom'].value
	dateToStr = fields['dateTo'].value

	dateFrom = datetime.strptime(dateFromStr, '%Y-%m-%d')
	dateTo = datetime.strptime(dateToStr, '%Y-%m-%d')


	col = MongoClient().test.twitter_search_candidates

	tweets = list(col.find({'search_info.keywords': candidateName, 'created_at_local': {'$gte': dateFrom, '$lt': dateTo}}).batch_size(10000))
	 
	entitySets = [t for t in tweets if 'entities' in t]

	hashCounter = Counter([hashtag for t in entitySets if 'hashtags' in t['entities'] for hashtag in t['entities']['hashtags']])
	urlCounter = Counter([url for t in entitySets if 'long_urls' in t['entities'] for url in t['entities']['long_urls']])
	mentionCounter = Counter([mention for t in entitySets if 'user_mentions' in t['entities'] for mention in t['entities']['user_mentions']])

	topUrls = urlCounter.most_common(MAX_RESULTS)
	topHashes = hashCounter.most_common(MAX_RESULTS)
	topMentions = mentionCounter.most_common(MAX_RESULTS)
	#topMentions = sorted(mentionCounter.items(), key=lambda x: x[1], reverse=True)[:RESULTS_MAX]


	rtCounter = Counter([t['retweeted_id'] for t in tweets if 'retweeted_id' in t])
	topRTs = rtCounter.most_common(MAX_RESULTS)
	topRTTexts = []

	for indx, item in enumerate(topRTs):
		retweeted = col.find_one({'_id': item[0]})
		if retweeted and 'text' in retweeted:
			topRTTexts.append({'value': retweeted['text'], 'count': item[1], 'rank': indx + 1})
		

	output = {}
	output['candidate'] = candidateName
	output['urls'] = [{'value': item[0], 'count': item[1], 'rank': indx + 1} for indx, item in enumerate(topUrls)]
	output['hashtags'] = [{'value': item[0], 'count': item[1], 'rank': indx + 1} for indx, item in enumerate(topHashes)]
	output['mentions'] = [{'value': item[0], 'count': item[1], 'rank': indx + 1} for indx, item in enumerate(topMentions)]
	output['retweets'] = topRTTexts

	print ''
	print json.dumps(output)
except Exception, e:
	print ''
	print json.dumps(str(e))
