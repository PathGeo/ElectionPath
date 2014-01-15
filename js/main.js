	
	//Load Google Charts and set callback
	google.load("visualization", "1", {packages:["corechart"]});
	google.load('visualization', '1', {packages:['table']});

	
	//global variables
	var app={
		donationMap:null,		// leaflet map object
		layer:{
			markerLead:L.marker([0,0]), //marker for top leads
			markerDealer:{
				drew: L.marker([32.774917,-117.005639], {icon: L.icon({iconUrl: 'images/logo_ford.png', iconSize:[60, 35]})}),			
				penske: L.marker([32.774917,-117.005639], {icon: L.icon({iconUrl: 'images/logo_penske.png', iconSize:[60, 35]})})
			},
			ACS_SD:null
		},
		candidates:null,
		chart:null,
		chartEvent:{
			click:null,
			rangeChange:null
		},
		dateFrom:null,
		dateTo:null,
		chartCSVData:{
			headers:["Date"],
			values:{}
		},
		ACS_SD:null,
		donationData:null,
		callout:[],
		chart:[],
		wordCloud:null,
		testMode:true
	}
	
	//chart
	var g=null,
		htmlDate=null;
    
	
	//inesrt char into string
	String.prototype.splice = function( idx, rem, s ) {
	    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
	};


	//dom ready
	$(function() { 
		
		
		//read candidates information 
		$.getJSON("db/candidates.json", function(json){
			app.candidates=json;
			
			//show press release dialog
			//showDialog('dialog_electionResult', 'PathGeo can provide real-time customizable social media (Big Data) analytics for your election campaign', {height:570});
			
			//scroll
			$.scrollIt();
		
			init_UI();
			//createDonationMap();
			init_chart();
		});
	});
	
	

	
	/**
	 * init user interface 
	 */
	function init_UI(){	
	
		//init time
		init_time();
		
		//read candidates
		if(app.candidates){
			var html="",
				html_candidateNav="",
				html_addWidget="",
				$candidate=$("#candidate > ul"),
				value=null,
				numbers=["1st",'2nd','3rd'],
				chartCSVData=app.chartCSVData;
			
			
			$.each(app.candidates, function(k,v){
				//hide information
				if(k=='Aguirre' || k=='Fletcher'){
					return;
				}
	
				//prepare chart csv content
				chartCSVData.headers.push(k);
				$.each(v.values, function(i,val){
					if(chartCSVData.values[val.date]) {
						chartCSVData.values[val.date].push(val.tweets_yesterday);
					}else {
						chartCSVData.values[val.date] = [val.tweets_yesterday];
					}
				});
				
				//reverse array order
				v.values.reverse()
				
				value=v.values[0];

				html="<li class='candidate-li' id='"+k+"'>"+
					 "<div class='candidate-name' style='background-color:"+v.backgroundColor+"'>"+v.name +"</div>"+
					 "<div class='candidate-content'>"+
					 	 "<ul>"+
						 	"<li class='candidate-image'><img src='"+v.image+"' /></li>"+
						 	"<li class='candidate-metadata'>"+
								"<div class='candidate-twitterYesterday'><img src='images/1382989480_Twitter_NEW.png' class='candidate-twitterImage' /><a href='#' class='showTable'>"+v.values[0].tweets_yesterday+"</a><label title='# of tweets mentioned about this candidate Yesterday'>mentions Yesterday</label></div>"+
								"<div class='candidate-info'>"+"<a href='"+v.url_website+"' target='_blank'>Website</a><br><a href='"+v.url_twitter+"' target='_blank'>Twitter</a></div>"+
							"</li>"+
						 "</ul>"+
						 //"<div class='showCandidateIndex'>show more..</div>"+
					 "</div>"+
					 "<div class='candidate-index'>"+
					 	"<ul>"+
							"<li><a href='#' class='showTable'>"+value.tweets_all+"</a><label title='Total # of tweets mentions this candidate from 10/07 to Yesterday'>mentions since 10/07</label></li>"+
							"<li><a href='#' class='showTable'>+"+value.followers_yesterday_new+"</a><label title=\"# of new followers added in this candidate's Twitter account\">NEW Followers Yesterday</label></li>"+
							"<li><a href='#' class='showTable'>-"+value.followers_yesterday_removed+"</a><label title=\"# of Twitter users 'unfollow' this candidate's Twitter account\">REMOVED Followers Yesterday</label></li>"+
							"<li><a href='#' class='showTable'>"+value.influence+"</a><label title=\"The percentage changes of the combined number of 'fans'(followers) from  each new follower\">Network Impact Changes Yesterday</label></li>"+
							"<li></li>"+
							(function(){
								var result='';
								$.each(numbers, function(i,n){
									if(value.biggestFollowers_yesterday[i]){
										result+="<li class='biggestFollwers_yesterday'>"+((value.biggestFollowers_yesterday[i].url)?"<a href='"+value.biggestFollowers_yesterday[i].url+"' target='_blank'>@"+value.biggestFollowers_yesterday[i].name+"</a>":"@"+value.biggestFollowers_yesterday[i].name)+"</a><br>"+n+" Biggest Follower Yesterday</li>";
									}else{
										result+="<li style='height:37px;'></li>";
									}
								});
								return result;
							})()+
							"<li></li>"+
							(function(){
								var result='';
								$.each(numbers, function(i,n){
									if(value.biggestFollowers[i]){
										result+="<li>"+((value.biggestFollowers[i].url)?"<a href='"+value.biggestFollowers[i].url+"' target='_blank'>@"+value.biggestFollowers[i].name+"</a>":"@"+value.biggestFollowers[i].name)+"</a><br>"+n+" Biggest Follower</li>";
									}else{
										result+="<li style='height:37px;'></li>";
									}
								});
								return result;
							})()+
						"</ul>"+
					 "</div>"
					 "</li>";
					 
				$candidate.append(html);
				
				
				//candidate info for nav
				html_candidateNav="<li class='candidate-li' id='"+k+"'>"+
					 "<div class='candidate-name' style='background-color:"+v.backgroundColor+"'>"+v.name + "</div>"+
					 "</li>";
				$("#header #candidateInfo > ul").append(html_candidateNav);
				
				//give legend background
				$("#legend-"+k).css({
					"background-color":v.backgroundColor
				});
			});
			
			
			
			//stick to nav bar
			stickToNav($("#candidate .candidate-name"))
			
			
			
			//add li's clicking event
			$(".showTable").click(function(){
				var $this=$(this),
					id=$this.parents("li.candidate-li").attr("id");
				
				if(app.candidates[id] && id && id!=''){
					showTable(id, app.candidates[id]);
				}else{
					console.log("[ERROR] cannot find out the candidate's info in the database. ")
				}
			}).siblings("label").each(function(){
				var $this=$(this),
					title=$this.attr('title');
				if(title && title!=''){
					$this.siblings('a.showTable').attr('title', title);
				}
			});
			
			
			//click event on show more
			// $(".showCandidateIndex").click(function(){
				// $(".candidate-index").show();
			// })
			
			
			
			//hide information
			//$candidate.find(".candidate-li[id='Faulconer'], .candidate-li[id='Alvarez']").append("<div class='candidate-overlay'></div>");
			// $candidate.find(".candidate-li[id='Faulconer'], .candidate-li[id='Alvarez']").each(function(){
				// var $this=$(this);
// 				
				// $this.find('.candidate-twitterYesterday > a').html('N/A').unbind('click');
				// $this.find(".candidate-index").html("<div class='candidate-hide'><h2><a href='https://www.pathgeo.com/?page_id=90' target='_blank'>Contact Us for More Information.</a></h2><p></p>We temporally put the information offline in order to build a sustainable business model for PathGeo<p></p>If you are interested in this information, please <br><a href='https://www.pathgeo.com/?page_id=90' target='_blank'>CONTACT US</a></div>").css('height', 598)
			// });
			
		}
	
	}
	
	
	
	
	/**
	 * initialize_time
	 */
	function init_time(){
		//calcualte countdown
		var todayTime=new Date().getTime(),
			electionTime=new Date(2014,2-1,11, 0,0,0).getTime(),
			//electionTime=new Date("November 19, 2013 08:00:00"),//.getTime(),
			countdownTime=parseInt((electionTime-todayTime)/86400/1000)+1;
			//countdownTime=(countdownTime<0)?0:countdownTime;
		$("#countdown label").html(countdownTime);
		
		
		//today's time
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
		
		var currentTime = new Date();
		var hours = currentTime.getHours()
		var minutes = currentTime.getMinutes()

		if (minutes < 10){
			minutes = "0" + minutes
		}
		var suffix = "AM";
		if (hours >= 12) {
			suffix = "PM";
			hours = hours - 12;
		}
		if (hours == 0) {
			hours = 12;
		}
	
		today+= "<span style='padding-left:30px'>" + hours + ":" + minutes + " " + suffix + "</span>";
		
		$("#clock").html(today);
	}
	
	
	
	
	/**
	 * initialize chart
	 */
	function init_chart(){
		var csv = "", 
			dates = null, 
			chartCSVData = app.chartCSVData,
			finalDate=null;
		
		//header
		var length = chartCSVData.headers.length - 1;
		$.each(chartCSVData.headers, function(i, v){
			csv += v + ((i == length) ? " \n" : ", ");
		});
		$.each(chartCSVData.values, function(k, v){
			dates = k.split('/');
			k=dates[2] + "-" + ((dates[0].length == 1) ? "0" + dates[0] : dates[0]) + "-" + ((dates[1].length == 1) ? "0" + dates[1] : dates[1]);
			csv += k.replace(/\-/g,"") + ", ";
			
			$.each(v, function(i, val){
				csv += val + ";" + val + ";" + val + ((i == length - 1) ? " \n" : ", ");
			});
			
			//app.dateFrom
			if(!finalDate){app.dateFrom=k;}
			finalDate=k;
		});
		
		//app.dateTo
		app.dateTo=finalDate.replace(/\//g, "-");
		
		//init chart
		app.chart = g = new Dygraph(
			document.getElementById("chart"), 
			csv, 
			{
				customBars: true,
				title: '',
				ylabel: 'The number of Tweets',
				colors: ['#C91111', '#E27C20', '#2CC671', '#A15FB7'],
				showRangeSelector: true,
				highlightCircleSize: 5,
				rangeSelectorHeight: 50,
				labelsDivWidth: 100,
				labelsDivStyles: {
					'textAlign': 'right'
				},
				labelsDivStyles: {
					'backgroundColor': 'rgba(255, 255, 255, 0.75)',
					'padding': '4px',
					'border': '1px solid grey',
					'borderRadius': '5px',
					'boxShadow': '2px 2px 2px #888',
					'width': '110px'
				},
				strokeWidth: 2,
				legend: 'always',
				hideOverlayOnMouseOut: true
			}
		);
		
		
		//tabs
		init_tabs();	
	}
		

	
	
	
		
	/**
	 * initialize_tabs
	 */
	function init_tabs(){
		$('.tabs').tabs();
		
		$("#informationTabs > ul > li > a").click(function(){
			var $this=$(this),
				$li=$this.parent(),
				href=$this.attr('href'),
				$href=$(href),
				candidate=href.split('-')[1];
			
			if(app.dateFrom && app.dateTo && candidate && candidate!=''){
				getMetrics(candidate, app.dateFrom, app.dateTo, $href);
			}else{
				$href.html("<div class='candidate-hide'><h2><a href='https://www.pathgeo.com/?page_id=90' target='_blank'>Contact Us for More Information.</a></h2><p></p>We temporally put the information offline in order to build a sustainable business model for PathGeo<p></p>If you are interested in this information, please <a href='https://www.pathgeo.com/?page_id=90' target='_blank'>CONTACT US</a></div>")
			}
			
			$li.css({
				"background":app.candidates[candidate].backgroundColor
			}).siblings().css({
				"background":""
			});
		});
		
		
		//enable click on each li
		$("#informationTabs > ul > li").click(function(){
			var $this=$(this),
				$a=$this.find('> a');
				candidate=$a.attr("href").split('-')[1];
				
			$a.trigger('click');
		});
		
		
		
		//trigger click on the first candidate
		$("#informationTabs > ul > li > a:nth(0)").trigger('click');
	}
	
	

	
	/** 
	 * show table
	 */
	function showTable(id, obj){
		var html="<div class='matrix-candidate'>"+$("li[id='"+id+"'] .candidate-content").html() +"</div><hr><h3>Twitter Data in past 2 weeks: </h3><table class='matrixTable'>",
			html="<table class='matrixTable'>",
			html_header="<thead><tr>",
			html_content="<tbody>",
			content="",
			templates=[
				{key:"date", title:"Date", description:"Date"},
				{key:"tweets_all", title:"Tweets <br>since 10/07", description:"Total # of tweets mentioned this candidate from 10/07 to Yesterday"},
				{key:"tweets_yesterday", title:"Tweets Today", description:"# of tweets mentioned about this candidate Today"},
				{key:"followers_all", title:"All Follewers", description:"All Followers"},
				{key:"followers_yesterday_new", title:"NEW<br>Followers Today", description:"# of new followers added in this candidate's Twitter account"},
				{key:"followers_yesterday_removed", title:"REMOVED<br>Followers Today", description:"# of Twitter users unfollow this candidate's Twitter account"},
				{key:"influence", title:"Network Impact Change", description:"The percentage changes of the combined number of fans(followers) from  each new follower"},
				{key:"biggestFollowers_yesterday", title:"Today Biggest <br>NEW Followers", description:"Top 3 Biggest Followers Today"},
				{key:"biggestFollowers", title:"Biggest NEW Followers", description:"Top 3 Biggest Followers"}
			];
			
		
		$.each(obj.values, function(i,value){
			html_content+="<tr>";
			$.each(templates, function(j,temp){
				if(i==0){
					html_header+="<th title='"+temp.description+"'>"+temp.title+"</th>";
				}
				content="<td>"+value[temp.key]+"</td>";
				
				if(temp.key=='biggestFollowers' || temp.key=='biggestFollowers_yesterday'){
					content="<td><ul>";
					$.each(value[temp.key], function(k,v){
						content+="<li>Top "+v.rank +":<br><a href='"+v.url+"' target='_blank'>@"+v.name+"</a></li>";
					});
					content+="</ul></td>";
				}
				
				html_content+=content;
			});
			html_content+="</tr>";
		});
		html_header+="</tr></thead>";		
		
		html=html+html_header+html_content+"</tbody></table>";
		
		$("#dialog_table").html(html);

		//fix header
		$('.matrixTable').fixheadertable({
             caption : '',
             height  : $(window).height()-235, //410,
             width : $(window).width()-80, //410,
			 colratio: [100, 100, 100, 100, 100, 100, 100, 200, 250], 
			 showhide:false,
			 sortable:false,
			 zebra:false
        });
		
		setTimeout(function(){
			showDialog("dialog_table", obj.name+"'s Twitter Influence Index");
			$(".ui-dialog .ui-widget-header").css({
				"background":"transparent",
				"background-color": obj.backgroundColor,
				"color":"#ffffff"
			}).find("span").css({
				"font-size":"16px",
				"font-family":"'Lato', sans-serif"
			});
		}, 10);
	}
	
	
	
	
	
	
	
	/**
	 * initilize map
	 */
	function createDonationMap(){
		
		//init map
		app.donationMap = L.map("donationMap", {
			center: [32.774917, -117.005639],
			zoom: 11,
			layers: [selectBasemap("ESRI Topographic Map")],
			attributionControl:true
		});			
			
		//scale bar
		app.donationMap.addControl(new L.Control.Scale());
		
		//read ACS data
		$.getJSON("db/ACS_SD.json", function(json){
			app.ACS_SD=json;

			//read donation data
			$.getScript('db/donation.js', function(script){
				//donation data will be saved in the app.donationData
				
				layerChange();
			});
		});
	}

	
	
	/**
	 * chartEvent
	 */
	app.chartEvent.click=function(clickDate){
		clickDate=clickDate.replace(/\//g,'-');
		
		var toDateTime=new Date(clickDate).getTime()+86400000;
			toDate=new Date(toDateTime);
			
		toDate=toDate.getFullYear()+'-'+(toDate.getMonth()+1)+'-'+toDate.getDate();
		
		var target=$("#informationTabs .ui-tabs-selected > a").attr('href'),
			candidate=target.split('-')[1];
		
		//request web service to get info. on the clicked date
		if(candidate && candidate!='' && clickDate && clickDate!=''){
			getMetrics(candidate, clickDate, clickDate, $(target));
		}else{
			$(target).html("<div class='candidate-hide'><h2><a href='https://www.pathgeo.com/?page_id=13' target='_blank'>Contact Us for More Information.</a></h2><p></p>We temporally put the information offline in order to build a sustainable business model for PathGeo<p></p>If you are interested in this information, please <a href='https://www.pathgeo.com/?page_id=90' target='_blank'>CONTACT US</a></div>")
		}
	}
	
	
	
	app.chartEvent.rangeChange=function(fromDate, toDate){
		fromDate=fromDate.split(" ")[0].replace(/\//g,'-');
		toDate=toDate.split(" ")[0].replace(/\//g,'-');
		
		var target=$("#informationTabs .ui-tabs-selected > a").attr('href'),
			candidate=target.split('-')[1];
		
		//request web service to get info. on the clicked date
		if(candidate && candidate!='' && fromDate && fromDate!='' && toDate && toDate!=''){
			getMetrics(candidate, fromDate, toDate, $(target));
		}else{
			$(target).html("<div class='candidate-hide'><h2><a href='https://www.pathgeo.com/?page_id=13' target='_blank'>Contact Us for More Information.</a></h2><p></p>We temporally put the information offline in order to build a sustainable business model for PathGeo<p></p>If you are interested in this information, please <a href='https://www.pathgeo.com/?page_id=90' target='_blank'>CONTACT US</a></div>")
		}
	}
	
	
	
	
	
	/**
	 * getMetrics
	 */
	function getMetrics(candidate, fromDate, toDate, $target){
		app.dateFrom=fromDate;
		app.dateTo=toDate;
		
		//label search date
		$("#chart_queryDate p").html(app.dateFrom + ' ～ ' +app.dateTo)
		
		//show loading
		$target.html("<center><img src='images/loading.gif' class='loading' /></center>");
		
		//request web service
		var url=(app.testMode)?"db/searchResult.json":'ws/getMetrics.py?candidate='+candidate+'&dateFrom='+fromDate+'&dateTo='+toDate
		$.getJSON(url, function(json){
			if(!json){console.log('[ERROR] query: no json'); return;}
			
			var html="<table>"+
						"<tr>"+
					 	"<td><br><label>Most Active Chatters</label><p>"+((json.users instanceof Array)?createTable(json.users):"None")+"</p></td>"+
						"<td><br><label>Top Mentioned People</label><p>"+((json.mentions instanceof Array)?createTable(json.mentions):"None")+"</p></td>"+
						"<td><br><label>Top Hashtags</label><p>"+((json.hashtags instanceof Array)?createTable(json.hashtags):"None")+"</p></td>"+
						"</tr><tr>"+
						"<td><br><label>Top Tweeted URLs</label><p>"+((json.urls instanceof Array)?createTable(json.urls):"None")+"</p></td>"+
						"<td><br><label>Top Retweets</label><p>"+((json.retweets instanceof Array)?createTable(json.retweets):"None")+"</p></td>"+
					 	"<td><br><label>Word-Cloud Map</label><P></p><div id='wordcloud'></div></td>"+
					 	"</tr>"+
						"<tr><td colspan=3 id='td_map'><br><label>GeoTagged Tweets' Map</label><p><div id='"+candidate+"_socialMap' class='socialMap'></div></p></td></tr>"+
					 "</table>";
			
			$target.html(html);
			
			
			//add qtip content
			$target.find("a").each(function(){
				var $this=$(this),
					url=encodeURIComponent($this.attr("href")),
					apiKey='pnZc5aMtlA2G', //websnapr apikey
					thumbnail=$("<img />").attr({
						src: 'http://images.websnapr.com/?url=' + url + '&key=' + apiKey + '&hash=' + encodeURIComponent(websnapr_hash), //websnapr_hash is a function from websnapr script
			            alt: 'Loading thumbnail...',
			            width: 202,
			            height: 152
					});
				
				
				// $this.qtip({
					// content: thumbnail,
		            // position: {
		                // corner: {
		                    // tooltip: 'bottomMiddle',
		                    // target: 'topMiddle'
		                // }
		            // },
		            // style: {
		                // tip: true, // Give it a speech bubble tip with automatic corner detection
		                // name: 'dark'
		            // }
				// });
			});
			
			
			//create social map
			createSocialMap(candidate, fromDate, toDate);
			
			
			//create word cloud
			createWordCloud(json.word_frequencies, $target);
			
			
			
			//create Table
			function createTable(array){
				var html_content="",
					html_header="<tr><td class='rank'>Top</td><td class='value'>Value</td><td class='count'>#</td></tr>",
					value='';
				
				$.each(array, function(i,obj){
					html_content+='<tr>'+
								  '<td class="rank">'+obj.rank+'</td>'+
								  "<td class='value'>"+
								  (function(){
								  	if(obj.url){
										return "<a href='"+obj.url+"' target='_blank'>"+obj.value+"</a>";
									}else{
										return obj.value;
									}
								  })()+"</td>"+
								  '<td class="count">'+obj.count+"</td>"+
								  "</tr>";
				});
			
				return "<table class='table'>"+html_header+html_content+"</table>";
			}
						
			
		});	
		
	}


	
	/**
	 * create wordcloud
	 */
	//create wordCloud  beta	
	function createWordCloud(cloudtext, $target) { 
				var $wordcloud=$target.find('#wordcloud'),
					width =$wordcloud.width(), //400,
					height =400;
				
				var colors = d3.scale.category20b(); 
				var json2 = cloudtext;
				var maxcount = 0;
				
				
				for (var indx in json2) 
					if (json2[indx].count > maxcount)  { maxcount = json2[indx].count;}
				

				if (!app.wordcloud) {
					app.wordcloud = d3.layout.cloud().size([width, height])
						.words(json2.map(function(d) {
							return {text: d.value, size: Math.sqrt(d.count/maxcount *100)*8};
						}))
						.rotate(function() { return ~~(Math.random() * 1) * 90; })
						.font("Impact")
						.spiral("archimedean")
						//.spiral("rectangular")
						.fontSize(function(d) { return d.size; })
						.on("end", draw)
						.start();
				} else {
					app.wordcloud.stop().words(json2.map(function(d) {
							return {text: d.value, size: Math.sqrt(d.count/maxcount *100)*8};
						})).on("end", draw).start();
				}
			
			
			
			function search(keyword) {
					console.log(keyword);
			}
			
			
			function draw(words) {
				d3.select("svg").remove();
				d3.select($wordcloud.selector).append("svg")
					.attr("width", width)
					.attr("height", height)
					.attr("style", "border-color:lightgray;border-style:solid;border-width:1px;")
					.append("g")
					.attr("transform", "translate(" + (width/2) + "," + (height/2) + ")")
					.selectAll("text")
					.data(words)
					.enter().append("text")
					.style("font-size", function(d) { return d.size + "px"; })
					.style("font-family", "Impact")
					.attr("text-anchor", "middle")
					.attr("transform", function(d) {
						return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
					})
					.text(function(d) { return d.text; });
					
				$("text").css("fill", function() { return colors(this.__data__.text.toLowerCase()); })
					
				$("text").click(function() { search(this.__data__.text); }).css("cursor", "pointer")
						//.mouseover(function() { $(this).css("fill", "#cc2222"); })
						.mouseover(function() { $(this).css("fill", "#22aa22"); })
						.mouseout(function() { $(this).css("fill", colors(this.__data__.text.toLowerCase())); });
					
			}
			
	}	
			
	
	
	
	/**
	 * create geotagged social map
	 */
	function createSocialMap(candidate, dateFrom, dateTo){
		if(!candidate || candidate=='' || !dateFrom || dateFrom=='' || !dateTo || dateTo==''){
			console.log('[ERROR] createSocialMap: no candidate or dateFrom or dateTo. Please check again!');
			return;
		}
		
		var mapID=candidate+"_socialMap";
	
		//get getTagged json
		var url=(app.testMode)?"db/geoTweets.json":"ws/getGeoTweets.py?candidate="+candidate+"&dateFrom="+dateFrom+"&dateTo="+dateTo
		$.getJSON(url, function(json){
			if(json && json.results && json.results.length>1){
				var geojson={
					type:"FeatureCollection",
					features:[]
				}, feature;
				
				$.each(json.results, function(i,result){
					//create feature object
					feature={
						type:"Feature",
						geometry:null,
						properties:{}
					};
					
					//read value
					$.each(result, function(k,v){
						if(k=='geo'){
							feature.geometry=v
						}else{
							feature.properties[k]=v
						}
					});
					
					geojson.features.push(feature);
				});
				
				
				//init map and add features
				var map=L.map(mapID, {
					center: [32.774917, -117.005639],
					zoom: 10,
					layers: [selectBasemap("ESRI Topographic Map")],
					attributionControl:true
				});			
				

				//heatmap
				var heatMapLayer = pathgeo.layer.heatMap(geojson, 1000, {
					opacity : 0.55,
					layerName:"heatMapLayer",
					visible:false
				}).addTo(map);
				

				//zoom to bound
				map.fitBounds(heatMapLayer._bounds);
				
				
			}else{
				$target.find("map").html("No GeoTagged Tweets. Please query another date or candidate. Thank you");
				return;
			}
		});
	}
	
	
	
	/**
	 * stick to nav bar 
	 */
	function stickToNav($obj){
		var top = $obj.offset().top - parseFloat($obj.css('marginTop').replace(/auto/, 100));
		
		 $(window).scroll(function (event) {
		    // what the y position of the scroll is
		    var y = $(this).scrollTop();
	
		    // whether that's below the form
		    if (y >= top) {
		      // if so, add the fixed class
		      //$("#header #candidateInfo").show();
		    } else {
		      // otherwise remove it
		      //$("#header #candidateInfo").hide();
		    }
		  });
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * select base map
	 * @param {Object} type
	 */
	function selectBasemap(type){
		if(!type || type==''){console.log('[ERROR]selectBasemap: no type'); return;}
		
		var basemaps={
			"OpenStreet Map" : L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution : "Map Provided by <a href='http://www.openstreetmap.org/' target='_blank'>Open Street Map</a>",
				title : "Open Street Map",
				maxZoom:19
			}),
			"ESRI Imagery Map" : L.layerGroup([
				L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
					serviceName: "World_Imagery",
					attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
					title : "ESRI Imagery Map"
				}),
				L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
					serviceName: "Reference/World_Boundaries_and_Places",
					attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
					title : "ESRI Imagery Map"
				})
			]),
			"ESRI Street Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "World_Street_Map",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI Street Map"
			}),
			"ESRI National Geographic Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "NatGeo_World_Map",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI National Geographic Map",
				maxZoom:16
			}),
			"ESRI Terrain Map" : L.layerGroup([
				L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
					serviceName: "World_Terrain_Base",
					attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
					title : "ESRI Terrain Map",
					maxZoom:13
				}),
				L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
					serviceName: "Reference/World_Reference_Overlay",
					attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
					title : "ESRI Terrain Map",
					maxZoom:13
				}),
			]),
			"ESRI Topographic Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "World_Topo_Map",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI Topographic Map"
			}),
			"ESRI Light Gray Map" : L.tileLayer("http://server.arcgisonline.com/ArcGIS/rest/services/{serviceName}/MapServer/tile/{z}/{y}/{x}", {
				serviceName: "Canvas/World_Light_Gray_Base",
				attribution : "Map Provided by <a href='http://www.arcgis.com/' target='_blank'>ESRI</a>",
				title : "ESRI Light Gray Map",
				maxZoom:16
			})
		}
		
		
		if(basemaps[type]){
			return basemaps[type]
		}else{
			console.log('[ERROR]selectBasemap: no selected basemap');
			return;
		}
	}
	


	




	
	
	
	/**
	 * layerChange 
	 */
	function layerChange(){
		var selectedLayer = $("#sel_census").val();
		
		//classification method
		var classification={
			"quantile": function(){
				var ACS_features=app.ACS_SD.features,
					values = [],
					j=0;
				
				$.each(ACS_features, function(i,feature){
					if(feature.properties[selectedLayer]!=-999){
						values[j++] = feature.properties[selectedLayer];
					}
				})			
				
				values.sort(function(a,b){return a-b});
				
				var interval = values.length / 5,
					intervals = new Array(),
					next_interval = 0;
				//intervals[0] = Math.round(values[0]);
				intervals[0] = values[0];
				for (var i=1; i<5; i++) {
					next_interval += interval;
					j = Math.round(next_interval);
					intervals[i] = values[j];
				}
				//alert(selectedLayer+"  "+intervals[0]+" "+intervals[1]+" "+intervals[2]+" "+intervals[3]+" "+intervals[4]+" "+intervals[5]+" "+intervals[6]+" "+intervals[7]);
				return intervals
			},
			"equal": function(){
				var ACS_features=app.ACS_SD.features,
					min = Number.MAX_VALUE,
					max = Number.MIN_VALUE;
				
				$.each(ACS_features, function(i, feature){
					if (feature.properties[selectedLayer]!=-999){
						if (min > feature.properties[selectedLayer]) min = feature.properties[selectedLayer];
						if (max < feature.properties[selectedLayer]) max = feature.properties[selectedLayer];
					}
				});
				
		
				var range = max - min,
					interval = range / 5,
					intervals = [];
					
				//intervals[0] = Math.round(min);
				intervals[0] = min;
				//intervals[0] = min;
				for (var i=1; i<5; i++) {
					//intervals[i] = Math.round((intervals[i-1] + interval)*10)/10;
					//intervals[i] = (intervals[i-1] + interval)*10/10;
					if (selectedLayer == "fam_size"){
						intervals[i] = Math.round((intervals[i-1] + interval)*100)/100;
					}
					else{
						intervals[i] = Math.round(intervals[i-1] + interval);
					}
				}
				//alert(intervals[0]+" "+intervals[1]+" "+intervals[2]+" "+intervals[3]+" "+intervals[4]+" "+intervals[5]+" "+intervals[6]+" "+intervals[7]);
				return intervals;
			}
		}
		
		
		
		
		ACSdata_render(selectedLayer, classification["quantile"]());
		
	
		invokeChart();
		resizeChart();
	}
	
	
	
	//render ACS data
	function ACSdata_render(item, intervals) {
		var html=""
		
		//title
		var select = item;
			if (select == 'income') select = 'Median Household Income ($)';
			if (select == 'fam_size') select = 'Average Family Size';
			if (select == 'age0_9') select = 'Age0 - 9';
			if (select == 'a0_9den') select = 'Age0 - 9 (ratio)';
			if (select == 'age10_19') select = 'Age10 - 19';
			if (select == 'a10_19den') select = 'Age10 - 19 (ratio)';
			if (select == 'age20_64') select = 'Age20 - 64';
			if (select == 'a20_64den') select = 'Age20 - 64 (ratio)';
			if (select == 'age65_abov') select = 'Age65 above';
			if (select == 'a65_den') select = 'Age65 above (ratio)';

			if (select == 'White') select = 'White';
			if (select == 'White_den') select = 'White (ratio)';
			if (select == 'Black_AA') select = 'Black or African American';
			if (select == 'Black_den') select = 'Black or African American (ratio)';
			if (select == 'Asian') select = 'Asian';
			if (select == 'Asian_den') select = 'Asian (ratio)';
			if (select == 'Hispanic') select = 'Hispanic or Latino';
			if (select == 'Hispanic_d') select = 'Hispanic or Latino (ratio)';

			if (select == 'pop') select = 'Population';
			if (select == 'popDen') select = 'Population Density';
 
		html+="<h4>"+select+"<h4><ul>";
		
		
		//values
		var from,to;
		
		// get color depending on population density value
		function getColor1(d) {
		//alert(d);
			//var color = ["#FFEDA0","#FED976","#FEB24C","#FD8D3C","#FC4E2A","#E31A1C","#BD0026","#800026"];
			var color = ["#DBDBDB","#A8A8A8","#7C7C7C","#404040 ","#080808"];
			for (var i=color.length-1; i>=0; i--) {
				//alert(intervals[i]);
				if (d >= intervals[i]) return color[i];
			}
		}
		
		
		//read value
		$.each(intervals, function(i, interval){
			from=interval;
			to=intervals[i+1];
			
			html+="<li style='background-color:"+getColor1(from+1)+"' >" + from + (to ? '&ndash;' + to : '+') +"</li>";
		});
		
		
		//show legend
		$("#legend_classification").html(html);
		

		//overlay acs_sd layer
		if(app.layer.ACS_SD){
			app.donationMap.removeLayer(app.layer.ACS_SD);
		}
		
		app.layer.ACS_SD = L.geoJson(app.ACS_SD, {
			style: function(feature){
				return {
					weight: 2,
					opacity: 1,
					color: 'white',
					dashArray: '3',
					fillOpacity: 0.5,
					fillColor: getColor1(feature.properties[item])
				};
			}
		}).addTo(app.donationMap);

		//app.donationMap.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');		
		
	}

	
	
	function removeChart(){
		for (var i = 0; i < app.chart.length; i++) {	
	       app.donationMap.removeLayer(app.chart[i]);
		   app.donationMap.removeLayer(app.callout[i]);
	    }
		app.chart = [];
		app.callout=[];
			//map.removeLayer(layerGroup);
			//layerGroup.removeLayer;
		
	}
	
	
	function invokeChart(){
		var currentZoom = app.donationMap.getZoom();	
		var data=app.donationData;
		
		
		removeChart();	
		

		    if (currentZoom >= 15 && currentZoom < 16) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*2*2*2, data[i].lat, data[i].lon, data[i].zip, 80, -100, -50 );				
				}		
		    }		
		    else if (currentZoom >= 14 && currentZoom < 15) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*2*2, data[i].lat, data[i].lon, data[i].zip, 40, -50, -30 );			
				}		
		    }		
		    else if (currentZoom >= 13 && currentZoom < 14) {
				for (var i = 0; i < data.length; i++) {		
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*2, data[i].lat, data[i].lon, data[i].zip, 20, -25, -20  );		
				}		
		    }
		    else if (currentZoom >= 12 && currentZoom < 13) {
				for (var i = 0; i < data.length; i++) {			
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi, data[i].lat, data[i].lon, data[i].zip, 10, -15, -10 );
					//alert(data[i].Fletcher+' '+data[i].Faulconer+' '+data[i].Alvarez+' '+data[i].Aguirre);
				}	
		    }		
		    else if (currentZoom >= 11 && currentZoom < 12) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*0.5, data[i].lat, data[i].lon, data[i].zip, 0, 0, 0  );
				}
		    }		
		    else if (currentZoom >= 10 && currentZoom < 11) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*0.5*0.5, data[i].lat, data[i].lon, data[i].zip, 0, 0, 0     );
				}		
		    }		
		    else if (currentZoom >= 9 && currentZoom < 10) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*0, data[i].lat, data[i].lon, data[i].zip, 0, 0, 0   );
				}				
		    }		
		    else if (currentZoom >= 8 && currentZoom < 9) {
				removeChart();		 		
		    }		
		    else if (currentZoom >= 7 && currentZoom < 8) {
	  		
		    }
		    else if (currentZoom >= 6 && currentZoom < 7) {
		     		
		    }
		    else if (currentZoom >= 5 && currentZoom < 6) {
	   		
		    }
		    else if (currentZoom >= 4 && currentZoom < 5) {
	    		
		    }		
		    else if (currentZoom >= 3 && currentZoom < 4) {
			
		    }			
		    else if (currentZoom >= 2 && currentZoom < 3) {
	
		    }
		    else if (currentZoom >= 1) {
	
		    }

	}
	
	
	
	function resizeChart(){
		app.donationMap.on('zoomend', function(e) {
			var zoom=app.donationMap.getZoom();
			var data=app.donationData;
			
			
			removeChart();	
			
		
		    if (zoom >= 15 && zoom < 16) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*2*2*2, data[i].lat, data[i].lon,data[i].zip, 80,-100, -50  );
				}		
		    }		
		    else if (zoom >= 14 && zoom < 15) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*2*2, data[i].lat, data[i].lon, data[i].zip, 40, -50, -30  );
				}		
	   		
		    }		
		    else if (zoom >= 13 && zoom < 14) {
				for (var i = 0; i < data.length; i++) {
					//Fletcher, Faulconer, Alvarez, Aguirre, 
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*2, data[i].lat, data[i].lon, data[i].zip, 20, -25, -20  );
				}		
			
		    }		
		    else if (zoom >= 12 && zoom < 13) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi, data[i].lat, data[i].lon, data[i].zip, 10, -15, -10 );
				}			
	   		
		    }		
		    else if (zoom >= 11 && zoom < 12) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*0.5, data[i].lat, data[i].lon, data[i].zip, 0, 0, 0  );
	
				}		
			
		    }		
		    else if (zoom >= 10 && zoom < 11) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*0.5*0.5, data[i].lat, data[i].lon, data[i].zip, 0, 0, 0   );
					
				}		
	 		
		    }		
		    else if (zoom >= 9 && zoom < 10) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*0.5*0.5*0.5, data[i].lat, data[i].lon, data[i].zip, 0, 0, 0   );
			
				}			
	   		
		    }		
		    else if (zoom >= 8 && zoom < 9) {
				for (var i = 0; i < data.length; i++) {
					drawMarkers(data[i].Fletcher,  data[i].Faulconer, data[i].Alvarez, data[i].Aguirre, data[i].radi*0, data[i].lat, data[i].lon, data[i].zip, 0, 0, 0  );
			
				}			
		    }		
		    else if (zoom >= 7 && zoom < 8) {
	  		
		    }
		    else if (zoom >= 6 && zoom < 7) {
		     		
		    }
		    else if (zoom >= 5 && zoom < 6) {
	   		
		    }
		    else if (zoom >= 4 && zoom < 5) {
	    		
		    }		
		    else if (zoom >= 3 && zoom < 4) {
			
		    }			
		    else if (zoom >= 2 && zoom < 3) {
	
		    }
		    else if (zoom >= 1) {
	
		    }
							
		});
	
	}

	
	
	
	/**
	 * addMarker
	 */
	function addMarkers(layerGroupName, Fletcher, Faulconer, Alvarez, Aguirre, radi, lat, lng, zip, font, fontlng, fontlat, deltaLng, count, markerFunction, text) {
	
		//map.removeLayer(layerGroup);
		//font =10;
		var layerGroup = new L.LayerGroup();
		app.donationMap.addLayer(layerGroup, false);
		//layerControl.addOverlay(layerGroup, layerGroupName);
		
		
		//text='12345'
		var call = new L.Callout(new L.LatLng(lat, lng), {
				direction: L.CalloutLine.DIRECTION.NW,
				lineStyle: L.CalloutLine.LINESTYLE.STRAIGHT,
				numberOfSides: 3,
				arrow: false,
				color: '#585858 ',
				fillColor: '#585858 ',
				position: new L.Point(fontlng, fontlat),
				//position: new L.Point(-25, -20),
				//position: new L.Point(-50, -30),
				//position: new L.Point(-100, -50),
				size: new L.Point(0, 0),
				icon: new L.DivIcon({
					iconSize: new L.Point(0, 0),
					html: '<div id='+zip +' style="font-size:'+font+'px;font-weight:bold;">' + zip + '</div>',
					className: 'callout-text'
				})
		});
		
		//alert(call.length);
	
		//callout[callout.length] = call;
		
	    app.callout[app.callout.length] = call;
		
		
		app.donationMap.addLayer(call);
		
		//alert(callout.toString());
	
		//map.clearLayers();
/*		
		for (var i = 0; i < count; ++i) {
			//map.removeLayer(layerGroup);
			
			layerGroup.addLayer(markerFunction(new L.LatLng(lat, lng + i * deltaLng), i));
		}
*/		
		var pieChart = markerFunction(new L.LatLng(lat, lng + 0 * deltaLng), 0)
        app.chart[app.chart.length] = pieChart
		
		//layerGroup.removeLayer(chart);
		layerGroup.addLayer(pieChart);
		//alert(chart.toString());
		//layerGroup.removeLayer(chart);
	};	

	

	/**
	 * drawMarkers
	 * @param {Object} Fletcher
	 * @param {Object} Faulconer
	 * @param {Object} Alvarez
	 * @param {Object} Aguirre
	 * @param {Object} radi
	 * @param {Object} lat
	 * @param {Object} lng
	 * @param {Object} zip
	 * @param {Object} font
	 * @param {Object} fontlng
	 * @param {Object} fontlat
	 */
	function drawMarkers(Fletcher, Faulconer, Alvarez, Aguirre, radi, lat, lng, zip, font, fontlng, fontlat){
	
		addMarkers('Pie Charts', Fletcher, Faulconer, Alvarez, Aguirre, radi, lat, lng, zip, font, fontlng, fontlat,  2.0, 1, function (latlng) {
		
		//alert(radi);
				var colorValue = Math.random() * 360;
				var options = {
					color: '#000',
					weight: 1,
					fillColor: 'hsl(' + colorValue + ',100%,50%)',
					radius: radi,
					fillOpacity: 1,
					rotation: 0.0,
					position: {
						x: 0,
						y: 0
					},
		/*			
				    tooltipOptions: {
				    	iconSize: new L.Point(60, 60)
				    	//iconAnchor: new L.Point(-5, 100)
				    },	
		*/			
					offset: 0,
					numberOfSides: 50,
					barThickness: radi/2
				};
		
				options.data = {
					'Fletcher': Fletcher,
					'Faulconer': Faulconer,
					'Alvarez': Alvarez,
					'Aguirre': Aguirre
				};
				
				options.chartOptions = {
					'Fletcher': {
						fillColor: '#9900FF',
						//minValue: 0,
						//maxValue: 0,
						//maxHeight: 0,
						displayText: function (value) {
							return '$ '+value.toFixed(0)+'<br/><div id=zip> ZIP: '+zip + '</div>';
						}
					},
					'Faulconer': {
						fillColor: '#FF6633',
						//minValue: 0,
						//maxValue: 0,
						//maxHeight: 0,
						displayText: function (value) {
							return '$ '+value.toFixed(0)+'<br/><div id=zip> ZIP: '+zip + '</div>';
						}
					},
					'Alvarez': {
						fillColor: '#00CC66',
						//minValue: 0,
						//maxValue: 0,
						//maxHeight: 0,
						displayText: function (value) {
							return '$ '+value.toFixed(0)+'<br/><div id=zip> ZIP: '+zip + '</div>';
						}
					},
					'Aguirre': {
						fillColor: '#CC0033',
						//minValue: 0,
						//maxValue: 0,
						//maxHeight: 0,
						displayText: function (value) {
							return '$ '+value.toFixed(0)+'<br/><div id=zip> ZIP: '+zip + '</div>';
						}
					}
				};
				
				return new L.PieChartMarker(latlng, options);
			});
	}

	
	
	
	

	
	
	
	
	/**
	 * showDialog
	 * @param {Object} id
	 * @param {Object} title
	 * @param {Object} dialogOptions
	 */
	function showDialog(id, title, dialogOptions){
		if (!dialogOptions) {
			dialogOptions = {}
		}
		
		//options
		dialogOptions.title = dialogOptions.title || title;
		dialogOptions.width = dialogOptions.width || $(window).width()-50;
		dialogOptions.height = dialogOptions.height || $(window).height()-100;
		dialogOptions.resizable = dialogOptions.resizable || false;
		dialogOptions.draggable = dialogOptions.draggable || false;
		dialogOptions.modal = dialogOptions.modal || true; 
		dialogOptions.dialogClass="";
		dialogOptions.position=dialogOptions.position || "center";
		dialogOptions.closeFn=dialogOptions.close || null;
		dialogOptions.close=function(){
			//if close function
			if(dialogOptions.closeFn){dialogOptions.closeFn()} 
			//enable <body> scroll
			$("body").css("overflow", "auto");
		};
		
		//disable <body> scroll
		$("body").css("overflow", "hidden");
		
		$("#"+id).dialog(dialogOptions);
	}
	

	



	
