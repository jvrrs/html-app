const electron = require('electron');
const html = document.querySelector("html");
const ui_minimize = document.querySelector(".minimize");
const ui_maximize = document.querySelector(".maximize");
const ui_restore = document.querySelector(".restore");
const ui_close = document.querySelector(".close");
const menu_list_items = document.querySelectorAll(".menu-list-item");
const menu_dropdown = document.querySelector(".menu-dropdown");
const current_window = electron.remote.getCurrentWindow();
const body = document.querySelector("body");
const main_container = document.querySelector(".main-container");
const drop_menu = electron.remote.Menu;

html.addEventListener("click", (e) => {
    switch (e.target) {
        case ui_minimize:
            current_window.minimize();
        break;

        case ui_maximize:
            current_window.maximize();
            ui_maximize.style.display = "none";
            ui_restore.style.display = "flex";
        break;

        case ui_restore:
            current_window.restore();
            ui_restore.style.display = "none";
            ui_maximize.style.display = "flex";
        break;

        case ui_close:
            current_window.close();
        break;
    };
});

var drop_open = "none";
menu_list_items.forEach(item => {
    item.addEventListener("click", (e) => {
        console.log(item);

        switch(item.textContent) {
            case "File":
                var list = ["New", "Open", "Save", "Save As", "<hr>", "Exit"];
                dropdown(list, item, item.textContent);
            break;

            case "Edit":
                var list = ["item1", "item2", "item3"];
                dropdown(list, item, item.textContent);
            break;

            case "View":
                var list = ["item1", "item2", "item3"];
                dropdown(list, item, item.textContent);
            break;

            case "Help":
                var list = ["item1", "item2", "item3"];
                dropdown(list, item, item.textContent);
            break;

            case "Dev-Tools":
                var list = ["item1", "item2", "item3"];
                dropdown(list, item, item.textContent);
            break;
            default:
                menu_dropdown.innerHTML = "";
                menu_dropdown.style.display = "none";
                drop_open = "none";
        }
    });
});

function dropdown(list, item, curr) {
    if(drop_open !== curr) {
        menu_dropdown.innerHTML = "";
        menu_dropdown.style.display = "none";
        drop_open = "none";

        let a, b;
        a = document.createElement("ul")
        a.className = "dropdown-menu";
        a.classList.add("m_area");

        list.forEach(list_item => {
            if (list_item === "<hr>") {
                b = document.createElement("hr");
                b.classList.add("m_area");
                a.appendChild(b);
            } else {
                b = document.createElement("li");
                b.className = "list-item";
                b.classList.add("m_area");
                b.innerHTML = list_item;
                a.appendChild(b);
            };
        });
        menu_dropdown.appendChild(a);

        var btn_loc = item.getBoundingClientRect();
        var list_x = btn_loc.x;
        var list_y = btn_loc.y + btn_loc.height;

        menu_dropdown.style.display = "flex";
        menu_dropdown.style.left = list_x + "px";
        menu_dropdown.style.top = list_y + "px";
        drop_open = curr;
    } else {
        menu_dropdown.innerHTML = "";
        menu_dropdown.style.display = "none";
        drop_open = "none";
    };

    document.addEventListener("click", (e) => {
        var tar = e.target;
        if (!tar.classList.contains("m_area")) {
            menu_dropdown.innerHTML = "";
            menu_dropdown.style.display = "none";
            drop_open = "none";
        }
    });
};

// Scroll Handle
const scroll_thumb = document.querySelector(".scroll-bar_thumb");
const scroll_track = document.querySelector(".scroll-bar_track");

main_container.addEventListener("scroll", scroll_handle);
window.addEventListener("resize", scroll_handle);

var sh_timeout;

function time() {
    sh_timeout = setTimeout(() => {scroll_track.classList.add("hidden")}, 2500);
} 

function r_time() {
    clearTimeout(sh_timeout);
}

html.addEventListener("mousemove", c_sh);

function c_sh() {
    scroll_handle();
}

function scroll_handle() {
    r_time();
    if (scroll_track.classList.contains("hidden")) {scroll_track.classList.remove("hidden")};
    var cont_h = main_container.scrollHeight + 35;
    var cont_t = main_container.scrollTop;
    var tr_h = scroll_track.scrollHeight;
    var win_h = window.innerHeight;
    var scroll_thumb_h = (win_h/cont_h) * tr_h;
    var scroll_thumg_t = (cont_t/cont_h) * tr_h;
    scroll_thumb.style.height = scroll_thumb_h + "px";
    scroll_thumb.style.top = scroll_thumg_t + "px";
    time();
};

scroll_thumb.addEventListener("mousedown", scroll_down_handle);

function scroll_down_handle(e) {
    html.removeEventListener("mousemove", c_sh);
    r_time();
    if (scroll_track.classList.contains("hidden")) {scroll_track.classList.remove("hidden")};
    var cont_h = main_container.scrollHeight + 35;
    var cont_t = main_container.scrollTop;
    var tr_h = scroll_track.scrollHeight;
    var th_h = scroll_thumb.scrollHeight;
    var scroll_dif = e.clientY - parseInt(scroll_thumb.style.top);
    html.style.pointerEvents = "none";
    window.addEventListener("mousemove", scroll_drag_handle);
    window.addEventListener("mouseup", scroll_up_handle);

    function scroll_drag_handle(e) {
        html.removeEventListener("mousemove", c_sh);
        r_time();
        var scroll_tar = (e.clientY - scroll_dif);
        if (scroll_tar > 0 && scroll_tar < (tr_h - th_h)) {
            scroll_thumb.style.top = scroll_tar + "px";
            main_container.scrollTo(0, (parseInt(scroll_thumb.style.top)/tr_h) * cont_h);   
        };
    };

    function scroll_up_handle(e) {
        window.removeEventListener("mouseup", scroll_up_handle);
        window.removeEventListener("mousemove", scroll_drag_handle);
        html.style.pointerEvents = "all";
        html.addEventListener("mousemove", c_sh);
        time();
    };
};