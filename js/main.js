	
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
		candidates:null
	}

    

	//dom ready
	$(function() { 
		//read candidates information 
		$.getJSON("db/candidates.json", function(json){
			app.candidates=json;
			init_UI();
		});
	});
	
	

	
	/**
	 * init user interface 
	 */
	function init_UI(){	
	
		//init time
		init_time();

		//tabs
		init_tabs();
		
		
		//read candidates
		if(app.candidates){
			var html="",
				html_addWidget="",
				$candidate=$("#candidate ul");
			
			$.each(app.candidates, function(k,v){
				//reverse array order
				v.values.reverse()
			
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
							"<li><a href='#' class='showTable'>"+v.values[0].tweets_all+"</a><label title='Total # of tweets mentions this candidate from 10/07 to Yesterday'>mentions since 10/07</label></li>"+
							"<li><a href='#' class='showTable'>+"+v.values[0].followers_yesterday_new+"</a><label title=\"# of new followers added in this candidate's Twitter account\">NEW Followers Yesterday</label></li>"+
							"<li><a href='#' class='showTable'>-"+v.values[0].followers_yesterday_removed+"</a><label title=\"# of Twitter users 'unfollow' this candidate's Twitter account\">REMOVED Followers Yesterday</label></li>"+
							"<li><a href='#' class='showTable'>"+v.values[0].influence+"</a><label title=\"The percentage changes of the combined number of 'fans'(followers) from  each new follower\">Network Impact Changes Yesterday</label></li>"+
							"<li></li>"+
							"<li>"+((v.values[0].biggestFollowers_yesterday[0].url)?"<a href='"+v.values[0].biggestFollowers_yesterday[0].url+"' target='_blank'>@"+v.values[0].biggestFollowers_yesterday[0].name+"</a>":"@"+v.values[0].biggestFollowers_yesterday[0].name)+"</a><br>1st Biggest Follower Yesterday</li>"+
							"<li>"+((v.values[0].biggestFollowers_yesterday[1].url)?"<a href='"+v.values[0].biggestFollowers_yesterday[1].url+"' target='_blank'>@"+v.values[0].biggestFollowers_yesterday[1].name+"</a>":"@"+v.values[0].biggestFollowers_yesterday[1].name)+"</a><br>2nd Biggest Follower Yesterday</li>"+
							"<li>"+((v.values[0].biggestFollowers_yesterday[2].url)?"<a href='"+v.values[0].biggestFollowers_yesterday[2].url+"' target='_blank'>@"+v.values[0].biggestFollowers_yesterday[2].name+"</a>":"@"+v.values[0].biggestFollowers_yesterday[2].name)+"</a><br>3rd Biggest Follower Yesterday</li>"+
							"<li></li>"+
							"<li>"+((v.values[0].biggestFollowers[0].url)?"<a href='"+v.values[0].biggestFollowers[0].url+"' target='_blank'>@"+v.values[0].biggestFollowers[0].name+"</a>":"@"+v.values[0].biggestFollowers[0].name)+"</a><br>1st Biggest Follower</li>"+
							"<li>"+((v.values[0].biggestFollowers[1].url)?"<a href='"+v.values[0].biggestFollowers[1].url+"' target='_blank'>@"+v.values[0].biggestFollowers[1].name+"</a>":"@"+v.values[0].biggestFollowers[1].name)+"</a><br>2nd Biggest Follower</li>"+
							"<li>"+((v.values[0].biggestFollowers[2].url)?"<a href='"+v.values[0].biggestFollowers[2].url+"' target='_blank'>@"+v.values[0].biggestFollowers[2].name+"</a>":"@"+v.values[0].biggestFollowers[2].name)+"</a><br>3rd Biggest Follower</li>"+
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
			countdownTime=Math.round((electionTime-todayTime)/86400/1000);
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
	 * initialize_tabs
	 */
	function init_tabs(){
		$('.tabs').tabs();
		
		$("#informationTabs > ul > li > a").click(function(){
			var $this=$(this),
				href=$this.attr('href'),
				$href=$(href),
				id=href.split('-')[1];
			
			if (id && id != '') {
				//request web service to get information
				query($href);
			}
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
				{key:"tweets_yesterday", title:"Tweets Yesterday", description:"# of tweets mentioned about this candidate Yesterday"},
				{key:"followers_all", title:"All Follewers", description:"All Followers"},
				{key:"followers_yesterday_new", title:"NEW<br>Followers Yesterday", description:"# of new followers added in this candidate's Twitter account"},
				{key:"followers_yesterday_removed", title:"REMOVED<br>Followers Yesterday", description:"# of Twitter users unfollow this candidate's Twitter account"},
				{key:"influence", title:"Network Impact", description:"The percentage changes of the combined number of fans(followers) from  each new follower"},
				{key:"biggestFollowers_yesterday", title:"Yesterday Biggest <br>NEW Followers", description:"Top 3 Biggest Followers Yesterday"},
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
//		$('.matrixTable').fixheadertable({
//             caption : '',
//             height  : 420,
//			 showhide:false,
//			 sortable:false
//        });
		
		setTimeout(function(){
			showDialog("dialog_table", obj.name+"'s twitter influence index");
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
	 * query Web service
	 */
	function query($target){
		if(app.map){app.map.remove();}
		
		//show loading
		$target.html("<center><img src='images/loading.gif' class='loading' /></center>");

		//request
		$.getJSON('db/searchResult.json', function(json){
			if(!json){console.log('[ERROR] query: no json'); return;}
			
			var html="<ul>"+
					 	"<li><br><label>Top Tweeted URLs</label><p>"+((json.urls instanceof Array)?createTable(json.urls):"None")+"</p></li>"+
					 	"<li><br><label>Top Followers</label><p>"+((json.followers instanceof Array)?createTable(json.followers):"None")+"</p></li>"+
						"<li><br><label>Top Retweets</label><p>"+((json.retweets instanceof Array)?createTable(json.retweets):"None")+"</p></li>"+
					 	"<li><br><label>Word-Cloud Map</label><p>"+((json.wordcloud)?"<img src='"+json.wordcloud+"' style='width:100%;' />":"None")+"</p></li>"+
					 	"<li style='width:66%;'><br><label>Hotspot Map</label><p><div id='map'></div></p></li>"+
					 "</ul>";
			
			$target.html(html);
			
			init_map();
			
			
			//create Table
			function createTable(array){
				var html_content="",
					html_header="<tr>",
					value='';
				
				$.each(array, function(i,obj){
					html_content+='<tr>';
					
					$.each(obj, function(k,v){
						if(k!='url'){
							//header
							if(i==0){
								html_header+="<td>"+k+"</td>";
							}
							
							value="<td>"+v+"</td>";
							
							//check if contains url
							if(k=='value' && obj.url && obj.url!=''){
								value="<td><a href='" + obj.url + "' target='_blank'>" + v + "</a></td>";
							}
							
							html_content+=value;
						}
					});
					
					html_content+="</tr>";
				});
				html_header+="</tr>";
			
				return "<table class='table'>"+html_header+html_content+"</table>";
			}
		});
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
		dialogOptions.width = dialogOptions.width || 850;
		dialogOptions.height = dialogOptions.height || 550;
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
	

	
	


	
