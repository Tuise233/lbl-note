export function getData(){
    let data = localStorage.getItem('lbl-note-data');
    if(data == null || data == undefined){
        data = {
            todoList: [],
            doneList: [],
            autoBoost: false,
            alwaysTop: false,
            darkTheme: false,
        }
        localStorage.setItem('lbl-note-data', JSON.stringify(data));
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
    localStorage.setItem('lbl-note-data', JSON.stringify(data));
}

export function clearData(){
    localStorage.removeItem('lbl-note-data');
    localStorage.getItem('lbl-note-data');
}

export function toggleTheme(isDark){
    let ele = document.getElementById("app");
    if(isDark){
        ele.classList.remove("primary_color");
        ele.classList.add("dark_color");
    } else {
        ele.classList.remove("dark_color");
        ele.classList.add("primary_color");
    }
}