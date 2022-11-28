$(function () {
    (function ($) {
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
                popupStyles: '',
                searchStyle: '',
                optionLabelStyle: '',
                listTemplate: '',
                listStyle: '',
                checkboxStyle: '',
                hideSelected: false,
                submitBtnStyle: '',
                badgeStyle: '',
                badgeColors: 'text-mild-green bg-mild-green-10 rounded-xl px-1.5 py-0.5',
                cancelBtnstyle: '',
                combineSelectorsTemplate: '',
                onItemCheck: function () { }
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
                            <div id="select-list" style="margin-top: 15px"></div>
                        </div>
                        </div>`;
                    $(searchArea).insertAfter(elem);
                    //Global variable declartion
                    var parent = $(elem).parent().closest('.multi-select');
                    var selectOptions = $(elem).children();
                    var closeEvent = 'click';
                    var dropDownList = [];
                    var selectedValues = [];
    
                    if(defaults.clickBtnTemplate != '') {
                        $(parent).find('#drop-btn').replaceWith(defaults.clickBtnTemplate);
                    }
    
                    if(defaults.searchTemplate != "") {
                        $(parent).find("#select-search").replaceWith(defaults.searchTemplate);
                    }
    
                    if(defaults.combineSelectorsTemplate != "") {
                        $(parent).find(".selected-toggle").replaceWith(defaults.combineSelectorsTemplate);
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
    
                    if (defaults.targetId == "") {
                        defaults.targetId = $(parent).find('#selected-ids');
                    }
    
                    if (defaults.listType != "checkbox") {
                        $(parent).find('.selected-toggle').remove();
                    }
    
                    if (defaults.submitBtn) {
                        var submitBtn = `<div style="margin-top: 15px; text-align: right;"><button class="${defaults.cancelBtnstyle}" id="custom-search-close">Cancel</button></button><button id='submit' class="${defaults.submitBtnStyle}">Submit</button></div>`
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
    
                            // Looping list Items
                            $.each(dropDownList, function (key, item) {
                                let id = Math.floor((Math.random() * 100000) + 1);
                                var elem = `<div class='list-option ${defaults.listStyle}' id="${id}">
                                        <input type="${defaults.listType}" class="${defaults.checkboxStyle}" style=${defaults.hideCheckBox?inputStyle:""} name="${defaults.listType}" value="${item.val}"/>
                                        <span class="option-name ${defaults.optionLabelStyle}">${item.name}</span></div>`;
    
                                if(defaults.listTemplate != '') {
                                    var elem = $.parseHTML(defaults.listTemplate);
                                    $(elem).attr("id", id);
                                    $(elem).find('input').attr({type: defaults.listType, name: defaults.listType, value: item.val});
                                    $(elem).find('.option-name').text(item.name);
                                    $(listElem).append(elem);
                                } else {
                                    $(listElem).append(elem);
                                }
    
                                if(item.addition) {
                                    if(item.addition != []) {
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
    
    
                            //Checkbox Click
                            $(parent).find('.list-option').on('click', function (event) {
                                $(parent).find('.list-option').removeClass('focused');
                                $(this).addClass('focused');
                                var value = $(this).find('input').val();
                                if (defaults.listType == 'radio') {
                                    selectedValues = [];
                                }
                                if ($(this).find('input')[0].checked == false) {
                                    $(this).addClass('selected');
                                    $(this).find('input').attr('checked', true);
                                    $(this).find('input').addClass('checked');
                                    selectedValues.push(value);
                                } else {
                                    selectedValues = $.grep(selectedValues, function (n) {
                                        return n != value;
                                    })
                                    $(this).removeClass('selected');
                                    $(this).find('input').removeAttr('checked');
                                    $(this).find('input').removeClass('checked');
                                }
                                $(elem).val(selectedValues);
                                if (!submitBtn) {
                                    defaults.onItemCheck.call(null, selectedValues);
                                    if (defaults.closeOnCheck) {
                                        defaults.closeMenu(parent, true);
                                    }
                                }
                                if(!defaults.hideSelected)
                                    showSelected();
                            })
    
    
                            //submitBtn Click
                            $(parent).find('#submit').on('click', function () {
                                defaults.onItemCheck.call(null, selectedValues);
                                defaults.closeMenu(parent, true);
                            })
    
                            //cancelBtn click
                            $(parent).find("#custom-search-close").on('click', function (){
                                defaults.closeMenu(parent, true);
                            })
                        }
                    }
    
                    //open lists
                    $(dropELem).on(defaults.opentType, function () {
                        defaults.openMenu(parent, true);
                        $(searchElem).focus();
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
                                    $(this).hide();
                                } else {
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
                                var badge = `<div class="selected-badge"><span>${item}</span><a class='close-icon' data-href="${item}">X</a></div>`;
                                $(defaults.targetId).append(badge);
                            })
                        }
    
                        $(parent).find('.close-icon').on('click', function () {
                            var val = $(this).attr('data-href');
                            if (val) {
                                selectedValues = $.grep(selectedValues, function (n) {
                                    return n != val;
                                })
                                $(parent).find('input[value=' + val + ']').prop("checked", false);
                                $(this).parent().remove();
                            }
                        })
                    }
    
                    // Check All
                    $(selectAll).on('click', function () {
                        selectedValues = [];
                        $(parent).find('.list-option input').each(function () {
                            var value = $(this).val();
                            $(this).parent().removeClass('selected');
                            $(this).parent().addClass('selected');
                            $(this).prop("checked", true);
                            selectedValues.push(value);
                        })
                        if(!defaults.hideSelected)
                            showSelected();
                    })
    
                    // Decheck All
                    $(deCheckElem).on('click', function () {
                        selectedValues = [];
                        $(parent).find('.list-option input').each(function () {
                            $(this).prop("checked", false);
                            $(this).removeClass("checked");
                            $(this).parent().removeClass('selected');
                            $(selectAll).prop("checked", false);
                        })
                        if(!defaults.hideSelected)
                            showSelected();
                    })
                }
            })
        }
    })(jQuery)
})