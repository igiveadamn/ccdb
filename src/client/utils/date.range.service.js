angular.module('ices.date.range.service', [])

    .service('DateRangeService', function () {
        var listeners = [];

        var findMostRecentMondayMorning = function () {
            var now = new Date(Date.now());
            if (now.getDay() === 1 && now.getHours() < 7) {
                now.setDate(now.getDate() - 7);
            } else if (now.getDay() === 0) {
                now.setDate(now.getDate() - 6);
            } else {
                now.setDate(now.getDate() - now.getDay() + 1);
            }

            now.setHours(7);
            now.setMinutes(0);
            now.setSeconds(0);
            now.setMilliseconds(0);

            return now;
        };

        var modelChanged = function (value) {
            exports.dateRange.startDate.setDate(exports.dateRange.startDate.getDate() + value);
            exports.dateRange.endDate.setDate(exports.dateRange.endDate.getDate() + value);

            _.each(listeners, function (listener) {
                listener(exports.dateRange);
            });
        };

        var startDate = findMostRecentMondayMorning();
        var endDate = new Date(new Date(startDate).setDate(startDate.getDate() + 7));

        var exports = {
            dateRange: {startDate: startDate, endDate: endDate},

            previous: function () {
                modelChanged(-7);
            },

            next: function () {
                modelChanged(7);
            },

            addListener: function (listener) {
                listeners.push(listener);
            }
        };

        return exports;
    })
;
