(function ($) {
    $.fn.multiSelect = function(options) {
        var defaults = $.extend({
            selectELem: $(this),
            parent: $(this),
            listElem: $(this),
            listType: "checkbox",
            dropDownList: [],
            onSelctInput: function(e){}
        }, options)
        var optionList = defaults.selectELem.html();
        if(optionList.length > 0) {
            $(optionList).each(function(){
                if($(this).html()) {
                    var obj = {
                        'name': $(this).html(),
                        'val': $(this).val()
                    }
                    defaults.dropDownList.push(obj);
                }
            })
            //Creating Select List UI
            var searchArea = `<div class="multi-select">
                                <div class='multi-select-inner'>
                                    <input type="text" id="select-search" placeholder="search.."/>
                                    <div class="multi-select-list-wrap">
                                        <div class="selected-toggle">
                                            <div class="select-all-btn">
                                                <input type="checkbox" /><span>All</spa>
                                            </div>
                                            <button class="deselect-btn">None</button>
                                        </div>
                                        <div id="select-list"></div>
                                    </div>  
                                </div>
                            </div>`;

            $(defaults.selectELem).wrap(searchArea);
            defaults.parent = $(this).parent().closest('.multi-select');
            defaults.listElem = $(defaults.parent).find("#select-list");
            $.each(defaults.dropDownList, function(key, item) {
                var elem = `<div class='list-option'><input type="${defaults.listType}" value="${item.val}"/><span>${item.name}</span></div>`;
                $(defaults.listElem).append(elem);
            })

            var searchElem = $(defaults.parent).find("#select-search");
            var checkElem = $(defaults.parent).find('.list-option input');
            var selectAll = $(defaults.parent).find('.select-all-btn input');
            var deCheckElem = $(defaults.parent).find('.deselect-btn');
            // Open list    
            $(searchElem).on('click', function(){
                $(defaults.parent).removeClass("opened");
                $(defaults.parent).addClass("opened");
                $(defaults.parent).find('.multi-select-list-wrap').slideDown();
            })

            // Close list
            $(document).on("click", function(event) {
                if(!($(event.target).closest(defaults.parent).length) && $(defaults.parent).hasClass("opened")){
                    closeModal();
                }
            });

            //Escape button click
             $(document).on('keydown', function(event) {
                if(event.key == "Escape" && $(defaults.parent).hasClass("opened")) {
                    $(searchElem).blur();
                    closeModal();
                }
            });

            function closeModal() {
                $(defaults.parent).removeClass("opened");
                $(defaults.parent).find('.multi-select-list-wrap').slideUp();
            }

            //Search Function
            $(searchElem).on('keyup', function() {
                var keyWord = $(this).val().toLowerCase();
                var selectHtml = $(defaults.parent).find('.list-option');
                if(keyWord != "") {
                    $(selectHtml).each(function() {
                        if(!$(this).text().toLowerCase().includes(keyWord)) {
                            $(this).hide();
                        }
                        else {
                            $(this).show();
                        }
                    })
                } else {
                    $(selectHtml).each(function() { 
                        $(this).show();
                    })
                }
            })

            //Checkbox Click
            $(checkElem).on('click', function() {
                if($(this)[0].checked) {
                    $(this).addClass('checked');
                } else {
                    $(this).removeClass('checked');
                }
            })

            // Check All
            $(selectAll).on('click', function() {
                var elem = $(this);
                $(checkElem).each(function(){
                    if($(elem)[0].checked) {
                        $(this).prop("checked", true); 
                    }else {
                        if(!($(this).hasClass('checked'))) {
                            $(this).prop("checked", false); 
                        }
                    }
                })
            })

            // Decheck All 
            $(deCheckElem).on('click', function() {
                $(checkElem).each(function(){ 
                    $(this).prop("checked", false); 
                    $(this).removeClass("checked");
                    $(selectAll).prop("checked", false);
                })
            })
        }
        return this;
    }
}(jQuery));