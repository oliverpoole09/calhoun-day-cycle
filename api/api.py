import json
from datetime import datetime, time
import requests
import bs4
import re
import os

#----------DECLARATIONS----------

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__)) # script dir const var

# get current time and end of day time
current_time = datetime.strptime(datetime.now().strftime("%H:%M"), "%H:%M").time()
day_end = time(15, 15, 0)

# vars
day = ""
block = ""

#----------WEB-SCRAPING----------

# get html via requests and grab the "Day" (if there is any, else return None)
html = requests.get("https://www.calhoun.org/my-calhoun-calendar")
soup = bs4.BeautifulSoup(html.text, "html.parser")
today_div = soup.find("div", class_="fsCalendarToday")
day_link = today_div.find("a", string=re.compile(r"^Day [1-6]$")) if today_div else None

# link day to day var
if day_link:
    day = day_link.text
else:
    day = "No School"

#----------CALC BLOCK----------

# if there is no school, skip code
if day == "No School":
    block = "No School"
else:
    # open block-times.json
    with open(os.path.join(SCRIPT_DIR, "block-times.json")) as file:
        block_times = json.load(file)

    possible_times = [] # empty array for possible times (for block)
    for block_name in block_times[day]:
        t = datetime.strptime(block_times[day][block_name], "%H:%M:%S").time() # convert block time into actual time "t"
        # if current time is greater than block time, it could be our block
        if current_time >= t:
            possible_times.append((block_name, t))

    # end of possible_times will be out block because it's the closest possible time to us

    # if current time is past end of day, it's the end of the day
    if current_time >= day_end:
        block = "End of Day"
    # if there are no possible times, school hasn't started
    elif not possible_times:
        block = "Before School"
    else:
        # get the block whose time is closest (but not after) current time
        block = max(possible_times, key=lambda x: x[1])[0]

# load day and block into current_dat.json
data = {"day": day, "block": block}
with open(os.path.join(SCRIPT_DIR, "current_dat.json"), "w") as f:
    json.dump(data, f)