const timer_value = document.querySelector('.card-timer-time-value');
const timer_progress = document.querySelector('.radial-progress-bar2');
const timer_container = document.querySelector('.card-timer-time');
const timer_status = document.querySelector('.card-timer-status');
const settings_card = document.querySelector('.settings-card');
const settings_close_button = document.querySelector('.close-button');
const open_settings_button = document.querySelector('.card-settings-button');
const short_break_value = document.querySelector('.shortbreak-spinner input');
const long_break_value = document.querySelector('.longbreak-spinner input');
const pomodoro_value = document.querySelector('.pomodoro-spinner input');
const settings_apply_button = document.querySelector('.apply-settings-button-container button');

//close the settings dialog box 
settings_close_button.addEventListener('click', () => {
    console.log('close settings');
    settings_card.classList.add('hide');

});

//open settings dialog box
open_settings_button.addEventListener('click', (e) => {
    e.preventDefault();
    settings_card.classList.remove('hide');
});


// pause || resume timer when clicked on timer_container
// this function needs to be refactored
timer_container.addEventListener('click', () => {
    if (timerObj.is_running) {
        timerObj.is_paused = !timerObj.is_paused;
        if (timerObj.is_paused) {
            timerObj.is_running = false;
            timerObj.is_stopped = false;
            timerObj.is_reset = false;
            timerObj.paused_time = timerObj.currentTime;
        } 
    }
    else{
        timerObj.is_paused = false;
        timerObj.is_running = true;
        timerObj.is_stopped = false;
        timerObj.is_reset = false;
        timerAction((timerObj.paused_time/60));
    }
});
// kick start timer on document load action
document.addEventListener('DOMContentLoaded', () => {
    timerAction(timerObj.time);
    set_settings_values();
});


// on timer start action
//this function takes in the time in minutes 
function timerAction(currentTime) {

    let total_seconds = currentTime * 60;
    //update timer value every second
    const liveTimer = setInterval(() => {
        
        
        //reduce the total seconds by 1
        total_seconds -= 1;

        //update the timer value
        update_timer_value(total_seconds);

        //update thet timer status
        timer_status.innerHTML = 'RUNNING'; // update timer status; 

        //handle timer pause
        if (timerObj.is_paused) {
            clearInterval(liveTimer);
            // timer_value.innerHTML = `${minutes}:${seconds}`;
            timer_progress.style.strokeDashoffset = `${timerObj.currentPosition}`;
            timerObj.is_paused =  true;
            timerObj.is_running = false;
            timer_status.innerHTML = 'PAUSED';
        }

        //handle timer stop
        if (total_seconds === 0) {
            timerObj.is_running = false;
            timerObj.is_stopped = true;
            timerObj.is_reset = false;
            clearInterval(liveTimer);
            //change the timer status
            timer_status.innerHTML = 'STOPPED';
        }

        //update the progress bar
        update_progress_bar(total_seconds);

        //update current time of timerObj
        timerObj.currentTime = total_seconds;

        //handle timerObj reset
        if (timerObj.is_reset) {
            timerObj.is_reset = false;
            timerObj.is_running = true;
            timerObj.is_stopped = false;
            timerObj.is_paused = false;
            clearInterval(liveTimer);
            timerAction(timerObj.time);
        }
        //handle timer mode change
        if (timerObj.is_mode_changed) {
            timerObj.is_mode_changed = false;
            timerObj.is_running = true;
            timerObj.is_stopped = false;
            timerObj.is_paused = false;
            clearInterval(liveTimer);
            timerAction(timerObj.time);
        }
       
    }, 1000);

}

//update minute and seconds on display
const update_timer_value = (total_seconds) => {
    let minutes = Math.floor(total_seconds / 60);
    let seconds = total_seconds % 60;

    if (seconds < 10 && seconds >= 0) {
        seconds = '0' + seconds;
    }
    timer_value.innerHTML = `${minutes}:${seconds}`;
};
//update the progress bar on timer change
const update_progress_bar = (total_seconds) => {
            //update timer progress bar
            let radius = timer_progress.getAttribute('r');
            let circumference = 2 * Math.PI * radius;
            let progress = circumference * (total_seconds / (timerObj.time * 60));
            timer_progress.style.strokeDasharray = `${progress} ${circumference}`;
}

//initialize timer object
var timerObj = {
    shortBreak: 5,
    longBreak: 15,
    pomodoro: 25,
    time: 25,
    is_paused: false,
    is_running: true,
    is_stopped: true,
    paused_time: 0,
    currentTime: 0,
    currentMode: 'pomodoro',
    is_mode_changed: false,
};

//initialize ui object
var uiObj = {
    fontFamily: " 'Syncopate', sans-serif",
    highLightColor: '#F87070',
};


