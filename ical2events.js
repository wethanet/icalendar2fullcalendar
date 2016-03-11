
function vevent2event(vevent) {
    event = {
        title:vevent.getFirstPropertyValue('summary'),
        start:vevent.getFirstPropertyValue('dtstart').toJSDate(),
        allDay:false
    }
    try {
        event['end'] = vevent.getFirstPropertyValue('dtend').toJSDate()
    } catch (TypeError) {
        event['allDay'] = true
    }
    return event
}

function jcal2events(jcal) {
    events = []
    vcalendar = new ICAL.Component(jcal)
    vevents = vcalendar.getAllSubcomponents('vevent')
    for (i in vevents) {
        events.push(vevent2event(vevents[i]))
    }
    return events
}

function ical2events(ical) {
    try {
        return jcal2events(ICAL.parse(ical))
    } catch (ReferenceError) {
        console.error('Unable to call the ical library. Please include the script at https://raw.github.com/mozilla-comm/ical.js/master/build/ical.js.')
    }
}


