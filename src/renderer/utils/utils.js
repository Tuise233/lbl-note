export function formatDateTime(){
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    hour = hour < 10 ? "0" + hour : hour;
    let minute = date.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;

    return `${year}/${month}/${day} ${hour}:${minute}`;
}

export function getData(){
    let data = localStorage.getItem('lbl-note-data2');
    if(data == null || data == undefined){
        data = {
            todoList: [],
            doneList: [],
            autoBoost: false,
            alwaysTop: false,
            darkTheme: false,
        }
        localStorage.setItem('lbl-note-data2', JSON.stringify(data));
    } else {
        data = JSON.parse(data);
    }
    return data;
}

export function saveData(obj){
    let data = getData();
    for(let key in obj){
        data[key] = obj[key];
    }
    localStorage.setItem('lbl-note-data2', JSON.stringify(data));
}

export function toggleTheme(isDark){
    let ele = document.getElementById("app");
    if(state){
        ele.classList.remove("primary_color");
        ele.classList.add("dark_color");
    } else {
        ele.classList.remove("dark_color");
        ele.classList.add("primary_color");
    }

    //icon颜色
    document.getElementById("screen-top-disable").src = isDark ? "@/assets/icons/screen-top-disable.png" : "@/assets/icons/screen-top-disable-white.png"
}