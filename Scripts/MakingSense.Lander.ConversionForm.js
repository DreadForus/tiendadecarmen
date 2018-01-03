function configConversionForm(options) {
    var landingPageUrl = window._lander_landingPageUrl || "";

    function getConfirmationPageURL() {
        if (typeof _lander_fbPageId != "undefined")
            return ["/Lander/Home/DisplayFacebookTabConfirmation?fbPageId=", _lander_fbPageId].join("");
        return [landingPageUrl, "/confirmation"].join("");
    }

    jQuery.fn.reset = function () {
        $(this).each(function () {
            this.reset();
        });
    }
    //EVENT BINDING
    $(function () {
        window.formProcessing = false;
        var fbFormSubmitionRedirection = ((typeof _lander_fbPageId != "undefined") && (options.modelButton.action == "goToUrl"));
        if (fbFormSubmitionRedirection)
            $("#" + options.modelId + " form a").attr("data-url", $("#" + options.modelId + " form a").attr("href"));
        $("#" + options.modelId + " form a")
        .attr("href", "")
        .click(function (event) {
            if (!fbFormSubmitionRedirection || !$("#" + options.modelId + " form").valid())
                event.preventDefault();
            else if (fbFormSubmitionRedirection) {
                $("#" + options.modelId + " form a")
                .attr("target", "_blank")
                .attr("href", $("#" + options.modelId + " form a").attr("data-url"));
            }
            if (!window.formProcessing) {
                $("#" + options.modelId + " form").submit();
            }
            $(".required.error").removeClass("requiredInput").addClass("requiredInputError");
            $(".optionsRequired input.error").parents(".optionsRequired").removeClass("itemRequiredInput").addClass("itemRequiredInputError");
            $(".email.error").each(function (index) {
                if ($(this).val() != "") {
                    $(this).removeClass("requiredInput").removeClass("requiredInputError").addClass("emailInputError");
                }

            });
            $('.emailWarning').qtip({
                content: "Invalid Email",
                style: {
                    color: '#8D9BA3',
                    background: "#FFFFFF",
                    textAlign: 'center',
                    fontSize: '12px',
                    border: {
                        width: 1,
                        color: '#EDEDED'
                    },
                    tip: {
                        corner: 'bottomMiddle',
                        size: {
                            x: 12,
                            y: 6
                        }
                    },
                    name: 'dark'
                },
                position: {
                    corner: {
                        target: 'topMiddle',
                        tooltip: 'bottomMiddle'
                    },
                    adjust: {
                        y: -2
                    }
                },
                show: {
                    when: 'mouseover',
                    effect: {
                        length: 200
                    },
                    delay: 100
                },
                hide: {
                    when: 'mouseout',
                    fixed: true,
                    delay: 1000
                }
            });

            $(".number.error").each(function (index) {
                if ($(this).val() != "") {
                    $(this).removeClass("requiredInput").removeClass("requiredInputError").addClass("numberInputError");
                }
            });
            $('.numberWarning').qtip({
                content: "Invalid Format",
                style: {
                    color: '#8D9BA3',
                    background: "#FFFFFF",
                    textAlign: 'center',
                    fontSize: '12px',
                    border: {
                        width: 1,
                        color: '#EDEDED'
                    },
                    tip: {
                        corner: 'bottomMiddle',
                        size: {
                            x: 12,
                            y: 6
                        }
                    },
                    name: 'dark'
                },
                position: {
                    corner: {
                        target: 'topMiddle',
                        tooltip: 'bottomMiddle'
                    },
                    adjust: {
                        y: -2
                    }
                },
                show: {
                    when: 'mouseover',
                    effect: {
                        length: 200
                    },
                    delay: 100
                },
                hide: {
                    when: 'mouseout',
                    fixed: true,
                    delay: 1000
                }
            });


        });
        //FORM SUBMISSION
        $("#" + options.modelId + " form")
        .validate({
            focusInvalid: false
        });
        $("#" + options.modelId + " form")
        .submit(function () {
            $(".selectRequiredImgContainer").each(function () {
                if (!$(this).hasClass("valid"))
                    $(this).addClass("error").addClass("errorSubmited");
            });
            if ($(".selectRequiredImgContainer.error").length)
                return false;

            if (($("#" + options.modelId + " form input, #" + options.modelId + " form textarea").size() == $("#" + options.modelId + " form input.valid, #" + options.modelId + " form textarea.valid").size()) || ($("#" + options.modelId + " form input.error, #" + options.modelId + " form textarea.error").size() == 0)) {
                $("#" + options.modelButton.id).addClass("buttonLoading");
                window.formProcessing = true;
                if (options.isConversion && typeof _lrx_sendEvent === "function") {
                    _lrx_sendEvent('conversion', 'LANDER-FORM-' + 'Form Submissions');
                }
                $.ajax({
                    type: "POST",
                    url: "/Lander/Home/ConversionFormSubmitted",
                    data: $("#" + options.modelId + " form").serialize(),
                    complete: function () {
                        if (options.modelButton.action == "showMessage" || fbFormSubmitionRedirection) {
                            $("#" + options.modelButton.id).removeClass("buttonLoading");
                            if (!fbFormSubmitionRedirection) {
                                $("#" + options.modelButton.id).addClass("buttonMessage");
                                $("#" + options.modelButton.id + " a").css("cursor", "default");
                                var originalButtonText = $("#" + options.modelButton.id + " span").text();
                                $("#" + options.modelButton.id + " span").text(options.modelButton.message);
                                setTimeout(function () {
                                    $("#" + options.modelButton.id).removeClass("buttonMessage");
                                    $("#" + options.modelButton.id + " span").text(originalButtonText);
                                    $("#" + options.modelButton.id + " a").css("cursor", "pointer");
                                }, 3000);
                            }
                        } else if (options.modelButton.action == "confirmationPage") {
                            window.location = getConfirmationPageURL();
                        } else if (options.modelButton.url != "") {
                            window.location = (options.modelButton.url);
                        } else if (!fbFormSubmitionRedirection) {
                            $("#" + options.modelId + " form input, #" + options.modelId + " form textarea").val("");
                        }
                        $("#" + options.modelId + " form").reset();
                        $("#" + options.modelId + " form .required").addClass("requiredInput");
                        $("select.required").parent().find(".selectRequiredImgContainer").removeClass("error").removeClass("valid");
                        setTimeout(function () { window.formProcessing = false; }, 3000);
                    }
                });

            }
            return false;
        });
        //REQUIRED INPUTS
        if ($(".required").length) {
            $(".required").each(function (index) {
                $(this).rules("add", {
                    required: true,
                    messages: {
                        required: ""
                    }
                });
            });
            $(".required").addClass("requiredInput");
            $(".required").focus(function () {
                $(this).removeClass("requiredInput");
                $(this).removeClass("requiredInputError");
            });
            $(".required").blur(function () {
                if ($(this).hasClass("error")) {
                    $(this).removeClass("requiredInput");
                    $(this).addClass("requiredInputError");
                } else {
                    if ($(this).val() == "") {
                        $(this).addClass("requiredInput");
                    }
                }
            });
        }
        //EMAIL INPUT
        if ($(".email").length) {
            $(".email").each(function (index) {
                $(this).rules("add", {
                    email: true,
                    messages: {
                        email: "<a class='emailWarning'></a>",
                        required: ""
                    }
                });
            })
            .focus(function () {
                $(this).removeClass("requiredInput");
                $(this).removeClass("requiredInputError");
                $("label[for='" + $(this).attr("Id") + "']").hide();
                $("label[for='" + $(this).attr("Id") + "'] a").qtip("hide");
            })
            .blur(function () {
                if ($(this).hasClass("error")) {
                    if (!($(this).val() == "" && $(this).hasClass("required"))) {
                        $(this).removeClass("requiredInputError");
                        $("label[for='" + $(this).attr("Id") + "']").show();
                        $('.emailWarning').qtip({
                            content: "Invalid Email",
                            style: {
                                color: '#8D9BA3',
                                background: "#FFFFFF",
                                textAlign: 'center',
                                fontSize: '12px',
                                border: {
                                    width: 1,
                                    color: '#EDEDED'
                                },
                                tip: {
                                    corner: 'bottomMiddle',
                                    size: {
                                        x: 12,
                                        y: 6
                                    }
                                },
                                name: 'dark'
                            },
                            position: {
                                corner: {
                                    target: 'topMiddle',
                                    tooltip: 'bottomMiddle'
                                },
                                adjust: {
                                    y: -2
                                }
                            },
                            show: {
                                when: 'mouseover',
                                effect: {
                                    length: 200
                                },
                                delay: 100
                            },
                            hide: {
                                when: 'mouseout',
                                fixed: true,
                                delay: 1000
                            }
                        });
                    }
                } else {
                    $(this).removeClass("emailInputError");
                }
            });
        }
        //NUMBER INPUT
        if ($(".number").length) {
            $(".number").each(function (index) {
                $(this).rules("add", {
                    number: true,
                    messages: {
                        number: "<a class='numberWarning'></a>",
                        required: ""
                    }
                });
            })
            .focus(function () {
                $(this).removeClass("requiredInput");
                $(this).removeClass("requiredInputError");
                $(this).removeClass("numberInputError");
                $("label[for='" + $(this).attr("Id") + "']").hide();
                $("label[for='" + $(this).attr("Id") + "'] a").qtip("hide");
            })
            .blur(function () {
                if ($(this).hasClass("error")) {
                    if (!($(this).val() == "" && $(this).hasClass("required"))) {
                        $(this).removeClass("requiredInputError")
                        $("label[for='" + $(this).attr("Id") + "']").show()
                        $('.numberWarning').qtip({
                            content: "Invalid Format",
                            style: {
                                color: '#8D9BA3',
                                background: "#FFFFFF",
                                textAlign: 'center',
                                fontSize: '12px',
                                border: {
                                    width: 1,
                                    color: '#EDEDED'
                                },
                                tip: {
                                    corner: 'bottomMiddle',
                                    size: {
                                        x: 12,
                                        y: 6
                                    }
                                },
                                name: 'dark'
                            },
                            position: {
                                corner: {
                                    target: 'topMiddle',
                                    tooltip: 'bottomMiddle'
                                },
                                adjust: {
                                    y: -2
                                }
                            },
                            show: {
                                when: 'mouseover',
                                effect: {
                                    length: 200
                                },
                                delay: 100
                            },
                            hide: {
                                when: 'mouseout',
                                fixed: true,
                                delay: 1000
                            }
                        });
                    }
                } else {
                    $(this).removeClass("numberInputError");
                }
            });
        }
        //CHECKBOXES/RADIOBUTTONS
        if ($(".optionsRequired").length) {
            $(".optionsRequired input").each(function (index) {
                $(this).rules("add", {
                    required: true,
                    messages: {
                        required: ""
                    }
                });
                $(this).click(function (index) {
                    var container = $(this).parents(".optionsRequired");
                    if ($(this).valid()) {
                        $(container).removeClass("itemRequiredInputError").addClass("itemRequiredInput");
                    } else {
                        $(container).addClass("itemRequiredInputError");
                    }
                });
            });
            $(".optionsRequired").addClass("itemRequiredInput");
        }
        //DROPDOWNS
        $("#" + options.modelId + " select.required").change(function () {
            if ($(this).val() == "") {
                $(this).parent().find(".selectRequiredImgContainer").removeClass("valid").addClass("error");
            } else
                $(this).parent().find(".selectRequiredImgContainer").removeClass("error").addClass("valid");
        })
        .focus(function () {
            $(this).parent().find(".selectRequiredImgContainer").removeClass("error").addClass("valid");
        })
        .focusout(function () {
            $(this).change();
        });

    });
}