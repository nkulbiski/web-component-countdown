(function () {
    'use strict';

    let timerID;

    customElements.define('k-countdown',
            class extends HTMLElement {
        constructor() {
            try {
                super();
                var countdown = this;
                let template = document.getElementById('k-countdown');
                let templateContent = template.content;

                const shadowRoot = this.attachShadow({mode: 'open'})
                        .appendChild(templateContent.cloneNode(true));

                if (!this.getAttribute("date")) {
                    throw "Date is missing";
                }

                let countdown_date = new Date(this.getAttribute("date"));

                if (!is_date_valid(countdown_date)) {
                    throw "Invalid date";
                }

                //start with the correct countdown values
                tick(countdown_date, countdown);
                
                //update the countdown every second
                timerID = setInterval(function () {
                    tick(countdown_date, countdown);
                }, 1000);


            } catch (e) {
                let error = e;
                if (this.getAttribute("error-message")) {
                    error = this.getAttribute("error-message");
                }
                countdown.shadowRoot.querySelector('.error-message').innerHTML = error;
                hide_timer(countdown);
            }

        }

    });

    function is_date_valid(date) {
        return date instanceof Date && !isNaN(date);
    }

    function tick(countdown_date, countdown) {

        let current_date = new Date();

        let total_seconds_until_countdown = (countdown_date.getTime() - current_date.getTime()) / 1000;

        //countdown ended
        if (total_seconds_until_countdown <= 0) {
            let ended = "The date has passed.";
            if (countdown.getAttribute("ended-message")) {

                ended = countdown.getAttribute("ended-message");
            }
            countdown.shadowRoot.querySelector('.ended-message').innerHTML = ended;
            hide_timer(countdown);

            //if the countdown has ended no need to call this function every second
            clearTimeout(timerID);
            return false;

        }

        //calculate the number of days, hours, minutes and seconds until the date
        let one_day_in_seconds = 60 * 60 * 24;
        let one_hour_in_seconds = 60 * 60;
        let one_min_in_seconds = 60;

        let days_until_countdown = Math.floor(total_seconds_until_countdown / one_day_in_seconds);

        let hours_until_countdown = Math.floor((total_seconds_until_countdown % one_day_in_seconds) / one_hour_in_seconds);

        let minutes_until_countdown = Math.floor(((total_seconds_until_countdown % one_day_in_seconds) % one_hour_in_seconds) / one_min_in_seconds);

        let sec_until_countdown = Math.round((((total_seconds_until_countdown % one_day_in_seconds) % one_hour_in_seconds) % one_min_in_seconds));

        //update the component with the calculated numbers
        countdown.shadowRoot.querySelector('.days .value').innerHTML = days_until_countdown;
        countdown.shadowRoot.querySelector('.hours .value').innerHTML = hours_until_countdown;
        countdown.shadowRoot.querySelector('.mins .value').innerHTML = minutes_until_countdown;
        countdown.shadowRoot.querySelector('.secs .value').innerHTML = sec_until_countdown;

        return true;
    }

    function hide_timer(countdown) {
        let timer = countdown.shadowRoot.getElementById('timer');
        if (timer) {
            timer.remove();
        }
    }
}());