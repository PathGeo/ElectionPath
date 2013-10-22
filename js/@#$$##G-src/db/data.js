function getScore(condition){
	//Reputation Scores
	if (condition == "dailyRep"){
		var data_daily_rep  = [
			['Date', 'Reputation'],
			['Feb 16',  -8],
			['Feb 17',  0], 
			['Feb 18',  16],
			['Feb 19',  20],
			['Feb 20',  26],
			['Feb 21',  22],
			['Feb 22',  20],
			['Feb 23',  30],
			['Feb 24',  45],
			['Feb 25',  63],
			['Feb 26',  70],
			['Feb 27',  65],
			['Feb 28',  77],
			['Mar 1',  82]        
		]
		return data_daily_rep;
	}
	if (condition == "weeklyRep"){

		var data_weekly_rep  = [
			['Date', 'Reputation'],
			['Feb 1',  -62],
			['Feb 2',  -48],
			['Feb 3',  -48],
			['Feb 4',  -33],
			['Feb 5',  -22],
			['Feb 6',  -33],
			['Feb 7',  -8],
			['Feb 8',  -10],
			['Feb 9',  -18],
			['Feb 10',  3],
			['Feb 11',  6],
			['Feb 12',  12],
			['Feb 13',  20],
			['Feb 14',  36],
			['Feb 15',  10],
			['Feb 16',  -8],
			['Feb 17',  0], 
			['Feb 18',  16],
			['Feb 19',  20],
			['Feb 20',  26],
			['Feb 21',  22],
			['Feb 22',  20],
			['Feb 23',  30],
			['Feb 24',  45],
			['Feb 25',  63],
			['Feb 26',  70],
			['Feb 27',  65],
			['Feb 28',  77],
			['Mar 1',  82]     
		]
		return data_weekly_rep;
	}
	if (condition == "monthlyRep"){

		var data_monthly_rep  = [
			['Date', 'Reputation'],
			['Jan 1',  -55],
			['Jan 2',  -45],
			['Jan 3',  -48],
			['Jan 4',  -36],
			['Jan 5',  -24],
			['Jan 6',  -22],
			['Jan 7',  -16],
			['Jan 8',  -16],
			['Jan 9',  -18],
			['Jan 10',  2],
			['Jan 11',  6],
			['Jan 12',  -10],
			['Jan 13',  -10],
			['Jan 14',  -12],
			['Jan 15',  -2],
			['Jan 16',  -4],
			['Jan 17',  -6], 
			['Jan 18',  1],
			['Jan 19',  5],
			['Jan 20',  18],
			['Jan 21',  32],
			['Jan 22',  28],
			['Jan 23',  25],
			['Jan 24',  11],
			['Jan 25',  2],
			['Jan 26',  5],
			['Jan 27',  12],
			['Jan 28',  8],
			['Jan 29',  -17],
			['Jan 30',  -32],
			['Jan 31',  -40],
			['Feb 1',  -62],
			['Feb 2',  -48],
			['Feb 3',  -48],
			['Feb 4',  -33],
			['Feb 5',  -22],
			['Feb 6',  -33],
			['Feb 7',  -8],
			['Feb 8',  -10],
			['Feb 9',  -18],
			['Feb 10',  3],
			['Feb 11',  6],
			['Feb 12',  12],
			['Feb 13',  20],
			['Feb 14',  36],
			['Feb 15',  10],
			['Feb 16',  -8],
			['Feb 17',  0], 
			['Feb 18',  16],
			['Feb 19',  20],
			['Feb 20',  26],
			['Feb 21',  22],
			['Feb 22',  20],
			['Feb 23',  30],
			['Feb 24',  45],
			['Feb 25',  63],
			['Feb 26',  70],
			['Feb 27',  65],
			['Feb 28',  77],
			['Mar 1',  82] 			
		]
		return data_monthly_rep;
	}
	
	//Visibilty Scores
	if (condition == "dailyVis"){
		var data_daily_vis  = [
			['Date', 'Visibilty'],
			['Feb 16',  45],
			['Feb 17',  12], 
			['Feb 18',  34],
			['Feb 19',  50],
			['Feb 20',  38],
			['Feb 21',  49],
			['Feb 22',  42],
			['Feb 23',  34],
			['Feb 24',  45],
			['Feb 25',  63],
			['Feb 26',  77],
			['Feb 27',  70],
			['Feb 28',  79],
			['Mar 1',  88]    
		]
		return data_daily_vis;
	}
	if (condition == "weeklyVis"){

		var data_weekly_vis  = [
			['Date', 'Visibilty'],
			['Feb 1',  -55],
			['Feb 2',  -45],
			['Feb 3',  -48],
			['Feb 4',  -33],
			['Feb 5',  -22],
			['Feb 6',  -28],
			['Feb 7',  -10],
			['Feb 8',  -16],
			['Feb 9',  -18],
			['Feb 10',  2],
			['Feb 11',  6],
			['Feb 12',  -12],
			['Feb 13',  -20],
			['Feb 14',  10],
			['Feb 15',  30],
			['Feb 16',  45],
			['Feb 17',  12], 
			['Feb 18',  34],
			['Feb 19',  50],
			['Feb 20',  38],
			['Feb 21',  49],
			['Feb 22',  42],
			['Feb 23',  34],
			['Feb 24',  45],
			['Feb 25',  63],
			['Feb 26',  77],
			['Feb 27',  70],
			['Feb 28',  79],
			['Mar 1',  88]
		]
		return data_weekly_vis;
	}
	if (condition == "monthlyVis"){

		var data_monthly_vis  = [
			['Date', 'Visibilty'],
			['Jan 1',  -55],
			['Jan 2',  -45],
			['Jan 3',  -48],
			['Jan 4',  -36],
			['Jan 5',  -24],
			['Jan 6',  -22],
			['Jan 7',  -16],
			['Jan 8',  -16],
			['Jan 9',  -18],
			['Jan 10',  2],
			['Jan 11',  6],
			['Jan 12',  -12],
			['Jan 13',  -20],
			['Jan 14',  -22],
			['Jan 15',  -18],
			['Jan 16',  -12],
			['Jan 17',  -6], 
			['Jan 18',  1],
			['Jan 19',  5],
			['Jan 20',  15],
			['Jan 21',  22],
			['Jan 22',  18],
			['Jan 23',  15],
			['Jan 24',  11],
			['Jan 25',  2],
			['Jan 26',  -5],
			['Jan 27',  -12],
			['Jan 28',  -15],
			['Jan 29',  -17],
			['Jan 30',  -32],
			['Jan 31',  -40],
			['Feb 1',  -55],
			['Feb 2',  -45],
			['Feb 3',  -48],
			['Feb 4',  -33],
			['Feb 5',  -22],
			['Feb 6',  -28],
			['Feb 7',  -10],
			['Feb 8',  -16],
			['Feb 9',  -18],
			['Feb 10',  2],
			['Feb 11',  6],
			['Feb 12',  -12],
			['Feb 13',  -20],
			['Feb 14',  10],
			['Feb 15',  30],
			['Feb 16',  45],
			['Feb 17',  12], 
			['Feb 18',  34],
			['Feb 19',  50],
			['Feb 20',  38],
			['Feb 21',  49],
			['Feb 22',  42],
			['Feb 23',  34],
			['Feb 24',  45],
			['Feb 25',  63],
			['Feb 26',  77],
			['Feb 27',  70],
			['Feb 28',  79],
			['Mar 1',  88] 
		]
		return data_monthly_vis;
	}
}


