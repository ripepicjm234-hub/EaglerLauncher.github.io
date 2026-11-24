// Not Added Feature
function errorNA(text) {
    clearTimeout()
    document.getElementById('errortext').innerHTML = "The " + text + " feature hasn't been made yet."
    document.getElementById('naerror').style.display = 'block';
    setTimeout(function(){
        document.getElementById('naerror').classList.add('zoom-out');
    }, 3000);
    setTimeout(function(){
        document.getElementById('naerror').classList.remove('zoom-out');
        document.getElementById('naerror').style.display = 'none';
        document.getElementById('errortext').innerHTML = "This feature hasn't been made yet."
    }, 3200);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let gamelink = "./mc/26.3-wasm/"



// Last Played Game Option
let selectedGame1 = localStorage.getItem("basegame");
if (selectedGame1) {
    try {
        if (JSON.parse(selectedGame1).link?.includes("26.2")) {
            localStorage.removeItem("basegame");
            selectedGame1 = null;
        }
    } catch (_) {}
}
let selectedGame2 = localStorage.getItem("moddedgame");
let selectedGame3 = localStorage.getItem("assisted");
let stealthname = localStorage.getItem("stealthname")
if (stealthname) {
	document.getElementById("stealthinput").value = stealthname
}
else {
	document.getElementById("stealthinput").value = "https://docs.google.com"
};
const stealth = localStorage.getItem("stealth")
const stealthmodebox = document.getElementById("stealthmode");
stealthmodebox.checked = localStorage.getItem("stealth") === "true";
let modslauncher
if (localStorage.getItem("modslauncher")) {
    modslauncher = JSON.parse(localStorage.getItem("modslauncher"))};
if (!localStorage.getItem("launcherpresets")) {
    localStorage.setItem("customlaunchers", "[]");
    localStorage.setItem("customlaunchersnumber", 0);
    localStorage.setItem("launcherpresets", false);
    localStorage.setItem("launchnewtab", false);
    localStorage.setItem("stealth", false);
};
let customlaunchersnumber = localStorage.getItem("customlaunchersnumber").padStart(2, "0");
if (customlaunchersnumber > 99) {
    console.log("%cWell.. You found an easter egg. You broke the launcher. Sure I can easily fix it. But this is a rare bug. Report if you found this bug, then I will. -IRV77", "color: red; font-weight: bold; background-color: rgba(0,0,0,0.5); padding: 1vw;");
};


async function setstealth() {
	const url = document.getElementById("stealthinput").value.trim();
	if (!url) return;

	document.querySelector("link[rel*='icon']").href = "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(url) + "&sz=128";
	try {
		const raw = await fetch("https://fetchtitle.eagerlauncher.workers.dev/?url=" + encodeURIComponent(url));
		if (raw.ok) {
			const result = await raw.json();
			if (result.title) document.title = result.title;
		}
	} catch (_) {
		// Keep the selected stealth site even when title lookup is unavailable.
	}
	localStorage.setItem("stealthname", url);
    stealthname = localStorage.getItem("stealthname");
    launchnewtab();
}

if (stealthmodebox.checked) {
	document.getElementById("stealthinput").style.display = "flex";
	localStorage.setItem("launchnewtab", true);
	document.getElementById('launchnewtab').checked = true;
	document.getElementById('launchnewtab').disabled = true;
	setstealth().catch(() => {});
} else {
	document.querySelector("link[rel*='icon']").href = './assets/images/logo.png';
   	document.title = "Eagler Launcher";
    document.getElementById("stealthinput").style.display = "none";
	document.getElementById('launchnewtab').disabled = false;
};

function generateprofile(game) {
    let selectedGame = "";
    let running = false;
    if (!selectedGame1) {
        fetch("./assets/json/base.json").then((response) => response.json()).then((data) => {
            selectedGame1 = JSON.stringify(data[0]); localStorage.setItem("basegame", selectedGame1);
        });
    };
    if (game === 1 && selectedGame1) {selectedGame = JSON.parse(selectedGame1);  running = true;}; 
    if (!selectedGame2) {
        fetch("./assets/json/modded.json").then((response) => response.json()).then((data) => {
            selectedGame2 = JSON.stringify(data[0]); localStorage.setItem("moddedgame", selectedGame2);
        });
    };
    if (game === 2 && selectedGame2) {selectedGame = JSON.parse(selectedGame2);  running = true;}; 
    if (!selectedGame3) {
        fetch("./assets/json/assisted.json").then((response) => response.json()).then((data) => {
            selectedGame3 = JSON.stringify(data[0]); localStorage.setItem("assisted", selectedGame3);
        });
    };
    if (game === 3 && selectedGame3) {selectedGame = JSON.parse(selectedGame3);  running = true;}; 
    if (running === true) {
    document.getElementById('gametitle').innerHTML = selectedGame.title;
    if (selectedGame.custom) {document.getElementById('gametitle').innerHTML = selectedGame.title.slice(4)};
    document.getElementById('gameversion').innerHTML = selectedGame.version;
    document.getElementById('gameicon').src = selectedGame.icon;
    gamelink = selectedGame.link;
    }
    if (!modslauncher) {
        localStorage.setItem("modslauncher", "");
        modslauncher = [];
    }
};

// Generate Game Options
const dropdown = document.getElementById("dropdn");
let margincount = 0;
function generategames(path) {
    margincount = 0;
    if (localStorage.getItem("customlaunchers")) {
        let gamepath;
        if (path === "./assets/json/base.json") {gamepath = "basegame"};
        if (path === "./assets/json/modded.json") {gamepath = "moddedgame"};
        if (path === "./assets/json/assisted.json") {gamepath = "assisted"};

        JSON.parse(localStorage.getItem("customlaunchers")).forEach((launcher) => {
            let game = JSON.parse(localStorage.getItem("c" + launcher));
            if (game.custom != gamepath) {return};
            generatelauncheroptions(path, game, "");
        });
    };
    fetch(path).then((response) => response.json()).then((data) => {
        let gamepath;
        if (path === "./assets/json/base.json") {
            if (!localStorage.getItem("basegame")) {localStorage.setItem("basegame", JSON.stringify(data[0]))};
            gamepath = JSON.parse(localStorage.getItem("basegame"));
        };
        if (path === "./assets/json/modded.json") {
            if (!localStorage.getItem("moddedgame")) {localStorage.setItem("moddedgame", JSON.stringify(data[0]))};
            gamepath = JSON.parse(localStorage.getItem("moddedgame"));
        };
        if (path === "./assets/json/assisted.json") {
            if (!localStorage.getItem("assisted")) {localStorage.setItem("assisted", JSON.stringify(data[0]))};
            gamepath = JSON.parse(localStorage.getItem("assisted"));
        };
        data.reverse()
        data.forEach((game) => {
            generatelauncheroptions(path, game, gamepath);
        });
    });
};

function generatelauncheroptions(path, game, gamepath) {
        if (localStorage.getItem("launcherpresets") === "false" && !game.custom) {localStorage.setItem(game.title, false); if (game.title === gamepath.title) {localStorage.setItem(game.title, true)}};
        if (!localStorage.getItem(game.title) && game.active === false) {localStorage.setItem(game.title, game.active); return};
        if (localStorage.getItem(game.title) === "false") {return};

        const gameoption = document.createElement("div");
        gameoption.className = "dropdownOptions";
        gameoption.style.bottom = margincount + "vw";
        gameoption.addEventListener("click", () => {
            document.getElementById('gametitle').innerHTML = game.title;
            if (game.custom) {document.getElementById('gametitle').innerHTML = game.title.slice(4)};
            document.getElementById('gameversion').innerHTML = game.version;
            document.getElementById('gameicon').src = game.icon;
            gamelink = game.link
            if (path === "./assets/json/base.json") {selectedGame1 = JSON.stringify(game); localStorage.setItem("basegame", selectedGame1)};
            if (path === "./assets/json/modded.json") {selectedGame2 = JSON.stringify(game); localStorage.setItem("moddedgame", selectedGame2)};
            if (path === "./assets/json/assisted.json") {selectedGame3 = JSON.stringify(game); localStorage.setItem("assisted", selectedGame3)};
            dropdowntoggle();
        });
        
        const gameoptioninner = document.createElement("div");
        gameoptioninner.className = "dropdownOption";
        const gameoptionicon = document.createElement("img");
        gameoptionicon.src = game.icon;
        
        const gameoptiontext = document.createElement("div");
        gameoptiontext.className = "dropdownOptionText";
        const gameoptiontitle = document.createElement("p");
        gameoptiontitle.className = "bolded";
        gameoptiontitle.innerHTML = game.title;
        if (game.custom) {gameoptiontitle.innerHTML = game.title.slice(4)};
        const gameoptionversion = document.createElement("p");
        gameoptionversion.innerHTML = game.version;
        
        gameoptiontext.appendChild(gameoptiontitle);
        gameoptiontext.appendChild(gameoptionversion);
        gameoptioninner.appendChild(gameoptionicon);
        gameoptioninner.appendChild(gameoptiontext);
        gameoption.appendChild(gameoptioninner);
        dropdown.appendChild(gameoption);
        margincount = margincount + 5;
};

const mods = document.getElementById("modsbox");
function generatemods() {
    fetch("./assets/json/mods.json").then((response) => response.json()).then((data) => {
        data.forEach((mod) => {
            const modoption = document.createElement("div");
            modoption.className = "modoption";
            modoption.addEventListener("click", () => {
                if (localStorage.getItem(mod.title) === 'true') {
                    mod.active = false; 
                    localStorage.setItem(mod.title, mod.active); 
                    modoption.classList.remove("selected"); 
                    modslauncher = modslauncher.filter(obj => obj !== mod.link); 
                    localStorage.setItem("modslauncher", JSON.stringify(modslauncher.filter(obj => obj !== mod.link))); 
                    console.log("Off")
                }
                else {
                    mod.active = true; 
                    localStorage.setItem(mod.title, mod.active); 
                    modoption.classList.add("selected"); 
                    modslauncher.push(mod.link); 
                    localStorage.setItem("modslauncher", JSON.stringify(modslauncher)); 
                    console.log("On")} 
            });
            if (localStorage.getItem(mod.title) === 'true') {
                modoption.classList.add("selected");
            }
            const modoptionimg = document.createElement("img");
            modoptionimg.src = mod.icon;

            const moddetails = document.createElement("div");
            moddetails.className = "moddetails";
            const moddetailtitle = document.createElement("p");
            moddetailtitle.className = "bolded modtitle";
            moddetailtitle.innerHTML = mod.title;
            const moddetailauthor = document.createElement("p");
            moddetailauthor.className = "modauthor";
            moddetailauthor.innerHTML = mod.author;
            const moddetaildesc = document.createElement("p");
            moddetaildesc.innerHTML = mod.description;

            moddetails.appendChild(moddetailtitle);
            moddetails.appendChild(moddetailauthor);
            moddetails.appendChild(moddetaildesc);
            modoption.appendChild(modoptionimg);
            modoption.appendChild(moddetails);
            mods.appendChild(modoption);
        }
        )
    })
};

function newinstallation(data) {
    const installationscreenheader = document.createElement("div");
    installationscreenheader.className = "bolded notescreenheader";
    installationscreenheader.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" onclick="closenotescreen()"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`
    const installationscreenheadertitle = document.createElement("p");
    installationscreenheadertitle.innerHTML = "Create New Installation";
    const installationscreenhr = document.createElement("hr");
    const installationscreendetails = document.createElement("div");
    installationscreendetails.className = "newinstallationdetails";
    const installationscreenicons = document.createElement("div");
    installationscreenicons.className = "newinstallationicons";
    fetch("./assets/json/icons.json").then((response) => response.json()).then((newicons) => {
        newicons.forEach((newicon) => {
            const newiconimg = document.createElement("img");
            newiconimg.src = newicon;
            newiconimg.className = "icon";
            newiconimg.addEventListener("click", () => {
                if (document.querySelector(".icon.selected")) {document.querySelector(".icon.selected").classList.remove("selected")};
                installationscreenicons.setAttribute("data-icon", newicon);
                newiconimg.classList.add("selected");
            });
            installationscreenicons.appendChild(newiconimg);
        });
        installationscreenicons.setAttribute("data-icon", newicons[0]);
        installationscreenicons.firstChild.classList.add("selected");
    });

    const installationscreennametitle = document.createElement("p");
    installationscreennametitle.className = "bolded newinstallationheader";
    installationscreennametitle.innerHTML = "NAME";
    const installationscreenname = document.createElement("input");
    installationscreenname.autocomplete = "off";
    installationscreenname.type = "text";
    installationscreenname.placeholder = "New Installation";
    installationscreenname.id = "installationscreenname";

    const installationscreenversion = document.createElement("p");
    installationscreenversion.className = "bolded newinstallationheader";
    installationscreenversion.innerHTML = "VERSION";
    const installationscreendropdown = document.createElement("select");
    installationscreendropdown.id = "installationscreendropdown";
    fetch(data).then((response) => response.json()).then((installs) => {
        installs.forEach((install) => {
            const installname = document.createElement("option");
            installname.innerHTML = install.title + "-" +install.version;
            installname.value = install.link;

            installationscreendropdown.appendChild(installname);
        });
    });

    const installationscreenfooter = document.createElement("div");
    installationscreenfooter.className = "newinstallationfooter";
    const installationscreenfooterhr = document.createElement("hr");
    const installationscreenfooterbuttons = document.createElement("div");
    installationscreenfooterbuttons.className = "newinstallationfooterbuttons";
    installationscreenfooterbuttons.innerHTML = `<div id="newinstallationcancel" class="classicbutton" onclick="closenotescreen();"><p class="bolded">Cancel</p></div><div id="newinstallationsave" class="greenbutton classicbutton" onclick="newinstallationsave();"><p class="bolded">Save</p></div>`;

    installationscreenheader.prepend(installationscreenheadertitle);
    installationscreenfooter.appendChild(installationscreenfooterhr);
    installationscreenfooter.appendChild(installationscreenfooterbuttons);
    installationscreendetails.appendChild(installationscreenicons);
    installationscreendetails.appendChild(installationscreennametitle);
    installationscreendetails.appendChild(installationscreenname);
    installationscreendetails.appendChild(installationscreenversion);
    installationscreendetails.appendChild(installationscreendropdown);
    externalmenu.appendChild(installationscreenheader);
    externalmenu.appendChild(installationscreenhr);
    externalmenu.appendChild(installationscreendetails);
    externalmenu.appendChild(installationscreenfooter);
    externalmenu.style.display = "flex";
};

function newinstallationsave(notsaving) {
    let customlaunchname = document.getElementById("installationscreenname").value;
    if (!customlaunchname) {customlaunchname = "New Installation";};
    let gamepath;
    if (localStorage.getItem("startupprofile") == 1) {gamepath = "basegame"};
    if (localStorage.getItem("startupprofile") == 2) {gamepath = "moddedgame"};
    if (localStorage.getItem("startupprofile") == 3) {gamepath = "assisted"};
    let customlaunch = {
        "title": customlaunchersnumber + "cl" + customlaunchname,
        "version": document.getElementById("installationscreendropdown").selectedOptions[0].innerText,
        "icon": document.querySelector(".newinstallationicons").getAttribute("data-icon"),
        "link": document.getElementById("installationscreendropdown").value,
        "active": true,
        "custom": gamepath
    };
    let customlaunchers = JSON.parse(localStorage.getItem("customlaunchers"));
    customlaunchers.push(customlaunch.title);
    customlaunchersnumber++
    localStorage.setItem("customlaunchers", JSON.stringify(customlaunchers));
    localStorage.setItem("customlaunchersnumber", customlaunchersnumber);
    localStorage.setItem("c" + customlaunch.title, JSON.stringify(customlaunch));
    generatelauncher(customlaunch, launcher);
    if (!notsaving) {
        while (installations.firstChild) {installations.removeChild(installations.firstChild)};
        generatelaunchers(launcher);
    };
    closenotescreen();
};

function installationedit(data, title) {
    const installationscreenheader = document.createElement("div");
    installationscreenheader.className = "bolded notescreenheader";
    installationscreenheader.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" onclick="closenotescreen()"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`
    const installationscreenheadertitle = document.createElement("p");
    installationscreenheadertitle.innerHTML = "Edit Installation";
    const installationscreenhr = document.createElement("hr");
    const installationscreendetails = document.createElement("div");
    installationscreendetails.className = "newinstallationdetails";
    const installationscreenicons = document.createElement("div");
    installationscreenicons.className = "newinstallationicons";
    fetch("./assets/json/icons.json").then((response) => response.json()).then((newicons) => {
        newicons.forEach((newicon) => {
            const newiconimg = document.createElement("img");
            newiconimg.src = newicon;
            newiconimg.className = "icon";
            newiconimg.addEventListener("click", () => {
                if (document.querySelector(".icon.selected")) {document.querySelector(".icon.selected").classList.remove("selected")};
                installationscreenicons.setAttribute("data-icon", newicon);
                newiconimg.classList.add("selected");
            });
            installationscreenicons.appendChild(newiconimg);
        });
        installationscreenicons.setAttribute("data-icon", JSON.parse(localStorage.getItem("c" + title)).icon);
        installationscreenicons.querySelector("[src='"+ JSON.parse(localStorage.getItem("c" + title)).icon +"']").classList.add("selected");
    });

    const installationscreennametitle = document.createElement("p");
    installationscreennametitle.className = "bolded newinstallationheader";
    installationscreennametitle.innerHTML = "NAME";
    const installationscreenname = document.createElement("input");
    installationscreenname.value = title.slice(4);
    installationscreenname.autocomplete = "off";
    installationscreenname.type = "text";
    installationscreenname.placeholder = "New Installation";
    installationscreenname.id = "installationscreenname";

    const installationscreenversion = document.createElement("p");
    installationscreenversion.className = "bolded newinstallationheader";
    installationscreenversion.innerHTML = "VERSION";
    const installationscreendropdown = document.createElement("select");
    installationscreendropdown.id = "installationscreendropdown";
    fetch(data).then((response) => response.json()).then((installs) => {
        installs.forEach((install) => {
            const installname = document.createElement("option");
            installname.innerHTML = install.title + "-" +install.version;
            installname.value = install.link;

            installationscreendropdown.appendChild(installname);
        });
    }).then(() => {
        installationscreendropdown.value = JSON.parse(localStorage.getItem("c" + title)).link;
    });

    const installationscreenfooter = document.createElement("div");
    installationscreenfooter.className = "newinstallationfooter";
    const installationscreenfooterhr = document.createElement("hr");
    const installationscreenfooterbuttons = document.createElement("div");
    installationscreenfooterbuttons.className = "newinstallationfooterbuttons";
    installationscreenfooterbuttons.innerHTML = `<div id="newinstallationcancel" class="classicbutton" onclick="closenotescreen();"><p class="bolded">Cancel</p></div><div id="newinstallationsave" class="greenbutton classicbutton" onclick="localStorage.removeItem('c` + title + `'); localStorage.removeItem('` + title + `'); localStorage.setItem('customlaunchers', JSON.stringify(JSON.parse(localStorage.getItem('customlaunchers')).filter(item => item !== '` + title + `'))); newinstallationsave(false);"><p class="bolded">Save</p></div>`;

    installationscreenheader.prepend(installationscreenheadertitle);
    installationscreenfooter.appendChild(installationscreenfooterhr);
    installationscreenfooter.appendChild(installationscreenfooterbuttons);
    installationscreendetails.appendChild(installationscreenicons);
    installationscreendetails.appendChild(installationscreennametitle);
    installationscreendetails.appendChild(installationscreenname);
    installationscreendetails.appendChild(installationscreenversion);
    installationscreendetails.appendChild(installationscreendropdown);
    externalmenu.appendChild(installationscreenheader);
    externalmenu.appendChild(installationscreenhr);
    externalmenu.appendChild(installationscreendetails);
    externalmenu.appendChild(installationscreenfooter);
    externalmenu.style.display = "flex";
};

function installationdelete(title) {
    document.querySelector('.confrimationmenuscreen').classList.add("deleteinstallation");
    document.getElementById('confirmationmenu').style.display = 'flex';
    document.querySelector(".warningtitle").innerHTML = "Are you sure you want to delete?";
    document.querySelector(".warningdesc").innerHTML = title.slice(4);
    document.querySelector(".warningbutton").setAttribute("onclick", "installationdeleteconfirm('" + title + "')");
};

function installationdeleteconfirm(title) {
    localStorage.removeItem("c" + title);
    localStorage.removeItem(title);
    localStorage.setItem("customlaunchers", JSON.stringify(JSON.parse(localStorage.getItem("customlaunchers")).filter(item => item !== title)));
    while (installations.firstChild) {installations.removeChild(installations.firstChild)};
    generatelaunchers(launcher);
    document.getElementById('confirmationmenu').style.display = "none";
};

const installations = document.getElementById("installationsbox");
function generatelaunchers(path) {
    document.getElementById("newinstallationbutton").setAttribute("onclick", "newinstallation('" + path + "')");
    const gamedividertop = document.createElement("hr");
    installations.appendChild(gamedividertop);
    if (localStorage.getItem("launcherpresets") == "true") {
        fetch(path).then((response) => response.json()).then((data) => {data.forEach((game) => {
            generatelauncher(game, path);
        })}).then(() => {generatecustomlaunchers(path)});
    };
    if (localStorage.getItem("launcherpresets") == "false") {
        let gamepath;
        if (path === "./assets/json/base.json") {gamepath = JSON.parse(localStorage.getItem("basegame"))};
        if (path === "./assets/json/modded.json") {gamepath = JSON.parse(localStorage.getItem("moddedgame"))};
        if (path === "./assets/json/assisted.json") {gamepath = JSON.parse(localStorage.getItem("assisted"))};
        generatelauncher(gamepath, path);
        generatecustomlaunchers(path);
    };
};

function generatecustomlaunchers(path) {
    if (localStorage.getItem("customlaunchers")) {
        let gamepath;
        if (path === "./assets/json/base.json") {gamepath = "basegame"};
        if (path === "./assets/json/modded.json") {gamepath = "moddedgame"};
        if (path === "./assets/json/assisted.json") {gamepath = "assisted"};

        JSON.parse(localStorage.getItem("customlaunchers")).forEach((launcher) => {
            let game = JSON.parse(localStorage.getItem("c" + launcher));
            if (game.custom != gamepath) {return};
            generatelauncher(game, path);
        });
    };
};

function generatelauncher(game, path) {
    let gamepath;
    if (path === "./assets/json/base.json") {gamepath = JSON.parse(localStorage.getItem("basegame"))};
    if (path === "./assets/json/modded.json") {gamepath = JSON.parse(localStorage.getItem("moddedgame"))};
    if (path === "./assets/json/assisted.json") {gamepath = JSON.parse(localStorage.getItem("assisted"))};

    const gameoption = document.createElement("div");
    gameoption.className = "installationOptions";
    const gameoptioninner = document.createElement("div");
    gameoptioninner.className = "installationOption";

    const gameinput = document.createElement("input");
    gameinput.className = "installationBox";
    gameinput.type = "checkbox";
    gameinput.addEventListener("change", () => {
        if (game.title === gamepath.title) {return};
        if (gameinput.checked) {game.active = true; localStorage.setItem(game.title, game.active); console.log("On")} 
        else {game.active = false; localStorage.setItem(game.title, game.active); console.log("Off")} 
    });
    if (!localStorage.getItem(game.title)) {localStorage.setItem(game.title, game.active)};
    if (localStorage.getItem(game.title) === 'true') {gameinput.checked = "checked"};

    const gameoptionicon = document.createElement("img");
    gameoptionicon.src = game.icon;
            
    const gameoptiontext = document.createElement("div");
    gameoptiontext.className = "installationOptionText";
    const gameoptiontitle = document.createElement("p");
    gameoptiontitle.className = "bolded";
    gameoptiontitle.innerHTML = game.title;
    if (game.custom) {
        gameoptiontitle.innerHTML = game.title.slice(4);
        const custombuttons = document.createElement("div");
        custombuttons.className = "editbuttons";
        const editbutton = document.createElement("div");
        editbutton.className = "classicbutton";
        editbutton.onclick = function(){installationedit(path, game.title)};
        const editbuttontext = document.createElement("p");
        editbuttontext.className = "bolded";
        editbuttontext.innerHTML = "Edit";
        const deletebutton = document.createElement("div");
        deletebutton.className = "redbutton classicbutton";
        deletebutton.onclick = function(){installationdelete(game.title)};
        const deletebuttontext = document.createElement("p");
        deletebuttontext.className = "bolded";
        deletebuttontext.innerHTML = "Delete";
        
        editbutton.appendChild(editbuttontext);
        deletebutton.appendChild(deletebuttontext);
        custombuttons.appendChild(editbutton);
        custombuttons.appendChild(deletebutton);
        gameoption.appendChild(custombuttons);
    };
    const gameoptionversion = document.createElement("p");
    gameoptionversion.innerHTML = game.version;
    const gamedivider = document.createElement("hr");

    gameoptiontext.appendChild(gameoptiontitle);
    gameoptiontext.appendChild(gameoptionversion);
    gameoptioninner.appendChild(gameinput);
    gameoptioninner.appendChild(gameoptionicon);
    gameoptioninner.appendChild(gameoptiontext);
    gameoption.prepend(gameoptioninner);
    installations.appendChild(gameoption);
    installations.appendChild(gamedivider);
}

const faqs = document.getElementById("faqbox");
function generatefaqs() {
    fetch("./assets/json/faqs.json").then((response) => response.json()).then((data) => {
        data.forEach((game) => {
            const faqoption = document.createElement("div");
            faqoption.className = "faqoption";

            const faqquestion = document.createElement("div");
            faqquestion.className = "bolded faqtext";
            const faqquestionsymbol = document.createElement("p");
            faqquestionsymbol.className = "faqsymbol";
            faqquestionsymbol.innerHTML = "Q";
            const faqquestiontext = document.createElement("p");
            faqquestiontext.innerHTML = game.question;

            const faqanswer = document.createElement("div");
            faqanswer.className = "faqtext";
            const faqanswersymbol = document.createElement("p");
            faqanswersymbol.className = "bolded faqsymbol";
            faqanswersymbol.innerHTML = "A";
            const faqanswertext = document.createElement("p");
            faqanswertext.innerHTML = game.answer;

            faqquestion.appendChild(faqquestionsymbol);
            faqquestion.appendChild(faqquestiontext);
            faqanswer.appendChild(faqanswersymbol);
            faqanswer.appendChild(faqanswertext);
            faqoption.appendChild(faqquestion);
            faqoption.appendChild(faqanswer);
            faqs.appendChild(faqoption);
        }
        )
    })
};

const notes = document.getElementById("patchnotesbox");
const externalmenu = document.getElementById("externalmenu");
function generatenotes() {
	document.getElementById("p").parentElement.innerHTML = "<input class=\"versionBox\" type=\"checkbox\" onchange=\"sortnote('game')\" checked><p id=\"gameselect\">Game Releases</p><input class=\"versionBox\" type=\"checkbox\" onchange=\"sortnote('site')\" checked><p id=\"siteselect\" >Site Releases</p><input id=\"hotfixselect\" class=\"versionBox\" type=\"checkbox\" onchange=\"sortnote('hotfix')\" checked><p id=\"p\">Hotfixes</p>";
    fetch("./assets/json/patchnotes.json").then((response) => response.json()).then((data) => {
        data.forEach((note) => {
            const patchnote = document.createElement("div");
            patchnote.className = "patchnote";
            patchnote.setAttribute('data-note-type', note.type);
            patchnote.addEventListener("click", () => {
                const notescreenheader = document.createElement("div");
                notescreenheader.className = "bolded notescreenheader";
                notescreenheader.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" onclick="closenotescreen()"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`
                const notescreenheadertitle = document.createElement("p");
                notescreenheadertitle.innerHTML = "Patch Notes " + note.title + " " + note.version;
                const notescreenhr = document.createElement("hr");

                const notescreendetails = document.createElement("div");
                notescreendetails.className = "notescreendetails";
                const notescreendate = document.createElement("p");
                notescreendate.className = "date";
                notescreendate.innerHTML = note.date;
                const notescreendescription = document.createElement("p");
                notescreendescription.className = "bolded notescreenheader";
                notescreendescription.innerHTML = note.description;

                const notescreenlist = document.createElement("ul");
                note.notes.forEach((item) => {
                    const noteitem = document.createElement("li");
                    noteitem.innerHTML = item;
                    notescreenlist.appendChild(noteitem);
                });

                notescreenheader.prepend(notescreenheadertitle);
                notescreendetails.appendChild(notescreendate);
                notescreendetails.appendChild(notescreendescription);
                notescreendetails.appendChild(notescreenlist);
                externalmenu.appendChild(notescreenheader);
                externalmenu.appendChild(notescreenhr);
                externalmenu.appendChild(notescreendetails);
                externalmenu.style.display = "flex";
            });

            const patchnoteimg = document.createElement("img");
            patchnoteimg.src = "./assets/images/" + note.icon;

            const patchnotedetails = document.createElement("div");
            patchnotedetails.className = "bolded patchnotedetails";
            const notedetailtitle = document.createElement("p");
            notedetailtitle.innerHTML = note.title;
            const notedetailversion = document.createElement("p");
            notedetailversion.innerHTML = note.version;

            patchnotedetails.appendChild(notedetailtitle);
            patchnotedetails.appendChild(notedetailversion);
            patchnote.appendChild(patchnoteimg);
            patchnote.appendChild(patchnotedetails);
            notes.appendChild(patchnote);
        });
        if (gamenote == false) { document.querySelectorAll('[data-note-type="game"]').forEach(element => {element.style.display = 'none'})};
        if (sitenote == false) { document.querySelectorAll('[data-note-type="site"]').forEach(element => {element.style.display = 'none'})};
        if (hotfixnote == false) { document.querySelectorAll('[data-note-type="hotfix"]').forEach(element => {element.style.display = 'none'})};
    });
};

function generatedownloads() {
	let jsonedition = "";
    if (launcher === "./assets/json/base.json") {
        jsonedition = "./assets/json/base-downloads.json";
    } else {
        jsonedition = "./assets/json/modded-downloads.json";
    }
    const jssort = document.getElementById("gameselect");
    const wasmsort = document.getElementById("siteselect");
    const removesort = document.getElementById("hotfixselect");
    const jsparent = jssort.parentElement;
    jsparent.innerHTML =  "<input class=\"versionBox\" type=\"checkbox\" onchange=\"sortdownload('js')\" checked><p id=\"gameselect\">Javascript</p><input class=\"versionBox\" type=\"checkbox\" onchange=\"sortdownload('wasm')\" checked><p id=\"siteselect\" >WASM-GC</p><input id=\"hotfixselect\" style=\"display: none\" class=\"versionBox\" type=\"checkbox\" onchange=\"sortnote('hotfix')\" checked><p id=\"p\" style=\"display: none;\">Hotfixes</p>";
    document.getElementById("p").style.display = "none";
    removesort.style.display = "none";
    fetch(jsonedition).then((response) => response.json()).then((data) => {
        data.forEach((note) => {
            const patchnote = document.createElement("div");
            patchnote.className = "patchnote";
            patchnote.setAttribute('data-download-type', note.type);
            patchnote.addEventListener("click", () => {
				const link = document.createElement('a'); 
				link.href = note.link + "index.html";
				link.download = note.title + " " + note.version + '.html'; // Forces download
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
            });

            const patchnoteimg = document.createElement("img");
            patchnoteimg.src = note.icon;

            const patchnotedetails = document.createElement("div");
            patchnotedetails.className = "bolded patchnotedetails";
            const notedetailtitle = document.createElement("p");
            notedetailtitle.innerHTML = note.title;
            const notedetailversion = document.createElement("p");
            notedetailversion.innerHTML = note.version;
            const downloadlink = document.createElement("a")
            downloadlink.href = note.link
            downloadlink.download = note.title + " " + note.version

            patchnotedetails.appendChild(notedetailtitle);
            patchnotedetails.appendChild(notedetailversion);
            patchnote.appendChild(patchnoteimg);
            patchnote.appendChild(patchnotedetails);
            notes.appendChild(patchnote);
            patchnoteimg.appendChild(downloadlink);
        });
        if (wasmdownload == false) { document.querySelectorAll('[data-download-type="wasm"]').forEach(element => {element.style.display = 'none'})};
        if (jsdownload == false) { document.querySelectorAll('[data-download-type="js"]').forEach(element => {element.style.display = 'none'})};
    });
};


const servers = document.getElementById("serversbox");
function generateservers() {
	while (servers.firstChild) {servers.removeChild(servers.firstChild)};
    fetch("./assets/json/servers.json").then((response) => response.json()).then((data) => {
    	shuffle(data)
        data.forEach((server) => {
            const serverdiv = document.createElement("div");
            serverdiv.className = "server";
            serverdiv.setAttribute('data-server-type', server.type);
            serverdiv.addEventListener("click", () => {
                const serverscreenheader = document.createElement("div");
                serverscreenheader.className = "bolded serverscreenheader";
                serverscreenheader.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" onclick="closeserverscreen()"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`
                const serverscreenheadertitle = document.createElement("p");
                serverscreenheadertitle.innerHTML = "Server " + server.title + " for " + server.version;
                const serverscreenhr = document.createElement("hr");

                const serverscreendetails = document.createElement("div");
                serverscreendetails.className = "serverscreendetails";
                const serverscreendescription = document.createElement("p");
                serverscreendescription.className = "bolded serverscreenheader";
                serverscreendescription.innerHTML = server.description;
				const copyipbutton = document.createElement("div");
				copyipbutton.className = "copyipbutton";
				copyipbutton.onclick = () => navigator.clipboard.writeText(server.ip);
                const text = document.createElement("p");
                text.className = "bolded";
                text.innerHTML = "Copy IP";
                const logoimgdiv = document.createElement("div");
                logoimgdiv.className = "logoimgdiv";
                const logoimg = document.createElement("img");
                logoimg.className = "logoimg"
                logoimg.src = "./assets/images/" + server.icon

                const serverscreenlist = document.createElement("ul");
                server.notes.forEach((item) => {
                    const noteitem = document.createElement("li");
                    noteitem.innerHTML = item;
                    serverscreenlist.appendChild(noteitem);
                });
                serverscreenheader.prepend(serverscreenheadertitle);
                serverscreendetails.appendChild(serverscreendescription);
                serverscreendetails.appendChild(serverscreenlist);
                copyipbutton.appendChild(text);
                logoimgdiv.appendChild(logoimg);
                externalmenu.appendChild(serverscreenheader);
                externalmenu.appendChild(copyipbutton);
                externalmenu.appendChild(logoimgdiv);
                externalmenu.appendChild(serverscreenhr);
                externalmenu.appendChild(serverscreendetails);
                externalmenu.style.display = "flex";
            });

            const serverimg = document.createElement("img");
            serverimg.src = "./assets/images/" + server.icon;

            const serverdetails = document.createElement("div");
            serverdetails.className = "bolded serverdetails";
            const serverdetailtitle = document.createElement("p");
            serverdetailtitle.innerHTML = server.title;
            const serverdetailversion = document.createElement("p");
            serverdetailversion.innerHTML = server.version;

            serverdetails.appendChild(serverdetailtitle);
            serverdetails.appendChild(serverdetailversion);
            serverdiv.appendChild(serverimg);
            serverdiv.appendChild(serverdetails);
            servers.appendChild(serverdiv);
        });
        if (onepointeight == false) { document.querySelectorAll('[data-server-type="1.8.8"]').forEach(element => {element.style.display = 'none'})};
        if (onepointtwelve == false) { document.querySelectorAll('[data-server-type="1.12.2"]').forEach(element => {element.style.display = 'none'})};
        if (other == false) { document.querySelectorAll('[data-server-type="other"]').forEach(element => {element.style.display = 'none'})};
    });
};

function generaterecentnote() {
    fetch("./assets/json/patchnotes.json").then((response) => response.json()).then((data) => {
        const note = data[0];
            const notescreenheader = document.createElement("div");
            notescreenheader.className = "bolded notescreenheader";
            notescreenheader.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" onclick="closenotescreen()"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>`
            const notescreenheadertitle = document.createElement("p");
            notescreenheadertitle.innerHTML = "Patch Notes " + note.title + " " + note.version;
            const notescreenhr = document.createElement("hr");

            const notescreendetails = document.createElement("div");
            notescreendetails.className = "notescreendetails";
            const notescreendate = document.createElement("p");
            notescreendate.className = "date";
            notescreendate.innerHTML = note.date;
            const notescreendescription = document.createElement("p");
            notescreendescription.className = "bolded notescreenheader";
            notescreendescription.innerHTML = note.description;

            const notescreenlist = document.createElement("ul");
            note.notes.forEach((item) => {
                const noteitem = document.createElement("li");
                noteitem.innerHTML = item;
                notescreenlist.appendChild(noteitem);
            });

            notescreenheader.prepend(notescreenheadertitle);
            notescreendetails.appendChild(notescreendate);
            notescreendetails.appendChild(notescreendescription);
            notescreendetails.appendChild(notescreenlist);
            externalmenu.appendChild(notescreenheader);
            externalmenu.appendChild(notescreenhr);
            externalmenu.appendChild(notescreendetails);
            externalmenu.style.display = "flex";
    })
};

// Patchnote Functions

let gamenote = true
let sitenote = true
let hotfixnote = true
function sortnote(type) {
    if (type === "site") {
        if (sitenote == true) { document.querySelectorAll('[data-note-type="site"]').forEach(element => {element.style.display = 'none';}); sitenote = false;}
        else if (sitenote == false) { document.querySelectorAll('[data-note-type="site"]').forEach(element => {element.style.display = 'flex';}); sitenote = true;}
    };
    if (type === "game") {
        if (gamenote == true) { document.querySelectorAll('[data-note-type="game"]').forEach(element => {element.style.display = 'none';}); gamenote = false; }
        else if (gamenote == false) { document.querySelectorAll('[data-note-type="game"]').forEach(element => {element.style.display = 'flex';}); gamenote = true; }
    };
    if (type === "hotfix") {
        if (hotfixnote == true) { document.querySelectorAll('[data-note-type="hotfix"]').forEach(element => {element.style.display = 'none';}); hotfixnote = false; }
        else if (hotfixnote == false) { document.querySelectorAll('[data-note-type="hotfix"]').forEach(element => {element.style.display = 'flex';}); hotfixnote = true; }
    };
}

let jsdownload = true
let wasmdownload = true
function sortdownload(type) {
	console.log(type)
    if (type === "wasm") {
        if (wasmdownload == true) { document.querySelectorAll('[data-download-type="wasm"]').forEach(element => {element.style.display = 'none';}); wasmdownload = false;}
        else if (wasmdownload == false) { document.querySelectorAll('[data-download-type="wasm"]').forEach(element => {element.style.display = 'flex';}); wasmdownload = true;}
    };
    if (type === "js") {
        if (jsdownload == true) { document.querySelectorAll('[data-download-type="js"]').forEach(element => {element.style.display = 'none';}); jsdownload = false; }
        else if (jsdownload == false) { document.querySelectorAll('[data-download-type="js"]').forEach(element => {element.style.display = 'flex';}); jsdownload = true; }
    };
}


let onepointeight = onepointtwelve = other = true;
function sortserver(type) {
    if (type === "1.8.8") {
        if (onepointeight == true) { document.querySelectorAll('[data-server-type="1.8.8"]').forEach(element => {element.style.display = 'none';}); onepointeight = false;}
        else if (onepointeight == false) { document.querySelectorAll('[data-server-type="1.8.8"]').forEach(element => {element.style.display = 'flex';}); onepointeight = true;}
    };
    if (type === "1.12.2") {
        if (onepointtwelve == true) { document.querySelectorAll('[data-server-type="1.12.2"]').forEach(element => {element.style.display = 'none';}); onepointtwelve = false; }
        else if (onepointtwelve == false) { document.querySelectorAll('[data-server-type="1.12.2"]').forEach(element => {element.style.display = 'flex';}); onepointtwelve = true; }
    };
    if (type === "other") {
        if (other == true) { document.querySelectorAll('[data-server-type="other"]').forEach(element => {element.style.display = 'none';}); other = false; }
        else if (other == false) { document.querySelectorAll('[data-server-type="other"]').forEach(element => {element.style.display = 'flex';}); other = true; }
    };
}

function closenotescreen() {
    externalmenu.style.display = "none";
    while (externalmenu.firstChild) {externalmenu.removeChild(externalmenu.firstChild)};
}
function closeserverscreen() {
    externalmenu.style.display = "none";
    while (externalmenu.firstChild) {externalmenu.removeChild(externalmenu.firstChild)};
}
function closedownloadsscreen() {
    externalmenu.style.display = "none";
    while (externalmenu.firstChild) {externalmenu.removeChild(externalmenu.firstChild)};
}

// Game Edition Selected
let launcher = "./assets/json/base.json";
webedition();


function webedition(){
    launcher = "./assets/json/base.json";
    localStorage.setItem("startupprofile", "1");
    resetTabSelected();
    generateprofile(1);
    generatelaunchers(launcher);
    document.getElementById('game-bg').style.backgroundImage = 'url(./assets/images/web-edition.png)';
    document.getElementById('game-title').src = './assets/images/web-title.png';
    document.getElementById('gameedition').innerHTML = 'EAGLERCRAFT WEB EDITION';
    document.getElementById('header2').style.display = 'none';
    document.getElementById('header9').style.display = 'none';
    document.getElementById('header10').style.display = 'none';
    document.getElementById('header11').style.display = 'none';
    document.getElementById('gtabs2').classList.add('selected');
    playheader();
}
function moddededition(){
    launcher = "./assets/json/modded.json";
    localStorage.setItem("startupprofile", "2");
    resetTabSelected();
    generateprofile(2);
    generatelaunchers(launcher);
    document.getElementById('game-bg').style.backgroundImage = 'url(./assets/images/modded-edition.jpg)';
    document.getElementById('game-title').src = './assets/images/modded-title.png';
    document.getElementById('gameedition').innerHTML = 'EAGLERCRAFT MODDED';
    document.getElementById('header9').style.display = 'none';
    document.getElementById('header10').style.display = 'none';
    document.getElementById('header11').style.display = 'none';
    document.getElementById('gtabs3').classList.add('selected');
    playheader();
}
function eaglercontrols(){
    launcher = "./assets/json/assisted.json";
    localStorage.setItem("startupprofile", "3");
    resetTabSelected();
    generateprofile(3);
    generatelaunchers(launcher);
    document.getElementById('game-bg').style.backgroundImage = 'url(./assets/images/controls-edition.jpg)';
    document.getElementById('game-title').src = './assets/images/controls-title.png';
    document.getElementById('gameedition').innerHTML = 'EAGLERCRAFT MOBILE/CONTROLLER';
    document.getElementById('header2').style.display = 'none';
    document.getElementById('header9').style.display = 'none';
    document.getElementById('header10').style.display = 'none';
    document.getElementById('header11').style.display = 'none';
    document.getElementById('header12').style.display = 'none';
    document.getElementById('gtabs4').classList.add('selected');
    playheader();
}
function serversmenu(){
    localStorage.setItem("startupprofile", "6");
    resetTabSelected();
    document.getElementById('gameedition').innerHTML = 'Servers';
    document.getElementById('header1').style.display = 'none';
    document.getElementById('header2').style.display = 'none';
    document.getElementById('header3').style.display = 'none';
    document.getElementById('header4').style.display = 'none';
    document.getElementById('header5').style.display = 'none';
    document.getElementById('header6').style.display = 'none';
    document.getElementById('header9').style.display = 'none';
    document.getElementById('header10').style.display = 'none';
    document.getElementById('header12').style.display = 'none';
    document.getElementById('gtabs7').classList.add('selected');
    serversheader();
}
function settingsmenu(){
    localStorage.setItem("startupprofile", "5");
    resetTabSelected();
    document.getElementById('gameedition').innerHTML = 'SETTINGS';
    document.getElementById('header1').style.display = 'none';
    document.getElementById('header2').style.display = 'none';
    document.getElementById('header3').style.display = 'none';
    document.getElementById('header4').style.display = 'none';
    document.getElementById('header5').style.display = 'none';
    document.getElementById('header6').style.display = 'none';
    document.getElementById('header12').style.display = 'none';
    document.getElementById('header11').style.display = 'none';
    document.getElementById('gtabs6').classList.add('selected');
    generalsettingsheader();
}

// Header Options
function playheader(){
    resetHeaderSelected();
    generategames(launcher);
    document.getElementById('game-bg').style.display = "flex";
    document.getElementById('gameSelection').style.display = "flex";
    document.getElementById('header1').classList.add('selected');
}
function modsheader(){
    resetHeaderSelected();
    generatemods();
    document.getElementById('mods').style.display = "flex";
    document.getElementById('header2').classList.add('selected');
}
function faqsheader(){
    resetHeaderSelected();
    document.getElementById('faq').style.display = "flex";
    document.getElementById('header3').classList.add('selected');
}
function installationheader(){
    resetHeaderSelected();
    document.getElementById('installations').style.display = "flex";
    document.getElementById('header4').classList.add('selected');
}
function skinsheader(){
    resetHeaderSelected();
    document.getElementById('skineditor').style.display = "flex";
    document.getElementById("skinsiframe").style.display = "flex";
    document.getElementById('header5').classList.add('selected');
    document.getElementById("skinsiframe").src = "./skineditor";
}
function patchnotesheader(){
    resetHeaderSelected();
    generatenotes();
    document.getElementById('patchNotes').style.display = "flex";
    document.getElementById('header6').classList.add('selected');
}
function serversheader(){
    resetHeaderSelected();
    generateservers();
    document.getElementById('servers').style.display = "flex";
    document.getElementById('header11').classList.add('selected');
}
function generalsettingsheader(){
    resetHeaderSelected();
    document.getElementById('settings').style.display = "flex";
    document.getElementById('generalsettings').style.display = "block";
    document.getElementById('header9').classList.add('selected');
}
function aboutsettingsheader(){
    resetHeaderSelected();
    document.getElementById('settings').style.display = "flex";
    document.getElementById('aboutsettings').style.display = "block";
    document.getElementById('header10').classList.add('selected');
}

function downloadsheader(){
    resetHeaderSelected();
    document.getElementById('patchNotes').style.display = "flex";
    generatedownloads("./assets/json/base.json");
    document.getElementById('header12').classList.add('selected');
}

// Dropdown game options toggle
function dropdowntoggle(){
    if (dropdown.style.visibility === 'hidden') {
        dropdown.style.visibility = 'visible';
        document.getElementById('dropdownuparrow').innerHTML = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 20 20"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="dropdownIcon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15l6 -6l6 6" /></svg>';
    } else {
        dropdown.style.visibility = 'hidden'; 
        document.getElementById('dropdownuparrow').innerHTML = '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 20 20"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="dropdownIcon"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6" /></svg>';
    }
}

// Resets certain UI aspects 
function resetTabSelected() {
    while (dropdown.firstChild) {dropdown.removeChild(dropdown.firstChild)};
    while (installations.firstChild) {installations.removeChild(installations.firstChild)};
    for (var i = 1; i < 8; i++) { 
        let gtabs = document.getElementById('gtabs' + [i]);
        if (gtabs) gtabs.classList.remove('selected');
    };
    for (var i = 1; i < 13; i++) { 
        let headers = document.getElementById('header' + [i]);
        if (headers) headers.style.display = "block";
    };
    document.getElementById('settings').style.display = "none";
    document.getElementById('servers').style.display = "none";
}

function resetHeaderSelected() {
    while (dropdown.firstChild) {dropdown.removeChild(dropdown.firstChild)};
    while (mods.firstChild) {mods.removeChild(mods.firstChild)};
    while (notes.firstChild) {notes.removeChild(notes.firstChild)};
    for (var i = 1; i < 13; i++) { 
        let headers = document.getElementById('header' + [i]);
        if (headers) headers.classList.remove('selected');
    };
    document.getElementById('game-bg').style.display = "none";
    document.getElementById('gameSelection').style.display = "none";
    document.getElementById('mods').style.display = "none";
    document.getElementById('faq').style.display = "none";
    document.getElementById('installations').style.display = "none";
    document.getElementById('patchNotes').style.display = "none";
    document.getElementById('generalsettings').style.display = "none";
    document.getElementById('aboutsettings').style.display = "none";
    document.getElementById("skineditor").style.display = "none";
    document.getElementById("skinsiframe").src = "about:blank";
}

// Prevents touchscreen move
window.addEventListener("scroll", preventMotion, false);
window.addEventListener("touchmove", preventMotion, false);

function preventMotion(event)
{
    window.scrollTo(0, 0);
    event.preventDefault();
    event.stopPropagation();
}

// Basic Settings
const newtabcheckbox = document.getElementById("launchnewtab");
const presetscheckbox = document.getElementById("launcherpresets");
let target = ""
if (localStorage.getItem("launcherpresets")) {
    if (localStorage.getItem("launcherpresets") == 'true') {
        presetscheckbox.checked = true;
    }
    else if (localStorage.getItem("launcherpresets") == 'false') {
        presetscheckbox.checked = false;
    }
    if (localStorage.getItem("launchnewtab") == 'true') {
        newtabcheckbox.checked = true;
        target = "_blank";
    }
    if (localStorage.getItem("launchnewtab") == 'false') {
        newtabcheckbox.checked = false;
        target = "_self";
    }
};
function launchnewtab() {
	if (newtabcheckbox.checked) {
		localStorage.setItem("launchnewtab", true)
		target = "_blank"
	}
    else {
    	localStorage.setItem("launchnewtab", false)
    	target = "_self"
    };
};

let hostGuidePreviousFocus;

function openHostGuide() {
    const guide = document.getElementById("hostguide");
    const selectedPath = new URL(gamelink, window.location.href).pathname.replace(/\/+$/, "");
    const supported = ["/mc/1.5.2", "/mc/1.8.8", "/mc/26.3-wasm"].includes(selectedPath);

    hostGuidePreviousFocus = document.activeElement;
    document.getElementById("hostguideversion").textContent =
        `Selected version: ${document.getElementById("gametitle").textContent} (${document.getElementById("gameversion").textContent})`;
    document.getElementById("hostguidenote").textContent = selectedPath === "/mc/26.3-wasm"
        ? "Eaglercraft 26.3 WASM runs the integrated world server in your browser and shares it through its built-in LAN/invite flow. Keep the game open, and have friends join with a compatible 26.3 client. This is not a standalone or always-on Java server."
        : "Keep the game open while hosting. Friends can join over the internet through the game's relay; this is a temporary world, not a 24/7 dedicated server.";
    document.getElementById("hostguidesteps").hidden = !supported;
    document.getElementById("hostguidenote").hidden = !supported;
    document.getElementById("hostguideunsupported").hidden = supported;
    document.getElementById("hostguidelaunch").disabled = !supported;
    guide.setAttribute("aria-hidden", "false");
    guide.style.display = "flex";
    document.getElementById(supported ? "hostguidelaunch" : "hostguideclose").focus();
}

function closeHostGuide() {
    const guide = document.getElementById("hostguide");
    guide.style.display = "none";
    guide.setAttribute("aria-hidden", "true");
    if (hostGuidePreviousFocus instanceof HTMLElement) {
        hostGuidePreviousFocus.focus();
    }
}

function launchHostedWorld() {
    if (document.getElementById("hostguidelaunch").disabled) {
        return;
    }
    closeHostGuide();
    openmc();
}

function openmc() {
	const startedAt = performance.now();
	const gameName = document.getElementById("gametitle").textContent;
	const w = window.open(gamelink, target);
	if (!w) {
		errorNA("Allow pop-ups to launch the game.");
		return;
	}
	if (w !== window && stealthmodebox.checked) {
		w.addEventListener('load', ()=> {
			w.document.title = document.title;
			w.document.querySelector("link[rel*='icon']").href = document.querySelector("link[rel*='icon']").href;
		});
	};
	if (w !== window) showGameLoadScreen(w, startedAt, gameName);
};
function presetlaunchers() {
    if (presetscheckbox.checked) {
        localStorage.setItem("launcherpresets", true);
        fetch("./assets/json/base.json").then((response) => response.json()).then((data) => {data.forEach((game) => {
            if (game.active == true) {localStorage.setItem(game.title, true)};
        })});
        fetch("./assets/json/modded.json").then((response) => response.json()).then((data) => {data.forEach((game) => {
            if (game.active == true) {localStorage.setItem(game.title, true)};
        })});
        fetch("./assets/json/assisted.json").then((response) => response.json()).then((data) => {data.forEach((game) => {
            if (game.active == true) {localStorage.setItem(game.title, true)};
        })});
        return
    }
    else {
        localStorage.setItem("launcherpresets", false);
        fetch("./assets/json/base.json").then((response) => response.json()).then((data) => {data.forEach((game) => {
            if (game.title === JSON.parse(localStorage.getItem("basegame")).title) {return};
            localStorage.setItem(game.title, false);
        })});
        fetch("./assets/json/modded.json").then((response) => response.json()).then((data) => {data.forEach((game) => {
            if (game.title === JSON.parse(localStorage.getItem("moddedgame")).title) {return};
            localStorage.setItem(game.title, false);
        })});
        fetch("./assets/json/assisted.json").then((response) => response.json()).then((data) => {data.forEach((game) => {
            if (game.title === JSON.parse(localStorage.getItem("assisted")).title) {return};
            localStorage.setItem(game.title, false);
        })});
    };
};

//stealth mode function

function stealthmode() {
  	if (stealthmodebox && stealthmodebox.checked) {
  		newtabcheckbox.checked = true;
		localStorage.setItem("launchnewtab", true);
		target = "_blank";
  		document.getElementById("stealthinput").style.display = "flex";
  		document.getElementById('launchnewtab').disabled = true;
		setstealth().catch(() => {});
		localStorage.setItem("stealth", true);

  	} else {
  		document.getElementById("stealthinput").style.display = "none";
  		document.getElementById('launchnewtab').disabled = false;
   		document.querySelector("link[rel*='icon']").href = './assets/images/logo.png';
   		document.title = "Eagler Launcher";
		localStorage.setItem("stealth", false);

  	}
}

function stealthnamechange() {
    const url = document.getElementById("stealthinput").value.trim();
    if (!url) return;
    localStorage.setItem("stealthname", url);
    stealthname = localStorage.getItem("stealthname");
    if (stealthmodebox.checked) setstealth();
};

// Local player profile
let username = document.getElementById('username');
const savedUsername = localStorage.getItem("username");
username.innerHTML = savedUsername || "Generic User";
document.getElementById("usernameinput").value = savedUsername || "";

function usernamechange() {
    const chosenName = document.getElementById("usernameinput").value.trim();
    if (!chosenName) {
        username.innerHTML = "Generic User";
        localStorage.removeItem("username");
        return;
    }
    localStorage.setItem("username", chosenName);
    username.innerHTML = chosenName;
};

const setupModeInfo = {
    "1": { path: "./assets/json/base.json", storageKey: "basegame" },
    "2": { path: "./assets/json/modded.json", storageKey: "moddedgame" },
    "3": { path: "./assets/json/assisted.json", storageKey: "assisted" }
};
let setupAvailableGames = [];
let setupVersionRequest = 0;
const profileImageDraft = { skin: null, cape: null };

async function loadSetupVersions() {
    const mode = document.getElementById("startup-mode").value;
    const modeInfo = setupModeInfo[mode];
    const versionSelect = document.getElementById("startup-version");
    const saveButton = document.getElementById("startup-profile-save");
    const message = document.getElementById("profile-setup-message");
    const requestId = ++setupVersionRequest;
    setupAvailableGames = [];
    versionSelect.disabled = true;
    saveButton.disabled = true;
    versionSelect.replaceChildren(new Option("Loading versions...", ""));
    message.textContent = "";
    message.classList.remove("profile-error");

    try {
        const response = await fetch(modeInfo.path);
        if (!response.ok) throw new Error(`Version list request failed (${response.status}).`);
        const games = await response.json();
        if (!Array.isArray(games) || !games.length) throw new Error("No versions are available for this mode.");
        if (requestId !== setupVersionRequest) return;

        setupAvailableGames = games.filter((game) =>
            game && game.active !== false && typeof game.link === "string");
        if (!setupAvailableGames.length) throw new Error("No usable versions were found for this mode.");
        versionSelect.replaceChildren(new Option("Choose a version", ""));
        setupAvailableGames.forEach((game) => {
            versionSelect.add(new Option(`${game.title} — ${game.version}`, game.link));
        });

        let savedLink = "";
        const savedSelection = localStorage.getItem(modeInfo.storageKey);
        if (savedSelection) {
            try {
                savedLink = JSON.parse(savedSelection)?.link || "";
            } catch (error) {
                message.textContent = "The saved version could not be read; choose a version to continue.";
                message.classList.add("profile-error");
            }
        }
        versionSelect.value = setupAvailableGames.some((game) => game.link === savedLink)
            ? savedLink
            : setupAvailableGames[0]?.link || "";
        versionSelect.disabled = setupAvailableGames.length === 0;
        saveButton.disabled = setupAvailableGames.length === 0;
    } catch (error) {
        if (requestId !== setupVersionRequest) return;
        versionSelect.replaceChildren(new Option("Versions unavailable", ""));
        message.textContent = `Could not load versions: ${error.message}`;
        message.classList.add("profile-error");
    }
}

function renderProfileImage(kind) {
    const preview = document.getElementById(`profile-${kind}-preview`);
    const removeButton = preview.nextElementSibling;
    const dataUrl = profileImageDraft[kind];
    preview.hidden = !dataUrl;
    removeButton.hidden = !dataUrl;
    if (dataUrl) preview.src = dataUrl;
    else preview.removeAttribute("src");
}

async function previewProfileImage(input, kind) {
    const file = input.files[0];
    const message = document.getElementById("profile-setup-message");
    if (!file) return;
    message.textContent = "";
    message.classList.remove("profile-error");

    try {
        if (file.type !== "image/png") throw new Error("Choose a PNG image.");
        if (file.size > 512 * 1024) throw new Error("Choose a PNG smaller than 512 KB.");
        const bitmap = await createImageBitmap(file);
        const validSize = kind === "skin"
            ? (bitmap.width === 64 && (bitmap.height === 64 || bitmap.height === 32))
            : (bitmap.width === 64 && bitmap.height === 32);
        bitmap.close();
        if (!validSize) {
            throw new Error(kind === "skin"
                ? "Skin images must be 64x64 or 64x32 pixels."
                : "Cape images must be 64x32 pixels.");
        }

        const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result), { once: true });
            reader.addEventListener("error", () => reject(new Error("Could not read the selected image.")), { once: true });
            reader.readAsDataURL(file);
        });
        if (typeof dataUrl !== "string") throw new Error("Could not read the selected image.");
        profileImageDraft[kind] = dataUrl;
        renderProfileImage(kind);
    } catch (error) {
        input.value = "";
        message.textContent = error.message;
        message.classList.add("profile-error");
    }
}

