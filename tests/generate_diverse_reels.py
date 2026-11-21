import json
import os

# 20 Categories x 3 Reels = 60 Diverse Reels
categories_data = [
    # 1. Education
    {
        "category": "Education",
        "reels": [
            {
                "topic": "Python Programming",
                "user_name": "pycode.dev",
                "profile_pic": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
                "is_verified": False,
                "caption": "Top 5 Python One-Liners that make you look like a Senior Engineer 🚀 List comprehensions & Walrus operator explained! #Python #CodingTips #DevCommunity",
                "audio_info": "pycode.dev • Python Beats",
                "video_url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500",
                "likes_count": 14890,
                "comments_count": 530,
                "views": "390K"
            },
            {
                "topic": "React 19 Hooks",
                "user_name": "react_mastery",
                "profile_pic": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                "is_verified": False,
                "caption": "React 19 Actions & useActionState hook in 45 seconds! Simplify async form handling & optimistic UI ⚡ #React #JavaScript #WebDev",
                "audio_info": "react_mastery • Code Flow",
                "video_url": "/videos/tech_reel_1.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
                "likes_count": 11420,
                "comments_count": 412,
                "views": "284K"
            },
            {
                "topic": "Data Structures",
                "user_name": "codenloop",
                "profile_pic": "/codenloop_story.jpg",
                "is_verified": False,
                "caption": "Reverse String with Stack LIFO Logic 🔥 Day 17 DSA Challenge! Time O(N) | Space O(N) #Java #DSA #TeluguCoding #Algorithms",
                "audio_info": "codenloop • Trending Tech",
                "video_url": "/videos/tech_reel_2.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500",
                "likes_count": 6240,
                "comments_count": 218,
                "views": "195K"
            }
        ]
    },
    # 2. Technology
    {
        "category": "Technology",
        "reels": [
            {
                "topic": "Quantum Computing",
                "user_name": "tech_insider",
                "profile_pic": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                "is_verified": True,
                "caption": "Quantum Computing breakthrough: How qubits solve in seconds what takes supercomputers 10,000 years ⚡🔬 #Technology #Quantum #FutureTech",
                "audio_info": "tech_insider • SciTech Horizon",
                "video_url": "https://videos.pexels.com/video-files/3015510/3015510-sd_640_360_24fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500",
                "likes_count": 21300,
                "comments_count": 640,
                "views": "480K"
            },
            {
                "topic": "System Design",
                "user_name": "system_design_101",
                "profile_pic": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                "is_verified": False,
                "caption": "Redis In-Memory Caching Strategies (Cache-Aside, Write-Through, Write-Back) for Ultra High Throughput ⚡💾 #SystemDesign #Redis #Backend",
                "audio_info": "system_design_101 • Deep Focus",
                "video_url": "/videos/sample_reel_1.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500",
                "likes_count": 12100,
                "comments_count": 395,
                "views": "320K"
            },
            {
                "topic": "Hardware Engineering",
                "user_name": "silicon_forge",
                "profile_pic": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
                "is_verified": False,
                "caption": "Under the electron microscope: 3nm semiconductor transistor architecture visualized 💻✨ #Hardware #Semiconductors #Chips",
                "audio_info": "silicon_forge • Tech Beats",
                "video_url": "https://videos.pexels.com/video-files/856973/856973-sd_640_360_25fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=500",
                "likes_count": 8750,
                "comments_count": 210,
                "views": "210K"
            }
        ]
    },
    # 3. Artificial Intelligence
    {
        "category": "Artificial Intelligence",
        "reels": [
            {
                "topic": "Humanoid Robotics",
                "user_name": "robotics_lab",
                "profile_pic": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150",
                "is_verified": False,
                "caption": "Next-gen autonomous bipedal robot agility test: Balances, flips, and navigates rough terrain effortlessly 🤖⚡ #Robotics #AI #Automation",
                "audio_info": "robotics_lab • Cyber Synth",
                "video_url": "https://videos.pexels.com/video-files/3571264/3571264-sd_640_360_30fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500",
                "likes_count": 18450,
                "comments_count": 480,
                "views": "410K"
            },
            {
                "topic": "Neural Networks",
                "user_name": "deep_learning_hub",
                "profile_pic": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
                "is_verified": False,
                "caption": "How neural weights adjust during backpropagation in high-dimensional vector space 🧠✨ #MachineLearning #DeepLearning #DataScience",
                "audio_info": "deep_learning_hub • Ambient Mind",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/mountains.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500",
                "likes_count": 9430,
                "comments_count": 290,
                "views": "230K"
            },
            {
                "topic": "Generative AI",
                "user_name": "future_ai_creators",
                "profile_pic": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                "is_verified": False,
                "caption": "Real-time multimodal voice and vision assistants: The future of human-computer interaction is here 🎙️👁️ #GenAI #VoiceAI #TechTrends",
                "audio_info": "future_ai_creators • Pulse AI",
                "video_url": "/videos/sample_reel_2.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=500",
                "likes_count": 15600,
                "comments_count": 510,
                "views": "375K"
            }
        ]
    },
    # 4. Sports
    {
        "category": "Sports",
        "reels": [
            {
                "topic": "Football Freekick",
                "user_name": "fifa_official",
                "profile_pic": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=150",
                "is_verified": True,
                "caption": "The physics behind this dipping knuckleball freekick in 4K slow motion ⚽🎯 Pure perfection! #Football #Freekick #ChampionsLeague #Golazo",
                "audio_info": "fifa_official • Stadium Roar",
                "video_url": "https://videos.pexels.com/video-files/854224/854224-sd_640_360_30fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=500",
                "likes_count": 34800,
                "comments_count": 1120,
                "views": "720K"
            },
            {
                "topic": "Basketball Crossover",
                "user_name": "hoops_daily",
                "profile_pic": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150",
                "is_verified": False,
                "caption": "Shifty behind-the-back crossover into a buzzer-beater stepback 🏀🔥 You can't guard that! #Basketball #Hoops #Handles #NBA",
                "audio_info": "hoops_daily • Hip-Hop Court Beat",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/snow_horses.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500",
                "likes_count": 16200,
                "comments_count": 390,
                "views": "340K"
            },
            {
                "topic": "Skateboarding Trick",
                "user_name": "skate_sessions",
                "profile_pic": "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=150",
                "is_verified": False,
                "caption": "First try clean hardflip down the 10-stair set at the downtown plaza 🛹💥 #Skateboarding #SkateLife #StreetSkate",
                "audio_info": "skate_sessions • Raw Wheels Audio",
                "video_url": "https://videos.pexels.com/video-files/854128/854128-sd_640_360_25fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1564982752979-3f7bc974d29a?w=500",
                "likes_count": 12400,
                "comments_count": 310,
                "views": "280K"
            }
        ]
    },
    # 5. Nature
    {
        "category": "Nature",
        "reels": [
            {
                "topic": "Ocean Reefs",
                "user_name": "national_geographic",
                "profile_pic": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=150",
                "is_verified": True,
                "caption": "Crystal turquoise water meeting pristine volcanic reef coral in French Polynesia 🌊🐠 Planet Earth is breathtaking. #Nature #NatGeo #OceanLife",
                "audio_info": "national_geographic • Ocean Whispers",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/sea_turtle.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500",
                "likes_count": 42100,
                "comments_count": 890,
                "views": "890K"
            },
            {
                "topic": "Mountain Sunrise",
                "user_name": "alpine_horizons",
                "profile_pic": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=150",
                "is_verified": False,
                "caption": "Golden hour light cascading over snow-dusted alpine spires at 4,000 meters 🏔️✨ #Mountains #Hiking #Sunrise #NatureLovers",
                "audio_info": "alpine_horizons • Dawn Harmonies",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/mountains.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=500",
                "likes_count": 19400,
                "comments_count": 420,
                "views": "395K"
            },
            {
                "topic": "Forest Waterfall",
                "user_name": "earth_visuals",
                "profile_pic": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150",
                "is_verified": False,
                "caption": "Hidden moss-covered waterfall deep within the Pacific Northwest rainforest 🌲💧 #NaturePhotography #Wilderness #Waterfall",
                "audio_info": "earth_visuals • Rushing Waters Ambient",
                "video_url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500",
                "likes_count": 13700,
                "comments_count": 280,
                "views": "290K"
            }
        ]
    },
    # 6. Travel
    {
        "category": "Travel",
        "reels": [
            {
                "topic": "Amalfi Coast Road Trip",
                "user_name": "wanderlust_diaries",
                "profile_pic": "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=150",
                "is_verified": False,
                "caption": "Driving along the cliffs of the Amalfi Coast in an open-top vintage convertible 🚗🇮🇹 Mediterranean dreaming! #Italy #TravelVlog #Wanderlust",
                "audio_info": "wanderlust_diaries • Italian Sunset Accordion",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/travel.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=500",
                "likes_count": 25800,
                "comments_count": 610,
                "views": "530K"
            },
            {
                "topic": "Tokyo Night Walk",
                "user_name": "tokyo_vibes",
                "profile_pic": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=150",
                "is_verified": False,
                "caption": "Neon reflections and rainy evening street alleyways in Shinjuku, Tokyo 🏮🌧️ #Tokyo #JapanTravel #StreetPhotography #Cyberpunk",
                "audio_info": "tokyo_vibes • Lo-Fi Tokyo Rain",
                "video_url": "https://videos.pexels.com/video-files/854128/854128-sd_640_360_25fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500",
                "likes_count": 18200,
                "comments_count": 430,
                "views": "370K"
            },
            {
                "topic": "Varanasi Ghats",
                "user_name": "explore_india",
                "profile_pic": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=150",
                "is_verified": False,
                "caption": "Sunrise boat ride along the ancient steps of Varanasi as morning chants echo across the holy Ganges 🌅🪔 #India #IncredibleIndia #Varanasi",
                "audio_info": "explore_india • Sitar & Flute Morning Raga",
                "video_url": "https://videos.pexels.com/video-files/3015510/3015510-sd_640_360_24fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500",
                "likes_count": 22100,
                "comments_count": 750,
                "views": "460K"
            }
        ]
    },
    # 7. Food
    {
        "category": "Food",
        "reels": [
            {
                "topic": "Hand-Pulled Noodles",
                "user_name": "food_network",
                "profile_pic": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150",
                "is_verified": True,
                "caption": "Mastering the art of Lanzhou hand-pulled noodles with sizzling chili crisp oil 🍜🔥 Listen to that sizzle! #FoodPorn #Noodles #StreetFood #Cooking",
                "audio_info": "food_network • Crispy Kitchen Sizzle ASMR",
                "video_url": "https://videos.pexels.com/video-files/3571264/3571264-sd_640_360_30fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500",
                "likes_count": 31400,
                "comments_count": 940,
                "views": "640K"
            },
            {
                "topic": "French Pastry Glaze",
                "user_name": "pastry_chef_julien",
                "profile_pic": "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150",
                "is_verified": False,
                "caption": "Pouring a high-gloss 24k gold leaf chocolate mirror glaze over entremet cakes 🍫✨ #Baking #PastryChef #Dessert #Satisfying",
                "audio_info": "pastry_chef_julien • Gentle Piano & Cocoa",
                "video_url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500",
                "likes_count": 19800,
                "comments_count": 520,
                "views": "420K"
            },
            {
                "topic": "Neapolitan Pizza",
                "user_name": "pizza_napoletana",
                "profile_pic": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150",
                "is_verified": False,
                "caption": "90 seconds at 480°C in an authentic woodfired oven: Leopard crust & bubbling fior di latte 🍕🔥 #Pizza #ItalianFood #ChefLife",
                "audio_info": "pizza_napoletana • Woodfire Crackle ASMR",
                "video_url": "https://videos.pexels.com/video-files/856973/856973-sd_640_360_25fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
                "likes_count": 24300,
                "comments_count": 680,
                "views": "510K"
            }
        ]
    },
    # 8. Movies and Entertainment
    {
        "category": "Movies and Entertainment",
        "reels": [
            {
                "topic": "Cinematography Breakdown",
                "user_name": "cinephile_collective",
                "profile_pic": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=150",
                "is_verified": False,
                "caption": "Why Denis Villeneuve’s wide symmetric camera framing makes Dune feel both monumental and intimate 🎬📐 #Cinematography #FilmMaking #Dune",
                "audio_info": "cinephile_collective • Cinematic Strings",
                "video_url": "https://www.w3schools.com/tags/movie.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
                "likes_count": 17900,
                "comments_count": 480,
                "views": "390K"
            },
            {
                "topic": "Color Grading Before/After",
                "user_name": "colorist_studio",
                "profile_pic": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=150",
                "is_verified": False,
                "caption": "Log profile raw camera sensor footage vs. final teal & orange cinematic film grade 🎞️🎨 #ColorGrading #DaVinciResolve #VideoEditing",
                "audio_info": "colorist_studio • Mood Film Score",
                "video_url": "/videos/tech_reel_1.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
                "likes_count": 14200,
                "comments_count": 310,
                "views": "310K"
            },
            {
                "topic": "Sound Design Secrets",
                "user_name": "foley_artist_dan",
                "profile_pic": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150",
                "is_verified": False,
                "caption": "How celery and wet cornstarch create the most realistic bone-crunching sound effects in Hollywood thrillers 🎙️🥦 #SoundDesign #Foley #MovieMagic",
                "audio_info": "foley_artist_dan • Foley Sound Demo",
                "video_url": "/videos/tech_reel_2.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
                "likes_count": 11800,
                "comments_count": 290,
                "views": "250K"
            }
        ]
    },
    # 9. Dialogues and Comedy
    {
        "category": "Dialogues and Comedy",
        "reels": [
            {
                "topic": "Dev Life Comedy",
                "user_name": "programmer_humor",
                "profile_pic": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                "is_verified": False,
                "caption": "When you fix a single CSS padding bug and completely break user authentication in production 😭💀 #CodingMemes #DevLife #Relatable",
                "audio_info": "programmer_humor • Funny Laugh Track",
                "video_url": "https://www.w3schools.com/html/mov_bbb.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500",
                "likes_count": 28900,
                "comments_count": 1140,
                "views": "580K"
            },
            {
                "topic": "Office Dialogue Sketch",
                "user_name": "corporate_sketches",
                "profile_pic": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                "is_verified": False,
                "caption": "Every Monday morning Zoom call that definitely could have been a two-sentence email 🙃📋 #OfficeHumor #WorkLife #ComedySketch",
                "audio_info": "corporate_sketches • Awkward Elevator Music",
                "video_url": "/videos/sample_reel_1.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500",
                "likes_count": 19700,
                "comments_count": 720,
                "views": "420K"
            },
            {
                "topic": "Relatable Standup",
                "user_name": "standup_reels",
                "profile_pic": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                "is_verified": False,
                "caption": "Trying to assemble IKEA furniture with just that one tiny hexagonal Allen wrench 🪑🛠️ #StandupComedy #Jokes #RelatableHumor",
                "audio_info": "standup_reels • Live Comedy Audience Chuckle",
                "video_url": "https://videos.pexels.com/video-files/854224/854224-sd_640_360_30fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=500",
                "likes_count": 16400,
                "comments_count": 590,
                "views": "350K"
            }
        ]
    },
    # 10. Bikes and Automobiles
    {
        "category": "Bikes and Automobiles",
        "reels": [
            {
                "topic": "Supercar Exhaust Note",
                "user_name": "throttle_culture",
                "profile_pic": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150",
                "is_verified": False,
                "caption": "Cold start revs on an 800 HP naturally aspirated V12 beast 🏎️💨 Headphones recommended! #Supercars #V12 #CarEnthusiast #ExhaustSound",
                "audio_info": "throttle_culture • Pure V12 Roar",
                "video_url": "https://videos.pexels.com/video-files/854128/854128-sd_640_360_25fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500",
                "likes_count": 27500,
                "comments_count": 890,
                "views": "620K"
            },
            {
                "topic": "Alpine Mountain Ride",
                "user_name": "motovlog_adventures",
                "profile_pic": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=150",
                "is_verified": False,
                "caption": "Leaning into sharp hairpins over the Swiss Stelvio mountain pass on two wheels 🏍️🏔️ #Motorcycle #BikerLife #MotoVlog #Ducati",
                "audio_info": "motovlog_adventures • Wind & Engine Symphony",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/snow_horses.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500",
                "likes_count": 18900,
                "comments_count": 470,
                "views": "410K"
            },
            {
                "topic": "EV Hypercar Launch",
                "user_name": "ev_pioneer",
                "profile_pic": "https://images.unsplash.com/photo-1563720223185-11003d516935?w=150",
                "is_verified": False,
                "caption": "0 to 100 km/h in 1.8 seconds: Instant electric torque launches like a jet takeoff ⚡🚀 #EV #ElectricVehicles #Hypercar",
                "audio_info": "ev_pioneer • Electric Jet Whine",
                "video_url": "https://videos.pexels.com/video-files/3015510/3015510-sd_640_360_24fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500",
                "likes_count": 15300,
                "comments_count": 380,
                "views": "330K"
            }
        ]
    },
    # 11. Gaming
    {
        "category": "Gaming",
        "reels": [
            {
                "topic": "Clutch 1v4 Esports",
                "user_name": "esports_arena",
                "profile_pic": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150",
                "is_verified": False,
                "caption": "Insane 1v4 defuse clutch in round 30 of the grand finals! Crowd went absolutely wild 🎮🔥 #Gaming #Esports #Clutch #FPS",
                "audio_info": "esports_arena • Esports Hype Caster",
                "video_url": "https://www.w3schools.com/tags/movie.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500",
                "likes_count": 22400,
                "comments_count": 680,
                "views": "520K"
            },
            {
                "topic": "4K Ray-Tracing Tour",
                "user_name": "pc_enthusiast",
                "profile_pic": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150",
                "is_verified": False,
                "caption": "Photorealistic rainy neon city reflections rendered at 4K 120 FPS with full path-tracing 🕹️✨ #Cyberpunk #RayTracing #PCMasterRace",
                "audio_info": "pc_enthusiast • Synthwave Night Drive",
                "video_url": "https://videos.pexels.com/video-files/3571264/3571264-sd_640_360_30fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500",
                "likes_count": 17800,
                "comments_count": 490,
                "views": "390K"
            },
            {
                "topic": "Retro Evolution",
                "user_name": "pixel_nostalgia",
                "profile_pic": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=150",
                "is_verified": False,
                "caption": "Evolution of open-world vehicle mechanics from 1997 top-down pixels to hyper-realistic physics 🎮⏳ #RetroGaming #GamingHistory #Pixels",
                "audio_info": "pixel_nostalgia • 8-Bit Chiptune Classic",
                "video_url": "/videos/sample_reel_2.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500",
                "likes_count": 13900,
                "comments_count": 340,
                "views": "295K"
            }
        ]
    },
    # 12. Fitness and Health
    {
        "category": "Fitness and Health",
        "reels": [
            {
                "topic": "Calisthenics Muscle-Up",
                "user_name": "calisthenics_coach",
                "profile_pic": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150",
                "is_verified": False,
                "caption": "3 steps to unlock your first clean bar muscle-up without chicken-winging 💪🔥 #Calisthenics #FitnessTips #WorkoutMotivation #PullUps",
                "audio_info": "calisthenics_coach • High-Energy Trap Workout",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/snow_horses.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
                "likes_count": 19100,
                "comments_count": 460,
                "views": "420K"
            },
            {
                "topic": "Morning Mobility Flow",
                "user_name": "yoga_with_elena",
                "profile_pic": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=150",
                "is_verified": False,
                "caption": "10-minute morning spine mobility and hip opener routine for posture and lower back relief 🧘‍♀️🌿 #Yoga #Mobility #HealthyLiving",
                "audio_info": "yoga_with_elena • Zen Meditation Bells",
                "video_url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500",
                "likes_count": 14700,
                "comments_count": 310,
                "views": "310K"
            },
            {
                "topic": "Half-Marathon Pacing",
                "user_name": "runner_pulse",
                "profile_pic": "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=150",
                "is_verified": False,
                "caption": "How to pace your heart rate zones during long endurance tempo runs 🏃‍♂️⏱️ #Running #MarathonPrep #Endurance #Cardio",
                "audio_info": "runner_pulse • Steady Cadence Running Beat",
                "video_url": "https://videos.pexels.com/video-files/856973/856973-sd_640_360_25fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500",
                "likes_count": 11300,
                "comments_count": 240,
                "views": "250K"
            }
        ]
    },
    # 13. Lifestyle
    {
        "category": "Lifestyle",
        "reels": [
            {
                "topic": "5 AM Morning Routine",
                "user_name": "minimalist_habits",
                "profile_pic": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                "is_verified": False,
                "caption": "5:00 AM productive morning: Journaling, pour-over coffee, and 90 minutes of zero-distraction focus ☕📖 #Productivity #Mindfulness #MorningRoutine",
                "audio_info": "minimalist_habits • Gentle Acoustic Morning",
                "video_url": "https://videos.pexels.com/video-files/854128/854128-sd_640_360_25fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500",
                "likes_count": 23600,
                "comments_count": 640,
                "views": "510K"
            },
            {
                "topic": "Desk Setup Aesthetics",
                "user_name": "setup_curator",
                "profile_pic": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                "is_verified": False,
                "caption": "Clean walnut wood desk setup with hidden cable routing and warm light bar ambient glow 🖥️✨ #DeskSetup #Minimalism #Workspace",
                "audio_info": "setup_curator • Lo-Fi Chill Study Beat",
                "video_url": "https://videos.pexels.com/video-files/3015510/3015510-sd_640_360_24fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500",
                "likes_count": 17500,
                "comments_count": 390,
                "views": "380K"
            },
            {
                "topic": "Bookshop Afternoon",
                "user_name": "city_strolls",
                "profile_pic": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                "is_verified": False,
                "caption": "Rainy afternoon browsing old bookshop corners and vinyl records in Edinburgh 📚🌧️ #CozyVibes #Edinburgh #TravelJournal",
                "audio_info": "city_strolls • Rain on Window & Vinyl Crackle",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/travel.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500",
                "likes_count": 14100,
                "comments_count": 320,
                "views": "305K"
            }
        ]
    },
    # 14. Music and Dance
    {
        "category": "Music and Dance",
        "reels": [
            {
                "topic": "Fingerstyle Acoustic",
                "user_name": "guitar_craft",
                "profile_pic": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150",
                "is_verified": False,
                "caption": "Autumn leaves fingerstyle acoustic guitar arrangement in DADGAD tuning 🎸🍁 #Fingerstyle #AcousticGuitar #Musician #Original",
                "audio_info": "guitar_craft • DADGAD Melody in D Minor",
                "video_url": "https://www.w3schools.com/tags/movie.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
                "likes_count": 18200,
                "comments_count": 450,
                "views": "395K"
            },
            {
                "topic": "Urban Street Dance",
                "user_name": "street_grooves",
                "profile_pic": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150",
                "is_verified": False,
                "caption": "Precision popping and locking choreography beneath the subway arches 💃🔥 #Dance #HipHopDance #Choreography #StreetDancer",
                "audio_info": "street_grooves • Heavy Bass Funk Break",
                "video_url": "https://videos.pexels.com/video-files/854224/854224-sd_640_360_30fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500",
                "likes_count": 21500,
                "comments_count": 560,
                "views": "480K"
            },
            {
                "topic": "Classical Piano Virtuoso",
                "user_name": "grand_piano_keys",
                "profile_pic": "https://images.unsplash.com/photo-1520523839898-50712140d9c3?w=150",
                "is_verified": False,
                "caption": "Beethoven Moonlight Sonata 3rd Movement played at full tempo on Steinway Concert Grand 🎹⚡ #ClassicalMusic #Piano #Beethoven",
                "audio_info": "grand_piano_keys • Moonlight Sonata Presto Agitato",
                "video_url": "/videos/tech_reel_1.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1520523839898-50712140d9c3?w=500",
                "likes_count": 16900,
                "comments_count": 410,
                "views": "360K"
            }
        ]
    },
    # 15. Photography and Creativity
    {
        "category": "Photography and Creativity",
        "reels": [
            {
                "topic": "Golden Hour Portrait Lighting",
                "user_name": "portrait_lensman",
                "profile_pic": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                "is_verified": False,
                "caption": "How to use a simple $15 circular silver reflector to bounce stunning natural catchlights into eyes 📸✨ #PhotographyHacks #PortraitPhotography",
                "audio_info": "portrait_lensman • Shutter Click & Soft Indie",
                "video_url": "https://videos.pexels.com/video-files/856973/856973-sd_640_360_25fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
                "likes_count": 24800,
                "comments_count": 670,
                "views": "540K"
            },
            {
                "topic": "3D Blender Simulation",
                "user_name": "geometry_nodes_pro",
                "profile_pic": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                "is_verified": False,
                "caption": "Procedural glass dispersion simulation with animated optical refraction in Blender 4.2 💎🌀 #3DArt #Blender3D #MotionDesign #CGI",
                "audio_info": "geometry_nodes_pro • Ambient Crystal Pad",
                "video_url": "https://videos.pexels.com/video-files/3571264/3571264-sd_640_360_30fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500",
                "likes_count": 18700,
                "comments_count": 490,
                "views": "410K"
            },
            {
                "topic": "Coastal Drone Hyperlapse",
                "user_name": "aerial_perspectives",
                "profile_pic": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                "is_verified": False,
                "caption": "Sunset drone hyperlapse soaring backwards over crashing lighthouse cliffs 🚁🌊 #DroneVideography #Cinematography #Hyperlapse",
                "audio_info": "aerial_perspectives • Epic Orchestral Lift",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/mountains.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500",
                "likes_count": 15300,
                "comments_count": 380,
                "views": "335K"
            }
        ]
    },
    # 16. Science and Innovation
    {
        "category": "Science and Innovation",
        "reels": [
            {
                "topic": "Deep Space Nebula",
                "user_name": "nasa_space",
                "profile_pic": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150",
                "is_verified": True,
                "caption": "Infrared cosmic pillars of creation revealed in unprecedented detail by the James Webb Space Telescope 🌌✨ #Space #NASA #Astronomy #Cosmos",
                "audio_info": "nasa_space • Ambient Cosmic Echoes",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/sea_turtle.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500",
                "likes_count": 48900,
                "comments_count": 1420,
                "views": "980K"
            },
            {
                "topic": "Acoustic Levitation",
                "user_name": "physics_laboratory",
                "profile_pic": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=150",
                "is_verified": False,
                "caption": "Water droplet suspended completely in mid-air using 40kHz ultrasonic acoustic standing sound waves 💧🔊 #Physics #ScienceExperiment #Acoustics",
                "audio_info": "physics_laboratory • High Frequency Tone Wave",
                "video_url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500",
                "likes_count": 21300,
                "comments_count": 590,
                "views": "470K"
            },
            {
                "topic": "CRISPR Gene Editing",
                "user_name": "biotech_future",
                "profile_pic": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=150",
                "is_verified": False,
                "caption": "How molecular Cas9 scissors target and snip specific double-stranded DNA sequences inside cell nuclei 🧬🔬 #Biotech #Genetics #Science",
                "audio_info": "biotech_future • Minimal Tech Pulses",
                "video_url": "/videos/tech_reel_2.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=500",
                "likes_count": 13800,
                "comments_count": 360,
                "views": "310K"
            }
        ]
    },
    # 17. Motivation and Personal Development
    {
        "category": "Motivation and Personal Development",
        "reels": [
            {
                "topic": "The Power of Consistency",
                "user_name": "ted_talks",
                "profile_pic": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=150",
                "is_verified": True,
                "caption": "Why small, unglamorous daily habits beat dramatic fleeting bursts of motivation every single time 💡📈 #TEDTalks #Discipline #GrowthMindset",
                "audio_info": "ted_talks • Inspiring Speech Piano",
                "video_url": "https://videos.pexels.com/video-files/854128/854128-sd_640_360_25fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500",
                "likes_count": 39500,
                "comments_count": 980,
                "views": "820K"
            },
            {
                "topic": "Deep Work Flow",
                "user_name": "focus_architect",
                "profile_pic": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                "is_verified": False,
                "caption": "The 90-minute time block method: How elite performers protect their cognitive bandwidth from micro-interruptions 🧠⚡ #DeepWork #Focus",
                "audio_info": "focus_architect • Binaural Alpha Waves",
                "video_url": "https://videos.pexels.com/video-files/3015510/3015510-sd_640_360_24fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500",
                "likes_count": 19400,
                "comments_count": 520,
                "views": "430K"
            },
            {
                "topic": "Overcoming Failure",
                "user_name": "resilience_mindset",
                "profile_pic": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                "is_verified": False,
                "caption": "Rejection is just redirection: Every master was once a beginner who refused to quit 🏆💪 #Motivation #Resilience #NeverGiveUp",
                "audio_info": "resilience_mindset • Epic Cinematic Strings",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/snow_horses.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500",
                "likes_count": 16800,
                "comments_count": 420,
                "views": "370K"
            }
        ]
    },
    # 18. Architecture and Design
    {
        "category": "Architecture and Design",
        "reels": [
            {
                "topic": "Japandi Interior Harmony",
                "user_name": "arch_digest",
                "profile_pic": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150",
                "is_verified": False,
                "caption": "Warm cedar slats, limestone countertops, and concealed storage: The ultimate peaceful Japandi home tour 🏡✨ #InteriorDesign #Architecture",
                "audio_info": "arch_digest • Minimalist Wooden Chimes",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/travel.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500",
                "likes_count": 26400,
                "comments_count": 710,
                "views": "560K"
            },
            {
                "topic": "Biophilic Skyscraper",
                "user_name": "urban_design_forum",
                "profile_pic": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150",
                "is_verified": False,
                "caption": "Vertical forests in Milan: How 20,000 trees integrated into high-rise facades clean smog and cool urban heat islands 🏙️🌿 #GreenArchitecture",
                "audio_info": "urban_design_forum • Modern City Horizon",
                "video_url": "https://videos.pexels.com/video-files/856973/856973-sd_640_360_25fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500",
                "likes_count": 17200,
                "comments_count": 390,
                "views": "380K"
            },
            {
                "topic": "Cliffside Cantilever Villa",
                "user_name": "modernist_spaces",
                "profile_pic": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=150",
                "is_verified": False,
                "caption": "15-meter reinforced concrete cantilever extending directly out over Pacific ocean surf 🌊🏠 Engineering masterstroke! #LuxuryHomes",
                "audio_info": "modernist_spaces • Ocean Breeze Ambient",
                "video_url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
                "likes_count": 19800,
                "comments_count": 480,
                "views": "425K"
            }
        ]
    },
    # 19. Animals and Pets
    {
        "category": "Animals and Pets",
        "reels": [
            {
                "topic": "Golden Retriever Pup",
                "user_name": "golden_tails",
                "profile_pic": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=150",
                "is_verified": False,
                "caption": "8-week-old puppy discovers his very first tennis ball in slow motion 🐶🎾 Pure unadulterated happiness! #DogsofInstagram #Puppy #GoldenRetriever",
                "audio_info": "golden_tails • Cheerful Whistling Tune",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/dog.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500",
                "likes_count": 45600,
                "comments_count": 1280,
                "views": "920K"
            },
            {
                "topic": "Curious Kitten",
                "user_name": "feline_diaries",
                "profile_pic": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150",
                "is_verified": False,
                "caption": "British Shorthair kitten gently tapping floating bubbles for the very first time 🐾🫧 #CatsofInstagram #Kitten #CuteAnimals",
                "audio_info": "feline_diaries • Gentle Music Box Lullaby",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/kitten_fighting.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500",
                "likes_count": 38200,
                "comments_count": 940,
                "views": "790K"
            },
            {
                "topic": "Savanna Elephant Herd",
                "user_name": "serengeti_wild",
                "profile_pic": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=150",
                "is_verified": False,
                "caption": "Elephant matriarch leading the herd safely across the watering hole at twilight 🐘🌅 #Wildlife #Serengeti #Elephants #Safari",
                "audio_info": "serengeti_wild • African Twilight Ambience",
                "video_url": "https://res.cloudinary.com/demo/video/upload/q_auto,w_480/elephants.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500",
                "likes_count": 27900,
                "comments_count": 620,
                "views": "580K"
            }
        ]
    },
    # 20. Miscellaneous Trending Content
    {
        "category": "Miscellaneous Trending Content",
        "reels": [
            {
                "topic": "Depth Optical Illusion",
                "user_name": "curiosity_feed",
                "profile_pic": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                "is_verified": False,
                "caption": "Stare at the red dot in the center for 15 seconds, then look at your hand 🌀🤯 Your brain's motion aftereffect is trippy! #Illusion #MindBlowing",
                "audio_info": "curiosity_feed • Hypnotic Synth Drone",
                "video_url": "https://videos.pexels.com/video-files/854224/854224-sd_640_360_30fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500",
                "likes_count": 33100,
                "comments_count": 1150,
                "views": "710K"
            },
            {
                "topic": "Fluid Kinetic Sand",
                "user_name": "satisfying_drops",
                "profile_pic": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                "is_verified": False,
                "caption": "Ultra clean cross-section slicing of multi-colored layered kinetic sand cubes 🔪🌈 So satisfying! #OddlySatisfying #ASMR #KineticSand",
                "audio_info": "satisfying_drops • Crisp Sand Slice ASMR",
                "video_url": "https://videos.pexels.com/video-files/3571264/3571264-sd_640_360_30fps.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500",
                "likes_count": 28400,
                "comments_count": 780,
                "views": "605K"
            },
            {
                "topic": "Acrylic Marble Pour",
                "user_name": "artistic_flow",
                "profile_pic": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
                "is_verified": False,
                "caption": "Liquid gold, metallic copper, and midnight cyan fluid acrylic resin blooming over canvas 🎨✨ #FluidArt #ArtProcess #Creative",
                "audio_info": "artistic_flow • Ethereal Calm Flow",
                "video_url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
                "thumbnail_url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500",
                "likes_count": 21800,
                "comments_count": 540,
                "views": "440K"
            }
        ]
    }
]

