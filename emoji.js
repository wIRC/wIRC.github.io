var emojiCategories = ["People", "Nature", "Foods", "Activity", "Places", "Objects", "Symbols", "Flags"];
var emojis = {"Symbols":[["❤️",["heart"]],["💛",["yellow_heart"]],["💚",["green_heart"]],["💙",["blue_heart"]],["💜",["purple_heart"]],["💔",["broken_heart"]],["❣️",["heavy_heart_exclamation_mark_ornament"]],["💕",["two_hearts"]],["💞",["revolving_hearts"]],["💓",["heartbeat"]],["💗",["heartpulse"]],["💖",["sparkling_heart"]],["💘",["cupid"]],["💝",["gift_heart"]],["💟",["heart_decoration"]],["☮️",["peace_symbol"]],["✝️",["latin_cross"]],["☪️",["star_and_crescent"]],["🕉",["om_symbol"]],["☸️",["wheel_of_dharma"]],["✡️",["star_of_david"]],["🔯",["six_pointed_star"]],["🕎",["menorah_with_nine_branches"]],["☯️",["yin_yang"]],["☦️",["orthodox_cross"]],["🛐",["place_of_worship"]],["⛎",["ophiuchus"]],["♈️",["aries"]],["♉️",["taurus"]],["♊️",["gemini"]],["♋️",["cancer"]],["♌️",["leo"]],["♍️",["virgo"]],["♎️",["libra"]],["♏️",["scorpius"]],["♐️",["sagittarius"]],["♑️",["capricorn"]],["♒️",["aquarius"]],["♓️",["pisces"]],["🆔",["id"]],["⚛️",["atom_symbol"]],["🈳",["u7a7a"]],["🈹",["u5272"]],["☢️",["radioactive_sign"]],["☣️",["biohazard_sign"]],["📴",["mobile_phone_off"]],["📳",["vibration_mode"]],["🈶",["u6709"]],["🈚️",["u7121"]],["🈸",["u7533"]],["🈺",["u55b6"]],["🈷️",["u6708"]],["✴️",["eight_pointed_black_star"]],["🆚",["vs"]],["🉑",["accept"]],["💮",["white_flower"]],["🉐",["ideograph_advantage"]],["㊙️",["secret"]],["㊗️",["congratulations"]],["🈴",["u5408"]],["🈵",["u6e80"]],["🈲",["u7981"]],["🅰️",["a"]],["🅱️",["b"]],["🆎",["ab"]],["🆑",["cl"]],["🅾️",["o2"]],["🆘",["sos"]],["⛔️",["no_entry"]],["📛",["name_badge"]],["🚫",["no_entry_sign"]],["❌",["x"]],["⭕️",["o"]],["💢",["anger"]],["♨️",["hotsprings"]],["🚷",["no_pedestrians"]],["🚯",["do_not_litter"]],["🚳",["no_bicycles"]],["🚱",["non-potable_water"]],["🔞",["underage"]],["📵",["no_mobile_phones"]],["❗️",["exclamation","heavy_exclamation_mark"]],["❕",["grey_exclamation"]],["❓",["question"]],["❔",["grey_question"]],["‼️",["bangbang"]],["⁉️",["interrobang"]],["💯",["100"]],["🔅",["low_brightness"]],["🔆",["high_brightness"]],["🔱",["trident"]],["⚜️",["fleur_de_lis"]],["〽️",["part_alternation_mark"]],["⚠️",["warning"]],["🚸",["children_crossing"]],["🔰",["beginner"]],["♻️",["recycle"]],["🈯️",["u6307"]],["💹",["chart"]],["❇️",["sparkle"]],["✳️",["eight_spoked_asterisk"]],["❎",["negative_squared_cross_mark"]],["✅",["white_check_mark"]],["💠",["diamond_shape_with_a_dot_inside"]],["🌀",["cyclone"]],["➿",["loop"]],["🌐",["globe_with_meridians"]],["Ⓜ️",["m"]],["🏧",["atm"]],["🈂️",["sa"]],["🛂",["passport_control"]],["🛃",["customs"]],["🛄",["baggage_claim"]],["🛅",["left_luggage"]],["♿️",["wheelchair"]],["🚭",["no_smoking"]],["🚾",["wc"]],["🅿️",["parking"]],["🚰",["potable_water"]],["🚹",["mens"]],["🚺",["womens"]],["🚼",["baby_symbol"]],["🚻",["restroom"]],["🚮",["put_litter_in_its_place"]],["🎦",["cinema"]],["📶",["signal_strength"]],["🈁",["koko"]],["🆖",["ng"]],["🆗",["ok"]],["🆙",["up"]],["🆒",["cool"]],["🆕",["new"]],["🆓",["free"]],["🔟",["keycap_ten"]],["🔢",["1234"]],["▶️",["arrow_forward"]],["⏸",["double_vertical_bar"]],["⏯",["black_right_pointing_triangle_with_double_vertical_bar"]],["⏹",["black_square_for_stop"]],["⏺",["black_circle_for_record"]],["⏭",["black_right_pointing_double_triangle_with_vertical_bar"]],["⏮",["black_left_pointing_double_triangle_with_vertical_bar"]],["⏩",["fast_forward"]],["⏪",["rewind"]],["🔀",["twisted_rightwards_arrows"]],["🔁",["repeat"]],["🔂",["repeat_one"]],["◀️",["arrow_backward"]],["🔼",["arrow_up_small"]],["🔽",["arrow_down_small"]],["⏫",["arrow_double_up"]],["⏬",["arrow_double_down"]],["➡️",["arrow_right"]],["⬅️",["arrow_left"]],["⬆️",["arrow_up"]],["⬇️",["arrow_down"]],["↗️",["arrow_upper_right"]],["↘️",["arrow_lower_right"]],["↙️",["arrow_lower_left"]],["↖️",["arrow_upper_left"]],["↕️",["arrow_up_down"]],["↔️",["left_right_arrow"]],["🔄",["arrows_counterclockwise"]],["↪️",["arrow_right_hook"]],["↩️",["leftwards_arrow_with_hook"]],["⤴️",["arrow_heading_up"]],["⤵️",["arrow_heading_down"]],["ℹ️",["information_source"]],["🔤",["abc"]],["🔡",["abcd"]],["🔠",["capital_abcd"]],["🔣",["symbols"]],["🎵",["musical_note"]],["🎶",["notes"]],["〰️",["wavy_dash"]],["➰",["curly_loop"]],["✔️",["heavy_check_mark"]],["🔃",["arrows_clockwise"]],["➕",["heavy_plus_sign"]],["➖",["heavy_minus_sign"]],["➗",["heavy_division_sign"]],["✖️",["heavy_multiplication_x"]],["💲",["heavy_dollar_sign"]],["💱",["currency_exchange"]],["©️",["copyright"]],["®️",["registered"]],["™️",["tm"]],["🔚",["end"]],["🔙",["back"]],["🔛",["on"]],["🔝",["top"]],["🔜",["soon"]],["☑️",["ballot_box_with_check"]],["🔘",["radio_button"]],["⚪️",["white_circle"]],["⚫️",["black_circle"]],["🔴",["red_circle"]],["🔵",["large_blue_circle"]],["🔸",["small_orange_diamond"]],["🔹",["small_blue_diamond"]],["🔶",["large_orange_diamond"]],["🔷",["large_blue_diamond"]],["🔺",["small_red_triangle"]],["▪️",["black_small_square"]],["▫️",["white_small_square"]],["⬛️",["black_large_square"]],["⬜️",["white_large_square"]],["🔻",["small_red_triangle_down"]],["◼️",["black_medium_square"]],["◻️",["white_medium_square"]],["◾️",["black_medium_small_square"]],["◽️",["white_medium_small_square"]],["🔲",["black_square_button"]],["🔳",["white_square_button"]],["🔈",["speaker"]],["🔉",["sound"]],["🔊",["loud_sound"]],["🔇",["mute"]],["📣",["mega"]],["📢",["loudspeaker"]],["🔔",["bell"]],["🔕",["no_bell"]],["🃏",["black_joker"]],["🀄️",["mahjong"]],["♠️",["spades"]],["♣️",["clubs"]],["♥️",["hearts"]],["♦️",["diamonds"]],["🎴",["flower_playing_cards"]],["💭",["thought_balloon"]],["🗯",["right_anger_bubble"]],["💬",["speech_balloon"]],["🕐",["clock1"]],["🕑",["clock2"]],["🕒",["clock3"]],["🕓",["clock4"]],["🕔",["clock5"]],["🕕",["clock6"]],["🕖",["clock7"]],["🕗",["clock8"]],["🕘",["clock9"]],["🕙",["clock10"]],["🕚",["clock11"]],["🕛",["clock12"]],["🕜",["clock130"]],["🕝",["clock230"]],["🕞",["clock330"]],["🕟",["clock430"]],["🕠",["clock530"]],["🕡",["clock630"]],["🕢",["clock730"]],["🕣",["clock830"]],["🕤",["clock930"]],["🕥",["clock1030"]],["🕦",["clock1130"]],["🕧",["clock1230"]]],"Objects":[["⌚️",["watch"]],["📱",["iphone"]],["📲",["calling"]],["💻",["computer"]],["⌨️",["keyboard"]],["🖥",["desktop_computer"]],["🖨",["printer"]],["🖱",["three_button_mouse"]],["🖲",["trackball"]],["🕹",["joystick"]],["🗜",["compression"]],["💽",["minidisc"]],["💾",["floppy_disk"]],["💿",["cd"]],["📀",["dvd"]],["📼",["vhs"]],["📷",["camera"]],["📸",["camera_with_flash"]],["📹",["video_camera"]],["🎥",["movie_camera"]],["📽",["film_projector"]],["🎞",["film_frames"]],["📞",["telephone_receiver"]],["☎️",["phone","telephone"]],["📟",["pager"]],["📠",["fax"]],["📺",["tv"]],["📻",["radio"]],["🎙",["studio_microphone"]],["🎚",["level_slider"]],["🎛",["control_knobs"]],["⏱",["stopwatch"]],["⏲",["timer_clock"]],["⏰",["alarm_clock"]],["🕰",["mantelpiece_clock"]],["⏳",["hourglass_flowing_sand"]],["⌛️",["hourglass"]],["🛰",["satellite"]],["🔋",["battery"]],["🔌",["electric_plug"]],["💡",["bulb"]],["🔦",["flashlight"]],["🕯",["candle"]],["🗑",["wastebasket"]],["🛢",["oil_drum"]],["💸",["money_with_wings"]],["💵",["dollar"]],["💴",["yen"]],["💶",["euro"]],["💷",["pound"]],["💰",["moneybag"]],["💳",["credit_card"]],["💎",["gem"]],["⚖️",["scales"]],["🔧",["wrench"]],["🔨",["hammer"]],["⚒",["hammer_and_pick"]],["🛠",["hammer_and_wrench"]],["⛏",["pick"]],["🔩",["nut_and_bolt"]],["⚙️",["gear"]],["⛓",["chains"]],["🔫",["gun"]],["💣",["bomb"]],["🔪",["hocho","knife"]],["🗡",["dagger_knife"]],["⚔️",["crossed_swords"]],["🛡",["shield"]],["🚬",["smoking"]],["☠️",["skull_and_crossbones"]],["⚰️",["coffin"]],["⚱️",["funeral_urn"]],["🏺",["amphora"]],["🔮",["crystal_ball"]],["📿",["prayer_beads"]],["💈",["barber"]],["⚗️",["alembic"]],["🔭",["telescope"]],["🔬",["microscope"]],["🕳",["hole"]],["💊",["pill"]],["💉",["syringe"]],["🌡",["thermometer"]],["🏷",["label"]],["🔖",["bookmark"]],["🚽",["toilet"]],["🚿",["shower"]],["🛁",["bathtub"]],["🔑",["key"]],["🗝",["old_key"]],["🛋",["couch_and_lamp"]],["🛌",["sleeping_accommodation"]],["🛏",["bed"]],["🚪",["door"]],["🛎",["bellhop_bell"]],["🖼",["frame_with_picture"]],["🗺",["world_map"]],["⛱",["umbrella_on_ground"]],["🗿",["moyai"]],["🛍",["shopping_bags"]],["🎈",["balloon"]],["🎏",["flags"]],["🎀",["ribbon"]],["🎁",["gift"]],["🎊",["confetti_ball"]],["🎉",["tada"]],["🎎",["dolls"]],["🎐",["wind_chime"]],["🎌",["crossed_flags"]],["🏮",["izakaya_lantern","lantern"]],["✉️",["email","envelope"]],["📩",["envelope_with_arrow"]],["📨",["incoming_envelope"]],["📧",["e-mail"]],["💌",["love_letter"]],["📮",["postbox"]],["📪",["mailbox_closed"]],["📫",["mailbox"]],["📬",["mailbox_with_mail"]],["📭",["mailbox_with_no_mail"]],["📦",["package"]],["📯",["postal_horn"]],["📥",["inbox_tray"]],["📤",["outbox_tray"]],["📜",["scroll"]],["📃",["page_with_curl"]],["📑",["bookmark_tabs"]],["📊",["bar_chart"]],["📈",["chart_with_upwards_trend"]],["📉",["chart_with_downwards_trend"]],["📄",["page_facing_up"]],["📅",["date"]],["📆",["calendar"]],["🗓",["spiral_calendar_pad"]],["📇",["card_index"]],["🗃",["card_file_box"]],["🗳",["ballot_box_with_ballot"]],["🗄",["file_cabinet"]],["📋",["clipboard"]],["🗒",["spiral_note_pad"]],["📁",["file_folder"]],["📂",["open_file_folder"]],["🗂",["card_index_dividers"]],["🗞",["rolled_up_newspaper"]],["📰",["newspaper"]],["📓",["notebook"]],["📕",["closed_book"]],["📗",["green_book"]],["📘",["blue_book"]],["📙",["orange_book"]],["📔",["notebook_with_decorative_cover"]],["📒",["ledger"]],["📚",["books"]],["📖",["book","open_book"]],["🔗",["link"]],["📎",["paperclip"]],["🖇",["linked_paperclips"]],["✂️",["scissors"]],["📐",["triangular_ruler"]],["📏",["straight_ruler"]],["📌",["pushpin"]],["📍",["round_pushpin"]],["🚩",["triangular_flag_on_post"]],["🏳️",["waving_white_flag"]],["🏴",["waving_black_flag"]],["🔐",["closed_lock_with_key"]],["🔒",["lock"]],["🔓",["unlock"]],["🔏",["lock_with_ink_pen"]],["🖊",["lower_left_ballpoint_pen"]],["🖋",["lower_left_fountain_pen"]],["✒️",["black_nib"]],["📝",["memo","pencil"]],["✏️",["pencil2"]],["🖍",["lower_left_crayon"]],["🖌",["lower_left_paintbrush"]],["🔍",["mag"]],["🔎",["mag_right"]]],"Nature":[["🐶",["dog"]],["🐱",["cat"]],["🐭",["mouse"]],["🐹",["hamster"]],["🐰",["rabbit"]],["🐻",["bear"]],["🐼",["panda_face"]],["🐨",["koala"]],["🐯",["tiger"]],["🦁",["lion_face"]],["🐮",["cow"]],["🐷",["pig"]],["🐽",["pig_nose"]],["🐸",["frog"]],["🐙",["octopus"]],["🐵",["monkey_face"]],["🙈",["see_no_evil"]],["🙉",["hear_no_evil"]],["🙊",["speak_no_evil"]],["🐒",["monkey"]],["🐔",["chicken"]],["🐧",["penguin"]],["🐦",["bird"]],["🐤",["baby_chick"]],["🐣",["hatching_chick"]],["🐥",["hatched_chick"]],["🐺",["wolf"]],["🐗",["boar"]],["🐴",["horse"]],["🦄",["unicorn_face"]],["🐝",["bee","honeybee"]],["🐛",["bug"]],["🐌",["snail"]],["🐞",["beetle"]],["🐜",["ant"]],["🕷",["spider"]],["🦂",["scorpion"]],["🦀",["crab"]],["🐍",["snake"]],["🐢",["turtle"]],["🐠",["tropical_fish"]],["🐟",["fish"]],["🐡",["blowfish"]],["🐬",["dolphin","flipper"]],["🐳",["whale"]],["🐋",["whale2"]],["🐊",["crocodile"]],["🐆",["leopard"]],["🐅",["tiger2"]],["🐃",["water_buffalo"]],["🐂",["ox"]],["🐄",["cow2"]],["🐪",["dromedary_camel"]],["🐫",["camel"]],["🐘",["elephant"]],["🐐",["goat"]],["🐏",["ram"]],["🐑",["sheep"]],["🐎",["racehorse"]],["🐖",["pig2"]],["🐀",["rat"]],["🐁",["mouse2"]],["🐓",["rooster"]],["🦃",["turkey"]],["🕊",["dove_of_peace"]],["🐕",["dog2"]],["🐩",["poodle"]],["🐈",["cat2"]],["🐇",["rabbit2"]],["🐿",["chipmunk"]],["🐾",["feet","paw_prints"]],["🐉",["dragon"]],["🐲",["dragon_face"]],["🌵",["cactus"]],["🎄",["christmas_tree"]],["🌲",["evergreen_tree"]],["🌳",["deciduous_tree"]],["🌴",["palm_tree"]],["🌱",["seedling"]],["🌿",["herb"]],["☘️",["shamrock"]],["🍀",["four_leaf_clover"]],["🎍",["bamboo"]],["🎋",["tanabata_tree"]],["🍃",["leaves"]],["🍂",["fallen_leaf"]],["🍁",["maple_leaf"]],["🌾",["ear_of_rice"]],["🌺",["hibiscus"]],["🌻",["sunflower"]],["🌹",["rose"]],["🌷",["tulip"]],["🌼",["blossom"]],["🌸",["cherry_blossom"]],["💐",["bouquet"]],["🍄",["mushroom"]],["🌰",["chestnut"]],["🎃",["jack_o_lantern"]],["🐚",["shell"]],["🕸",["spider_web"]],["🌎",["earth_americas"]],["🌍",["earth_africa"]],["🌏",["earth_asia"]],["🌕",["full_moon"]],["🌖",["waning_gibbous_moon"]],["🌗",["last_quarter_moon"]],["🌘",["waning_crescent_moon"]],["🌑",["new_moon"]],["🌒",["waxing_crescent_moon"]],["🌓",["first_quarter_moon"]],["🌔",["moon","waxing_gibbous_moon"]],["🌚",["new_moon_with_face"]],["🌝",["full_moon_with_face"]],["🌛",["first_quarter_moon_with_face"]],["🌜",["last_quarter_moon_with_face"]],["🌞",["sun_with_face"]],["🌙",["crescent_moon"]],["⭐️",["star"]],["🌟",["star2"]],["💫",["dizzy"]],["✨",["sparkles"]],["☄️",["comet"]],["☀️",["sunny"]],["🌤",["mostly_sunny","sun_small_cloud"]],["⛅️",["partly_sunny"]],["🌥",["barely_sunny","sun_behind_cloud"]],["🌦",["partly_sunny_rain","sun_behind_rain_cloud"]],["☁️",["cloud"]],["🌧",["rain_cloud"]],["⛈",["thunder_cloud_and_rain"]],["🌩",["lightning","lightning_cloud"]],["⚡️",["zap"]],["🔥",["fire"]],["💥",["boom","collision"]],["❄️",["snowflake"]],["🌨",["snow_cloud"]],["☃️",["snowman"]],["☃️",["snowman"]],["🌬",["wind_blowing_face"]],["💨",["dash"]],["🌪",["tornado","tornado_cloud"]],["🌫",["fog"]],["☂️",["umbrella"]],["☂️",["umbrella"]],["💧",["droplet"]],["💦",["sweat_drops"]],["🌊",["ocean"]]],"Foods":[["🍏",["green_apple"]],["🍎",["apple"]],["🍐",["pear"]],["🍊",["tangerine"]],["🍋",["lemon"]],["🍌",["banana"]],["🍉",["watermelon"]],["🍇",["grapes"]],["🍓",["strawberry"]],["🍈",["melon"]],["🍒",["cherries"]],["🍑",["peach"]],["🍍",["pineapple"]],["🍅",["tomato"]],["🍆",["eggplant"]],["🌶",["hot_pepper"]],["🌽",["corn"]],["🍠",["sweet_potato"]],["🍯",["honey_pot"]],["🍞",["bread"]],["🧀",["cheese_wedge"]],["🍗",["poultry_leg"]],["🍖",["meat_on_bone"]],["🍤",["fried_shrimp"]],["🥚",["egg"]],["🍔",["hamburger"]],["🍟",["fries"]],["🌭",["hotdog"]],["🍕",["pizza"]],["🍝",["spaghetti"]],["🌮",["taco"]],["🌯",["burrito"]],["🍜",["ramen"]],["🍲",["stew"]],["🍥",["fish_cake"]],["🍣",["sushi"]],["🍱",["bento"]],["🍛",["curry"]],["🍙",["rice_ball"]],["🍚",["rice"]],["🍘",["rice_cracker"]],["🍢",["oden"]],["🍡",["dango"]],["🍧",["shaved_ice"]],["🍨",["ice_cream"]],["🍦",["icecream"]],["🍰",["cake"]],["🎂",["birthday"]],["🍮",["custard"]],["🍬",["candy"]],["🍭",["lollipop"]],["🍫",["chocolate_bar"]],["🍿",["popcorn"]],["🍩",["doughnut"]],["🍪",["cookie"]],["🍺",["beer"]],["🍻",["beers"]],["🍷",["wine_glass"]],["🍸",["cocktail"]],["🍹",["tropical_drink"]],["🍾",["champagne"]],["🍶",["sake"]],["🍵",["tea"]],["☕️",["coffee"]],["🍼",["baby_bottle"]],["🍴",["fork_and_knife"]],["🍽",["knife_fork_plate"]]],"People":[["😀",["grinning"]],["😬",["grimacing"]],["😁",["grin"]],["😂",["joy"]],["😃",["smiley"]],["😄",["smile"]],["😅",["sweat_smile"]],["😆",["laughing","satisfied"]],["😇",["innocent"]],["😉",["wink"]],["😊",["blush"]],["🙂",["slightly_smiling_face"]],["🙃",["upside_down_face"]],["☺️",["relaxed"]],["😋",["yum"]],["😌",["relieved"]],["😍",["heart_eyes"]],["😘",["kissing_heart"]],["😗",["kissing"]],["😙",["kissing_smiling_eyes"]],["😚",["kissing_closed_eyes"]],["😜",["stuck_out_tongue_winking_eye"]],["😝",["stuck_out_tongue_closed_eyes"]],["😛",["stuck_out_tongue"]],["🤑",["money_mouth_face"]],["🤓",["nerd_face"]],["😎",["sunglasses"]],["🤗",["hugging_face"]],["😏",["smirk"]],["😶",["no_mouth"]],["😐",["neutral_face"]],["😑",["expressionless"]],["😒",["unamused"]],["🙄",["face_with_rolling_eyes"]],["🤔",["thinking_face"]],["😳",["flushed"]],["😞",["disappointed"]],["😟",["worried"]],["😠",["angry"]],["😡",["rage"]],["😔",["pensive"]],["😕",["confused"]],["🙁",["slightly_frowning_face"]],["☹️",["white_frowning_face"]],["😣",["persevere"]],["😖",["confounded"]],["😫",["tired_face"]],["😩",["weary"]],["😤",["triumph"]],["😮",["open_mouth"]],["😱",["scream"]],["😨",["fearful"]],["😰",["cold_sweat"]],["😯",["hushed"]],["😦",["frowning"]],["😧",["anguished"]],["😢",["cry"]],["😥",["disappointed_relieved"]],["😪",["sleepy"]],["😓",["sweat"]],["😭",["sob"]],["😵",["dizzy_face"]],["😲",["astonished"]],["🤐",["zipper_mouth_face"]],["😷",["mask"]],["🤒",["face_with_thermometer"]],["🤕",["face_with_head_bandage"]],["😴",["sleeping"]],["💤",["zzz"]],["💩",["hankey","poop","shit"]],["😈",["smiling_imp"]],["👿",["imp"]],["👹",["japanese_ogre"]],["👺",["japanese_goblin"]],["💀",["skull"]],["👻",["ghost"]],["👽",["alien"]],["🤖",["robot_face"]],["😺",["smiley_cat"]],["😸",["smile_cat"]],["😹",["joy_cat"]],["😻",["heart_eyes_cat"]],["😼",["smirk_cat"]],["😽",["kissing_cat"]],["🙀",["scream_cat"]],["😿",["crying_cat_face"]],["😾",["pouting_cat"]],["🙌",["raised_hands"]],["👏",["clap"]],["👋",["wave"]],["👍",["+1","thumbsup"]],["👎",["-1","thumbsdown"]],["👊",["facepunch","punch"]],["✊",["fist"]],["✌️",["v"]],["👌",["ok_hand"]],["✋",["hand","raised_hand"]],["👐",["open_hands"]],["💪",["muscle"]],["🙏",["pray"]],["☝️",["point_up"]],["👆",["point_up_2"]],["👇",["point_down"]],["👈",["point_left"]],["👉",["point_right"]],["🖕",["middle_finger","reversed_hand_with_middle_finger_extended"]],["🖐",["raised_hand_with_fingers_splayed"]],["🤘",["the_horns","sign_of_the_horns"]],["🖖",["spock-hand"]],["✍️",["writing_hand"]],["💅",["nail_care"]],["👄",["lips"]],["👅",["tongue"]],["👂",["ear"]],["👃",["nose"]],["👁",["eye"]],["👀",["eyes"]],["👤",["bust_in_silhouette"]],["👥",["busts_in_silhouette"]],["🗣",["speaking_head_in_silhouette"]],["👶",["baby"]],["👦",["boy"]],["👧",["girl"]],["👨",["man"]],["👩",["woman"]],["👱‍♂️",["person_with_blond_hair"]],["👴",["older_man"]],["👵",["older_woman"]],["👲",["man_with_gua_pi_mao"]],["👳‍♂️",["man_with_turban"]],["👮‍♂️",["cop"]],["👷‍♂️",["construction_worker"]],["💂‍♂️",["guardsman"]],["🕵️‍♂️",["sleuth_or_spy"]],["🎅",["santa"]],["👼",["angel"]],["👸",["princess"]],["👰",["bride_with_veil"]],["🚶‍♂️",["walking"]],["🏃‍♂️",["runner","running"]],["💃",["dancer"]],["👯‍♀️",["dancers"]],["👫",["couple","man_and_woman_holding_hands"]],["👬",["two_men_holding_hands"]],["👭",["two_women_holding_hands"]],["🙇‍♂️",["bow"]],["💁‍♀️",["information_desk_person"]],["🙅‍♀️",["no_good"]],["🙆‍♀️",["ok_woman"]],["🙋‍♀️",["raising_hand"]],["🙎‍♀️",["person_with_pouting_face"]],["🙍‍♀️",["person_frowning"]],["💇‍♀️",["haircut"]],["💆‍♀️",["massage"]],["👩‍❤️‍👨",["couple_with_heart"]],["👩‍❤️‍👩",["woman-heart-woman"]],["👨‍❤️‍👨",["man-heart-man"]],["👩‍❤️‍💋‍👨",["couplekiss"]],["👩‍❤️‍💋‍👩",["woman-kiss-woman"]],["👨‍❤️‍💋‍👨",["man-kiss-man"]],["👨‍👩‍👦",["family","man-woman-boy"]],["👨‍👩‍👧",["man-woman-girl"]],["👨‍👩‍👧‍👦",["man-woman-girl-boy"]],["👨‍👩‍👦‍👦",["man-woman-boy-boy"]],["👨‍👩‍👧‍👧",["man-woman-girl-girl"]],["👩‍👩‍👦",["woman-woman-boy"]],["👩‍👩‍👧",["woman-woman-girl"]],["👩‍👩‍👧‍👦",["woman-woman-girl-boy"]],["👩‍👩‍👦‍👦",["woman-woman-boy-boy"]],["👩‍👩‍👧‍👧",["woman-woman-girl-girl"]],["👨‍👨‍👦",["man-man-boy"]],["👨‍👨‍👧",["man-man-girl"]],["👨‍👨‍👧‍👦",["man-man-girl-boy"]],["👨‍👨‍👦‍👦",["man-man-boy-boy"]],["👨‍👨‍👧‍👧",["man-man-girl-girl"]],["👚",["womans_clothes"]],["👕",["shirt","tshirt"]],["👖",["jeans"]],["👔",["necktie"]],["👗",["dress"]],["👙",["bikini"]],["👘",["kimono"]],["💄",["lipstick"]],["💋",["kiss"]],["👣",["footprints"]],["👠",["high_heel"]],["👡",["sandal"]],["👢",["boot"]],["👞",["mans_shoe","shoe"]],["👟",["athletic_shoe"]],["👒",["womans_hat"]],["🎩",["tophat"]],["⛑",["helmet_with_white_cross"]],["🎓",["mortar_board"]],["👑",["crown"]],["🎒",["school_satchel"]],["👝",["pouch"]],["👛",["purse"]],["👜",["handbag"]],["💼",["briefcase"]],["👓",["eyeglasses"]],["🕶",["dark_sunglasses"]],["💍",["ring"]],["🌂",["closed_umbrella"]]],"Places":[["🚗",["car","red_car"]],["🚕",["taxi"]],["🚙",["blue_car"]],["🚌",["bus"]],["🚎",["trolleybus"]],["🏎",["racing_car"]],["🚓",["police_car"]],["🚑",["ambulance"]],["🚒",["fire_engine"]],["🚐",["minibus"]],["🚚",["truck"]],["🚛",["articulated_lorry"]],["🚜",["tractor"]],["🏍",["racing_motorcycle"]],["🚲",["bike"]],["🚨",["rotating_light"]],["🚔",["oncoming_police_car"]],["🚍",["oncoming_bus"]],["🚘",["oncoming_automobile"]],["🚖",["oncoming_taxi"]],["🚡",["aerial_tramway"]],["🚠",["mountain_cableway"]],["🚟",["suspension_railway"]],["🚃",["railway_car"]],["🚋",["train"]],["🚝",["monorail"]],["🚄",["bullettrain_side"]],["🚅",["bullettrain_front"]],["🚈",["light_rail"]],["🚞",["mountain_railway"]],["🚂",["steam_locomotive"]],["🚆",["train2"]],["🚇",["metro"]],["🚊",["tram"]],["🚉",["station"]],["🚁",["helicopter"]],["🛩",["small_airplane"]],["✈️",["airplane"]],["🛫",["airplane_departure"]],["🛬",["airplane_arriving"]],["⛵️",["boat","sailboat"]],["🛥",["motor_boat"]],["🚤",["speedboat"]],["⛴",["ferry"]],["🛳",["passenger_ship"]],["🚀",["rocket"]],["🛰",["satellite"]],["💺",["seat"]],["⚓️",["anchor"]],["🚧",["construction"]],["⛽️",["fuelpump"]],["🚏",["busstop"]],["🚦",["vertical_traffic_light"]],["🚥",["traffic_light"]],["🏁",["checkered_flag"]],["🚢",["ship"]],["🎡",["ferris_wheel"]],["🎢",["roller_coaster"]],["🎠",["carousel_horse"]],["🏗",["building_construction"]],["🌁",["foggy"]],["🗼",["tokyo_tower"]],["🏭",["factory"]],["⛲️",["fountain"]],["🎑",["rice_scene"]],["⛰",["mountain"]],["🏔",["snow_capped_mountain"]],["🗻",["mount_fuji"]],["🌋",["volcano"]],["🗾",["japan"]],["🏕",["camping"]],["⛺️",["tent"]],["🏞",["national_park"]],["🛣",["motorway"]],["🛤",["railway_track"]],["🌅",["sunrise"]],["🌄",["sunrise_over_mountains"]],["🏜",["desert"]],["🏖",["beach_with_umbrella"]],["🏝",["desert_island"]],["🌇",["city_sunrise"]],["🌆",["city_sunset"]],["🏙",["cityscape"]],["🌃",["night_with_stars"]],["🌉",["bridge_at_night"]],["🌌",["milky_way"]],["🌠",["stars"]],["🎇",["sparkler"]],["🎆",["fireworks"]],["🌈",["rainbow"]],["🏘",["house_buildings"]],["🏰",["european_castle"]],["🏯",["japanese_castle"]],["🏟",["stadium"]],["🗽",["statue_of_liberty"]],["🏠",["house"]],["🏡",["house_with_garden"]],["🏚",["derelict_house_building"]],["🏢",["office"]],["🏬",["department_store"]],["🏣",["post_office"]],["🏤",["european_post_office"]],["🏥",["hospital"]],["🏦",["bank"]],["🏨",["hotel"]],["🏪",["convenience_store"]],["🏫",["school"]],["🏩",["love_hotel"]],["💒",["wedding"]],["🏛",["classical_building"]],["⛪️",["church"]],["🕌",["mosque"]],["🕍",["synagogue"]],["🕋",["kaaba"]],["⛩",["shinto_shrine"]]],"Activity":[["⚽️",["soccer"]],["🏀",["basketball"]],["🏈",["football"]],["⚾️",["baseball"]],["🎾",["tennis"]],["🏐",["volleyball"]],["🏉",["rugby_football"]],["🎱",["8ball"]],["⛳️",["golf"]],["🏌️‍♂️",["golfer"]],["🏓",["table_tennis_paddle_and_ball"]],["🏸",["badminton_racquet_and_shuttlecock"]],["🏒",["ice_hockey_stick_and_puck"]],["🏑",["field_hockey_stick_and_ball"]],["🏏",["cricket_bat_and_ball"]],["🎿",["ski"]],["⛷",["skier"]],["🏂",["snowboarder"]],["⛸",["ice_skate"]],["🏹",["bow_and_arrow"]],["🎣",["fishing_pole_and_fish"]],["🚣‍♂️",["rowboat"]],["🏊‍♂️",["swimmer"]],["🏄‍♂️",["surfer"]],["🛀",["bath"]],["⛹️‍♂️",["person_with_ball"]],["🏋️‍♂️",["weight_lifter"]],["🚴‍♂️",["bicyclist"]],["🚵‍♂️",["mountain_bicyclist"]],["🏇",["horse_racing"]],["🕴",["man_in_business_suit_levitating"]],["🏆",["trophy"]],["🎽",["running_shirt_with_sash"]],["🏅",["sports_medal"]],["🎖",["medal"]],["🎗",["reminder_ribbon"]],["🏵",["rosette"]],["🎫",["ticket"]],["🎟",["admission_tickets"]],["🎭",["performing_arts"]],["🎨",["art"]],["🎪",["circus_tent"]],["🎤",["microphone"]],["🎧",["headphones"]],["🎼",["musical_score"]],["🎹",["musical_keyboard"]],["🎷",["saxophone"]],["🎺",["trumpet"]],["🎸",["guitar"]],["🎻",["violin"]],["🎬",["clapper"]],["🎮",["video_game"]],["👾",["space_invader"]],["🎯",["dart"]],["🎲",["game_die"]],["🎰",["slot_machine"]],["🎳",["bowling"]]],"Flags":[["🇦🇫",["flag-af"]],["🇦🇽",["flag-ax"]],["🇦🇱",["flag-al"]],["🇩🇿",["flag-dz"]],["🇦🇸",["flag-as"]],["🇦🇩",["flag-ad"]],["🇦🇴",["flag-ao"]],["🇦🇮",["flag-ai"]],["🇦🇶",["flag-aq"]],["🇦🇬",["flag-ag"]],["🇦🇷",["flag-ar"]],["🇦🇲",["flag-am"]],["🇦🇼",["flag-aw"]],["🇦🇺",["flag-au"]],["🇦🇹",["flag-at"]],["🇦🇿",["flag-az"]],["🇧🇸",["flag-bs"]],["🇧🇭",["flag-bh"]],["🇧🇩",["flag-bd"]],["🇧🇧",["flag-bb"]],["🇧🇾",["flag-by"]],["🇧🇪",["flag-be"]],["🇧🇿",["flag-bz"]],["🇧🇯",["flag-bj"]],["🇧🇲",["flag-bm"]],["🇧🇹",["flag-bt"]],["🇧🇴",["flag-bo"]],["🇧🇶",["flag-bq"]],["🇧🇦",["flag-ba"]],["🇧🇼",["flag-bw"]],["🇧🇷",["flag-br"]],["🇮🇴",["flag-io"]],["🇻🇬",["flag-vg"]],["🇧🇳",["flag-bn"]],["🇧🇬",["flag-bg"]],["🇧🇫",["flag-bf"]],["🇧🇮",["flag-bi"]],["🇨🇻",["flag-cv"]],["🇰🇭",["flag-kh"]],["🇨🇲",["flag-cm"]],["🇨🇦",["flag-ca"]],["🇮🇨",["flag-ic"]],["🇰🇾",["flag-ky"]],["🇨🇫",["flag-cf"]],["🇹🇩",["flag-td"]],["🇨🇱",["flag-cl"]],["🇨🇳",["flag-cn","cn"]],["🇨🇽",["flag-cx"]],["🇨🇨",["flag-cc"]],["🇨🇴",["flag-co"]],["🇰🇲",["flag-km"]],["🇨🇬",["flag-cg"]],["🇨🇩",["flag-cd"]],["🇨🇰",["flag-ck"]],["🇨🇷",["flag-cr"]],["🇭🇷",["flag-hr"]],["🇨🇺",["flag-cu"]],["🇨🇼",["flag-cw"]],["🇨🇾",["flag-cy"]],["🇨🇿",["flag-cz"]],["🇩🇰",["flag-dk"]],["🇩🇯",["flag-dj"]],["🇩🇲",["flag-dm"]],["🇩🇴",["flag-do"]],["🇪🇨",["flag-ec"]],["🇪🇬",["flag-eg"]],["🇸🇻",["flag-sv"]],["🇬🇶",["flag-gq"]],["🇪🇷",["flag-er"]],["🇪🇪",["flag-ee"]],["🇪🇹",["flag-et"]],["🇪🇺",["flag-eu"]],["🇫🇰",["flag-fk"]],["🇫🇴",["flag-fo"]],["🇫🇯",["flag-fj"]],["🇫🇮",["flag-fi"]],["🇫🇷",["flag-fr","fr"]],["🇬🇫",["flag-gf"]],["🇵🇫",["flag-pf"]],["🇹🇫",["flag-tf"]],["🇬🇦",["flag-ga"]],["🇬🇲",["flag-gm"]],["🇬🇪",["flag-ge"]],["🇩🇪",["flag-de","de"]],["🇬🇭",["flag-gh"]],["🇬🇮",["flag-gi"]],["🇬🇷",["flag-gr"]],["🇬🇱",["flag-gl"]],["🇬🇩",["flag-gd"]],["🇬🇵",["flag-gp"]],["🇬🇺",["flag-gu"]],["🇬🇹",["flag-gt"]],["🇬🇬",["flag-gg"]],["🇬🇳",["flag-gn"]],["🇬🇼",["flag-gw"]],["🇬🇾",["flag-gy"]],["🇭🇹",["flag-ht"]],["🇭🇳",["flag-hn"]],["🇭🇰",["flag-hk"]],["🇭🇺",["flag-hu"]],["🇮🇸",["flag-is"]],["🇮🇳",["flag-in"]],["🇮🇩",["flag-id"]],["🇮🇷",["flag-ir"]],["🇮🇶",["flag-iq"]],["🇮🇪",["flag-ie"]],["🇮🇲",["flag-im"]],["🇮🇱",["flag-il"]],["🇮🇹",["flag-it","it"]],["🇨🇮",["flag-ci"]],["🇯🇲",["flag-jm"]],["🇯🇵",["flag-jp","jp"]],["🇯🇪",["flag-je"]],["🇯🇴",["flag-jo"]],["🇰🇿",["flag-kz"]],["🇰🇪",["flag-ke"]],["🇰🇮",["flag-ki"]],["🇽🇰",["flag-xk"]],["🇰🇼",["flag-kw"]],["🇰🇬",["flag-kg"]],["🇱🇦",["flag-la"]],["🇱🇻",["flag-lv"]],["🇱🇧",["flag-lb"]],["🇱🇸",["flag-ls"]],["🇱🇷",["flag-lr"]],["🇱🇾",["flag-ly"]],["🇱🇮",["flag-li"]],["🇱🇹",["flag-lt"]],["🇱🇺",["flag-lu"]],["🇲🇴",["flag-mo"]],["🇲🇰",["flag-mk"]],["🇲🇬",["flag-mg"]],["🇲🇼",["flag-mw"]],["🇲🇾",["flag-my"]],["🇲🇻",["flag-mv"]],["🇲🇱",["flag-ml"]],["🇲🇹",["flag-mt"]],["🇲🇭",["flag-mh"]],["🇲🇶",["flag-mq"]],["🇲🇷",["flag-mr"]],["🇲🇺",["flag-mu"]],["🇾🇹",["flag-yt"]],["🇲🇽",["flag-mx"]],["🇫🇲",["flag-fm"]],["🇲🇩",["flag-md"]],["🇲🇨",["flag-mc"]],["🇲🇳",["flag-mn"]],["🇲🇪",["flag-me"]],["🇲🇸",["flag-ms"]],["🇲🇦",["flag-ma"]],["🇲🇿",["flag-mz"]],["🇲🇲",["flag-mm"]],["🇳🇦",["flag-na"]],["🇳🇷",["flag-nr"]],["🇳🇵",["flag-np"]],["🇳🇱",["flag-nl"]],["🇳🇨",["flag-nc"]],["🇳🇿",["flag-nz"]],["🇳🇮",["flag-ni"]],["🇳🇪",["flag-ne"]],["🇳🇬",["flag-ng"]],["🇳🇺",["flag-nu"]],["🇳🇫",["flag-nf"]],["🇲🇵",["flag-mp"]],["🇰🇵",["flag-kp"]],["🇳🇴",["flag-no"]],["🇴🇲",["flag-om"]],["🇵🇰",["flag-pk"]],["🇵🇼",["flag-pw"]],["🇵🇸",["flag-ps"]],["🇵🇦",["flag-pa"]],["🇵🇬",["flag-pg"]],["🇵🇾",["flag-py"]],["🇵🇪",["flag-pe"]],["🇵🇭",["flag-ph"]],["🇵🇳",["flag-pn"]],["🇵🇱",["flag-pl"]],["🇵🇹",["flag-pt"]],["🇵🇷",["flag-pr"]],["🇶🇦",["flag-qa"]],["🇷🇪",["flag-re"]],["🇷🇴",["flag-ro"]],["🇷🇺",["flag-ru","ru"]],["🇷🇼",["flag-rw"]],["🇧🇱",["flag-bl"]],["🇸🇭",["flag-sh"]],["🇰🇳",["flag-kn"]],["🇱🇨",["flag-lc"]],["🇵🇲",["flag-pm"]],["🇻🇨",["flag-vc"]],["🇼🇸",["flag-ws"]],["🇸🇲",["flag-sm"]],["🇸🇹",["flag-st"]],["🇸🇦",["flag-sa"]],["🇸🇳",["flag-sn"]],["🇷🇸",["flag-rs"]],["🇸🇨",["flag-sc"]],["🇸🇱",["flag-sl"]],["🇸🇬",["flag-sg"]],["🇸🇽",["flag-sx"]],["🇸🇰",["flag-sk"]],["🇸🇮",["flag-si"]],["🇸🇧",["flag-sb"]],["🇸🇴",["flag-so"]],["🇿🇦",["flag-za"]],["🇬🇸",["flag-gs"]],["🇰🇷",["flag-kr","kr"]],["🇸🇸",["flag-ss"]],["🇪🇸",["flag-es","es"]],["🇱🇰",["flag-lk"]],["🇸🇩",["flag-sd"]],["🇸🇷",["flag-sr"]],["🇸🇿",["flag-sz"]],["🇸🇪",["flag-se"]],["🇨🇭",["flag-ch"]],["🇸🇾",["flag-sy"]],["🇹🇼",["flag-tw"]],["🇹🇯",["flag-tj"]],["🇹🇿",["flag-tz"]],["🇹🇭",["flag-th"]],["🇹🇱",["flag-tl"]],["🇹🇬",["flag-tg"]],["🇹🇰",["flag-tk"]],["🇹🇴",["flag-to"]],["🇹🇹",["flag-tt"]],["🇹🇳",["flag-tn"]],["🇹🇷",["flag-tr"]],["🇹🇲",["flag-tm"]],["🇹🇨",["flag-tc"]],["🇹🇻",["flag-tv"]],["🇺🇬",["flag-ug"]],["🇺🇦",["flag-ua"]],["🇦🇪",["flag-ae"]],["🇬🇧",["flag-gb","gb","uk"]],["🇺🇸",["flag-us","us"]],["🇻🇮",["flag-vi"]],["🇺🇾",["flag-uy"]],["🇺🇿",["flag-uz"]],["🇻🇺",["flag-vu"]],["🇻🇦",["flag-va"]],["🇻🇪",["flag-ve"]],["🇻🇳",["flag-vn"]],["🇼🇫",["flag-wf"]],["🇪🇭",["flag-eh"]],["🇾🇪",["flag-ye"]],["🇿🇲",["flag-zm"]],["🇿🇼",["flag-zw"]]]};

