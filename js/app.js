const timer_value = document.querySelector('.card-timer-time-value');
const timer_progress = document.querySelector('.radial-progress-bar2');
const timer_container = document.querySelector('.card-timer-time');
const timer_status = document.querySelector('.card-timer-status');
const settings_card = document.querySelector('.settings-card');
const settings_close_button = document.querySelector('.close-button');
const open_settings_button = document.querySelector('.card-settings-button');

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


//initialize timer object
const timerObj = {
    work: 25,
    break: 5,
    time: 1,
    is_paused: false,
    is_running: true,
    is_stopped: true,
    paused_time: 0,
    currentTime: 0,
};

// pause || resume timer when clicked on timer_container
// this function needs to be refactored
timer_container.addEventListener('click', () => {
    if (timerObj.is_running) {
        timerObj.is_paused = !timerObj.is_paused;
        if (timerObj.is_paused) {
            timerObj.is_running = false;
            timerObj.is_stopped = false;
            timerObj.is_reset = false;
            timer_container.classList.add('card-timer-time-paused');
            timerObj.paused_time = timerObj.currentTime;
        } 
    }
    else{
        timerObj.is_paused = false;
        timerObj.is_running = true;
        timerObj.is_stopped = false;
        timerObj.is_reset = false;
        timer_container.classList.remove('card-timer-time-paused');
        timerAction((timerObj.paused_time/60));
    }
});
// kick start timer on document load action
document.addEventListener('DOMContentLoaded', () => {
    timerAction(timerObj.time);
});


// on timer start action
//this function takes in the time in minutes 
function timerAction(currentTime) {

    let total_seconds = currentTime * 60;
    console.log(total_seconds);

    //update timer value every second
    var liveTimer = setInterval(() => {
        total_seconds--;
        minutes = Math.floor(total_seconds / 60);
        seconds = total_seconds % 60;
        if (seconds < 10 && seconds >= 0) {
            seconds = '0' + seconds;
        }

        timer_status.innerHTML = timerObj.is_paused ? 'PAUSED' : 'RUNNING'; // update timer status; 
        //pause if object timer is paused
        if (timerObj.is_paused) {
            clearInterval(liveTimer);
            timer_value.innerHTML = `${minutes}:${seconds}`;
            timer_progress.style.strokeDashoffset = `${timerObj.currentPosition}`;
            return;
        }
        // if(total_seconds === 0 || timerObj.is_paused) {

        //     console.log('timer paused', timerObj.paused_time);
        //     timerObj.is_running = false;
        //     timerObj.is_stopped = true;
        //     timerObj.is_reset = false;
        //     if (total_seconds === 0) {
        //         timerObj.is_paused = false;
        //         timerObj.is_running = false;
        //         timerObj.is_stopped = true;
        //         timerObj.is_reset = false;
        //         clearInterval(liveTimer);
        //     }
        //     clearInterval(liveTimer);
        // }
        
        //update timer value
        timer_value.textContent = `${minutes}:${seconds}`;

        //update timer progress bar
        let radius = timer_progress.getAttribute('r');
        let circumference = 2 * Math.PI * radius;
        let progress = circumference * (total_seconds / (timerObj.time * 60));
        timer_progress.style.strokeDasharray = `${progress} ${circumference}`;

        //update current time
        timerObj.currentTime = total_seconds;

    }, 1000);

    return liveTimer;
}

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