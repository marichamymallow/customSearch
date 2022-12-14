;(function ($) {
    $.fn.customSearch = function (options) {
        var defaults = $.extend({
           loading: function () {
                return new Promise((resolve, reject) => {
                    resolve("default resolve");
                });
            },
            selectElem: $(this),
            hideCheckBox: false,
            closeOnCheck: false,
            multiselect: true,
            maxListValElem: null,
            showDeselectOnly: false,
            deSelectTemplate: "",
            openMenu: function (elem, isPlugin) {
                if (isPlugin) {
                    if(!$(elem).hasClass("opened")) {
                        $(elem).addClass("opened");
                        $(elem).find('.multi-select-list-wrap').show();
                    }
                } else {
                    $(elem).show();
                }
            },
            closeMenu: function (elem, isPlugin) {
                if (isPlugin) {
                    $(elem).removeClass("opened");
                    $(elem).find('.multi-select-list-wrap').hide();
                } else {
                    $(elem).hide();
                }
            },
            clickBtnTemplate: "",
            searchTemplate: "",
            loadingTemplate: `<div class="loading">Loading...</div>`,
            submitBtn: false,
            listType: "checkbox",
            targetId: "",
            opentType: 'click',
            search: true,
            hideClearIcon: false,
            popupStyles: '',
            searchStyle: '',
            optionLabelStyle: '',
            listTemplate: '',
            listStyle: '',
            checkboxStyle: '',
            hideSelected: false,
            submitBtnStyle: '',
            badgeStyle: '',
            badgeColors: '',
            cancelBtnstyle: '',
            combineSelectorsTemplate: '',
            hideCombineSelectors: false,
            onItemCheck: function () { },
            defaultCheck: undefined,
            conCurrentSelect: null,
        }, options)

        return $(defaults.selectElem).each(function () {
            if (defaults.hasOwnProperty(options) == true) {
                var component = $(this);
                return defaults[options](component, false)
            } else {
                const inputStyle = "position:absolute;width:100%;height:100%;top:0;left:0;opacity:0"
                var elem = $(this);
                $(elem).wrap("<div class='multi-select'></div>");
                $(elem).css('display', 'none');
                var searchArea = `
                <div class='multi-select-inner'>
                    <button id='drop-btn'>Filter</button>
                    <div id="selected-ids"></div>
                    <div class="multi-select-list-wrap">
                        <input id="select-search" placeholder="Search..." />
                        <div class="selected-toggle">
                            <div class="select-all-btn">
                                <input type="checkbox" /><span>All</spa>
                            </div>
                            <button class="deselect-btn">None</button>
                        </div>
                        <div id="select-list" data-select-id="${$(elem).attr("id")}" style="margin-top: 15px"></div>
                    </div>
                    </div>`;
                $(searchArea).insertAfter(elem);
                //Global variable declartion
                var parent = $(elem).parent().closest('.multi-select');
                var selectOptions = $(elem).children();
                var closeEvent = 'click';
                var dropDownList = [];
                var selectedValues = [];
                var selectedTexts = [];

                if(defaults.clickBtnTemplate != '') {
                    $(parent).find('#drop-btn').replaceWith(defaults.clickBtnTemplate);
                }

                if($(elem).attr("initialValue") && $(elem).attr("initialValue").length>2) {
                    var val = $(elem).attr("initialValue");
                    $(elem).val(val);
                    $(parent).find('#drop-btn').text(val);
                }

                if(defaults.searchTemplate != "" && defaults.search) {
                    $(parent).find("#select-search").replaceWith(defaults.searchTemplate);
                }

                if(defaults.combineSelectorsTemplate != "" && !defaults.hideCombineSelectors) {
                    $(parent).find(".selected-toggle").replaceWith(defaults.combineSelectorsTemplate);
                }

                if(defaults.showDeselectOnly) {
                    $(parent).find(".select-all-btn").remove();
                }

                if(defaults.hideCombineSelectors) {
                    $(parent).find(".selected-toggle").remove();
                }

                if(!defaults.search) {
                    $(parent).find("#select-search").remove();
                }

                const listElem = $(parent).find('#select-list'),
                    searchElem = $(parent).find("#select-search"),
                    selectAll = $(parent).find('.select-all-btn'),
                    dropELem = $(parent).find('#drop-btn'),
                    popUp = $(parent).find('.multi-select-list-wrap'),
                    deCheckElem = $(parent).find('.deselect-btn');

                if(defaults.popupStyles != '') {
                    popUp.addClass(defaults.popupStyles);
                }

                if(defaults.searchStyle != '') {
                    searchElem.addClass(defaults.searchStyle);
                }

                $(parent).find('#select-list').prepend(defaults.loadingTemplate);

                if (defaults.listType != "checkbox") {
                    $(parent).find('.selected-toggle').remove();
                }

                if (defaults.submitBtn) {
                    var submitBtn = `<div style="margin-top: 15px; text-align: right; display: flex;"><button class="${defaults.cancelBtnstyle}" id="custom-search-close">Cancel</button></button><button id='submit' class="${defaults.submitBtnStyle}">Submit</button></div>`
                    $(parent).find('.multi-select-list-wrap').append(submitBtn);
                }

                //Intializing Element
                defaults.loading.call().then(
                    function (value) {
                        create(elem);
                    },
                    function (error) {
                        console.log(error);
                    }
                )

                function create() {
                    $(parent).find('.loading').remove();
                    if (selectOptions.length > 0) {
                        //Creating Select List UI
                        // Create List JSON
                        $(selectOptions).each(function () {
                            var obj  = {};
                            if($(this).attr("data-addition")) {
                                var addition = $(this).attr("data-addition");
                                obj.addition = addition;
                            }
                            if ($(this).html()) {
                                obj.name = $(this).html();
                                obj.val = $(this).val();
                                dropDownList.push(obj);
                            }
                        })
                        let initialValue = $(elem).attr("initialValue");
                        // Looping list Items
                        $.each(dropDownList, function (key, item) {
                            let id = Math.floor((Math.random() * 100000) + 1);
                            var elem = `<div class='list-option ${defaults.listStyle} ${initialValue?initialValue == item.val?"selected":"":""}' id="${id}" data-list-id="${item.val}">
                                    <input type="${defaults.listType}" class="${defaults.checkboxStyle} ${initialValue?initialValue == item.val?"checked":"":""}" style='${defaults.hideCheckBox?inputStyle:""}' name="${defaults.listType}" value="${item.val}" checked='${initialValue?initialValue == item.val?true:false:false}'/>
                                    <span class="option-name ${defaults.optionLabelStyle}">${item.name}</span></div>`;

                            if(defaults.listTemplate != '') {
                                var elem = $.parseHTML(defaults.listTemplate);
                                $(elem).attr({"id":id, "data-list-id": item.val});
                                $(elem).find('input').attr({type: defaults.listType, name: defaults.listType, value: item.val});
                                $(elem).find('.option-name').text(item.name);
                                $(listElem).append(elem);
                            } else {
                                $(listElem).append(elem);
                            }
                            if(item.addition) {
                                if(defaults.badgeColors != '') {
                                    var color = item.addition;
                                    var style = typeof defaults.badgeColors == 'string' ? defaults.badgeColors : defaults.badgeColors[color];
                                    let elem = `<div><span class="addition-badge ${style}">${color}</span></div>`;
                                    $('#'+id).append(elem);
                                }else {
                                    let additionData = item.addition.split(",");
                                    for(let i = 0; i<additionData.length;i++) {
                                        let elem = `<div><span class="addition-badge ${defaults.badgeStyle}">${additionData[i]}</span></div>`;
                                        $('#'+id).append(elem);
                                    }
                                }
                            }
                        })

                        if(defaults.defaultCheck) {
                            $.each(defaults.defaultCheck, function(key, item){
                                selectedValues.push(item);
                                selectedTexts.push(item);
                                $(parent).find(`input[value=${item}]`).attr("checked", true).addClass("checked");
                                $(parent).find(`input[value=${item}]`).closest('.list-option').addClass("selected");
                            })
                            $(elem).val(selectedValues);
                            defaults.onItemCheck.call(null, selectedValues, selectedTexts);
                        }


                        //Checkbox Click
                        $(parent).find('.list-option').on('click', function (event) {
                            $(parent).find('.list-option').removeClass('focused');
                            $(this).addClass('focused');
                            var value = $(this).find('input').val();
                            var text = $(this).find('.option-name').text();
                            if (defaults.listType == 'radio') {
                                selectedValues = [];
                                selectedTexts = [];
                            }
                            if(defaults.multiselect) {
                                if ($(this).find('input')[0].checked == false) {
                                    $(this).addClass('selected');
                                    $(this).find('input').attr('checked', true);
                                    $(this).find('input').addClass('checked');
                                    selectedValues.push(value);
                                    selectedTexts.push(text);
                                } else {
                                    selectedValues = $.grep(selectedValues, function (n) {
                                        return n != value;
                                    })
                                    selectedTexts = $.grep(selectedTexts, function (n) {
                                        return n != text;
                                    })
                                    $(this).removeClass('selected');
                                    $(this).find('input').removeAttr('checked');
                                    $(this).find('input').removeClass('checked');
                                }
                            }
                            else {
                                var listId = $(this).attr('data-list-id');
                                $(parent).find('.list-option.selected input').removeAttr('checked').removeClass('checked');
                                $(parent).find('.list-option.selected').removeClass('selected');
                                selectedValues = [];
                                selectedTexts = [];
                                $(this).addClass('selected');
                                $(this).find('input').attr('checked', true);
                                $(this).find('input').addClass('checked');
                                selectedTexts.push(text);
                                selectedValues.push(value);
                                if(defaults.conCurrentSelect) {
                                    $("[data-select-id="+defaults.conCurrentSelect+"]").find('.list-option').each(function(){
                                        if($(this).attr('data-list-id') == listId) {
                                            $(this).find('input').click();
                                        }
                                    })
                                }
                            }

                            if (!submitBtn) {
                                //Changing select tag value for AJAX call
                                $(elem).val(selectedValues);
                                defaults.onItemCheck.call(null, selectedValues, selectedTexts);
                                if (defaults.closeOnCheck) {
                                    defaults.closeMenu(parent, true);
                                }
                            }
                            if(!defaults.hideSelected)
                                showSelected();
                        })


                        //submitBtn Click
                        $(parent).find('#submit').on('click', function () {
                            $(elem).val(selectedValues);
                            defaults.onItemCheck.call(null, selectedValues, selectedTexts);
                            defaults.closeMenu(parent, true);
                        })

                        //cancelBtn click
                        $(parent).find("#custom-search-close").on('click', function (){
                            defaults.closeMenu(parent, true);
                        })
                    }
                }

                function stringToFloat(str) {
                    if(str) {
                        var tempVal = str.split(":");
                        if(tempVal.length>0) {
                            var tempString = tempVal[0] + "." + tempVal[1];
                            return parseFloat(tempString);
                        }
                    }
                }


                function removeMinimum(max) {
                    $(parent).find('.list-option').each(function() {
                        var listValue = stringToFloat($(this).find('.option-name').text());
                        if(listValue > max ) {
                            $(this).remove();
                        }
                    })
                }

                //open lists
                $(dropELem).on(defaults.opentType, function () {
                    // checking actual selected value
                    var existingValues = $(elem).val();
                    if(defaults.maxListValElem) {
                        if(parseInt($(defaults.maxListValElem).val()) >= 0) {
                            var maxListValue = stringToFloat($(defaults.maxListValElem).val());
                            removeMinimum(maxListValue);
                        }else {
                            return false;
                        }
                    }
                    if(typeof existingValues == 'string') {
                        existingValues = [];
                        existingValues.push($(elem).val())
                    }
                    $(parent).find('.list-option').each(function() {
                        var listId = $(this).attr('data-list-id');
                        if(existingValues && existingValues.length>0 && $.inArray(listId, existingValues) != -1) {
                            if($.inArray(listId, selectedValues) == -1) {
                                selectedValues.push(listId);
                            }
                            $(this).addClass('selected');
                            $(this).find('input').attr('checked', true);
                            $(this).find('input').addClass('checked');
                        }
                        else {
                            selectedValues = $.grep(selectedValues, function (n) {
                                return n != listId;
                            })
                            $(this).removeClass('selected');
                            $(this).find('input').removeAttr('checked');
                            $(this).find('input').removeClass('checked');
                        }
                    })
                    defaults.openMenu(parent, true);
                    $(searchElem).val("");
                    $(searchElem).focus();
                    $(parent).find('[data-hide=true]').each(function () {
                        $(this).removeAttr('data-hide');
                        $(this).removeAttr('style');
                    })
                })

                // Close list
                if (closeEvent == 'click') {
                    $(document).on(closeEvent, function (event) {
                        if (!($(event.target).closest(parent).length) && $(parent).hasClass("opened") && !($(event.target).hasClass('close-icon'))) {
                            defaults.closeMenu(parent, true);
                        }
                    });
                } else {
                    $(parent).on(closeEvent, function () {
                        if ($(this).hasClass("opened") && !defaults.submitBtn) {
                            defaults.closeMenu(parent, true);
                        }
                    })
                }

                //Keydown events
                $(document).on('keydown', function (event) {
                    if (event.key == "Enter" && $(parent).hasClass("opened")) {
                        var input = $(parent).find('.list-option.focused input');
                        if (input.length > 0) {
                            $(input).click();
                        }
                    }
                    if (event.key == "Escape" && $(parent).hasClass("opened")) {
                        $(parent).find('.list-option').removeClass('focused');
                        $(parent).find('#select-search').blur();
                        defaults.closeMenu(parent, true);
                    }
                    if (event.key == "ArrowDown" && $(parent).hasClass("opened")) {
                        if ($(parent).find('.list-option').hasClass('focused')) {
                            var ele = $(parent).find('.list-option.focused');
                            if($(ele).next('.list-option').length>0) {
                                $(ele).removeClass('focused');
                                $(ele).next('.list-option').addClass('focused');
                            }
                        } else {
                            $(parent).find('.list-option:first-child').addClass('focused');
                        }
                    }
                    if (event.key == "ArrowUp" && $(parent).hasClass("opened")) {
                        if ($(parent).find('.list-option').hasClass('focused')) {
                            var ele = $(parent).find('.list-option.focused');
                            if($(ele).prev('.list-option').length>0) {
                                $(ele).removeClass('focused');
                                $(ele).prev('.list-option').addClass('focused');
                            }
                        }
                    }
                });

                //Search Function
                $(searchElem).on('keyup', function () {
                    var keyWord = $(this).val().toLowerCase();
                    var selectHtml = $(parent).find('.list-option');
                    if (keyWord != "") {
                        $(selectHtml).each(function () {
                            if (!$(this).text().toLowerCase().includes(keyWord)) {
                                $(this).attr('data-hide',true);
                                $(this).hide();
                            } else {
                                $(this).removeAttr('data-hide');
                                $(this).show();
                            }
                        })
                    } else {
                        $(selectHtml).each(function () {
                            $(this).show();
                        })
                    }
                })

                //Selected elements
                function showSelected() {
                    $(defaults.targetId).empty();
                    if (selectedValues.length > 0) {
                        $.each(selectedValues, function (key, item) {
                            if(!defaults.hideClearIcon) {
                                var badge = `<div class="selected-badge"><span>${item}</span><a class='close-icon' data-href="${item}">X</a></div>`;
                                $(defaults.targetId).append(badge);
                            } else {
                                $(parent).find(defaults.targetId).text(selectedTexts[key]);
                            }
                        })
                    } else {
                        $(parent).find(defaults.targetId).text("");
                    }

                    $(parent).find('.close-icon').on('click', function () {
                        var val = $(this).attr('data-href');
                        if (val) {
                            selectedValues = $.grep(selectedValues, function (n) {
                                return n != val;
                            })
                            selectedTexts = $.grep(selectedTexts, function (n) {
                                return n != val;
                            })
                            $(parent).find('input[value=' + val + ']').prop("checked", false);
                            $(this).parent().remove();
                        }
                    })
                    if(!defaults.multiselect) {
                        defaults.closeMenu(parent, true);
                    }
                }

                // Check All
                $(selectAll).on('click', function () {
                    $(parent).find('.list-option input').each(function () {
                        if(!$(this).closest('.list-option').attr('data-hide') && !$(this).attr('checked')) {
                            var value = $(this).val();
                            var text = $(this).closest('.list-option').find('.option-name').text();
                            $(this).closest('.list-option').removeClass('selected');
                            $(this).closest('.list-option').addClass('selected');
                            $(this).attr('checked', true);
                            selectedValues.push(value);
                            selectedTexts.push(text);
                        }
                    })

                    //Changing select tag value for AJAX call
                    $(elem).val(selectedValues);

                    if(!defaults.hideSelected)
                        showSelected();
                })

                // Decheck All
                $(deCheckElem).on('click', function () {
                    if(!defaults.multiselect) {
                        var elem = $(parent).find('.list-option.selected');
                        if(elem.length > 0) {
                            $(elem).find('input').removeClass('checked').removeAttr('checked');
                            $(elem).removeClass('selected');
                            selectedValues = [];
                            selectedTexts = [];
                        }
                    }else {
                        $(parent).find('.list-option input').each(function () {
                            if(!$(this).closest('.list-option').attr('data-hide')) {
                                var val = $(this).val();
                                var text = $(this).closest('.list-option').find('.option-name').text();
                                selectedValues = $.grep(selectedValues, function (n) {
                                    return n != val;
                                })
                                selectedTexts = $.grep(selectedTexts, function (n) {
                                    return n != text;
                                })
                                $(this).removeAttr('checked');
                                $(this).removeClass("checked");
                                $(this).closest('.list-option').removeClass('selected');
                                $(selectAll).prop("checked", false);
                            }
                        })
                    }

                    if (!submitBtn) {
                        //Changing select tag value for AJAX call
                        $(elem).val(selectedValues);

                        defaults.onItemCheck.call(null, selectedValues, selectedTexts);
                    }

                    if(!defaults.hideSelected)
                        showSelected();
                })
            }
        })
    }
})(jQuery)
