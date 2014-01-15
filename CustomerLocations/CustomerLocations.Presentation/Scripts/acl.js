$(document).ready(function () {
    var baseUrl = "http://192.168.1.6";
    //var baseUrl = "http://localhost";
    var infoBoxes = { "successBox": "successBox", "warningBox": "warningBox", "errorBox": "errorBox" };
    var boxType = "";
    var infoIcons = { infoIcon: "infoIcon", successIcon: "successIcon", warningIcon: "warningIcon", errorIcon: "errorIcon" };
    var iconType = "";

    var modelState = {
        modelErrors: { errors: {}, warnings: {} },
        locNumValid: false,
        locNumUnique: true,
        countryValid: false,
        prefixValid: false,
        phoneNoValid: false,
        timespaneValid: false,
        isValid: function () {
            return (this.locNumValid && this.locNumUnique && this.countryValid && this.prefixValid && this.phoneNoValid && this.timespaneValid);
        },
        reset: function () {
            this.locNumValid = this.locNumUnique = this.countryValid = this.prefixValid = this.phoneNoValid = this.timespaneValid = false
        },

        getModelErrors: function (rowItems) {
            //obtain reference to individual row item

            var data = {
                LocNumber: $(rowItems).find(".locNumber"),
                Country: $(rowItems).find(".countries"),
                Prefix: $(rowItems).find(".prefixes"),
                Phone: $(rowItems).find(".locPhone"),
                Timespane: $(rowItems).find(".timespanes")
            };
            this.modelErrors.errors = {};
            this.modelErrors.warnings = {};
            //errors
            if (!modelState.locNumValid) {
                this.modelErrors.errors.locNumError = $(data.LocNumber).data('errormsg');
                console.log($(data.LocNumber).data('errormsg'));
            }
            if (!modelState.countryValid) {
                this.modelErrors.errors.countryError = $(data.Country).data('errormsg');
            }
            if (!modelState.prefixValid) {
                this.modelErrors.errors.prefixError = $(data.Prefix).data('errormsg');
            }
            if (!modelState.phoneNoValid) {
                this.modelErrors.errors.phoneError = $(data.Phone).data('errormsg');
            }
            if (!modelState.timespaneValid) {
                this.modelErrors.errors.timespaneError = $(data.Timespane).data('errormsg');
            }

            //warnings
            if (!modelState.locNumUnique) {
                this.modelErrors.warnings.locNumWarning = $(data.LocNumber).data('warningmsg');
            }
            //this.modelErrors.warnings.countryWarning = $(data.Country).data('warningmsg');
            //this.modelErrors.warnings.prefixWarning = $(data.Prefix).data('warningmsg');
            //this.modelErrors.warnings.phoneWarning = $(data.Phone).data('warningmsg');
            //this.modelErrors.warnings.timespaneWarning = $(data.LocNumber).data('warningmsg');

            //format messages i.e., create an ordered list of errors/warnings
            var msgs = $('<div/>');
            //errors
            var errors = $('<div/>');
            var errorsList = $("<ol/>");
            $.each(this.modelErrors.errors, function (key, value) {
                if (key != undefined && value != undefined)
                    $('<li/>').html(key + ':' + value).appendTo(errorsList);
            });
            $('<p>').text('List of errors').appendTo(errors);
            $(errors).append(errorsList);
            //warnings
            var warnings = $('<div/>');
            var warningList = $("<ol/>");
            $.each(this.modelErrors.warnings, function (key, value) {
                if (key != undefined && value != undefined)
                    $('<li/>').html(key + ':' + value).appendTo(warningList);
            });

            $('<p>').text('List of warnings').appendTo(warnings);
            $(warnings).append(warningList);

            //wrap both
            $(msgs).append(errors);
            $(msgs).append(warnings);
            //console.log(msgs[0].outerHTML);
            console.log(
            'getModelErrors',
            modelState.locNumValid,
            modelState.locNumUnique,
            modelState.countryValid,
            modelState.prefixValid,
            modelState.phoneNoValid,
            modelState.timespaneValid
        );
            return msgs[0].outerHTML;
        }
    };

    $("body").on('click', '.btnSave', function () {


        var rowItems = $(this).parents('tr').children();
        var currentRow = $(rowItems).parent();
        validateAll(rowItems);
        if (!modelState.isValid()) {
            console.log("Model state is not valid");
            //update the errormsg associated with save button and display to the user
            var errormsg = "Please corect the following:";
            errormsg += modelState.getModelErrors(rowItems);
            $(this).data('errormsg', errormsg);
            displayInfoIcon(this, infoIcons.errorIcon);
            displayInfoBox(this, infoBoxes.errorBox);
            return false;
        }

        //url = $(currentRow).attr('class') == 'oldRecord' ? "http://localhost/locations/home/update" : "http://localhost/locations/home/create";

        var currentBtn = $(this);
        var data = {
            LocNumber: $(rowItems[0]).find("input").val(),
            Country: $(rowItems[1]).find("option").filter(":selected").text(),
            Prefix: $(rowItems[2]).find("option").filter(":selected").text(),
            Phone: $(rowItems[3]).find("input").val(),
            Timespane: $(rowItems[4]).find("option").filter(":selected").text(),
            Enabled: $(rowItems[5]).find("input").is(':checked')
        };


        $.ajax({
            url: baseUrl + "/locations/home/create",
            type: "Post",
            data: data,
            beforeSend: function () {
                showLoader(currentBtn);
            },
            success: function (response) {
                if (response.isSuccess == "true") {
                    modelState.reset();
                    showSuccess(currentBtn);
                    updateRowClass(currentRow);
                    addNewRow(response.row);

                } else {
                    //need to provide more details about the error???
                    showError(currentBtn);
                }
            },
            error: function (xhr, thrownError) {
                //need to provide more details about the error???
                alert(xhr.status + ' ' + thrownError);
                showError(currentBtn);
            }
        });
        //console.log(data.LocNumber + " " + data.Country + " " + data.Prefix + " " + data.Phone + " " + data.Timespane + " " + data.Enabled);
    });

    $("body").on('click', '.infoIcon', function () {
        displayInfoBox(this);
    });

    $('body').on('click', '.closeIcon', function () {
        hideInfoBox();
    });

    $('body').on('mouseleave focusout', '#infoBox', function () {
        hideInfoBox();
    });

    $('body').on('click', '#_alreadyExists', function () {
        hideInfoBox();
        scrollToRecord($(this).data("recordid"));

    });

    $('body').on('focus', 'tr', function () {

        $(this).siblings().css('background', '');
        $(this).css('background', 'navajowhite');
    });

    function scrollToRecord(recordId) {
        //add some effects to draw user attention
        console.log('scrollToRecord executed');
        $('html, body').animate({ scrollTop: $("#locNum" + recordId).offset().top }, 'fast');
        //$("#locNum" + recordId).parents("tr").effect("highlight", "slow");
        $("#locNum" + recordId).parents("tr").focus();
        $("#locNum" + recordId).focus();
    }

    $("body").on('change', '.locInput', function () {

        //define some important variables
        var rowItems = $(this).parents("tr").children();
        var saveBtn = $(rowItems).find(".btnSave");
        var prefixCombo, countriesCombo;

        if (!$(saveBtn).is(":visible")) {
            showSaveButton(saveBtn);
        }

        //set country and its prefix simultaneously
        if ($(this).hasClass('countries') || $(this).hasClass('prefixes')) {
            prefixCombo = $(rowItems).find(".prefixes");
            countriesCombo = $(rowItems).find(".countries");
            setCountryPrefix(prefixCombo, countriesCombo, this);
            validateCountryPrefixTimespane(prefixCombo);
            validateCountryPrefixTimespane(countriesCombo);
        } else if ($(this).hasClass('timespanes')) {
            validateCountryPrefixTimespane(this);
        }

    });

    $('body').on('click', '.locInput', function () {
        //console.log($(this).parents().hasClass('newRecord'));
    });

    $('body').on('keyup focusout', '.locInput', function (e) {

        if ($(this).hasClass('locNumber')) {
            validateLocNumber(this);

        } else if ($(this).hasClass('locPhone')) {
            validatePhoneNumber(this);

        }
        //searching is costly, so validate duplicates only when there is a focusout
        if (e.type == 'focusout') {
            if ($(this).hasClass('locNumber')) {
                validateLocNoUnique(this);
            } else if ($(this).hasClass('locPhone')) {
                validatePhoneAlreadyExists(this);
            }
        }

    });

    function validateCountryPrefixTimespane(item) {
        var itemValue = $(item).val();
        if ((itemValue == undefined) || (itemValue == 'select')) {
            displayInfoIcon(item, infoIcons.errorIcon);
            return false;
        } else {
            hideInfoIcon(item);
            return true;
        }
    }


    function validatePhoneNumber(item) {
        var phNumber = $(item).val();

        if (!phNumber.match(/^(\d{8}|\d{9}|\d{10})$/)) {
            displayInfoIcon(item, infoIcons.errorIcon);
            //displayInfoBox(item, infoBoxes.errorBox);
            return false;
        } else {
            hideInfoIcon(item);
            //hideInfoBox();
            return true;
        }
    }

    function validatePhoneAlreadyExists(item) {
        var itemValue = $(item).val();
        var existingItem = $('input[value="' + itemValue + '"]').not($(item)).val();
        if (!(existingItem === undefined)) {
            //phone number already exists, display a warning
            displayInfoIcon(item, infoIcons.warningIcon);
        } else {
            hideInfoIcon(item);
        }
    }

    function validateLocNumber(item) {
        var locNumber = $(item).val();

        if (!locNumber.match(/^(\d{4}|\d{3}|\d{2}|\d{1})$/) || locNumber <= 0) {
            displayInfoIcon(item, infoIcons.errorIcon);
            //displayInfoBox(item, infoBoxes.errorBox);
            return false;
        } else {
            hideInfoIcon(item);
            //hideInfoBox();
            return true;
        }
    }


    function validateLocNoUnique(item) {

        if ($(item).parents('tr').hasClass('newRecord')) {
            $.ajax({
                url: baseUrl + "/avis/api/locations",
                type: "Get",
                data: { id: $(item).val() },

                beforeSend: function () {
                    console.log("validating...");
                },
                success: function (data) {
                    console.log("Record already exists");
                    console.log(data.LocNumber, data.Country, data.Prefix, data.Phone, data.Timespane);

                    var msg = $(item).data("uniqueiderror");
                    msg += '<a id="_alreadyExists" data-recordid="' + $(item).val() + '" class="btn btn-primary btn-xs">See here</a>';

                    $(item).data("warningmsg", msg);

                    displayInfoIcon(item, infoIcons.warningIcon);
                    //displayInfoBox(item, infoBoxes.warningBox);
                    modelState.locNumUnique = false;
                },
                error: function (a, b, c) {
                    //hideInfoBox();
                    hideInfoIcon(this);
                    console.log("Record not found on server");
                    modelState.locNumUnique = true;
                }
            });
        } else if ($(item).parents('tr').hasClass('oldRecord')) {
            //if its an old record, we assume its already verified and its unique.
            modelState.locNumUnique = true;
        }


    }

    function validateAll(rowItems) {
        //modelState.reset();
        var data = {
            LocNumber: $(rowItems).find(".locNumber"),
            Country: $(rowItems).find(".countries"),
            Prefix: $(rowItems).find(".prefixes"),
            Phone: $(rowItems).find(".locPhone"),
            Timespane: $(rowItems).find(".timespanes")
        };
        modelState.locNumValid = validateLocNumber(data.LocNumber);
        if (!modelState.locNumUnique) {
            validateLocNoUnique(data.LocNumber);
        }
        modelState.countryValid = validateCountryPrefixTimespane(data.Country);
        modelState.prefixValid = validateCountryPrefixTimespane(data.Prefix);
        modelState.phoneNoValid = validatePhoneNumber(data.Phone);
        validatePhoneAlreadyExists();
        modelState.timespaneValid = validateCountryPrefixTimespane(data.Timespane);
        //console.log(
        //    'validateAll',
        //    modelState.locNumValid,
        //    modelState.locNumUnique,
        //    modelState.countryValid,
        //    modelState.prefixValid,
        //    modelState.phoneNoValid,
        //    modelState.timespaneValid
        //);
    }

    function displayInfoIcon(item, icon) {

        iconType = icon;

        $(item).siblings(".infoIcon").attr("class", "infoIcon").addClass(icon);
        $(item).siblings(".infoIcon").show();
    }

    function hideInfoIcon(item) {
        $(item).siblings(".infoIcon").attr("class", "infoIcon");
        $(item).siblings(".infoIcon").hide();
        //if ($('#infoBox').is(":visible")) {
        //    console.log('infobox is visible?');
        //    hideInfoBox();
        //}
    }

    function displayInfoBox(item, box) {

        var msg = "";
        var position;
        var itemClass = $(item).attr('class').split(' ')[1];
        //console.log(itemClass);
        //console.log(box);
        //handle icon clicks. These icons are displayed near the input items upon errors/warnings
        if (box == undefined) {
            //find the attached input item with the icon
            item = $(item).siblings(".locInput")[0];
            if (itemClass == "warningIcon") {
                boxType = infoBoxes.warningBox;
                msg = $(item).data("warningmsg");
            } else if (itemClass == "errorIcon") {
                boxType = infoBoxes.errorBox;
                msg = $(item).data("errormsg");
            } else if (itemClass == "successIcon") {
                boxType = infoBoxes.successBox;
                msg = $(item).data("successmsg");
            }
        }
            //handle errors/warnings on input items (on text-change/focus-lost)
        else {
            boxType = box;
            if (boxType == infoBoxes.successBox) {
                msg = $(item).data("successmsg");
            } else if (boxType == infoBoxes.warningBox) {
                msg = $(item).data("warningmsg");
            } else if (boxType == infoBoxes.errorBox) {
                msg = $(item).data("errormsg");
            }
        }

        //calculate a position for the infoBox
        position = $(item).offset();
        position.top = position.top - item.offsetHeight / 2;
        position.left = position.left + item.offsetWidth;


        $(".inn-b").attr("class", "inn-b").addClass(boxType);
        $(".infoMessage").html(msg);
        //$('#infoBox').css(position).fadeIn('fast');
        $('#infoBox').css(position).show();
        $('#infoBox').focus();
    }

    function hideInfoBox() {
        //restore to original class
        $("div.inn-b").attr("class", "inn-b");
        //$('#infoBox').fadeOut('fast');
        $('#infoBox').hide();
    }

    $('body').on('keyup', function (e) {
        //when escape key is pressed, hide any displayed info-boxes
        if (e.keyCode == 27) {
            hideInfoBox();
        }
    });


    function setCountryPrefix(prefixCombo, countriesCombo, target) {
        var country = "Country";
        var prefix = "Prefix";
        if ($(target).hasClass("countries")) {
            country = $(countriesCombo).val();
            if (country == "select") {
                prefix = "select";
            } else if (country == "Norway") {
                prefix = "+47";
            } else if (country == "Sweden") {
                prefix = "+46";
            } else if (country == "Denmark") {
                prefix = "+45";
            }
        } else if ($(target).hasClass("prefixes")) {
            prefix = $(prefixCombo).val();
            if (prefix == "+47") {
                country = "Norway";
            } else if (prefix == "+46") {
                country = "Sweden";
            } else if (prefix == "+45") {
                country = "Denmark";
            }
        }
        $(prefixCombo).val(prefix);
        $(countriesCombo).val(country);

    }

    function showLoader(button) {
        $(button).parent().siblings(".loader").show();
        $(button).hide();
        $(button).parent().siblings(".failure").hide();
        $(button).parent().siblings(".accept").hide();
    }

    function showError(button) {
        $(button).parent().siblings(".loader").hide();
        $(button).hide();
        $(button).parent().siblings(".failure").show();
        $(button).parent().siblings(".accept").hide();
    }

    function showSuccess(button) {
        $(button).parent().siblings(".loader").hide();
        $(button).hide();
        $(button).parent().siblings(".failure").hide();
        $(button).parent().siblings(".accept").show();
    }

    function showSaveButton(button) {
        $(button).parent().siblings(".loader").hide();
        $(button).show();
        $(button).parent().siblings(".failure").hide();
        $(button).parent().siblings(".accept").hide();
    }

    function addNewRow(row) {
        if (!$('#locs').find(".newRecord").html()) {
            //alert("Not Found");
            $("#locs tr:last").after(row);
        } else {
            //alert("Found" + "\n" + $('body').find(".newRecord").html());

        }
    }

    function updateRowClass(row) {
        $(row).attr('class', 'oldRecord');
        var locNum = $(row).find('.locNumber');
        $(locNum).attr('id', 'locNum' + $(locNum).val());
        $(locNum).attr('readonly', 'readonly');
    }

});
