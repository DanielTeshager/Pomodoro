const timer_value = document.querySelector('.card-timer-time-value');
const timer_progress = document.querySelector('.radial-progress-bar2');
const timer_container = document.querySelector('.card-timer-time');
const timer_status = document.querySelector('.card-timer-status');

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