(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ical.js')) :
    typeof define === 'function' && define.amd ? define(['exports', 'ical.js'], factory) :
    (factory((global.ical2fullcalendar = global.ical2fullcalendar || {}),global.ICAL));
}(this, function (exports,ICAL$1) { 'use strict';

    ICAL$1 = 'default' in ICAL$1 ? ICAL$1['default'] : ICAL$1;

    function ical_events(ical, event_callback, recur_event_callback) {
        jcal_events(ICAL$1.parse(ical), event_callback, recur_event_callback)
    }

    function jcal_events(jcal, event_callback, recur_event_callback) {
        for (event of new ICAL$1.Component(jcal).getAllSubcomponents('vevent')) {
            if (event.hasProperty('rrule')) {
                recur_event_callback(event)
            } else {
                event_callback(event)
            }
        }
    }

    function event_duration(event) {
        return new Date(event.getFirstPropertyValue('dtend').toJSDate() - event.getFirstPropertyValue('dtstart').toJSDate()).getTime()
    }

    function event_dtend(dtstart, duration) {
        return new ICAL$1.Time().fromJSDate(new Date(dtstart.toJSDate().getTime() + duration))
    }

    function expand_recur_event(event, dtstart, dtend, event_callback) {
        var exp = new ICAL$1.RecurExpansion({
            component:event,
            dtstart:event.getFirstPropertyValue('dtstart')
        })
        var duration = event_duration(event)
        while (! exp.complete && exp.next() < dtend) {
            if (exp.last >= dtstart) {
                event = new ICAL$1.Component(event.toJSON())
                event.updatePropertyWithValue('dtstart', exp.last)
                event.updatePropertyWithValue('dtend', event_dtend(exp.last, duration))
                event_callback(event)
            }
        }
    }

    var recur_events = [];

    function an_filter(string) {
        // remove non alphanumeric chars
        return string.replace(/[^\w\s]/gi, '')
    }

    function moment_icaltime(moment, timezone) {
        // TODO timezone
        return new ICAL.Time().fromJSDate(moment.toDate())
    }

    function expand_recur_events(start, end, timezone, events_callback) {
        var events = []
        for (event of recur_events) {
    	var event_properties = event.event_properties
            expand_recur_event(event, moment_icaltime(start, timezone), moment_icaltime(end, timezone), function(event){
                fc_event(event, function(event){
                    events.push(merge_events(event_properties, merge_events({className:['recur-event']}, event)))
                })
            })
        }
        events_callback(events)
    }

    function fc_events(ics, event_properties) {
        var events = []
        ical_events(
            ics,
            function(event){
                fc_event(event, function(event){
                    events.push(merge_events(event_properties, event))
                })
            },
            function(event){
                event.event_properties = event_properties
                recur_events.push(event)
            }
        )
        return events
    }

    function merge_events(e, f) {
        // f has priority
        for (var k in e) {
            if (k == 'className') {
                f[k] = [].concat(f[k]).concat(e[k])
            } else if (! f[k]) {
                f[k] = e[k]
            }
        }
        return f;
    }

    function fc_event(event, event_callback) {
        var e = {
            title:event.getFirstPropertyValue('summary'),
            url:event.getFirstPropertyValue('url'),
            id:event.getFirstPropertyValue('uid'),
            className:['event-'+an_filter(event.getFirstPropertyValue('uid'))],
            allDay:false
        }
        try {
            e['start'] = event.getFirstPropertyValue('dtstart').toJSDate()
        } catch (TypeError) {
            console.debug('Undefined "dtstart", vevent skipped.')
            return
        }
        try {
            e['end'] = event.getFirstPropertyValue('dtend').toJSDate()
        } catch (TypeError) {
            e['allDay'] = true
        }
        event_callback(e)
    }

    exports.an_filter = an_filter;
    exports.moment_icaltime = moment_icaltime;
    exports.expand_recur_events = expand_recur_events;
    exports.fc_events = fc_events;
    exports.merge_events = merge_events;
    exports.fc_event = fc_event;

    Object.defineProperty(exports, '__esModule', { value: true });

}));