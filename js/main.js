	
	//Load Google Charts and set callback
	google.load("visualization", "1", {packages:["corechart"]});
	google.load('visualization', '1', {packages:['table']});

	
	//global variables
	var app={
		map:null,		// leaflet map object
		layer:{
			markerLead:L.marker([0,0]), //marker for top leads
			markerDealer:{
				drew: L.marker([32.774917,-117.005639], {icon: L.icon({iconUrl: 'images/logo_ford.png', iconSize:[60, 35]})}),			
				penske: L.marker([32.774917,-117.005639], {icon: L.icon({iconUrl: 'images/logo_penske.png', iconSize:[60, 35]})})
			}
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
		}
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
			init_UI();
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
				html_addWidget="",
				$candidate=$("#candidate ul"),
				value=null,
				numbers=["1st",'2nd','3rd'],
				chartCSVData=app.chartCSVData;
			
			
			$.each(app.candidates, function(k,v){
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

				html="<li id='"+k+"'>"+
					 "<div class='candidate-name' style='background-color:"+v.backgroundColor+"'>"+v.name +"</div>"+
					 "<div class='candidate-content'>"+
						 "<img class='candidate-image' src='"+v.image+"' />"+
						 "<div class='candidate-metadata'>"+
							"<img src='images/1382989480_Twitter_NEW.png' class='candidate-twitterImage' />"+
							"<div class='candidate-twitterYesterday'><a href='#' class='showTable'>"+v.values[0].tweets_yesterday+"</a><label title='# of tweets mentioned about this candidate Yesterday'>mentions Yesterday</label></div>"+
							"<div class='candidate-info'>"+"<a href='"+v.url_website+"' target='_blank'>Website</a><br><a href='"+v.url_twitter+"' target='_blank'>Twitter</a></div>"+
						 "</div>"+
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
			});
		
			
			//add li's clicking event
			$(".showTable").click(function(){
				var $this=$(this),
					id=$this.parent().parents("li").attr("id");
				
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
		}
	
	}
	
	
	
	
	/**
	 * initialize_time
	 */
	function init_time(){
		//calcualte countdown
		var todayTime=new Date().getTime(),
			electionTime=new Date("November 19, 2013 08:00:00").getTime(),
			countdownTime=Math.round((electionTime-todayTime)/86400/1000)+1;
		$("#countdown label").html(countdownTime);
		
		
		//today's time
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
		
		var currentTime = new Date()
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
				getMetrics(candidate, app.dateFrom, app.dateTo, $(href));
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
	function init_map(){
		// start map functions
		//basemap
		var basemaps = {
			"OpenStreetMap": L.tileLayer('http://{s}.tile.cloudmade.com/ad132e106cd246ec961bbdfbe0228fe8/997/256/{z}/{x}/{y}.png', {styleId: 256, attribution: ""}),
			"Gray Map": L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png', {styleId: 22677, attribution: ""}),
			"Night View": L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png', {styleId: 999, attribution: ""})
		}
		
		//init map
		app.map = L.map('map', {
			center: [32.774917, -117.005639],
			zoom: 11,
			layers: [basemaps["Gray Map"]],
			attributionControl:false
		});			
			
			
		//scale bar
		app.map.addControl(new L.Control.Scale());
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
		$.getJSON('ws/getMetrics.py?candidate='+candidate+'&dateFrom='+fromDate+'&dateTo='+toDate, function(json){
		//$.getJSON("db/searchResult.json", function(json){
			if(!json){console.log('[ERROR] query: no json'); return;}
			
			var html="<table>"+
						"<tr>"+
					 	"<td><br><label>Most Active Chatters</label><p>"+((json.users instanceof Array)?createTable(json.users):"None")+"</p></td>"+
						"<td><br><label>Top Mentioned People</label><p>"+((json.mentions instanceof Array)?createTable(json.mentions):"None")+"</p></td>"+
						"<td><br><label>Top Hashtags</label><p>"+((json.hashtags instanceof Array)?createTable(json.hashtags):"None")+"</p></td>"+
						"</tr><tr>"+
						"<td><br><label>Top Tweeted URLs</label><p>"+((json.urls instanceof Array)?createTable(json.urls):"None")+"</p></td>"+
						"<td><br><label>Top Retweets</label><p>"+((json.retweets instanceof Array)?createTable(json.retweets):"None")+"</p></td>"+
					 	"<td><br><label>Word-Cloud Map</label><p>"+((json.wordcloud)?"<img src='"+json.wordcloud+"' style='width:100%;' />":"Coming soon..")+"</p></td>"+
					 	"</tr><tr>"+
						"<td colspan=3><br><label>Hotspot Map</label><p>Coming soon..</p></td>"+ //<div id='map'></div></p></td>"+
						"</tr>"+
					 "</table>";
			
			$target.html(html);
			
			//init_map();
			
			
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
	 * showDialog
	 * @param {Object} id
	 * @param {Object} title
	 * @param {Object} dialogOptions
	 */
	function showDialog(id, title, dialogOptions){
		if (!dialogOptions) {
			dialogOptions = {}
		}
		console.log($(window).width());
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
	

	
	


	