function removeProfileImage(kind) {
    profileImageDraft[kind] = null;
    document.getElementById(`profile-${kind}-file`).value = "";
    renderProfileImage(kind);
}

function openProfileSetup() {
    const screen = document.getElementById("startupscreen");
    const mode = launcher === "./assets/json/modded.json"
        ? "2"
        : launcher === "./assets/json/assisted.json" ? "3" : "1";
    document.getElementById("startupprofile").hidden = false;
    document.getElementById("startup-username").value = localStorage.getItem("username") || "";
    document.getElementById("startup-mode").value = setupModeInfo[mode] ? mode : "1";
    document.getElementById("startup-profile-heading").textContent =
        localStorage.getItem("username") ? "Edit player setup" : "Set up your player";
    document.getElementById("profile-setup-message").textContent = "";
    document.getElementById("profile-setup-message").classList.remove("profile-error");
    screen.hidden = false;
    document.getElementById("sidebar").inert = true;
    document.querySelector(".mainPage").inert = true;

    for (const kind of ["skin", "cape"]) {
        profileImageDraft[kind] = localStorage.getItem(`profile-${kind}-png`);
        renderProfileImage(kind);
    }
    loadSetupVersions();
    document.getElementById("startup-username").focus();
}

function signOut() {
    localStorage.removeItem("username");
    localStorage.removeItem("profile-skin-png");
    localStorage.removeItem("profile-cape-png");
    document.getElementById("usernameinput").value = "";
    username.textContent = "Generic User";
    openProfileSetup();
}