(function (ready) {
    if (document.readyState === 'loading') {
        document.addEventListener("DOMContentLoaded", ready);
    }
    else ready();
})(function () {

    var emojiPicker = document.getElementById("emojiPicker");
    var emojiButton = document.getElementById("emojiButton");
    var emojiContainer = document.getElementById("emojiContainer");
    var emojiSearchInput = document.getElementById("emojiSearchInput");
    var categoryContent = function (cat, items) {
        var listContent = items.map(function (e) { return '<span class="emoji" title="' + e[1].join(", ") + '">' + e[0] + '</span>'; }).join("");
        return '<span class="emojiCategory" id="emojiCategory' + cat + '">' + cat + '</span>' +
                '<span class="emojiList">' + listContent + '</span>'
    };

    BS.UI.emojiPicker = {
        state: false,
        stats: BS.sets.get('emoji'),
        show: function () {
            BS.UI.emojiPicker.state = true;
            if (emojiSearchInput.value) {
                emojiSearchInput.value = "";
                BS.UI.emojiPicker.updateContent();
            }
            emojiPicker.style.display = 'block';
            emojiSearchInput.focus();
        },
        hide: function () {
            BS.UI.emojiPicker.state = false;
            emojiPicker.style.display = 'none';
        },
        toggle: function () {
            if (BS.UI.emojiPicker.state) BS.UI.emojiPicker.hide();
            else BS.UI.emojiPicker.show();
        },
        saveStats: function () { BS.sets.set("emoji", BS.UI.emojiPicker.stats); },
        computeMostUsed: function (limit) {
            var used = BS.UI.emojiPicker.stats.used;
            var sorted = Object.keys(used);
            sorted.sort(function (a, b) {
                var fa = used[a], fb = used[b];
                return fa > fb ? -1 : (fb > fa ? 1 : 0);
            });
            return BS.UI.emojiPicker.computeEmojiArray(sorted.slice(0, limit));
        },
        computeEmojiArray: function (emojiList) {
            var index = {};
            for (let i = 0; i < emojiList.length; i++) {
                index[emojiList[i]] = i;
            }
            var result = [];
            for (cat in emojis) {
                var items = emojis[cat];
                for (let i = 0; i < items.length; i++) {
                    if (items[i][0] in index) result[index[items[i][0]]] = items[i];
                }
            }
            return result.filter(function (e) { return e != undefined; });
        },
        generateContent: function (content) {
            emojiContainer.innerHTML = content.map(function (e) { return categoryContent(e[0], e[1]); }).join("");
        },
        computeContent: function () {
            var result = [];
            var mostUsed = BS.UI.emojiPicker.computeMostUsed(10);
            if (mostUsed.length) result.push(['Frequently Used', mostUsed]);
            for (var i = 0; i < emojiCategories.length; i++) {
                var cat = emojiCategories[i];
                var itemsEmoji = emojis[cat].map(function (e) { return e; });
                result.push([cat, itemsEmoji]);
            }
            return result;
        },
        updateContent: function () {
            if (emojiSearchInput.value) {
                BS.UI.emojiPicker.generateContent([['Search Results', BS.UI.emojiPicker.search(emojiSearchInput.value)]]);
            }
            else  BS.UI.emojiPicker.generateContent(BS.UI.emojiPicker.computeContent());
        },
        search: function (text) {
            var resultStarts = [];
            var resultIncludes = [];
            for (var k = 0; k < emojiCategories.length; k++) {
                var cat = emojiCategories[k];
                var emojisCat = emojis[cat];
                for (var i = 0; i < emojisCat.length; i++) {
                    var emoji = emojisCat[i];
                    var emojiNames = emoji[1];
                    for (var j = 0; j < emojiNames.length; j++) {
                        if (emojiNames[j].startsWith(text)) {
                            resultStarts.push(emoji);
                            break;
                        }
                        else if (emojiNames[j].includes(text)) {
                            resultIncludes.push(emoji);
                            break;
                        }
                    }
                }
            }
            // sort by most used
            var used = BS.UI.emojiPicker.stats && BS.UI.emojiPicker.stats.used;
            if (used) {
                var sortFunction = function (a, b) {
                    var fa = used[a[0]] || 0, fb = used[b[0]] || 0;
                    return fa > fb ? -1 : (fb > fa ? 1 : 0);
                };
                resultStarts.sort(sortFunction);
                resultIncludes.sort(sortFunction);
            }
            return resultStarts.concat(resultIncludes);
        },
        searchAscii: function (text) {
            switch (text) {
                case '<3': return BS.UI.emojiPicker.computeEmojiArray(["\u2764\uFE0F"]);
                case ':o)': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDC35"]);
                case '</3': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDC94"]);
                case '=)':
                case '=-)': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE03"]);
                case 'C:':
                case 'c:':
                case ':D':
                case ':-D': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE04"]);
                case ':>':
                case ':->': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE06"]);
                case ';)':
                case ';-)': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE09"]);
                case '8)': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE0E"]);
                case ':|':
                case ':-|': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE10"]);
                case ':\\':
                case ':-\\':
                case ':\/':
                case ':-\/': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE15"]);
                case ':*':
                case ':-*': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE18"]);
                case ':p':
                case ':-p':
                case ':P':
                case ':-P':
                case ':b':
                case ':-b': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE1B"]);
                case ';p':
                case ';-p':
                case ';b':
                case ';-b':
                case ';P':
                case ';-P': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE1C"]);
                case '):':
                case ':(':
                case ':-(': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE1E"]);
                case '>:(':
                case '>:-(': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE1F"]);
                case ':\'(': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE22"]);
                case 'D:': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE27"]);
                case ':o':
                case ':-o':
                case ':O':
                case ':-O': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE2E"]);
                case ':)':
                case '(:':
                case ':-)': return BS.UI.emojiPicker.computeEmojiArray(["\uD83D\uDE42"]);
                case 'xP': return BS.UI.emojiPicker.computeEmojiArray(["😝"]);
                case 'xD': return BS.UI.emojiPicker.computeEmojiArray(["😆"]);
                case '\':D': return BS.UI.emojiPicker.computeEmojiArray(["😅"]);
                case ':\'o': return BS.UI.emojiPicker.computeEmojiArray(["😥"]);
                case ':\'\'(': return BS.UI.emojiPicker.computeEmojiArray(["😭"]);
            }
        },
        incEmojiCount: function (emoji) {
            var stats = BS.UI.emojiPicker.stats;
            if (stats.used[emoji]) stats.used[emoji]++;
            else stats.used[emoji] = 1;
            BS.UI.emojiPicker.saveStats();
        }
    };

    if (!BS.UI.emojiPicker.stats) {
        BS.UI.emojiPicker.stats = {used: {}};
        BS.UI.emojiPicker.saveStats();
    }

    emojiButton.addEventListener("click", BS.UI.emojiPicker.toggle);
    emojiSearchInput.addEventListener("input", BS.UI.emojiPicker.updateContent);
    emojiContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains("emoji")) {
            var emoji = e.target.innerHTML;
            BSWindow.active.editbox.appendText(emoji);
            BS.UI.emojiPicker.hide();
            BS.UI.emojiPicker.incEmojiCount(emoji);
        }
    });

    var emojiTabs = document.getElementById("emojiTabs");
    var emojiTabsEls = ["Frequently Used"].concat(emojiCategories).map(function (e) {
        return '<span data-category="' + e + '" title="' + e + '" style="background-image:url(images/Emoji' + e.replace(" ", "") + '.svg)"></span>';
    });
    emojiTabs.innerHTML = emojiTabsEls.join("");
    emojiTabs.addEventListener("mousedown", function (e) {
        e.preventDefault(); // prevent focus
    });
    emojiTabs.addEventListener("click", function (e) {
        if (emojiSearchInput.value) {
            emojiSearchInput.value = "";
            BS.UI.emojiPicker.updateContent();
        }
        var category = e.target.getAttribute("data-category");
        if (category) {
            var categoryTitle = document.getElementById("emojiCategory" + category);
            categoryTitle.scrollIntoView();
        }
    });

    document.addEventListener("click", function (e) {
        if (BS.UI.emojiPicker.state && e.target != emojiButton && !e.path.includes(emojiPicker)) {
           BS.UI.emojiPicker.hide();
        }
    });

    BS.UI.emojiPicker.updateContent();
});
