// Imports
const Applet = imports.ui.applet;
const GLib = imports.gi.GLib;
const Mainloop = imports.mainloop;
const Util = imports.misc.util;
const PopupMenu = imports.ui.popupMenu;

// Paths
const JSON_PATH = GLib.get_home_dir() + "/.local/share/cinnamon/applets/calhoun-day-cycle@oliverpoole09/api/current_dat.json";
const PY_PATH = GLib.get_home_dir() + "/.local/share/cinnamon/applets/calhoun-day-cycle@oliverpoole09/api/api.py";

// MyApplet Class for what will show up in the applet
class MyApplet extends Applet.TextApplet {
    // constructor for when applet is created
    constructor(metadata, orientation, panel_height, instance_id) {
        super(orientation, panel_height, instance_id);
        this._currentDay = null;
        this._currentBlock = null;
        this.set_applet_label("-- | --");

        // Set up popup menu
        this.menuManager = new PopupMenu.PopupMenuManager(this);
        this.menu = new Applet.AppletPopupMenu(this, orientation);
        this.menuManager.addMenu(this.menu);

        // menu items
        this._dayItem = new PopupMenu.PopupMenuItem("Day: ...", { reactive: false });
        this._blockItem = new PopupMenu.PopupMenuItem("Block: ...", { reactive: false });
        this.menu.addMenuItem(this._dayItem);
        this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
        this.menu.addMenuItem(this._blockItem);

        this._runScript(); // run python script immediatly when applet loads
        this._startPolling(); // start timer for periodical updates
    }

    // method for reading and parsing json file
    _loadData() {
        try {
            const contents = GLib.file_get_contents(JSON_PATH)[1];
            return JSON.parse(imports.byteArray.toString(contents));
        } catch (e) {
            global.log("Calhoun applet - Error reading JSON: " + e);
            return null;
        }
    }
    
    // method for executing python script in background
    _runScript() {
        Util.spawnCommandLine("python3 " + PY_PATH);
    }

    // method to update panel label and menu items with fresh data
    _updateLabel() {
        // load data from json file
        const data = this._loadData();
        if (!data) return;

        // only update if something has changed
        if (data.day !== this._currentDay || data.block !== this._currentBlock) {
            this._currentDay = data.day;
            this._currentBlock = data.block;
            this.set_applet_label(data.day + " | " + data.block);
            this.set_applet_tooltip("Day: " + data.day + "\nBlock: " + data.block);

            // Update menu items
            this._dayItem.label.set_text("Day: " + data.day);
            this._blockItem.label.set_text("Block: " + data.block);
        }
    }

    // method for setting up all repeating timers
    _startPolling() {
        Mainloop.timeout_add(60 * 1000, () => {
            this._runScript();
            return true;
        });

        Mainloop.timeout_add(30 * 1000, () => {
            this._updateLabel();
            return true;
        });

        Mainloop.timeout_add(5000, () => {
            this._updateLabel();
            return false;
        });
    }

    // when user clicks applet, show the menu
    on_applet_clicked() {
        this.menu.toggle();
    }
}

function main(metadata, orientation, panel_height, instance_id) {
    return new MyApplet(metadata, orientation, panel_height, instance_id);
}