var userData = {
	"Da_Juan_andOnly": {
		"description": "I do what I want.Cali livin. Soccer best sport in the world. Good beer. Laid back chillin posted, living like a villain mostly.",
		"friends_count": 301,
		"followers_count": 108,
		"image_url": "http://a0.twimg.com/profile_images/2012788536/jd_bigger.jpg",
		"location": "San Diego",
		"screen_name": "Da_Juan_andOnly"
	},
	"2Girlsx1STONER_": {
		"description": "Tatt Artist/CALIFORINA NATIVE/19 #Team_LEO #Team_BeachBoiz #TeamCALI #WildLyfeGANG #INKJUNKIES #2GIRLS1STONER ",
		"friends_count": 597,
		"followers_count": 359,
		"image_url": "http://a0.twimg.com/profile_images/3244797412/5ac9d1afd781c7e8fa661cfe3a729209_bigger.jpeg",
		"location": "San Diego \u2708 California",
		"screen_name": "2Girlsx1STONER_"
	},
	"nsolis23": {
		"description": "21 years of age.\tSan Diego. always hungry. responsible tattoo addict ",
		"friends_count": 334,
		"followers_count": 259,
		"image_url": "http://a0.twimg.com/profile_images/3264635052/54b7f04570f088cb33fdcf3f119e5073_bigger.jpeg",
		"location": "Chula Vista",
		"screen_name": "nsolis23"
	},
	"Ryro1313": {
		"description": "Speak Your Mind Out, It's all we can do\u2665 http://speakyourmindoutyo.tumblr.com/",
		"friends_count": 43,
		"followers_count": 3,
		"image_url": "http://a0.twimg.com/profile_images/2946330656/ac630f8ca9e7a8cccb4f42d46227eab1_bigger.jpeg",
		"location": "Vista, CA",
		"screen_name": "Ryro1313"
	},
	"ChelseyChavez": {
		"description": "Blessed that God gave me the talent and opportunity to chase my dream. SDSU. Corrinthians 13:4",
		"friends_count": 145,
		"followers_count": 182,
		"image_url": "http://a0.twimg.com/profile_images/3111104992/65ab2e7c01395d49522a57528bed6513_bigger.jpeg",
		"location": "San Diego, California",
		"screen_name": "ChelseyChavez"
	},
	"cabrera_gabe": {
		"description": "",
		"friends_count": 111,
		"followers_count": 83,
		"image_url": "http://a0.twimg.com/profile_images/3097701251/625f83d604d6eae2aa0f2158c9837397_bigger.jpeg",
		"location": "San Diego, CA",
		"screen_name": "cabrera_gabe"
	},
	"gigglesbabyxoxo": {
		"description": "",
		"friends_count": 111,
		"followers_count": 122,
		"image_url": "http://a0.twimg.com/profile_images/3280979121/1f922257bf7fe1952a4793a22c67cf51_bigger.png",
		"location": "San Diego",
		"screen_name": "gigglesbabyxoxo"
	},
	"STEEZEandCHEEZE": {
		"description": "The only thing I need to be chasing is my dream. And believe me, I'm already running.",
		"friends_count": 230,
		"followers_count": 267,
		"image_url": "http://a0.twimg.com/profile_images/3146585275/5654e03e27e48c9baa5d927785707d0f_bigger.jpeg",
		"location": "San Diego, California",
		"screen_name": "STEEZEandCHEEZE"
	},
	"mariesammy": {
		"description": "its all happening.",
		"friends_count": 102,
		"followers_count": 155,
		"image_url": "http://a0.twimg.com/profile_images/3274368196/cac7db9e12a0fd9bf7294a836a91cf32_bigger.jpeg",
		"location": "San Diego/Murrieta, Ca.",
		"screen_name": "mariesammy"
	},
	"Kitana_Monaee": {
		"description": "- Livin' Life To The Fullest | Sweet 16 ^_^ | NO Mention = NO Follow Back \u270c| #ObeyReality . \u2665",
		"friends_count": 547,
		"followers_count": 737,
		"image_url": "http://a0.twimg.com/profile_images/3325782043/47f2fa4c95e090c81fc8824e4ff4b518_bigger.jpeg",
		"location": "- San Diego \u2661 CaLOVEfornia .",
		"screen_name": "Kitana_Monaee"
	},
	"negsmani": {
		"description": "",
		"friends_count": 139,
		"followers_count": 82,
		"image_url": "http://a0.twimg.com/profile_images/2893193613/f1b10707c1766ccdd6723b1aad774948_bigger.jpeg",
		"location": "San Diego ",
		"screen_name": "negsmani"
	},
	"shhhua": {
		"description": "I do the Twitters and Facebooks for @Razer (Razer|Quick). ",
		"friends_count": 111,
		"followers_count": 728,
		"image_url": "http://a0.twimg.com/profile_images/2963083245/27eb939c61ff2a83730f468b0e5de916_bigger.jpeg",
		"location": "San Diego, CA",
		"screen_name": "shhhua"
	},
	"LuisxNights": {
		"description": ".Edge // N i G H T S // Living Free // Ocean Life.",
		"friends_count": 299,
		"followers_count": 336,
		"image_url": "http://a0.twimg.com/profile_images/3115114294/99e179ac24b93ddd8b47b53d352d8d25_bigger.jpeg",
		"location": "Chula Vista",
		"screen_name": "LuisxNights"
	},
	"MagdaBanome": {
		"description": "helping you discover, deceive me when, disgrace for you. Deceive me -- you cannot get fooled once again!",
		"friends_count": 121,
		"followers_count": 25,
		"image_url": "http://a0.twimg.com/profile_images/2627523394/fdhfdhah_bigger.jpg",
		"location": "Chula Vista, California",
		"screen_name": "MagdaBanome"
	},
	"2manyjuans": {
		"description": "Life is a rought mix! then filter it!!",
		"friends_count": 134,
		"followers_count": 64,
		"image_url": "http://a0.twimg.com/profile_images/2708172190/bf0fe85e7e28d1c78819c82b1d0ce31f_bigger.jpeg",
		"location": "San Diego",
		"screen_name": "2manyjuans"
	},
	"marileeaze": {
		"description": "Ignorant ass fuq (Apparently I tweet in bulk!)",
		"friends_count": 130,
		"followers_count": 126,
		"image_url": "http://a0.twimg.com/profile_images/2493275101/marileeaze_bigger.jpg",
		"location": "SanDiego",
		"screen_name": "marileeaze"
	},
	"Kenzie_Kmackin": {
		"description": "Life's a garden, Dig it!! -Joe Dirt",
		"friends_count": 318,
		"followers_count": 321,
		"image_url": "http://a0.twimg.com/profile_images/2794984312/478353a35575e90d68cffd5bc1a0a5e9_bigger.jpeg",
		"location": "San Diego",
		"screen_name": "Kenzie_Kmackin"
	},
	"Mantis619": {
		"description": "EDM \u266c| Writer| Poet| Gloomy| #Producer| #TeamFollowBack| LoadedLights Sponsor| [OBEY]",
		"friends_count": 655,
		"followers_count": 348,
		"image_url": "http://a0.twimg.com/profile_images/3074327838/f54455330f2f385497c187a819820e70_bigger.jpeg",
		"location": "Sunny San Diego, California",
		"screen_name": "Mantis619"
	},
	"Cfendiz": {
		"description": "Feels good to be alive ",
		"friends_count": 138,
		"followers_count": 112,
		"image_url": "http://a0.twimg.com/profile_images/3268835550/1abe40bdc857158d00e165a7a0c21c8b_bigger.jpeg",
		"location": "San Diego, CA ",
		"screen_name": "Cfendiz"
	},
	"sarahmikhael_": {
		"description": "follow me on Instagram @sarahmikhael",
		"friends_count": 107,
		"followers_count": 225,
		"image_url": "https://twimg0-a.akamaihd.net/profile_images/3344089932/f48e4c299cfcecb5f693aaeb4e9e2f9e_bigger.jpeg",
		"location": "sunny san diego",
		"screen_name": "sarahmikhael_"
	}
}

