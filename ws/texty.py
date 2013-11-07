#! /usr/bin/env python
# -*- coding: utf-8 -*-
from nltk import word_tokenize
from nltk.tokenize import punkt
from re import compile, IGNORECASE

def make_unicode_set (charlist):
    return set([unicode(s,"utf-8") for s in charlist])

def read_stop_words(stop_file, stopwords=None):
    stopwords = set(STOP_WORDS)
    stopwords = stopwords.union(twitter_function_words).union(punctuation).union(contractions)
    '''
	#Do we want to add functionality to read a file for custom stopwords?
	with open(stop_file,'r') as fh:
        for line in fh:
            stopwords.add(line.strip())
	'''
    return stopwords
	
STOP_WORDS = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']
url_re = compile(r'http:', IGNORECASE)
twitter_domain_re = compile(r't\.co\/', IGNORECASE)
punctuation = ['?',',',':','.',';',"'",'"',"!","-","(",")","&","[","]","--","...","’","–","‘",'”','“',"|","``","..."]
contractions = ["'ve","'m","'ll","'s","n't","'re","'d"]
punctuation = make_unicode_set(punctuation)
contractions = make_unicode_set(contractions)
twitter_function_words = set([u'http',u'@',u'rt',u'#',u'&amp',u'tweet',u'tweets',u'retweet',u'retweets',u'twitter',u'tcot'])	

def tokenize_string (str0):
    def valid_url (w):
        return url_re.match(w) or valid_twitter_domain_site(w)
    def valid_twitter_domain_site (w):
        return twitter_domain_re.search(w)
    def filter_unicode_punctuation (w):
        if valid_url(w) or valid_twitter_domain_site(w):
            pass
        else:
            for p in punctuation:
                while p in w:
                    ind = w.index(p)
                    w = w[:ind] + w[ind + len(p):]
        return w
        
    line_words0 = []
    for sent in punkt.PunktSentenceTokenizer().tokenize(str0):
        line_words0.extend(word_tokenize(sent))
    line_words = []
    ## a little bit of extra tokenizing because the
    ## tokenizer misses some unicode 
    for w in line_words0:
        w = filter_unicode_punctuation(w)
        if w:
            line_words.append(w)
            
    return line_words

def getWordFreqs(text):
	counts = {}
	
	stopwords = read_stop_words("stopwords_Ford.vocab")
	words = [word.lower() for word in tokenize_string(text) if word.lower() not in stopwords]
	
	for word in words:	
		#if word is not already in the counts dictionary, then intialize it
		#otherwise, just add one to the current value
		counts[word] = 1 if word not in counts else counts[word] + 1

	return counts

def getWordFreqsAsOrderedList(text):
	wfs = getWordFreqs(text)
	
	result = wfs.items()
	result.sort(key=lambda item: item[1])	#sort by count
	result.reverse()
	
	return result

if __name__ == '__main__':
	try: 
		'''
		NOTE:  
		Mark's word cloud generator seems to give +1 to a word if it occurs in a tweet text (ie, the document frequency). 
		It does NOT add up ALL occurrences, like this script does.
		
		Ex:
		tweet1 = 'this is cool but not super cool'
		tweet2 = 'this is lame'
		
		This score for 'cool' --> 2
		Mark's score for 'cool' --> 1
		
		Which way is better?
		
		counts = {}
		
		for tweet in tweets:
			words = list(set(tokenize(tweet.text)))
			for word in [word.lower() for word in words]:
				counts[word] = 1 if word not in counts else counts[word] + 1
		
		'''
		
		test = "this is some text.  it is not very creative text, but it will test the word count function.  i do not know if it will work proporly, but we will see.  it is very difficult trying to type random text, therefore i will stop trying to type random text."

		wf = getWordFreqs(test)

		for key in wf.keys()[:5]:
			print key, wf[key]
		
		while 1: pass

	except Exception, e:
		print "Uh oh: ", e

        

