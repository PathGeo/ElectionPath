import opengraph, cgi



params=cgi.FieldStorage()


print "Content-Type: text/html \n"


#check if url in the params
if("url" in params and params["url"].value!=""):
    #print params["url"].value
    
    op=opengraph.OpenGraph(url=params.getvalue("url"))

    #print op
    print op.to_json()
else:
    print "no url parameter"

