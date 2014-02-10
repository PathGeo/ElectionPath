#Standard Libraries
import cgitb, os, cgi, json
cgitb.enable()

MAX_RESULTS = 10

from pymongo import MongoClient
from collections import Counter
from datetime import datetime, timedelta

USER_URL = 'http://www.twitter.com/%s'
TWEET_URL = 'http://www.twitter.com/%s/status/%d'
HASH_URL = 'https://twitter.com/search?q=%%23%s&src=hash'

try: 
	fields = cgi.FieldStorage()

	candidateName = fields['candidate'].value.title().split(",")
	category = None if 'category' not in fields else fields['category'].value
	dateFromStr = fields['dateFrom'].value
	dateToStr = fields['dateTo'].value
	voice='people' if 'voice' not in fields else fields['voice'].value

	dateFrom = datetime.strptime(dateFromStr, '%Y-%m-%d')
	dateTo = datetime.strptime(dateToStr, '%Y-%m-%d') + timedelta(days=1)
	
        col = MongoClient().test.twitter_search_candidates
        #-----------------------------------------------------------------------------
        def doQuery(candidate):
                query = {'search_info.keywords': candidate, 'created_at_local': {'$gte': dateFrom, '$lt': dateTo}}
                if category:
                        query['categories'] = category

                #determine userCategory
                if (voice=='candidate'):
                        query['user_category']=candidate+"_Team"
                
                tweets = list(col.find(query).batch_size(10000))
	 
                entitySets = [t for t in tweets if 'entities' in t]


                hashCounter = Counter([hashtag.lower() for t in entitySets if 'hashtags' in t['entities'] for hashtag in t['entities']['hashtags']])
                urlCounter = Counter([url for t in entitySets if 'long_urls' in t['entities'] for url in t['entities']['long_urls']])
                mentionCounter = Counter([mention for t in entitySets if 'user_mentions' in t['entities'] for mention in t['entities']['user_mentions']])
                userCounter = Counter([t['user']['screen_name'] for t in tweets])

                topUrls = urlCounter.most_common(MAX_RESULTS)
                topHashes = hashCounter.most_common(MAX_RESULTS)
                topMentions = mentionCounter.most_common(MAX_RESULTS)
                topUsers = userCounter.most_common(MAX_RESULTS)

                print ''
                print topUrls


                rtCounter = Counter([t['retweeted_id'] for t in tweets if 'retweeted_id' in t])
                topRTs = rtCounter.most_common(MAX_RESULTS)
                topRTTexts = []

                for indx, item in enumerate(topRTs):
                        retweeted = col.find_one({'_id': item[0]})
                        if retweeted and 'text' in retweeted:
                                topRTTexts.append({'value': retweeted['text'], 'count': item[1], 'url': TWEET_URL % (retweeted['user']['screen_name'], retweeted['id']), 'rank': indx + 1, 'profile_image':retweeted['user']['profile_image_url'] if 'profile_image_url' in retweeted['user'] else null, 'profile_screenName': retweeted['user']['screen_name'], 'profile_id': retweeted['user']['id']})
                        

                output = {}
                output['candidate'] = candidate
                output['topWebpages'] = [{'value': item[0], 'url': item[0], 'count': item[1], 'rank': indx + 1} for indx, item in enumerate(topUrls)]
                output['topHashtags'] = [{'value': '#' + item[0], 'url': HASH_URL % item[0], 'count': item[1], 'rank': indx + 1} for indx, item in enumerate(topHashes)]
                output['topMentions'] = [{'value': '@' + item[0], 'url': USER_URL % item[0], 'count': item[1], 'rank': indx + 1} for indx, item in enumerate(topMentions)]
                output['topChatters'] = [{'value': item[0], 'url': USER_URL % item[0], 'count': item[1], 'rank': indx + 1} for indx, item in enumerate(topUsers)]
                output['topRetweets'] = topRTTexts

                return output
        #-----------------------------------------------------------------------------       
	

        #query each candidate
        output={}
        for candidate in candidateName:
                output[candidate]=doQuery(candidate)
	

	#import texty
	#text = ' '.join([t['text'] for t in tweets])
	#output['word_frequencies'] = [{'count': count, 'value': value} for value, count in texty.getWordFreqsAsOrderedList(text)[:50]]
	
	print ''
	print json.dumps(output)
except Exception, e:
	print ''
	print json.dumps(str(e))
