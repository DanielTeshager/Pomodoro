const timer_value = document.querySelector('.card-timer-time-value');
const timer_progress = document.querySelector('.radial-progress-bar2');
const timer_container = document.querySelector('.card-timer-time');
const timer_status = document.querySelector('.card-timer-status');

const timerObj = {
    work: 25,
    break: 5,
    time: 1,
    currentPosition: 0,
    is_work: true,
    is_paused: false,
    is_running: true,
    is_stopped: true,
    is_reset: false,
    paused_time: 0,
    currentTime: 0,
};
// pause timer when clicked on timer_container
timer_container.addEventListener('click', () => {
    if (timerObj.is_running) {
        timerObj.is_paused = !timerObj.is_paused;
        if (timerObj.is_paused) {
            timerObj.is_running = false;
            timerObj.is_stopped = false;
            timerObj.is_reset = false;
            timer_container.classList.add('card-timer-time-paused');
        } else {
            timerObj.is_running = true;
            timerObj.is_stopped = false;
            timerObj.is_reset = false;
            console.log('timer resumed', timerObj.paused_time);
            timerAction((timerObj.paused_time/60));
            timer_container.classList.remove('card-timer-time-paused');
        }
    }
    else{
        timerObj.is_paused = false;
        timerObj.is_running = true;
        timerObj.is_stopped = false;
        timerObj.is_reset = false;
        timer_container.classList.remove('card-timer-time-paused');
        timerAction(timerObj.paused_time);
    }
});
// on document load action
document.addEventListener('DOMContentLoaded', () => {
    timerAction(timerObj.time);
});


// on timer start action
function timerAction(currentTime, is_reset, is_paused) {
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
        if(total_seconds === 0 || timerObj.is_paused) {

            timer_status.innerHTML = 'PAUSED'; 
            console.log('timer stopped', timerObj.paused_time);
            timerObj.is_running = false;
            timerObj.is_stopped = true;
            timerObj.is_reset = false;
            if (total_seconds === 0) {
                timerObj.is_paused = false;
                timerObj.is_running = false;
                timerObj.is_stopped = true;
                timerObj.is_reset = false;
                clearInterval(liveTimer);
            }
            clearInterval(liveTimer);
        }
        timer_value.textContent = `${minutes}:${seconds}`;
        let radius = timer_progress.getAttribute('r');
        let circumference = 2 * Math.PI * radius;
        let progress = circumference * (total_seconds / (timerObj.time * 60));
        timer_progress.style.strokeDasharray = `${progress} ${circumference}`;

        //update current time
        timerObj.currentTime = total_seconds;

    }, 1000,);

    return liveTimer;
}