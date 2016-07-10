/*jshint laxbreak:true*/
var mongoose = require('mongoose');
var schema = require('./schema');
var url = require('url');
var _ = require('lodash');

var Patient = mongoose.model('Patient', schema.patientSchema);

function addReference(patient, success, failure) {
    //generate a 6 digit number and check that it hasn't been used in that hospital before.
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    var length = 6;
    var reference = patient.hospital.substr(0, 4).toUpperCase() + '-';
    for (var i = length; i > 0; --i) {
        reference += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    var filter = {
        reference: new RegExp(reference, 'i'),
        hospital: patient.hospital
    };

    Patient.find(filter, function (err, patients) {
        if (err) {
            failure();
        }
        if (patients.length > 0) {
            addReference(patient, success, failure);
        } else {
            patient.reference = reference;
            success();
        }
    });
}

function updateOrInsertPatient(id, patient, response) {
    Patient.findByIdAndUpdate(id, patient, {upsert: true}, function (err, savedPatient) {
        if (err) {
            console.log(err);
        }
        response.json(savedPatient);
    });
}

module.exports = {
    search: function (request, response) {
        var query = request.query.query;
        var filter = {
            $or: [
                {reference: new RegExp(query, 'i')},
                {firstName: new RegExp(query, 'i')},
                {lastName: new RegExp(query, 'i')}
            ]
        };
        filter.hospital = request.hospital;
        Patient.find(filter)
        .sort('-referral.referralDate')
        .limit(20)
        .exec(function (err, patients) {
            if (err) {
                console.log(err);
            }
            response.json(patients);
        });
    },

    // add a parameter to say whether to return the whole set, the top n, or just the count.
    // maybe do the whole list by default, add a parameter now for count, and do n constraint later.
    list: function (request, response) {
        var requestFilterParameters = url.parse(request.url, true).query;
        var dateRangeFilterRequested = Boolean(requestFilterParameters.range && requestFilterParameters.rangeField);

        function getDateRangeFilter(dateRange, field) {
            var dateRangeFilter = {};
            dateRangeFilter[field] = {"$gte": new Date(dateRange.startDate), "$lt": new Date(dateRange.endDate)};
            return dateRangeFilter;
        }

        var patientDataFilter = JSON.parse(unescape(requestFilterParameters.filter));
        var patientDateRangeFilter = Boolean(dateRangeFilterRequested)
          ? getDateRangeFilter(JSON.parse(requestFilterParameters.range), requestFilterParameters.rangeField)
          : {};
        var loggedInUserHospitalFilter = {hospital: request.hospital};

        var filter = {$and: [patientDataFilter, patientDateRangeFilter, loggedInUserHospitalFilter]};

        Patient.find(filter, function (err, patients) {
            if (err) {
                console.log(err);
            }
            if (requestFilterParameters.countOnly) {
                response.json(patients.length);
            } else {
                response.json(patients);
            }
        });
    },

    single: function (request, response) {
        var filter = {_id: request.query.patientId};
        filter.hospital = request.hospital;

        Patient.findOne(filter, function (err, patient) {
            if (err) {
                console.log(err);
            }
            response.json(patient);
        });
    },

    save: function (request, response) {
        var patient = request.body.patient;
        patient.hospital = request.hospital;
        var id = patient._id;
        delete patient._id;
        delete patient.__v;

        if (!id) { // get some values quick before inserting
            id = new mongoose.Types.ObjectId();
            patient.reference = addReference(patient, function () {
                updateOrInsertPatient(id, patient, response);
            }, function (error) {
                console.log(error);
            });
        } else {
            delete patient.reference; // just to make sure it can't get updated
            updateOrInsertPatient(id, patient, response);
        }
    },

    suggestions: function (request, response) {
        var query = url.parse(request.url, true).query;
        var value = query.value;
        var text = query.text;

        var filter = {};
        filter[value] = new RegExp(text, 'i');
        filter.hospital = request.hospital;
        Patient.find(filter, function (err, patients) {
            if (err) {
                console.log(err);
            }
            var values = _.map(patients,
                function (n) {
                    var v = n;
                    _.forEach(value.split('.'), function (k) {
                        v = v[k];
                    });
                    return v;
                });
            response.json(values);
        });
    }
};
