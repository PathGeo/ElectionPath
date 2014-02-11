import opengraph
from pymongo import MongoClient
from datetime import datetime

#global variables
DATETIME_FORMAT = '%a %b %d %H:%M:%S +0000 %Y'
DB_SOURCE='test'
COL_SOURCE='twitter_search_candidates'
DB='electionpath'
COL_UPDATE='opengraphUpdate'



#get opengraph info from url
def getOpengraph(url):
    op={}
    
    if(url and url!=""):
        op=opengraph.OpenGraph(url=url)
        
    return op


#LOG
def getLogger(logName="log.log"):
	import logging, os
	from os import path
	
	logger = logging.getLogger("log")
	curDir = path.dirname(path.realpath(__file__))
	hdlr = logging.FileHandler(curDir + "\\" + logName)
	formatter = logging.Formatter("%(asctime)s %(levelname)s %(message)s")
	hdlr.setFormatter(formatter)
	logger.addHandler(hdlr)
	logger.setLevel(logging.DEBUG)
	
	return logger



#LOG
LOGGER=getLogger(logName='cacheOpengraph.log')


#Connect to Collection in MongoDB
mongoClient=MongoClient()
col_source=mongoClient[DB_SOURCE][COL_SOURCE]
col_update=mongoClient[DB][COL_UPDATE]


#get nowaday time
now=datetime.now()
lastUpdateTime=col_update.find().sort("updateTime",-1)[0]["updateTime"]


#query source db
query={"created_at_local":{"$lt": now, "$gt":lastUpdateTime, "entities.long_urls":{"$exists": True}}}
#query={"created_at_local":{"$lt": now}, "entities.long_urls":{"$exists":True}, "entities.opengraphs":{"$exists": False}}
tweets=col_source.find(query)

'''
print tweets.count()
count=0
for t in tweets:
    if 'entities' in t:
        print t['entities']['long_urls']
        print '-'*60
        count+=1

    if(count>20):
        break


import sys
sys.exit()
'''



#read tweets
count=0

import time
startTime=time.time()

LOGGER.info("-"*60)
LOGGER.info("START CACHING OPENGRAPH AT " + now.strftime(DATETIME_FORMAT))
LOGGER.info("-"*60)



for tweet in tweets:
    if("entities" in tweet and "long_urls" in tweet["entities"] and "opengraphs" not in tweet["entities"]):
        urls=tweet['entities']['long_urls']
        opengraphs=[]

        for url in urls:
            try:
                opengraphs.append(getOpengraph(url))
                LOGGER.info("Success: "+ str(tweet["id"])+", "+url)

            except Exception, e:
                import traceback
                LOGGER.error("Error: "+ str(tweet["id"])+", "+url)
                LOGGER.error(str(e))
                LOGGER.error(str(traceback.print_exc()))

        tweet['entities']['opengraphs']=opengraphs

        col_source.save(tweet)

        count+=1




endTime=time.time()

LOGGER.info("-"*60)
LOGGER.info("FINISH CACHING OPENGRAPH. DURATION=%d MINUTES" % int((endTime - startTime)/60))
LOGGER.info("-"*60)
 

#save update time into a collectoin in the Mongodb
col_update.insert({
    "updateTime": now,
    "count": count
})

    