function createLocalProfile(event) {
    event.preventDefault();
    const profileName = document.getElementById("startup-username").value.trim();
    const mode = document.getElementById("startup-mode").value;
    const selectedGame = setupAvailableGames.find((game) =>
        game.link === document.getElementById("startup-version").value);
    const message = document.getElementById("profile-setup-message");
    if (!/^[A-Za-z0-9_]{3,16}$/.test(profileName)) {
        document.getElementById("startup-username").reportValidity();
        return;
    }
    if (!setupModeInfo[mode] || !selectedGame) {
        message.textContent = "Choose an available game version before continuing.";
        message.classList.add("profile-error");
        return;
    }

    try {
        for (const kind of ["skin", "cape"]) {
            const storageKey = `profile-${kind}-png`;
            if (profileImageDraft[kind]) localStorage.setItem(storageKey, profileImageDraft[kind]);
            else localStorage.removeItem(storageKey);
        }
        localStorage.setItem(setupModeInfo[mode].storageKey, JSON.stringify(selectedGame));
        localStorage.setItem("username", profileName);
        localStorage.setItem("startupprofile", mode);
    } catch (error) {
        message.textContent = "Could not save this setup. Remove an image and try again.";
        message.classList.add("profile-error");
        return;
    }

    document.getElementById("usernameinput").value = profileName;
    username.textContent = profileName;
    if (mode === "1") {
        selectedGame1 = JSON.stringify(selectedGame);
        webedition();
    } else if (mode === "2") {
        selectedGame2 = JSON.stringify(selectedGame);
        moddededition();
    } else {
        selectedGame3 = JSON.stringify(selectedGame);
        eaglercontrols();
    }
    dismissStartupScreen();
}

