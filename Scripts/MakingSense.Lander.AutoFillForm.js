function autoFillForm(iframeUrl) {
    var isIE7OrLower = /(MSIE\ [0-7]\.\d+)/.test(navigator.userAgent);

    function fillForm(visitor) {
        var $inputs = $('#lander-form input');

        $inputs.each(function (index) {
            var cleanId = $(this).attr('id');
            if (cleanId) {
                var cleanInput = cleanId.toUpperCase().replace(/\s+|-/g, '').trim();

                if (visitor.name && cleanInput.includes('NAME') && !cleanInput.includes('FIRSTNAME') && !cleanInput.includes('LASTNAME')) {
                    $(this).val(isIE7OrLower ? visitor.name[1] : visitor.name);
                    $(this).removeClass("requiredInput");
                    $(this).valid();
                }
                if (visitor.firstName && (cleanInput.includes('FIRSTNAME') || cleanInput.includes('NOMBRE'))) {
                    $(this).val(isIE7OrLower ? visitor.firstName[1] : visitor.firstName);
                    $(this).removeClass("requiredInput");
                    $(this).valid();
                }
                if (visitor.lastName && (cleanInput.includes('LASTNAME') || cleanInput.includes('APELLIDO'))) {
                    $(this).val(isIE7OrLower ? visitor.lastName[1] : visitor.lastName);
                    $(this).removeClass("requiredInput");
                    $(this).valid();
                }
                if (visitor.phone && cleanInput.includes('PHONE')) {
                    $(this).val(isIE7OrLower ? visitor.phone[1] : visitor.phone);
                    $(this).removeClass("requiredInput");
                    $(this).valid();
                }
                if (visitor.email && cleanInput.includes('EMAIL')) {
                    $(this).val(isIE7OrLower ? visitor.email[1] : visitor.email);
                    $(this).removeClass("requiredInput");
                    $(this).valid();
                }
            }
        });
    }

    function setVisitorValues(name, firstName, lastName, phone, email) {
        getVisitorValues(function (visitor) {
            visitor = { name: (name ? name : (visitor ? visitor.name : null)), firstName: (firstName ? firstName : (visitor ? visitor.firstName : null)), lastName: (lastName ? lastName : (visitor ? visitor.lastName : null)), phone: (phone ? phone : (visitor ? visitor.phone : null)), email: (email ? email : (visitor ? visitor.email : null)) };
            visitor = removeEmptyAttributes(visitor);

            if (typeof (Storage) !== "undefined") {
                xdLocalStorage.setItem("visitor", JSON.stringify(visitor));
                var cookieValue = ['visitor', '=', JSON.stringify(visitor), '; expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/'].join('');
                document.cookie = cookieValue;
            } else {
                if (isIE7OrLower) {
                    document.cookie = "visitorName=" + name + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
                    document.cookie = "visitorFirstName=" + firstName + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
                    document.cookie = "visitorLastName=" + lastName + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
                    document.cookie = "visitorPhone=" + phone + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
                    document.cookie = "visitorEmail=" + email + "; expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
                } else {
                    var cookieValue = ['visitor', '=', JSON.stringify(visitor), '; expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/'].join('');
                    document.cookie = cookieValue;
                }
            }
        });
    }

    function removeEmptyAttributes(visitor) {
        for (var i in visitor) {
            if (visitor[i] === null || visitor[i] === undefined) {
                delete visitor[i];
            }
        }
        return visitor;
    }

    function getVisitorValues(callback) {
        if (typeof (Storage) !== "undefined") {
            xdLocalStorage.getItem("visitor", function (data) {
                callback(JSON.parse(data.value));
            });
        }

        var cookieAdded = readCookie();
        if (cookieAdded) {
            return callback(cookieAdded);
        }

        return null;
    }

    function readCookie() {
        if (isIE7OrLower) {
            var name = document.cookie.match(new RegExp("visitorName" + '=([^;]+)'));
            var first = document.cookie.match(new RegExp("visitorFirst" + '=([^;]+)'));
            var last = document.cookie.match(new RegExp("visitorLast" + '=([^;]+)'));
            var phone = document.cookie.match(new RegExp("visitorPhone" + '=([^;]+)'));
            var email = document.cookie.match(new RegExp("visitorEmail" + '=([^;]+)'));

            var visitorCookie = { name: name, firstName: first, lastName: last, phone: phone, email: email };

            if (!!visitorCookie) {
                return visitorCookie;
            } else {
                return null;
            }
        } else {
            var result = document.cookie.match(new RegExp("visitor" + '=([^;]+)'));
            result = result && JSON.parse(result[1]) ? JSON.parse(result[1]) : null;
            return result;
        }
    }

    $(function () {
        xdLocalStorage.init(
        {
            iframeUrl: iframeUrl,
            initCallback: function () {
                getVisitorValues(function (visitor) {
                    if (visitor) {
                        fillForm(visitor);
                    }
                });
            }
        });

        if (!String.prototype.includes) {
            String.prototype.includes = function () {
                'use strict';
                return String.prototype.indexOf.apply(this, arguments) !== -1;
            };
        }

        var name, firstName, lastName, phone, email;

        $("#lander-form a[target='_self']").click(function () {
            var $inputs = $('#lander-form input');
            $inputs.each(function (index) {
                var cleanId = $(this).attr('id');
                if (cleanId) {
                    var cleanInput = cleanId.toUpperCase().replace(/\s+|-/g, '').trim();

                    if (cleanInput.includes('NAME') && !cleanInput.includes('FIRSTNAME') && !cleanInput.includes('LASTNAME')) {
                        name = $(this).val();
                    }
                    if (cleanInput.includes('FIRSTNAME') || cleanInput.includes('NOMBRE')) {
                        firstName = $(this).val();
                    }
                    if (cleanInput.includes('LASTNAME') || cleanInput.includes('APELLIDO')) {
                        lastName = $(this).val();
                    }
                    if (cleanInput.includes('PHONE')) {
                        phone = $(this).val();
                    }
                    if (cleanInput.includes('EMAIL')) {
                        email = $(this).val();
                    }
                }
            });
            setVisitorValues(name, firstName, lastName, phone, email);
        });

    });

};