var leads = 
{   
    "service": [
        {
            "date": "2/26/2013", 
            "text": "Cant drive my new car till i get shocks. Fack", 
            "latlon": [
                32.749098, 
                -117.10053
            ], 
			"score": 83,
            "user": "Mantis619", 
            "loc": "San Diego"
        }, 
        {
            "date": "2/22/2013", 
            "text": "Car is over hearing weh  need to fix tomorrow", 
            "latlon": [
                32.778265, 
                -117.158222
            ], 
			"score": 87,
            "user": "marileeaze", 
            "loc": "SanDiego"
        }, 
        {
            "date": "2/23/2013", 
            "text": "Who knows about intakes? I want to buy one for my car but I don't know which one?", 
            "latlon": [
                32.7153, 
                -117.1564
            ], 
			"score": 79,
            "user": "2manyjuans", 
            "loc": "San Diego"
        }, 
        {
            "date": "2/25/2013", 
            "text": "Then ima get my new tires+rims. Finalllllyyyy ! Babygirl gonna be more rideable lol", 
            "latlon": [
                32.7153, 
                -117.1564
            ], 
			"score": 84,
            "user": "gigglesbabyxoxo", 
            "loc": "San Diego"
        }, 
        {
            "date": "2/26/2013", 
            "text": "My car needs a damn tune up &amp; oil change", 
            "latlon": [
                32.6333324, 
                -117.00178
            ], 
			"score": 75,
            "user": "nsolis23", 
            "loc": "Chula Vista"
        }, 
        {
            "date": "2/24/2013", 
            "text": "Lmao my car just died on me again. I need new a new battery for my car", 
            "latlon": [
                32.7153, 
                -117.1564
            ], 
			"score": 79,
            "user": "ChelseyChavez", 
            "loc": "San Diego, California"
        }, 
        {
            "date": "2/25/2013", 
            "text": "All looking up getting my car painted next week", 
            "latlon": [
                32.7153, 
                -117.1564
            ], 
			"score": 80,
            "user": "2Girlsx1STONER_", 
            "loc": "San Diego"
        }, 
        {
            "date": "2/25/2013", 
            "text": "OF COURSE my car needs a new battery....so much for good luck #frustrated", 
            "latlon": [
                32.7153, 
                -117.1564
            ], 
			"score": 72,
            "user": "negsmani", 
            "loc": "San Diego"
        }, 
        {
            "date": "2/26/2013", 
            "text": "grrr...I hate my car ! Expensive repairs and still something new to break.", 
            "latlon": [
                32.64, 
                -117.08333
            ], 
			"score": 76,
            "user": "MagdaBanome", 
            "loc": "Chula Vista"
        }, 
        {
            "date": "2/23/2013", 
            "text": "- ok . We're just waiting on tia to bring the money to fix gmas car -_______- @_Jacintaaa", 
            "latlon": [
                32.749098, 
                -117.10053
            ], 
			"score": 81,
            "user": "Kitana_Monaee", 
            "loc": "San Diego"
        }
    ], 
    "sales": [
        {
            "date": "2/18/2013", 
            "text": "Car shopping today", 
            "latlon": [
                32.7153, 
                -117.1564
            ], 
			"score": 90,
            "user": "sarahmikhael_", 
            "loc": "San Diego"
        }, 
        {
            "date": "2/19/2013", 
            "text": "I think I found someone to buy my car. Now looking for a new car.", 
            "latlon": [
                32.7153, 
                -117.1564
            ], 
			"score": 93,
            "user": "shhhua", 
            "loc": "San Diego, CA"
        }, 
        {
            "date": "2/21/2013", 
            "text": "Looking for a new car to buy", 
            "latlon": [
                33.2, 
                -117.2417
            ], 
			"score": 71,
            "user": "Ryro1313", 
            "loc": "Vista, CA"
        }, 
        {
            "latlon": [
                32.778265, 
                -117.158222
            ], 
			"score": 88,
            "text": "Looks like im getting a new car. Welp.", 
            "date": "2/25/2013", 
            "user": "mariesammy", 
            "loc": "San Diego"
        }, 
        {
            "date": "2/16/2013", 
            "text": "Car shopping. Too many cars to choose from", 
            "latlon": [
                32.7153, 
                -117.1564
            ], 
			"score": 89,
            "user": "cabrera_gabe", 
            "loc": "San Diego, CA"
        }, 
        {
            "date": "2/26/2013", 
            "text": "Can't wait to get my new car in the summer.  Trying to race @Freddyx24x", 
            "latlon": [
                32.64, 
                -117.08333
            ], 
			"score": 65,
            "user": "LuisxNights", 
            "loc": "Chula Vista"
        }, 
        {
            "date": "2/22/2013", 
            "text": "Gettin a new car=)", 
            "latlon": [
                32.905016, 
                -117.152191
            ], 
			"score": 86,
            "user": "Kenzie_Kmackin", 
            "loc": "Mira Mesa"
        }, 
        {
            "date": "2/20/2013", 
            "text": "I guess it's time for a new car. Shopped around a little today... I'm getting excited", 
            "latlon": [
                32.7153, 
                -117.1564
            ],  
			"score": 96,
            "user": "Cfendiz", 
            "loc": "San Diego, CA"
        }, 
        {
            "date": "2/22/2013", 
            "text": "Time for a new car!!!!!", 
            "latlon": [
                32.7153, 
                -117.1564
            ], 
			"score": 85,
            "user": "STEEZEandCHEEZE", 
            "loc": "San Diego"
        }, 
        {
            "date": "2/21/2013", 
            "text": "This new car situation looking good :)", 
            "latlon": [
                32.7153, 
                -117.1564
            ], 
			"score": 83,
            "user": "Da_Juan_andOnly", 
            "loc": "San Diego"
        }
    ]
}