function dismissStartupScreen() {
    document.getElementById("startupscreen").hidden = true;
    document.getElementById("sidebar").inert = false;
    document.querySelector(".mainPage").inert = false;
}

function formatLoadBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function measureLoadedResources(pageWindow) {
    try {
        const performanceEntries = pageWindow.performance;
        const navigation = performanceEntries.getEntriesByType("navigation")[0];
        const resources = performanceEntries.getEntriesByType("resource")
            .filter((entry) => new URL(entry.name, pageWindow.location.href).origin === pageWindow.location.origin);
        const transferred = (navigation?.encodedBodySize || 0) +
            resources.reduce((total, entry) => total + (entry.encodedBodySize || 0), 0);
        return { count: resources.length + (navigation ? 1 : 0), bytes: transferred };
    } catch (error) {
        return null;
    }
}

let gameLoadTimer;

function closeGameLoadScreen() {
    clearInterval(gameLoadTimer);
    gameLoadTimer = undefined;
    document.getElementById("gameloadscreen").hidden = true;
}

function showGameLoadScreen(gameWindow, startedAt, gameName) {
    const screen = document.getElementById("gameloadscreen");
    const progress = document.getElementById("gameload-progress");
    const status = document.getElementById("gameload-status");
    const stats = document.getElementById("gameload-stats");
    const closeButton = document.getElementById("gameload-close");
    document.getElementById("gameload-title").textContent = `Loading ${gameName}`;
    progress.classList.remove("complete");
    progress.setAttribute("aria-busy", "true");
    status.textContent = "Waiting for the game page to finish loading...";
    closeButton.hidden = true;
    screen.hidden = false;
    clearInterval(gameLoadTimer);

    const updateElapsed = () => {
        stats.textContent = `Elapsed: ${((performance.now() - startedAt) / 1000).toFixed(1)} seconds`;
        if (gameWindow.closed) {
            clearInterval(gameLoadTimer);
            gameLoadTimer = undefined;
            status.textContent = "The game window was closed before loading finished.";
            closeButton.hidden = false;
        }
    };
    updateElapsed();
    gameLoadTimer = setInterval(updateElapsed, 100);

    gameWindow.addEventListener("load", () => {
        clearInterval(gameLoadTimer);
        gameLoadTimer = undefined;
        const elapsed = ((performance.now() - startedAt) / 1000).toFixed(1);
        const resources = measureLoadedResources(gameWindow);
        progress.classList.add("complete");
        progress.setAttribute("aria-busy", "false");
        status.textContent = `Game page loaded in ${elapsed} seconds. The game may still be starting.`;
        stats.textContent = resources
            ? `${resources.count} resources • ${formatLoadBytes(resources.bytes)} loaded`
            : `Elapsed: ${elapsed} seconds • Resource details unavailable`;
        closeButton.hidden = false;
    }, { once: true });
}

