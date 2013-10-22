	
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
			toc:null,
			geocoding: new L.Control.BingGeocoder('AvZ8vsxrtgnSqfEJF1hU40bASGwxahJJ3_X3dtkd8BSNljatfzfJUvhjo9IGP_P7')
		}, 
		hitMapData:{   //heatmap data
			max:  1,        // Always 1 in tweet data
			data: []
		},
		gridster:null,  //gridster
		widgets:["widget_aguirre", "widget_alvarez", "widget_fletcher", "widget_faulconer", "widget_controlPanel"],// "widget_addWidget"],
		constants: {
			KEYWORDS: ['car', 'buy', 'shopping', 'Ford', 'friendly', 'upset', 'nice', 'bad', 'good', 'helpful', 'mistake']
		},
		eventHandler:{
			click: ('ontouchend' in document.documentElement)? "touchend" : "click", //this is because that the click eventHandler will NOT work in the iOS devices (some conflict with the gridster mouse event)
			mouseover: "mouseover"
		}
	}

    

	//dom ready
	$(function() { 	    
		init_UI();
		//init_news_widget();
		
		
		//TEMPORARY way to open map gallery (when map is double clicked)
//		$("#map").dblclick(function(event) {
//			showDialog('dialog_map_gallery', 'Map Gallery', {modal:true});
//			initMapGallery();
//			//event.preventDefault();
//			return false;
//		});		
	});
	
	
	
	
	/**
	* Creates a google table in news_widget.  Table is populated with data from rss.js.  
	*/
	function init_news_widget() {
		//sort score
		sortArray(rssFeeds, "score");
		showNews();
	}
	
	
	
	
	/**
	 * show news Feed
	 */
	function showNews(){
		//use <ul><li>to show the rssFeeds
		var html="<ul>";
		$.each(rssFeeds, function(i,rss){
			html+="<li rssIndex=" + i +" title='Please click to see the news'><div class='score' title='Relevant Score. Powered by PathGeo'>" + rss.score+"</div><div class='content'><label class='title'>"+ rss.name + " @ " + rss.date + "</label><br>"+ rss.title + "</div></li>";
		});
		html+="</ul>";
		$("#rss_news").html(html);
		
		//onclick event on each li
		$("#rss_news ul li").click(function(){
			var id=$(this).attr("rssIndex");
			if(id && id !=""){
				$("#dialog_news_score").html(rssFeeds[id].score);
				$("#dialog_news_content").html("<label class='title'>"+ rssFeeds[id].title + "</label><br>" + rssFeeds[id].name + " @ " + rssFeeds[id].date);
				$("#dialog_news_goto").click(function(){window.open(rssFeeds[id].url)});
				$("#dialog_news iframe").attr("src", rssFeeds[id].url);
				showDialog("dialog_news", "news", {modal:true, resizable:false, draggable:false, width:900, height:650, close:function(e,ui){$("#dialog_news iframe").html("").attr("src", "");}});
			}
		})
		
	}
	
	
	
	
	function init_leads(){
		//tabs
		//we have to wait until the tabs have been created. Otherwise, the google chart table cannot get the correct width
		$("#leads").tabs({"create": function(e,ui){
			//init_leads_table(leads.sales, "sales_leads");
			//init_leads_table(leads.service, "service_leads");
			init_leads_table(leads);
		}});
	}




	function init_leads_table(leads) {
		var divName='';
		
		//read leads
		$.each(leads, function(k,v){
			if(k=='service'){divName='service_leads'}
			if(k=='sales'){divName='sales_leads'}
			
			//adjust divName width and height. It is because using tabs will make the width of 2nd+ tabs to 0. So we need to set up manually.
			$("#"+divName).css({width: $("#"+divName).parent().width()-40, height: $("#"+divName).parent().height()-65});
			
			//sort array 
			sortArray(v, "score");
			
			var html="<ul>";
			$.each(v, function(i, lead){
				lead.leadID=i;
				lead.leadType=k;
				lead.divName=divName;
				
				html+="<li id=" + i + " leadType='" + k + "'>" + 
				  "<div class='score'>" + lead.score +"</div>"+
				  "<div class='content'><img title='see more about the lead' src='" + userData[lead.user].image_url + "' /><div><label class='title'>" + lead.user +"</label> says:<br>" + pathgeo.util.highlightKeyword(app.constants.KEYWORDS, lead.text, true) + "</div></div>"+
				  "</li>";
			});
			$("#"+divName).html(html);	
		});
		
		//click event and mouseover event
		$(".leads ul li .content img").bind(app.eventHandler.click, function(){
			var idx=$(this).parent().parent().attr("id"), //id in <li>
				leadType=$(this).parent().parent().attr("leadType"); //leadType in <li>
				
			showUserInfoDialog(leads[leadType][idx]);
		});
		$(".leads ul li").bind(app.eventHandler.mouseover, function(){
			//reset background color to avoid the color setted while mouseovering the marker
			$(".leads ul li").css({"background-color": ""});
			
			var idx=$(this).attr("id"),
				leadType=$(this).attr("leadType");
			showLocation(leads[leadType][idx]);
		});
	}
	
	
	
	function showUserInfoDialog(lead) {
		var userInfo=userData[lead.user]
		
		//join userinfo and lead, but we should be very carefull if there is any existing key name in two dateset
		$.extend(userInfo, lead);
		
		//user image
		$("#user_image").attr("src", userInfo.image_url);
		//user info
		$(".userInfo").each(function(){
			if($(this).attr("id") && $(this).attr("id") && userInfo[$(this).attr("id")] && userInfo[$(this).attr("id")]!=''){
				//if there is appointed format
				if($(this).attr("textFormat") && $(this).attr("textFormat")!='' && $(this).attr("textFormat").split("{value}").length>1){
					$(this).html($(this).attr("textFormat").replace(new RegExp("{value}", 'ig'), userInfo[$(this).attr("id")]));
				}else{
					$(this).html(userInfo[$(this).attr("id")])
					//highlight the text
					if($(this).attr("id")=='text'){$(this).html(pathgeo.util.highlightKeyword(app.constants.KEYWORDS, userInfo[$(this).attr("id")], true))}
				}
			}
		});
		
		
//		var userInfo;
//		for (var indx in userData) {
//			if (userData[indx].user_info.screen_name == userName) 
//				userInfo = userData[indx].user_info;
//		}
		//alert(userInfo.image_url);
//		$("#user_image").attr({"src": userInfo.image_url});
//		$("#user_description").text(userInfo.description);
//		$("#user_location").text(userInfo.location);
//		$("#user_friends_count").text(userInfo.friends_count);
//		$("#user_followers_count").text(userInfo.followers_count);
		
		showDialog('dialog_user_info', "About "+ lead.user, {
			modal:true,
			create:function(e,ui){
				$("#dialog_user_info textarea").blur(); //disable focusing to avoid the vitual keyboard popup i
			},
			open:function(e, ui){
				$("#dialog_user_info textarea").blur(); //disable focusing to avoid the vitual keyboard popup in mobile devices.
			}
		}); 
		
	}
	
	
	
	
	/**
	 * while mouseovering on the lead, it will trigger showLocation to show location on the map
	 * @param {Object} Lead
	 */
	function showLocation(lead){
		var userInfo=userData[lead.user]
		//join userinfo and lead, but we should be very carefull if there is any existing key name in two dateset
		
		//hide the markerLead layer
		app.map.removeLayer(app.layer.markerLead);
		
		var idx=Number(lead.leadID);
		
		//show
		if(lead.latlon && lead.latlon.length==2 && lead.latlon[0]!='' && lead.latlon[1]!=''){
			app.layer.markerLead=L.marker(lead.latlon)//.addTo(app.map); //add marker
			app.map.panTo(app.layer.markerLead.getLatLng()); //center to the marker
			
			//popup info window
			//var html="<img style='' src='" + userInfo.image_url + "' width=30px height=30px />"+
			var html="<div class='popup' style=''><b>" + lead.user + "</b> says: <br>"+lead.text+"&nbsp; &nbsp; &nbsp; <a style='cursor:pointer'>more...</a></div>";
			//app.layer.markerLead.bindPopup(html).openPopup();
			L.popup().setLatLng(app.layer.markerLead.getLatLng()).setContent(html).openOn(app.map);
			
			$(".popup a").bind(app.eventHandler.click, function(){
				showUserInfoDialog(lead);
			});
				
			
			//mouseover event on the app.layer.markerLead 
			//still have some problem!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			app.layer.markerLead.on("mouseover", function(e){
					app.layer.markerLead.openPopup();
					$("#" + lead.divName + " ul li:nth-child(" + (idx + 1) + ")").css({"background-color": "#eeeeee"});
			}).on("mouseout", function(e){
					app.layer.markerLead.closePopup();
					//$("#" + divName + " ul li:nth-child(" + (idx + 1) + ")").css({"background-color": ""});
				}
			);
		}
	}


    function init_Reputation(){

        var keywords = ['GOES UP', 'DROPS'];
       
        var html="";
        $.each(reputSolution, function(i,reputSol){
			html+="<div class='dia_rep' repIndex=" + i +">\n\
                    <span class='time'>" + reputSol.time+"</span>\n\
                    <div class='solution'><img class='image' src= " + reputSol.image_url+ " /><p class='message'>"+ pathgeo.util.highlightKeyword(keywords, reputSol.description, true)  + "</p>\n\
                    <span class='span'>Solution</span> <span class='span'>Detail</span> <span class='span'>Reply</span> <span class='span'>Save</span>\n\
                    <br>"+ reputSol.solution + "</div>\n\
                   </div>";
		});
		html+="";
		$("#reputation").html(html);

        $(".dia_rep").hover(function(){
			$(this).css('background-color','#BDBDBD');
            $(this).children().children('.span').css('display','inline')
		}, function(){
			$(this).css('background-color','#FFFFFF');
            $(this).children().children('.span').css('display','none')
		})

        $(".dia_rep_2").hover(function(){
			$(this).css('background-color','#BDBDBD')
		}, function(){
			$(this).css('background-color','#FFFFFF')
		})
    }

    function init_Visibility(){

        var keywords = ['GOES UP', 'DROPS'];

        var html="";
        $.each(visibSolution, function(i,visibSol){
			html+="<div class='dia_vis' repIndex=" + i +">\n\
                    <span class='time'>" + visibSol.time+"</span>\n\
                    <div class='solution'><img class='image' src= " + visibSol.image_url+ " /><p class='message'>"+ pathgeo.util.highlightKeyword(keywords, visibSol.description, true)  + "</p>\n\
                    <span class='span' id='btnSolution'>Solution</span> <span class='span' id='btnDetail'>Detail</span> <span class='span' id='btnReply'>Reply</span> <span class='span' id='btnSave'>Save</span>\n\
                    <br><div class='info' id='txtSolution'>"+ visibSol.solution + "</div></div>\n\
                   </div>";
		});
		html+="";
		$("#visibility").html(html);

        $(".dia_vis").hover(function(){
			$(this).css('background-color','#BDBDBD');
            $(this).children().children('.span').css('display','inline')
		}, function(){
			$(this).css('background-color','#FFFFFF');
            $(this).children().children('.span').css('display','none')
		})

        $(".dia_vis_2").hover(function(){
			$(this).css('background-color','#BDBDBD')
		}, function(){
			$(this).css('background-color','#FFFFFF')
		})

        $("#btnSolution").click(function(){
            $(this).siblings('#txtSolution').css('display','inline')
        })
    }
	
	/**
	 * init user interface 
	 */
	function init_UI(){		
		//gridster
		$(".gridster").append("<ul></ul>");

		app.gridster=$(".gridster > ul").gridster({
	        widget_margins: [10, 10],
	        widget_base_dimensions: [$(".gridster").width()/7, $(".gridster").width()/7.45],
			draggable: {
	            handle: '.widget-title' //change draggable area to the '.widget-title'
	        }
	    }).data("gridster");//.disable(); //disable dragging while init();
	    
		
	    //load widget
	    $.each(app.widgets, function(i,widget){
			addWidget(widget);
		});


		//cursor change while mouseovering on the widget title 
		$(".widget-title").hover(function(){
			$(this).css('cursor','move');
		}, function(){
			$(this).css('cursor','auto');
		})
		
		
		
		/**
		*logout dropdown event handler
		*/
		$('a#link').click(function() {
			//alert("sdfd");
			var submenu = $('div#submenu');
			if (submenu.is(":visible")) {
				submenu.fadeOut();
			} else {
				submenu.fadeIn();
			}
		});
		
		var submenu_active = false;
		 
		$('div#submenu').mouseenter(function() {
			submenu_active = true;
		});
		 
		$('div#submenu').mouseleave(function() {
			submenu_active = false;
			setTimeout(function() { if (submenu_active === false) $('div#submenu').fadeOut(); }, 400);
		});
		
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

		$("#date").html(today);
		
		
		//Adjust score text size based on window size
		//var sectionWidth = $('#widget_reputation').height();
		
		//var newFontSizeScore = ($('#widget_reputation').height() - 66);
		//$('.digital_score').css({"font-size" : newFontSizeScore});
		
		//var newFontSizePercent = newFontSizeScore/2;
		//$('.digital_percent').css({"font-size" : newFontSizePercent});
		
		//var arrowSize = (newFontSizePercent*20)/32;
		//$('.digital_arrow').width(arrowSize);
		//$('.digital_arrow').height(arrowSize);
		
		//$('.digital_table').css({"font-size" : newFontSizePercent});
		//$('.digital_table').css({"font-size" : newFontSizePercent});

	
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
	function addWidget(dom_id){
		var $this=$("div[id="+dom_id+"]");
		
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





	