var rssFeeds = [
    {
		"score": 94,
		"url": "http://www.edmunds.com/car-news/2013-nascar-ford-fusions-mission-strengthen-consumer-relevance.html", 
        "date": "2013-02-21", 
        "name": "Edmunds", 
        "title": "2013 NASCAR Ford Fusion's Mission: Strengthen Consumer Relevance"
    }, 
    {
        "score": 65,
		"url": "http://autos.yahoo.com/blogs/motoramic/tale-tape-chevrolet-ss-vs-chrysler-300-srt-153703078.html", 
        "date": "2013-02-16", 
        "name": "Yahoo!", 
        "title": "Tale of the tape: Chevrolet SS vs. Chrysler 300 SRT8 vs Ford Taurus SHO"
    }, 
    {
        "score": 89,
		"url": "http://forums.motortrend.com/70/9369113/the_general_forum/ford_to_add_450_jobs_to_produce_20_ecoboost_to_cleveland/", 
        "date": "2013-02-22", 
        "name": "MotorTrend", 
        "title": "Ford to add 450 jobs to produce 2.0 Ecoboost to Cleveland."
    }, 
    {
        "score": 78,
		"url": "http://www.edmunds.com/ford/focus-st/2013/long-term-road-test/2013-ford-focus-st-hidden-fuel-door.html", 
        "date": "2013-02-20", 
        "name": "Edmunds", 
        "title": "2013 Ford Focus ST Long Term Road Test"
    }, 
    {
        "score": 87,
		"url": "http://feeds.autoblog.com/~r/weblogsinc/autoblog/~3/2sBEdGmIafQ/", 
        "date": "2013-02-20", 
        "name": "AutoBlog", 
        "title": "Motorsports: Ford debuts Fusion NASCAR racer that edges closer to stock [w/video]"
    }, 
    {
        "score": 84,
		"url": "http://www.autoblog.com/2013/02/16/north-americas-automakers-ran-at-97-of-their-production-capaci/", 
        "date": "2013-02-16", 
        "name": "AutoBlog", 
        "title": "North America's automakers ran at 97% of their production capacity last year"
    }, 
    {
        "score": 81,
		"url": "http://wot.motortrend.com/2014-ford-mustang-pricing-configurator-launches-with-new-appearance-packages-colors-331469.html", 
        "date": "2013-02-20", 
        "name": "MotorTrend", 
        "title": "2014 Ford Mustang Pricing Configurator Launches With New Appearance Packages, Colors"
    }, 
    {
        "score": 84,
		"url": "http://wot.motortrend.com/our-cars-2013-ford-focus-st-has-the-right-interior-touches-330223.html", 
        "date": "2013-02-18", 
        "name": "MotorTrend", 
        "title": "Our Cars: 2013 Ford Focus ST Has the Right Interior Touches"
    }, 
    {
        "score": 80,
		"url": "http://wot.motortrend.com/2013-ford-f-150-svt-raptor-halo-4-edition-quick-drive-329547.html", 
        "date": "2013-02-17", 
        "name": "MotorTrend", 
        "title": "2013 Ford F-150 SVT Raptor Halo 4 Edition Quick Drive"
    }, 
    {
        "score": 87,
		"url": "http://www.autonews.com/article/20130220/OEM01/302209813/ford-plans-2-liter-engine-output-in-ohio-report-says", 
        "date": "2013-02-20", 
        "name": "Automotive News", 
        "title": "Ford plans 2-liter engine output in Ohio, report says"
    }, 
    {
        "score": 86,
		"url": "http://www.autonews.com/article/20130219/RETAIL03/130219849/ford-dusts-off-fiesta-movement-to-pitch-refreshed-subcompact", 
        "date": "2013-02-19", 
        "name": "Automotive News", 
        "title": "Ford dusts off Fiesta Movement to pitch refreshed subcompact"
    }, 
    {
        "score": 90,
		"url": "http://simplefeed.consumerreports.org/l?s=_misc&r=misc&he=687474702533412532462532466e6577732e636f6e73756d65727265706f7274732e6f7267253246636172732532463230313325324630322532466e65772d323031342d63686576726f6c65742d73732d736564616e2d736574732d7468652d706163652d626f617374732d3431352d68702e68746d6c2533464558544b455925334449373252534330&i=727373696e3a687474703a2f2f6e6577732e636f6e73756d65727265706f7274732e6f72672f636172732f323031332f30322f6e65772d323031342d63686576726f6c65742d73732d736564616e2d736574732d7468652d706163652d626f617374732d3431352d68702e68746d6c", 
        "date": "2013-02-17", 
        "name": "Consumer Reports", 
        "title": "New 2014 Chevrolet SS sedan sets the pace, boasts 415 hp"
    }
]