// Clear Local Storage

function clearlocalstorage() {
    document.querySelector('.confrimationmenuscreen').classList.remove("deleteinstallation");
    document.getElementById('confirmationmenu').style.display = 'flex';
    document.querySelector(".warningtitle").innerHTML = "Clear Local Storage";
    document.querySelector(".warningdesc").innerHTML = "This will delete all of your local storage data of the website. This will reset saved settings and installations. Continue?";
    document.querySelector(".warningbutton").setAttribute("onclick", "clearlocalstorageconfirm()");
};
function confirmationcancel() {
    document.getElementById('confirmationmenu').style.display = "none";
};
function clearlocalstorageconfirm() {
    document.getElementById('confirmationmenu').style.display = "none";
    localStorage.clear();
    location.reload();
};

generatefaqs();

let setupDemoTimer;
let setupDemoPreviousFocus;

function openSetupDemo() {
    const setup = document.getElementById("setupdemo");
    setupDemoPreviousFocus = document.activeElement;
    setup.setAttribute("aria-hidden", "false");
    setup.style.display = "flex";
    document.getElementById("setupdemowelcome").hidden = false;
    document.getElementById("setupdemoprogress").hidden = true;
    document.getElementById("setupdemodone").hidden = true;
    document.getElementById("setupdemonext").hidden = false;
    document.getElementById("setupdemonext").disabled = false;
    document.getElementById("setupdemofinish").hidden = true;
    document.getElementById("setupdemonext").focus();
}