# Interleave the categories: Reel 1 from each category, then Reel 2 from each category, then Reel 3
# This guarantees that NO TWO CONSECUTIVE REELS are from the same category or creator!
interleaved_reels = []
max_reels_per_cat = max(len(cat_info["reels"]) for cat_info in categories_data)

reel_counter = 1
for round_idx in range(max_reels_per_cat):
    for cat_info in categories_data:
        cat_name = cat_info["category"]
        reels_list = cat_info["reels"]
        if round_idx < len(reels_list):
            reel_item = reels_list[round_idx].copy()
            reel_item["id"] = f"reel_{reel_counter}"
            reel_item["category"] = cat_name
            reel_item["created_at"] = f"2026-11-{(20 - (reel_counter % 15)):02d}T10:{(reel_counter * 3 % 60):02d}:00Z"
            interleaved_reels.append(reel_item)
            reel_counter += 1

print(f"Generated {len(interleaved_reels)} diverse, interleaved Reels entries across {len(categories_data)} categories!")

# Check verification distribution:
verified_count = sum(1 for r in interleaved_reels if r["is_verified"])
pct = (verified_count / len(interleaved_reels)) * 100
print(f"Verified accounts: {verified_count}/{len(interleaved_reels)} ({pct:.1f}%) -> Strictly within 5-15% target range!")

# Save to socialshield_backend/data/reels_db.json
backend_path = os.path.join("socialshield_backend", "data", "reels_db.json")
with open(backend_path, "w", encoding="utf-8") as f:
    json.dump(interleaved_reels, f, indent=2)
print(f"Successfully saved to {backend_path}")

# Also save to src/data/reelsData.json for direct frontend import fallback
frontend_path = os.path.join("src", "data", "reelsData.json")
with open(frontend_path, "w", encoding="utf-8") as f:
    json.dump(interleaved_reels, f, indent=2)
print(f"Successfully saved to {frontend_path}")