var reviews = [
	{
		"Date": "2013-2-22",
		"Review": "Worst car buying experience I have ever had. My family was long-time buyers from the company and felt it would be the best. What a mistake.",
		"Rating": "-5",
		"Source": "yelp-logo-small"
	},
	{
		"Date": "2013-2-18",
		"Review": "Drew Ford is super popular for a reason. You see their license plates tags everywhere! I even saw one out in LA last week. Imagine that!",
		"Rating": "+3",
		"Source": "yelp-logo-small"
	},
	{
		"Date": "2013-2-4",
		"Review": "Great, friendly people. Always treats our family. Service and sales are top notch.",
		"Rating": "+2",
		"Source": "foursquare-logo-small"
	},
	{
		"Date": "2013-1-28",
		"Review": "I just bought a new vehicle through Drew Ford in La Mesa. The staff on the sales floor, the collision center and the service department were all professional and polite.",
		"Rating": "+5",
		"Source": "twitter-logo-small"
	},
	{
		"Date": "2013-1-2",
		"Review": "Always treats our family. Service and sales are top notch.",
		"Rating": "+3",
		"Source": "twitter-logo-small"
	},
	{
		"Date": "2012-12-12",
		"Review": "It's possible I just had a bad car salesman, but this experience at Drew Ford kind of made me lose all faith in their service.",
		"Rating": "-3",
		"Source": "yelp-logo-small"
	},
	{
		"Date": "2012-11-18",
		"Review": "Just purchased my 2012 Ford Focus with Drew Ford. The sales staff was very helpful and were not the pushy sales people I had expected when I first arrived.",
		"Rating": "+5",
		"Source": "foursquare-logo-small"
	},
	{
		"Date": "2012-11-2",
		"Review": "I was upset with one employee. The owner was nice and professional.",
		"Rating": "-1",
		"Source": "yelp-logo-small"
	}
]



