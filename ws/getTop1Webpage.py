#Standard Libraries
import cgitb, os, cgi, json
cgitb.enable()

MAX_RESULTS = 1

from pymongo import MongoClient
from collections import Counter
from datetime import datetime, timedelta

USER_URL = 'http://www.twitter.com/%s'
TWEET_URL = 'http://www.twitter.com/%s/status/%d'
HASH_URL = 'https://twitter.com/search?q=%%23%s&src=hash'

try: 
        fields = cgi.FieldStorage()

        candidates = fields['candidates'].value.title().split(",")
        category = None if 'category' not in fields else fields['category'].value
        dates= fields['dates'].value.split(",")
        dates=sorted(dates, key=lambda d: map(int, d.split('-')))

        col = MongoClient().test.twitter_search_candidates


        #-----------------------------------------------------------------------------
        def doQuery(candidate, date):
                dateFrom = datetime.strptime(date, '%Y-%m-%d')
                dateTo = dateFrom + timedelta(days=1)
                
                query = {'search_info.keywords': candidate, 'created_at_local': {'$gte': dateFrom, '$lt': dateTo}}
                if category:
                        query['categories'] = category
                
                tweets = list(col.find(query).batch_size(10000))
         
                entitySets = [t for t in tweets if 'entities' in t]

                urlCounter = Counter([url for t in entitySets if 'long_urls' in t['entities'] for url in t['entities']['long_urls']])
  
                topUrls = urlCounter.most_common(MAX_RESULTS)
                

                output = {'date': date}
                #output['candidate'] = candidate
                output['topWebpages'] = [{'value': item[0], 'url': item[0], 'count': item[1], 'rank': indx + 1} for indx, item in enumerate(topUrls)]
                
                return output
        #-----------------------------------------------------------------------------       
        

        #query each candidate
        output={}
        for candidate in candidates:
                output[candidate]=[]
                for date in dates:
                        output[candidate].append(doQuery(candidate, date))
                
        

        #import texty
        #text = ' '.join([t['text'] for t in tweets])
        #output['word_frequencies'] = [{'count': count, 'value': value} for value, count in texty.getWordFreqsAsOrderedList(text)[:50]]
        
        print ''
        print json.dumps(output)
except Exception, e:
        print ''
        print json.dumps(str(e))
