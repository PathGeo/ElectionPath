	
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
		dealer:"drew", //currrentDealer
		controls:{     //leafmap controls
			toc:null
		}, 
		hitMapData:{   //heatmap data
			max:  1,        // Always 1 in tweet data
			data: []
		},
		gridster:null,  //gridster
		//widgets:["widget_aguirre", "widget_alvarez", "widget_fletcher", "widget_faulconer", "widget_controlPanel"],// "widget_addWidget"],
		constants: {
			KEYWORDS: ['car', 'buy', 'shopping', 'Ford', 'friendly', 'upset', 'nice', 'bad', 'good', 'helpful', 'mistake']
		},
		eventHandler:{
			click: ('ontouchend' in document.documentElement)? "touchend" : "click", //this is because that the click eventHandler will NOT work in the iOS devices (some conflict with the gridster mouse event)
			mouseover: "mouseover"
		},
		candidates:null
	}

    

	//dom ready
	$(function() { 
	
		//read candidates information 
		$.getJSON("db/candidates_new.json", function(json){
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
		
		
		//read candidates
		if(app.candidates){
			var html="",
				html_addWidget="",
				$candidate=$("#candidate ul");
			
			$.each(app.candidates, function(k,v){
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
							"<li><label>"+v.values[0].tweets_all+"</label>mentioned since 10.01</li>"+
							"<li><label>"+v.values[0].followers_yesterday+"</label>Followers Yesterday</li>"+
							"<li><label>"+v.values[0].influence+"</label title='help'>Network influence Yesterday</li>"+
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
		
		//add layers
		var geojson=leadsToGeojson(leads.service.concat(leads.sales), "latlon");
		//clusterlayer
		var clusterMap=pathgeo.layer.markerCluster(geojson,
				{
					onEachFeature: function(feature,layer){
						var html="<div class='popup'><ul><li><label class='score'>" + feature.properties["score"] + "</label><b>" + feature.properties["user"] + ":</b>&nbsp; " + feature.properties["text"] + "</li></ul></div>";
						html=html.replace(/undefined/g, "Tweet");
													
						//highlight keyword
						html=pathgeo.util.highlightKeyword(app.constants.KEYWORDS, html, true);
						//info window
						layer.bindPopup(html,{maxWidth:400, maxHeight:225});
					}
				},{
					clusterclick: function(e){
						if(!e.layer._popup){
							var properties=pathgeo.util.readClusterFeatureProperies(e.layer, []);
							var html="<div class='popup'><b>" + e.layer._childCount + "</b> leads in this area:<p></p><ul>";
							$.each(properties, function(i, property){
								html+="<li id=" + property["leadID"] + " leadType='" + property["leadType"] + "' ><label class='score'>" + property["score"] + "</label><b>" + property["user"] + ":</b>&nbsp; " + property["text"] + "</li>";
							});
							html+="</ul></div>";
							html=html.replace(/undefined/g, "Tweet");
											
							//highlight keyword
							html=pathgeo.util.highlightKeyword(app.constants.KEYWORDS, html, true);
													
							e.layer.bindPopup(html,{maxWidth:400, maxHeight:225}).openPopup();
						}else{
							e.layer.openPopup();
						}
						
						
						//onclick and onmouseover event
						//!!!!!!!!! still have some problems!!!!!!!!!!!!!!!!!!!
						$(".popup ul li").bind(app.eventHandler.click, function(){
							var lead=leads[$(this).attr("leadType")][$(this).attr("id")];
							showUserInfoDialog(lead)
						}).bind(app.eventHandler.mouseover, function(){
							var lead=leads[$(this).attr("leadType")][$(this).attr("id")];
							$("#" + lead.divName + " ul li:nth-child(" + (Number(lead.leadID)+1) + ")").css("background-color:#eeeeee;")
						});
					}
				}
		).addTo(app.map);


		//map controls
		var overlays = {
			"Marker Map": L.geoJson(geojson, {
				onEachFeature: function(feature,layer){
						var html="<div class='popup'><ul><li><label class='score'>" + feature.properties["score"] + "</label><b>" + feature.properties["user"] + ":</b>&nbsp; " + feature.properties["text"] + "</li></ul></div>";
						html=html.replace(/undefined/g, "Tweet");
													
						//highlight keyword
						html=pathgeo.util.highlightKeyword(app.constants.KEYWORDS, html, true);
						//info window
						layer.bindPopup(html,{maxWidth:400, maxHeight:225});
				}
			}),
			"Cluster Map": clusterMap,
			"Heat Map": pathgeo.layer.heatMap(geojson),
			"Census Data": L.tileLayer.wms("http://sgis.kisr.edu.kw/geoserver/topp/wms", {layers:"topp:states", attribution:"", format:"image/png", transparent:true})
		};
		app.controls.toc=L.control.layers(basemaps, overlays).addTo(app.map);		
		
		
		//bing geocoder
		app.map.addControl(app.controls.geocoding)
		
		//scale bar
		app.map.addControl(new L.Control.Scale());
		
		
		//show default dealer logo marker
		app.layer.markerDealer[app.dealer].addTo(app.map);
		
		//add buffer around car dealer 32.774917,-117.005639 (1mile = 1609.34 meters)
		var biffer5m = L.circle([32.774917, -117.005639], 1609.34 * 5, {
			color: 'red',
			fillColor: '#f03',
			weight:2,
			fillOpacity: 0
		}).addTo(app.map);
		
		var biffer10m = L.circle([32.774917, -117.005639], 1609.34 * 10, {
			color: 'green',
			fillColor: '#f03',
			weight:2,
			fillOpacity: 0
		}).addTo(app.map);	

		var biffer15m = L.circle([32.774917, -117.005639], 1609.34 * 15, {
			color: 'blue',
			fillColor: '#f03',
			weight:2,
			fillOpacity: 0
		}).addTo(app.map);			
			
	}

	
	/**
	 * convert leads to geojson format
	 * @param {Array} leadArray
	 * @param {String} locationFieldName
	 */
	function leadsToGeojson(leadArray, locationFieldName){
		if(!leadArray && !locationFieldName){console.log("[ERROR] leadsToGeojson: no leadArray, location field name");return;}
		
		var featureCollection={
				type: "FeatureCollection",
				features:[]
			};
		
		$.each(leadArray, function(i,lead){
			var feature={
				type:"Feature",
				properties:lead,
				geometry:{
					type:"Point",
					coordinates:[]
				}
			};
			$.each(lead, function(k,v){
				if(k==locationFieldName){feature.geometry.coordinates=[v[1], v[0]]}
			});
			featureCollection.features.push(feature);
		})
		return featureCollection;
	}
		
	

	/**
	 * add a new Widget into the Dashboard 
	 */
	function addWidget(id){
		if(!id){
			$(".widget").each(function(){
				createWidget($(this));
			})
		}else{
			//check if the widget is already existing
			if($(".gs_w[id='"+id+"']").length>0){
				alert('The widget is already existing. You do not need to add duplicate widget. ');
			}else{
				createWidget($("#"+id))
			}
		}
		
		
		
		//create widget
		function createWidget($this){
			var sizeX=$this.attr("widget-sizeX") || 1,
				sizeY=$this.attr("widget-sizeY") || 1,
				row=$this.attr("widget-row") || 1,
				col=$this.attr("widget-col") || 1;
	
			
			//add the widget
			var $widget=app.gridster.add_widget("<li>"+ createWidgetTitle($this) + $this.html() + "</li>", sizeX, sizeY, col, row);
			
			//give widget id
			$widget.attr("id", $this.attr("id"));
	
			//init the widget
			//Because while loading all widget into the dashboard, the width of the widgets will be dyanmically increased until to the assigned width
			//Therefore, we have to wait until the widgets reach the assigned width to call the init function
			//calculate the widget final width
			var final_width=(app.gridster.min_widget_width * sizeX) - (app.gridster.options.widget_margins[0] * 2 )-1;
			var interval=setInterval(function(){
				if($widget.width() > final_width){
					clearInterval(interval);
					
					//if div contains widget-onInit event
					if($this.attr("widget-onInit") && $this.attr("widget-onInit")!=""){
						//window[$this.attr("widget-onInit")]()
						eval($this.attr("widget-onInit"));
					}
				}
			},100);
			
			
			//onclick event
			if($this.attr("widget-onClick") && $this.attr("widget-onClick")!=""){
				//if not addWidget
				if($widget.attr("id")!="widget_addWidget"){
					$widget.find(".widget-detail").show().bind(app.eventHandler.click, function(){
						eval($this.attr("widget-onClick"));
					});
				}else{
					$widget.find("div:nth-child(2)").bind(app.eventHandler.click, function(){
						eval($this.attr("widget-onClick"));
					});
				}
			}
			
			//onclose event
			$widget.find(".widget-close").bind(app.eventHandler.click, function(){
				if($widget.attr("id")!='widget_addWidget'){
					showDialog('div_closeWidget', 'Close Widget', {
						width:300,
						height:150,
						resizable:false,
						draggable:false,
						modal:true, 
						buttons: {
							Confirm: function() {
								if($this.attr("widget-onClose") && $this.attr("widget-onClose")!=""){
									eval($this.attr("widget-onClose"));
								}
								app.gridster.remove_widget($widget);
								$(this).dialog("close");
							},
							Cancel: function() {
								$(this ).dialog("close");
							}
						}
					});
				}
			})
			
		}
		
		
		//close all dialog
		$("*").dialog("close");
		
	}
	
	
	/**
	 * create title section in a widget 
	 */
	function createWidgetTitle($this){
		//title
		var html="<div class='widget-title'>"
		if($this.attr("widget-title") && $this.attr("widget-title")!=""){
			html+="<label>"+$this.attr("widget-title")+"</label>";
		}
		
		if($this.attr("id")!="widget_addWidget"){
			html+="<span class='widget-close' title='close the widget'></span>"+
			  	  "<span class='widget-detail' title='See more detail'></span>"+
			      "</div>";
		}
		return html;
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
	

	
	/**
	 * sort array based on objname
	 */
	function sortArray(array, objName){
		if (!array || array.length==0 || !objName || objName == "") {console.log("[ERROR]sortArray: no array or objName");return;}
		
		array.sort(function(a,b){
			switch ($.type(a[objName])) {
				case "number":
					if (a[objName] == b[objName]) return 0;
					return a[objName] < b[objName] ? 1 : -1; //descend
				break;
				case "date":
					
				break;
				case "string":
					if(objName=='date'){
						return (new Date(a[objName]) < new Date(b[objName]))? 1: -1; //descend
					}else{
						return a[objName] > b[objName] ? 1: -1; //ascend
					}
					
				break;
			}
		});
		
	}		



	/**
	*   Initialize tweet stream box
	*/	
	function init_tweetStream(TweetStream_kw){
        
	    if (!window.BAM) {
	        window.BAM = new TWTR.Widget({
	            version: 2,
	            id: 'tweet',
	            subject: 'Now Streaming: "' + TweetStream_kw + '"',
	            type: 'search',
	            search: TweetStream_kw,
	            interval: 30,
	            width: 'auto',
	            height: $("li[id=widget_tweetStream]").height() - $(".widget_title").height() - 133,
	            theme: {
	                shell: {
	                    background: '#8ec1da',
	                    color: '#ffffff'
	                },
	                tweets: {
	                    background: '#ffffff',
	                    color: '#444444',
	                    links: '#1985b5'
	                }
	            },
	            features: {
	                scrollbar: true,
	                loop: true,
	                live: true,
	                behavior: 'all'
	            }
	        });

	        window.BAM
                .render()
                .start();
	    }
	    else {
	        if (TweetStream_kw != window.old_search) {
	            window.BAM
                    .stop()
                    .setSearch(TweetStream_kw)
                    .setCaption('Now Streaming: "' + TweetStream_kw + '"')
                    .render()
                    .start()
	        }
	    }

	    window.old_search = TweetStream_kw;
	    return window.BAM;
	}

	function change_Keyword(user_kw) {
	    init_tweetStream(user_kw)
	}


	
		
	/**
	*Initialize reputation score and graphs
	*/
	function init_reputation_graph(){
	
		showDialog('dialog_reputation', 'Reputation', {modal:true});
	
		$('.changeRepGraph').css('cursor', 'pointer');
	
		var reputation_data = getScore("weeklyRep");
		var reputation_data_table = google.visualization.arrayToDataTable(reputation_data);

        var options_graph_rep = {
          legend: {position: 'none'},
		  vAxis: {minValue:-100,maxValue:100,gridlines:{count:5}},
		  hAxis: {showTextEvery:4},
		  pointSize:4
        };

        var reputation_graph = new google.visualization.LineChart(document.getElementById('graph_rep'));
        reputation_graph.draw(reputation_data_table, options_graph_rep);
		
		
		$('.changeRepGraph').click(function() {
			reputation_data = getScore($(this).attr('id'));
			reputation_data_table = google.visualization.arrayToDataTable(reputation_data);
			if($(this).attr('id') == "dailyRep"){
				var hLabel = 2;
			}
			if($(this).attr('id') == "weeklyRep"){
				var hLabel = 4;
			}
			if($(this).attr('id') == "monthlyRep"){
				var hLabel = 8;
			}
			options_graph_rep = {
				legend: {position: 'none'},
				vAxis: {minValue:-100,maxValue:100,gridlines:{count:5}},
				hAxis: {showTextEvery:hLabel},
				pointSize:4
				
			};
			reputation_graph.draw(reputation_data_table, options_graph_rep);
			$('.changeRepGraph').css("font-weight","normal");
			var bolder = '#' + ($(this).attr('id'));
			$(bolder).css("font-weight","bold");
		});
		
		//Show reviews table
		var reviewData = new google.visualization.DataTable();
		reviewData.addColumn("string", "Rating");
		reviewData.addColumn("string", "Date");
		reviewData.addColumn("string", "Review");
		
		for (var indx in reviews) {
			var feed = reviews[indx];
			if(feed.Rating.charAt(0) == "+"){
				feed.Rating = "<span style='color:green; font-weight:bold'>" + feed.Rating + "</span>"
			}
			else{
				feed.Rating = "<span style='color:red; font-weight:bold'>" + feed.Rating + "</span>"
			}
			//review = "<div style='float:left'><img src='images/small/" + feed.Source + ".png' alt='logo' ></div>" + feed.Review;
			var review = "<div style='float:left'><img src='images/small/" + feed.Source + ".png' alt='logo' ></div>" + (pathgeo.util.highlightKeyword(app.constants.KEYWORDS, feed.Review, true));
			reviewData.addRow( [feed.Rating, 
								feed.Date,
								review
							] );
		}
		
		var reviewTable = new google.visualization.Table(document.getElementById('review_rep'));
		reviewTable.draw(reviewData, { showRowNumber: false, allowHtml: true, sortColumn: 1, sortAscending: false} );
		
	}
	
	/**
	*Initialize visibilty score and graphs
	*/
	function init_visibilty_graph(){
	
		showDialog('dialog_visibility', 'Visibility', {modal:true})
	
		$('.changeVisGraph').css('cursor', 'pointer');
	
		var visibility_data = getScore("weeklyVis");
		var visibilty_data_table = google.visualization.arrayToDataTable(visibility_data);

        var options_graph_vis = {
			series: [{color: 'F00000'}],
			legend: {position: 'none'},
			vAxis: {minValue:-100,maxValue:100,gridlines:{count:5}},
			hAxis: {showTextEvery:4},
			pointSize:4
        };

        var visibility_graph = new google.visualization.LineChart(document.getElementById('graph_vis'));
        visibility_graph.draw(visibilty_data_table, options_graph_vis);
		
		
		$('.changeVisGraph').click(function() {
			visibility_data = getScore($(this).attr('id'));
			visibilty_data_table = google.visualization.arrayToDataTable(visibility_data);
			if($(this).attr('id') == "dailyVis"){
				var hLabel = 2;
			}
			if($(this).attr('id') == "weeklyVis"){
				var hLabel = 4;
			}
			if($(this).attr('id') == "monthlyVis"){
				var hLabel = 8;
			}
			options_graph_vis = {
				series: [{color: 'F00000'}],
				legend: {position: 'none'},
				vAxis: {minValue:-100,maxValue:100,gridlines:{count:5}},
				hAxis: {showTextEvery:hLabel},
				pointSize:4
				
			};
			visibility_graph.draw(visibilty_data_table, options_graph_vis);
			$('.changeVisGraph').css("font-weight","normal");
			var bolder = '#' + ($(this).attr('id'));
			$(bolder).css("font-weight","bold");
		});
		
		//Show reviews table
		var reviewData = new google.visualization.DataTable();
		reviewData.addColumn("string", "Rating");
		reviewData.addColumn("string", "Date");
		reviewData.addColumn("string", "Chatter");
		
		for (var indx in reviews) {
			var feed = reviews[indx];
			if(feed.Rating.charAt(0) == "+"){
				feed.Rating = "<span style='color:green; font-weight:bold'>" + feed.Rating + "</span>"
			}
			else{
				feed.Rating = "<span style='color:red; font-weight:bold'>" + feed.Rating + "</span>"
			}
			//var review = "<div style='float:left'><img src='images/small/" + feed.Source + ".png' alt='logo' ></div>" + feed.Review;
			var review = "<div style='float:left'><img src='images/small/" + feed.Source + ".png' alt='logo' ></div>" + (pathgeo.util.highlightKeyword(app.constants.KEYWORDS, feed.Review, true));
			reviewData.addRow( [feed.Rating, 
								feed.Date,
								review
							] );
		}
		
		var reviewTable = new google.visualization.Table(document.getElementById('review_vis'));
		reviewTable.draw(reviewData, { showRowNumber: false, allowHtml: true, sortColumn: 1, sortAscending: false} );

	}
	
	
	
	/**
	*Initialize competitor score and graphs
	*/
	function init_competitor_graph(){
	
		showDialog('dialog_competitor', 'Competitor', {modal:true})
		$('.changeCompGraph').css('cursor', 'pointer');
		
		var competitor_data = getCompetitorScores("dealerA");
		var competitor_data_table = google.visualization.arrayToDataTable(competitor_data);

        var options_graph_comp = {
			legend: {position: 'bottom'},
			vAxis: {minValue:-100,maxValue:100,gridlines:{count:5}},
			hAxis: {showTextEvery:4},
			pointSize:4
        };

        var competitor_graph = new google.visualization.LineChart(document.getElementById('competitor_graph'));
        competitor_graph.draw(competitor_data_table, options_graph_comp);
		
		$('.changeCompGraph').click(function() {
		
			competitor_data = getCompetitorScores($(this).attr('id'));
			competitor_data_table = google.visualization.arrayToDataTable(competitor_data);

			competitor_graph = new google.visualization.LineChart(document.getElementById('competitor_graph'));
			competitor_graph.draw(competitor_data_table, options_graph_comp);

			$('.changeCompGraph').css("font-weight","normal");
			var bolder = '#' + ($(this).attr('id'));
			$(bolder).css("font-weight","bold");
		});
	

	}

	
	
	
	/**
	*Switch User Logo
	*/
	function switch_user(company){
		if(company=="penske"){
			$("#link").html("General Manager<span class='ui-icon ui-icon-carat-1-s widget-dropdown' title='Expand'></span>");
			$("#logo").html("<img src = 'images/logo_penske.png' alt='logo' border='0' style = 'float:left;padding-right:15px' />");
			$('div#submenu').hide();
		}
		else{
			$("#link").html("General Manager<span class='ui-icon ui-icon-carat-1-s widget-dropdown' title='Expand'></span>");
			$("#logo").html("<img src = 'images/logo_ford.png' alt='logo' border='0' style = 'float:left;padding-right:15px' />");
			$('div#submenu').hide();
		}
		
		//add dealer logo on the map
		//first, remove all dealer logo existing on the map
		$.each(app.layer.markerDealer, function(k,v){app.map.removeLayer(v);});
		app.layer.markerDealer[company].addTo(app.map);
		
		app.dealer=company;
	}
	
	
	/**
	*Logout
	*/
	function logout(){
		$("#link").html("Sign In<span class='ui-icon ui-icon-carat-1-s widget-dropdown' title='Expand'></span>");
		$("#logo").html("");
		$('div#submenu').hide();
	}
	
	
	/**
	*Change Chart Type
	*/
	function changeChart(chartType){
	
		var chart_data = getData(chartType);
		
		if(chartType == "line"){
			var options = {
				title: 'Total Mentions per Day',
				legend: {position:'bottom'},
				hAxis: {showTextEvery:2},
				pointSize:4,
				titleTextStyle: {color: '#555555', fontName: 'Arial', fontSize: 12}
			};
			var data = google.visualization.arrayToDataTable(chart_data);
			var chart = new google.visualization.LineChart(document.getElementById('chart'));
			chart.draw(data, options);
		}

		if(chartType == "pie"){
			var options = {
				title: 'Total Mentions, Feb 22-28',
				legend: {position:'bottom'},
				titleTextStyle: {color: '#555555', fontName: 'Arial', fontSize: 12}
			};
			var data = google.visualization.arrayToDataTable(chart_data);
			var chart = new google.visualization.PieChart(document.getElementById('chart'));
			chart.draw(data, options);


		}
	}





	