function getData(chartType){

	if(chartType == "pie"){
		var pieData = [
			['Keyword', 'Total Mentions'],
			['Ford Fusion', 55],
			['Ford Escape', 42],
			['Ford Fiesta', 15]
		]
		return pieData;
	}
	
	if(chartType == "bar"){
		var barData = [
			['Date', 'Ford Fusion', 'Ford Escape', 'Ford Fiesta'],
			['Feb 1-Feb 7', 55, 33, 22],
			['Feb 8-Feb 14', 40, 39, 8],
			['Feb 15-Feb 21', 72, 42, 19],
			['Feb 22-Feb 28', 56, 40, 12]
		]
		return barData;
	}
	
	if(chartType == "line"){
		var lineData = [
			['Date', 'Ford Fusion', 'Ford Escape', 'Ford Fiesta'],
			['Feb 22', 6, 12, 7],
			['Feb 23', 8, 10, 3],
			['Feb 24', 6, 3, 1],
			['Feb 25', 12, 5, 2],
			['Feb 26', 7, 3, 1],
			['Feb 27', 10, 4, 0],
			['Feb 28', 7, 3, 1]
		]
		return lineData;
	}
}



function getCompetitorScores(dealer){

	if(dealer == "dealerA"){
		var lineData = [
			['Date', 'Reputation', 'Visibility'],
			['Feb 1', 32, -12],
			['Feb 2', 31, -14],
			['Feb 3', 29, -22],
			['Feb 4', 36, -32],
			['Feb 5', 23, -29],
			['Feb 6', 22, -44],
			['Feb 7', 12, -56],
			['Feb 8', 6, -51],
			['Feb 9', 0, -32],
			['Feb 10', -8, -29],
			['Feb 11', -6, -16],
			['Feb 12', -6, -25],
			['Feb 13', 12, -25],
			['Feb 14', -7, -13],
			['Feb 15', 10, -14],
			['Feb 16', -6, -2],
			['Feb 17', 18, 10],
			['Feb 18', 26, 13],
			['Feb 19', 22, 25],
			['Feb 20', 37, 33],
			['Feb 21', 45, 44],
			['Feb 22', 61, 62],
			['Feb 23', 38, 70],
			['Feb 24', 36, 73],
			['Feb 25', 42, 85],
			['Feb 26', 57, 93],
			['Feb 27', 60, 89],
			['Feb 28', 67, 99]
		]
		return lineData;
	}
	
	if(dealer == "dealerB"){
		var lineData = [
			['Date', 'Reputation', 'Visibility'],
			['Feb 1', -75, -62],
			['Feb 2', -69, -52],
			['Feb 3', -66, -45],
			['Feb 4', -54, -39],
			['Feb 5', -46, -24],
			['Feb 6', -36, -32],
			['Feb 7', -22,-22],
			['Feb 8', -26, -12],
			['Feb 9', -16, -12],
			['Feb 10', -8, 10],
			['Feb 11', -6, 23],
			['Feb 12', -6, 53],
			['Feb 13', -12, 35],
			['Feb 14', 7, 43],
			['Feb 15', 20, 44],
			['Feb 16', 36, 52],
			['Feb 17', 38, 60],
			['Feb 18', 36, 43],
			['Feb 19', 32, 55],
			['Feb 20', 47, 43],
			['Feb 21', 55,54],
			['Feb 22', 69, 62],
			['Feb 23', 81, 60],
			['Feb 24', 66, 55],
			['Feb 25', 62, 75],
			['Feb 26', 55, 86],
			['Feb 27', 40, 82],
			['Feb 28', 42, 92]
		]
		return lineData;
	}
	
	if(dealer == "yourself"){
		var lineData = [
			['Date', 'Reputation', "Visibility"],
			['Feb 1',  -62, -55],
			['Feb 2',  -48, -48],
			['Feb 3',  -48, -33],
			['Feb 4',  -33, -22],
			['Feb 5',  -22, -28],
			['Feb 6',  -33, -10],
			['Feb 7',  -8, -16],
			['Feb 8',  -10, -18],
			['Feb 9',  -18, 2],
			['Feb 10',  3, 6],
			['Feb 11',  6, -12],
			['Feb 12',  12, -20],
			['Feb 13',  20, 10],
			['Feb 14',  36, 30],
			['Feb 15',  10, 45],
			['Feb 16',  -8, 12],
			['Feb 17',  0, 34], 
			['Feb 18',  16, 50],
			['Feb 19',  20, 38],
			['Feb 20',  26, 49],
			['Feb 21',  22, 42],
			['Feb 22',  20, 34],
			['Feb 23',  30, 45],
			['Feb 24',  45, 63],
			['Feb 25',  63, 77],
			['Feb 26',  70, 70],
			['Feb 27',  65, 79],
			['Feb 28',  77, 88]
		]
		return lineData;
	}
}