function startSetupDemo() {
    const welcome = document.getElementById("setupdemowelcome");
    const progress = document.getElementById("setupdemoprogress");
    const next = document.getElementById("setupdemonext");
    const progressBar = progress.querySelector('[role="progressbar"]');
    const fill = document.getElementById("setupdemoprogressfill");
    const percent = document.getElementById("setupdemopercent");
    const status = document.getElementById("setupdemostatus");
    let value = 0;

    welcome.hidden = true;
    progress.hidden = false;
    next.disabled = true;
    fill.style.width = "0%";
    progressBar.setAttribute("aria-valuenow", "0");
    percent.textContent = "0%";
    status.textContent = "Preparing preview";

    setupDemoTimer = setInterval(() => {
        value = Math.min(value + 20, 100);
        fill.style.width = value + "%";
        progressBar.setAttribute("aria-valuenow", String(value));
        percent.textContent = value + "%";
        status.textContent = value < 40 ? "Copying demo files" : value < 80 ? "Creating shortcuts" : "Finishing preview";

        if (value === 100) {
            clearInterval(setupDemoTimer);
            setupDemoTimer = undefined;
            progress.hidden = true;
            document.getElementById("setupdemodone").hidden = false;
            document.getElementById("setupdemonext").hidden = true;
            document.getElementById("setupdemofinish").hidden = false;
            document.getElementById("setupdemofinish").focus();
        }
    }, 250);
}

function closeSetupDemo() {
    clearInterval(setupDemoTimer);
    setupDemoTimer = undefined;
    const setup = document.getElementById("setupdemo");
    setup.style.display = "none";
    setup.setAttribute("aria-hidden", "true");
    if (setupDemoPreviousFocus instanceof HTMLElement) {
        setupDemoPreviousFocus.focus();
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.getElementById("setupdemo").getAttribute("aria-hidden") === "false") {
        closeSetupDemo();
    }
    if (event.key === "Escape" && document.getElementById("hostguide").getAttribute("aria-hidden") === "false") {
        closeHostGuide();
    }
});