//define max and min values for timer
const max_min_values = {
    shortBreak: {
        min: 1,
        max: 60,
    },
    longBreak: {
        min: 1,
        max: 60,
    },
    pomodoro: {
        min: 1,
        max: 60,
    },
};


//handle timer value change
const timer_value_change = (e) => {
    //target element tagname

    let clickedElement = e.target.tagName;
    let parent_element = clickedElement ==='SPAN' ? e.target : e.target.parentElement;
    //data attribute of the parent element to determine which timer to update
    let data_attribute = parent_element.parentElement.getAttribute('data-spinner-type');
    let current_input_field = parent_element.parentElement.parentElement.children[1];
    //get the value of parent elements sibling
    let current_value =  parseInt(current_input_field.value);
    //add or subtract value from current value
    //if parent_element class is up then add value
    if (parent_element.classList.contains('up') && current_value < max_min_values[data_attribute].max) {
        current_value++;
    }
    //if parent_element class is down then subtract value
    else if (parent_element.classList.contains('down') && current_value > max_min_values[data_attribute].min) {
        current_value--;
    }
    //update the value of the parent element
    current_input_field.value = current_value;
}


//handle all spinners value change
const spinners = document.querySelectorAll('.spin');
spinners.forEach(spinner => {
    spinner.addEventListener('click', timer_value_change);
});


//set settings values on load using timerObj
const set_settings_values = () => {
    short_break_value.value = timerObj.shortBreak;
    long_break_value.value = timerObj.longBreak;
    pomodoro_value.value = timerObj.time;
}

//handle settings apply button
settings_apply_button.addEventListener('click', () => {
    // reinitialize timer object
    timerObj = {
        'shortBreak': parseInt(short_break_value.value),
        'longBreak': parseInt(long_break_value.value),
        'pomodoro': parseInt(pomodoro_value.value),
        'time': parseInt(pomodoro_value.value),'currentTime': 0,
        'is_paused': false,'is_running': true,
        'is_stopped': true,'paused_time': 0,
        'is_reset': true,
    };

    //update ui changes
    update_ui_changes();

    //hide settings card
    settings_card.classList.add('hide');
    //update timer value
});

const update_ui_changes = () => {
    //apply font changes
    let root = document.documentElement;
    root.style.setProperty('--highlight', uiObj.highLightColor);
    document.body.style.fontFamily = uiObj.fontFamily;
    //apply color changes
    console.log(document.body.style.fontFamily);
}

//handle card navigation pomodoro -> short break -> long break 
const card_navigation = (e) => {
    //ensure always the target element is the div with .card-nav-item class
    let clickedElement = e.target.tagName === 'A' ? e.target.parentElement : e.target;
    //get id of the clicked element
    let id = clickedElement.getAttribute('id');
    //activate timer mode 
    console.log(id)
    timer_mode_change(id);
    //add active class to the clicked element
    clickedElement.classList.add('active');
    //remove active class from all other elements
    card_navigation_buttons.forEach(item => {
        if (item.getAttribute('id') !== id) {
            item.classList.remove('active');
        }
    });
 
}

//handle card navigation buttons
const card_navigation_buttons = document.querySelectorAll('.card-nav-item');
card_navigation_buttons.forEach(button => {
    button.addEventListener('click', card_navigation);
});

//handle activation of different modes of timer i.e. pomodoro, short break, long break
const timer_mode_change = (timer_mode) => {
    console.log(timer_mode,'timer_mode');
    //set timer mode
    timerObj.currentMode = timer_mode;
    //update timer value
    timerObj.time = timerObj[timer_mode];
    //update timer mode status
    timerObj.is_mode_changed = true;

}


//handle font type switch
const font_settings = document.querySelectorAll('ul.font-settings li');
font_settings.forEach(item => {

    item.addEventListener('click', (e) => {
        //get font type
        let target_element = e.target.tagName === 'SPAN' ? e.target.parentElement : e.target;
        let font_type = target_element.getAttribute('data-font-type');
        uiObj.fontFamily = font_type;
        //add active class to the clicked element
        target_element.classList.add('active');
        //remove active class from all other elements
        font_settings.forEach(item => {
            if (item.getAttribute('data-font-type') !== font_type) {
                item.classList.remove('active');
            }
        });
   
    });
        
});

const color_settings = document.querySelectorAll('ul.color-settings li');
color_settings.forEach(item => {

    item.addEventListener('click', (e) => {
        //get font type
        let target_element = e.target.tagName === 'SPAN' ? e.target.parentElement : e.target;
        let color_type = target_element.getAttribute('data-color');
        uiObj.highLightColor = `var(${color_type})`;
        console.log(color_type);
        //remove hide from i element to show the color
        target_element.children[0].classList.remove('hide');
        //add hide to all other i elements
        color_settings.forEach(item => {
            if (item !== target_element) {
                item.children[0].classList.add('hide');
            }
        });
   
    });
        
});