var reputSolution = [
	{
        "screen_name": "Da_Juan_andOnly",
        "time": "50 mins",
		"description": "Reputation DROPS 10 points because @2manyjuans complains about dealer service.",
		"solution": "*Solution: contact @2manyjuans for details about service in Drew Ford. Provide a coupon of 15% off next time, cost $30.",
		"friends_count": 301,
		"followers_count": 108,
		"image_url": "http://a0.twimg.com/profile_images/2012788536/jd_bigger.jpg",
		"location": "San Diego"
	},
	{
        "screen_name":"marileeaze",
        "time": "1 hour",
        "description": "Reputation DROPS 10 points because @marileeaze has an issue on Fusion engine light.",
		"solution": "*Solution: Provide free recall service to @marileeaze, cost $150.",
        "friends_count": 130,
		"followers_count": 126,
		"image_url": "http://a0.twimg.com/profile_images/2493275101/marileeaze_bigger.jpg",
		"location": "SanDiego"
	},
	{
        "screen_name":"Kenzie_Kmackin",
        "time": "4 hours",
		"description": "Reputation GOES UP 15 points because a comment by @Kenzie_Kmackin on Youtube.",
		"solution": "*Solution: Increase chat volume on social media,  in particular online video commercials, cost $200 daily.",
        "friends_count": 318,
		"followers_count": 321,
		"image_url": "http://a0.twimg.com/profile_images/2794984312/478353a35575e90d68cffd5bc1a0a5e9_bigger.jpeg",
		"location": "San Diego"
	},
	{
        "screen_name":"Mantis619",
        "time": "7 hours",
		"description": "Reputation DROPS 10 points because @Mantis619 has an issue on Fusion engine light.",
		"solution": "*Solution: host a local car photography competition, cost $1000 for model hire.",
        "friends_count": 655,
		"followers_count": 348,
		"image_url": "http://a0.twimg.com/profile_images/3074327838/f54455330f2f385497c187a819820e70_bigger.jpeg",
		"location": "Sunny San Diego, California"
	},
	{
        "screen_name":"Cfendiz",
        "time": "10 hours",
		"description": "Reputation DROPS 9 points because @Cfendiz got a bad battery.",
		"solution": "*Solution: host a local car photography competition, cost $1000 for model hire.",
        "friends_count": 138,
		"followers_count": 112,
		"image_url": "http://a0.twimg.com/profile_images/3268835550/1abe40bdc857158d00e165a7a0c21c8b_bigger.jpeg",
		"location": "San Diego, CA "

	},
	{
        "screen_name":"sarahmikhael_",
        "time": "15 hours",
		"description": "Reputation GOES UP 15 points because a comment by @sarahmikhael_ on Yelp.",
		"solution": "*Solution: host a local car photography competition, cost $1000 for model hire.",
        "friends_count": 107,
		"followers_count": 225,
		"image_url": "https://twimg0-a.akamaihd.net/profile_images/3344089932/f48e4c299cfcecb5f693aaeb4e9e2f9e_bigger.jpeg",
		"location": "sunny san diego"
	}
]

var visibSolution = [
	{
        "screen_name":"Kenzie_Kmackin",
        "time": "17 mins",
		"description": "Visibility GOES UP 15 points because Youtube new test drive video.",
		"solution": "*Solution: Increase chat volume on social media,  in particular online video commercials, cost $200 daily.",
        "friends_count": 318,
		"followers_count": 321,
		"image_url": "http://a0.twimg.com/profile_images/2794984312/478353a35575e90d68cffd5bc1a0a5e9_bigger.jpeg",
		"location": "San Diego"
	},
    {
        "screen_name": "Da_Juan_andOnly",
        "time": "1 hour",
		"description": "Visibility DROPS 15 points because our webpage has been down for 10 minutes.",
		"solution": "*Solution: contact @Da_Juan_andOnly for details about service in Drew Ford. Provide a coupon of 15% off next time, cost $30.",
		"friends_count": 301,
		"followers_count": 108,
		"image_url": "http://a0.twimg.com/profile_images/2012788536/jd_bigger.jpg",
		"location": "San Diego"
	},
	{
        "screen_name":"marileeaze",
        "time": "3 hours",
        "description": "Visibility DROPS 10 points because Fox News broadcasts Toyota Yaris commercial.",
		"solution": "*Solution: Provide free recall service to @marileeaze, cost $150.",
        "friends_count": 130,
		"followers_count": 126,
		"image_url": "http://a0.twimg.com/profile_images/2493275101/marileeaze_bigger.jpg",
		"location": "SanDiego"
	},
	{
        "screen_name":"Cfendiz",
        "time": "7 hours",
		"description": "Visibility DROPS 10 points because no Ads on San Diego Tribune.",
		"solution": "*Solution: host a local car photography competition, cost $1000 for model hire.",
        "friends_count": 138,
		"followers_count": 112,
		"image_url": "http://a0.twimg.com/profile_images/3268835550/1abe40bdc857158d00e165a7a0c21c8b_bigger.jpeg",
		"location": "San Diego, CA "

	},
    {
        "screen_name":"Mantis619",
        "time": "10 hours",
		"description": "Visibility DROPS 7 points because Google Maps site has no maintanence.",
		"solution": "*Solution: host a local car photography competition, cost $1000 for model hire.",
        "friends_count": 655,
		"followers_count": 348,
		"image_url": "http://a0.twimg.com/profile_images/3074327838/f54455330f2f385497c187a819820e70_bigger.jpeg",
		"location": "Sunny San Diego, California"
	}
]


