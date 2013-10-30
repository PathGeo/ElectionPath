	
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
		//calcualte countdown
		var today=new Date().getTime(),
			electionDate=new Date("November 19, 2013 08:00:00").getTime(),
			countdown=Math.round((electionDate-today)/86400/1000);
		$("#countdown label").html(countdown);
		
		
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
							"<div class='candidate-twitterYesterday'>"+v.values[0].tweets_yesterday+"<label>mentioned Yesterday</label></div>"+
							"<div class='candidate-info'>"+"<a href='"+v.url_website+"' target='_blank'>Website</a><br><a href='"+v.url_twitter+"' target='_blank'>Twitter</a></div>"+
						 "</div>"+
					 "</div>"+
					 "<div class='candidate-index'>"+
					 	"<ul>"+
							"<li><label>"+v.values[0].tweets_all+"</label>mentioned since 9/29</li>"+
							"<li><label>+"+v.values[0].followers_yesterday+"</label>NEW Followers Yesterday</li>"+
							"<li><label>-"+v.values[0].followers_yesterday+"</label>REMOVED Followers Yesterday</li>"+
							"<li><label>"+v.values[0].influence+"</label title='help'>Network Impact Changes Yesterday</li>"+
							"<li><label>"+((v.values[0].biggestFollowers[0].url)?"<a href='"+v.values[0].biggestFollowers[0].url+"' target='_blank'>@"+v.values[0].biggestFollowers[0].name+"</a>":"@"+v.values[0].biggestFollowers[0].name)+"</label><br>1st Biggest new follower</li>"+
							"<li><label>"+((v.values[0].biggestFollowers[1].url)?"<a href='"+v.values[0].biggestFollowers[1].url+"' target='_blank'>@"+v.values[0].biggestFollowers[1].name+"</a>":"@"+v.values[0].biggestFollowers[1].name)+"</label><br>2nd Biggest new follower</li>"+
							"<li><label>"+((v.values[0].biggestFollowers[2].url)?"<a href='"+v.values[0].biggestFollowers[2].url+"' target='_blank'>@"+v.values[0].biggestFollowers[2].name+"</a>":"@"+v.values[0].biggestFollowers[2].name)+"</label><br>3rd Biggest new follower</li>"+
						"</ul>"+
					 "</div>"
					 "</li>";
				
				$candidate.append(html);
			});
			
			
			//add li's clicking event
			$candidate.find("> li").click(function(){
				var $this=$(this),
					id=$this.attr("id");
				
				if(app.candidates[id] && id && id!=''){
					console.log(app.candidates[id]);
				}else{
					console.log("[ERROR] cannot find out the candidate's info in the database. ")
				}
			});
			
			
			
		}
			
		
		
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
		if(!dialogOptions){dialogOptions={}}
		
		//options
		dialogOptions.title=dialogOptions.title || title;
		dialogOptions.width=dialogOptions.width || 700;
		dialogOptions.height=dialogOptions.height || 500;
		dialogOptions.resizable=dialogOptions.resizable || false;
		dialogOptions.draggable=dialogOptions.draggable || false;
		//dialogOptions.draggable=false || dialogOptions.draggable;
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
		
		//jquery mobile
		//$("#"+id).show();
		//$.mobile.changePage('#'+id, {transition: 'pop', role: 'dialog'});
	}
	

	
	


	
