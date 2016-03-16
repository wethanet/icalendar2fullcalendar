ics_sources = ['samples/events.ics','samples/32c3.ics','samples/daily_recur.ics']

function data_req (url, callback) {
    req = new XMLHttpRequest()
    req.addEventListener('load', callback)
    req.open('GET', url)
    req.send()
}

$(document).ready(function() {
    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        defaultView: 'month',
    })
    for (ics of ics_sources) {
        data_req(ics, function(){
            $('#calendar').fullCalendar('addEventSource', fc_events(this.response))
        })
    }
    $('#calendar').fullCalendar('addEventSource', expand_recur_events)
})

