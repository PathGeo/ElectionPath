#Standard Libraries
import cgitb, os, cgi, json
cgitb.enable()


from pymongo import MongoClient
from datetime import datetime, timedelta

try: 
	fields = cgi.FieldStorage()

	candidateName = fields['candidate'].value.title()
	dateFromStr = fields['dateFrom'].value
	dateToStr = fields['dateTo'].value

	dateFrom = datetime.strptime(dateFromStr, '%Y-%m-%d')
	dateTo = datetime.strptime(dateToStr, '%Y-%m-%d') + timedelta(days=1)


	col = MongoClient().test.twitter_search_candidates

	query = {}
	if candidateName <> 'All': 
		query['search_info.keywords'] = candidateName
	query['geo'] = {'$exists': 1}
	query['created_at_local'] = {'$gte': dateFrom, '$lt': dateTo}
	
	tweets = list(col.find(query, {'created_at_local': 1, 'text': 1, 'geo': 1, 'user.location': 1}).batch_size(10000))

	for t in tweets:
		if 'created_at_local' in t:
			t['local_time'] = str(t['created_at_local'])
			del t['created_at_local']
		if 'user' in t and 'location' in t['user']:
			t['location'] = t['user']['location']
			del t['user']
		if '_id' in t:
			del t['_id']
		if 'geo' in t:
                        lat=t['geo']['coordinates'][0]
                        lng=t['geo']['coordinates'][1]
                        t['geo']['coordinates']=[lng, lat]

	print ''
	print json.dumps({'results': tweets})
except Exception, e:
	print ''
	print json.dumps(str(e))
