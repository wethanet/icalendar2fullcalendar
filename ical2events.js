function vevent2event(vevent) {
    e = {
        title:vevent.getFirstPropertyValue('summary'),
        url:vevent.getFirstPropertyValue('url'),
        id:vevent.getFirstPropertyValue('uid'),
        allDay:false
    }
    try {
        e['start'] = vevent.getFirstPropertyValue('dtstart').toJSDate()
    } catch (TypeError) {
        console.debug('Missing dtstart, vevent skipped.')
        return
    }
    try {
        e['end'] = vevent.getFirstPropertyValue('dtend').toJSDate()
    } catch (TypeError) {
        e['allDay'] = true
    }
    return e
}

function jcal2events(jcal) {
    events = []
    vcalendar = new ICAL.Component(jcal)
    vevents = vcalendar.getAllSubcomponents('vevent')
    for (i in vevents) {
        e = vevent2event(vevents[i])
        if (e) {
            events.push(e)
        }
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