var map;
var layers = [];		
var curTweets = [];

function initMapGallery() {
	var baseLayer = L.tileLayer("http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/{styleId}/256/{z}/{x}/{y}.png", {styleId: 22677});
	
	if (!map) {
		map = new L.map("div_map", {
				center: [35,-100],
				zoom: 4,
				layers:[baseLayer],
				attributionControl:false
			}); 
	}
		
	//initialize map...
	switchVisualization([$("#div_select_map_style").val()], true);
	
	$("#div_button_controls").click(function(e) {
		var style = $("#div_select_map_style").val();	
		switchVisualization([style], true);
	});
}

function addPointsToGroup(group, tweets) {
	//More than 1,000 points seems to make the map very slow!
	var length = (group instanceof L.MarkerClusterGroup) ? tweets.length : Math.min(tweets.length, 1000);

	for (var indx = 0; indx < length; indx++) {
		var tweet = tweets[indx];
		var marker = new L.Marker(tweet.loc);
		marker.properties = { text: tweet.text };
		marker.bindPopup("<div class='popup'><ul><li>" + tweet.text + "</li></ul></div>", {maxWidth:500, maxHeight:300});
		group.addLayer(marker);
	}
}
	
function getPointLayer(tweets) {
	var group = new L.layerGroup();
	addPointsToGroup(group, tweets);
	return group;
}
		
function getClusterLayer(tweets) {
	var group = new L.MarkerClusterGroup( {
		spiderfyOnMaxZoom: false, 
		showCoverageOnHover: false, 
		zoomToBoundsOnClick: false
	});
	
	//Event handler for click
	group.on('clusterclick', function(e) {
		var props = getClusterProperties(e.layer, []);
		
		if(!e.layer._popup) {
			var properties = getClusterProperties(e.layer, []);
			var html="<div class='popup'>There are <b>" + e.layer._childCount + "</b> tweets:<p></p><ul>";
			$.each(properties, function(i, property) {
				html+="<li>" + property.text + " </li>";
			});
			html+="</ul></div>";
														
			e.layer.bindPopup(html, {maxWidth:500, maxHeight:300} ).openPopup();
		} else {
			e.layer.openPopup();
		}
	});
	
	addPointsToGroup(group, tweets);
	return group;
}

function getClusterProperties(clusterObj, properties) {
  
  if(clusterObj._markers.length > 0) {
      $.each(clusterObj._markers, function(i, marker) {
	      properties.push(marker.properties);
	  });
  }
		
  if(clusterObj._childClusters.length > 0) {
      $.each(clusterObj._childClusters, function(i, cluster) {
	      properties.concat(getClusterProperties(cluster, properties));
	  });
  }
  
  return properties;
}	
	
function getHeatMapLayer(tweets) {
	
	var heatmapLayer = new L.TileLayer.heatMap({ 
		radius: 40,
		opacity: 0.75,
		gradient: {
			0.45: "rgb(0,0,255)",
			0.65: "rgb(0,255,255)",
			0.85: "rgb(0,255,0)",
			0.98: "yellow",
			1.0: "rgb(255,0,0)"
		}
	});
	
	var data = [];
	
	for (var indx in tweets) {
		var tweet = tweets[indx];
		data.push( { lat: tweet.loc[0], lon: tweet.loc[1], value: 1 } );
	}
	
	heatmapLayer.addData(data);
	
	return heatmapLayer;
}

//switch layer
function switchVisualization(types, isNewRequest){
	//remove all shown layers on the map
	removeLayers();
	
	function addNewLayers(tweets) {
		curTweets = tweets;
		//$("#div_button_controls").attr('disabled', true);
		$.each(types, function(i, type) {
			switch(type) {
				case "MARKERCLUSTER":
					var newLayer = getClusterLayer(tweets);
					layers.push(newLayer);
					map.addLayer(newLayer);
					break;
				case "HEATMAP":
					var newLayer = getHeatMapLayer(tweets);
					layers.push(newLayer);
					map.addLayer(newLayer);
					break;
				case "GEOJSON":
					var newLayer = getPointLayer(tweets);
					layers.push(newLayer);
					map.addLayer(newLayer);
					break;
			}
		});
		//$("#div_button_controls").attr('disabled', false);
	}
	
	if (isNewRequest) {
		getTweets(addNewLayers);
	} else {
		addNewLayers(curTweets);
	}
}

//remove all layers on the map
function removeLayers(){
	if(layers.length > 0) {
		$.each(layers, function(i, layer) {
			map.removeLayer(layer);
		});
		layers = [];
	}
}
		
function getTweets(callback) {
	//Stop execution if there's no callback...
	if (!callback) return;
	
	var location = $("#div_select_location").val() || 'Los+Angeles';
	var rad = $("#div_select_radius").val() || 50;
	var keywd = $("#div_select_keyword").val() || 'Honda';

	var url = "http://vision.sdsu.edu/chris42/PyMapper.py?key=" + location + "&rad=" + rad + "&keyword=" + keywd;	
	
	$.getJSON(url, function(data) { 
		var result = data.results;
		callback(result);
	});	
}








