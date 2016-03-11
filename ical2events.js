
function vevent2event(vevent) {
    event = {
        title:vevent.getFirstPropertyValue('summary'),
        url:vevent.getFirstPropertyValue('url'),
        id:vevent.getFirstPropertyValue('uid'),
        allDay:false
    }
    try {
        event['start'] = vevent.getFirstPropertyValue('dtstart').toJSDate()
    } catch (TypeError) {
        console.debug('Missing dtstart, vevent skipped.')
        return
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
    return jcal2events(ICAL.parse(ical))
}

try {
    ICAL
} catch (ReferenceError) {
    console.error('Unable to call the ical library, ical2events wont work. Please include the script at https://raw.github.com/mozilla-comm/ical.js/master/build/ical.js.')
}


