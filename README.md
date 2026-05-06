<p align="center">
  <img src="https://img.shields.io/badge/JS-Language-yellow?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/platform-Linux%20Mint-lightgreen?style=for-the-badge" />
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge" />
  </a>
</p>

<h1 align="center">calhoun-day-cycle</h1>

<p align="center"><i>A Cinnamon desktop applet for Calhoun students that displays the current day in the school's rotating 6-day cycle, along with the current block — right in your panel.</i></p>

---

## 📅 What is the Day Cycle? 

Calhoun (My School) runs on a 6-day rotating schedule. Rather than a standard Monday–Friday week, each school day is labeled **Day 1 through Day 6**. Since there are only 5 days in a week, the cycle carries over across weeks — so Day 1 might fall on a Monday one week and a Tuesday the next.

Each day has its own unique block schedule. Blocks are labeled A–F plus community time, cluster, and E blocks. Here's an example of what a day looks like:

**Day 1**
| Block | Start Time |
|---|---|
| A Block | 8:25 AM |
| Cluster | 9:25 AM |
| Community Time | 9:40 AM |
| B Block | 10:20 AM |
| C Block | 11:50 AM |
| E1 Block | 12:40 PM |
| E2 Block | 1:30 PM |
| D Block | 2:20 PM |

The applet scrapes the Calhoun school calendar daily to determine the current day, then calculates the current block based on the time.

## 🚀 Features

- Shows the current day (e.g. `Day 3`) and block (e.g. `B Block`) in your panel at a glance
- Click the applet to open a popup with the full day and block info
- Automatically refreshes every minute in the background
- Shows `No School` on days with no scheduled day cycle
- Shows `Before School` or `End of Day` outside of school hours

## 📕 Requirements 

- Linux with the **Cinnamon** desktop environment
- Python 3
- The following Python packages:
  - `requests`
  - `beautifulsoup4`

Install them with:
```bash
pip install requests beautifulsoup4 --break-system-packages
```

## 📦 Installation

1. Clone or download this repository into your Cinnamon applets folder:
```bash
git clone https://github.com/oliverpoole09/calhoun-day-cycle ~/.local/share/cinnamon/applets/calhoun-day-cycle@oliverpoole09
```

2. Open **System Settings** → **Applets**

3. Find **Calhoun Day Cycle** in the list and click the **+** button to add it to your panel

4. The applet will appear in your panel and start fetching data automatically

## ⚙️ How It Works

1. When the applet loads, it runs `api.py` in the background
2. `api.py` scrapes the Calhoun school calendar to find today's day number
3. It then checks the current time against `block-times.json` to determine the active block
4. The result is written to `current_dat.json`
5. The applet reads the JSON and updates the panel label
6. This repeats every 60 seconds automatically

## 📜 License

MIT License — feel free to use, modify, and share.
