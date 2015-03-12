"use strict";

$.fn.extend({
    dropdown: function (options) {
        options = options || {};
        options.search = options.search === false ? false : true;
        options.ajaxType = (options.ajaxType && options.ajaxType.toUpperCase() == 'POST') ? 'post' : 'get';
        options.filter = options.filter || function () { return true; };
        return this.each(function () {
            var $this = $(this).hide();
            var $wrap = $('<div class="btn-group dropdown dds-wrap">')
                .css('width', options.width || 'auto')
                .insertAfter($this);
            var $button = $('<button type="button">')
                .attr({'class': 'btn btn-default dropdown-toggle', 'aria-expanded': 'false'})
                .html(($this.attr('title') || '請選擇'))
                .appendTo($wrap);
            var $menu = $('<ul class="dropdown-menu" role="menu"/>')
                            .appendTo($wrap);
            var $input = $('<input type="text" class="dds-input form-control">');
            var $search = $('<div class="input-group-addon dds-search"><span class="glyphicon glyphicon-search"></span></div>');
            var $searchGroup = $('<div class="input-group" />')
                                    .append($input)
                                    .append($search);
            var $clear = $('<button type="button" class="btn btn-default">取消選取</button>');
            var $finish = $('<button type="butto" class="btn btn-info">完成</button>')
            var $items = $('<li class="dropdown-items dds-items"/>');
            var $loading = $('<li class="dds-loading" />').hide();

            var isMulti = $this.prop('multiple');

            if (options.search) {
                $menu.append($('<li>').append($searchGroup))
                    .append('<li class="divider">');
            }

            $menu.append($items)
                .append($loading);

            $this.data('dropdown', $wrap);
            $this.data('items', {});

            var removeNoSelected = function () {
                var items = $this.data('items');
                $this.find('option').not(':selected').each(function () {
                    items['option-' + this.value].$option.remove();
                    items['option-' + this.value].$item.remove();
                    delete items['option-' + this.value];
                });
                $('#select-data optgroup')
                    .filter(function () { 
                        return $(this).children().length === 0; 
                    })
                    .each(function () {
                        var key = 'optgroup-' + $(this).attr('label');
                        items[key].$optgroup.remove();
                        items[key].$itemgroup.remove();
                        delete items[key];
                    });
                $this.trigger('dds.refresh')
            }

            var createOption = function (o, items) {
                var key = 'option-' + o.value;
                if (! items[key]) {

                    items[key] = {};

                    items[key].$option = $('<option/>')
                        .val(o.value)
                        .html(o.name);

                    items[key].$item = $('<a class="item" />')
                        .attr('item-value', o.value)
                        .html(o.name)
                        .bind('click', function () {
                            var selected = isMulti ? ! items[key].$option.attr('selected') : true;
                            if (selected) {
                                items[key].$option.attr('selected', 'selected');
                            } else {
                                items[key].$option.removeAttr('selected');  
                            } 
                            $this.trigger('dds.refresh');
                            if (! isMulti) {
                                $this.trigger('dds.hide');
                            }
                        });


                    return items[key];
                }
                return false;
            }

            var loadSource = function () {

                var query = $input.val();
                $loading.show();
                if (typeof options.source === 'string') {

                    $.ajax(options.source, {type: options.ajaxType , data: {query: query}, dataType: 'json'})
                        .done(function (request) {
                            $loading.hide();
                            $this.trigger('dds.loadData', [request]);
                        })
                        .fail(function (request) {
                            console.log(request);
                        });
                } else {
                    $loading.hide();
                    $this.trigger('dds.loadData', [options.source]);

                }
            }

            $button.bind('click', function () {
                if ($menu.is(':visible')) {
                    $this.trigger('dds.hide');
                } else {
                    $this.trigger('dds.show');
                }
            });
            

            $search.bind('click', function () {
                loadSource();
            });

            $('html').bind('mousedown', function (e) {
                if ($(e.target).closest($wrap).length === 0) {
                    $this.trigger('dds.hide');
                }
            });

            $input.bind('input', function () {

                $(this)
                    .attr('title', ' 按 Enter 查詢 ')
                    .tooltip('show');

            }).bind('keydown', function (e) {

                if (e.keyCode == 13) {
                    $(this)
                        .removeAttr('title')
                        .tooltip('destroy');
                    loadSource();
                    e.preventDefault();

                }

            })

            $this
                .bind('dds.hide', function () {
                    $menu.hide();
                })
                .bind('dds.show', function () {
                    $menu.show();
                })
                .bind('dds.refresh', function (e, value) {
                    var items = $this.data('items');
                    var values = $this.val() !== null ? isMulti ? $this.val() : [$this.val()] : [];
                    var name = [];
                    $items.find('.selected').removeClass('selected');
                    for (var i in values) {
                        items['option-' + values[i]].$item.addClass('selected');
                        name.push(items['option-' + values[i]].$item.text());
                    }
                    name = name.length ? name.join(', ') : '請選擇';
                    $button.html(name).attr('title', name);
                })
                .bind('dds.loadData', function (e, data) {

                    var query = $input.val();
                    var items = $this.data('items');

                    removeNoSelected();

                    $.each(data, function (i, o) {

                        /* optgroup */
                        if (o.is_optgroup) {
                            var key = 'optgroup-' + o.label;
                            if (! items[key]) {
                                items[key] = {};
                                items[key].$optgroup = $('<optgroup/>')
                                    .attr('label', o.label)
                                    .appendTo($this);
                                items[key].$itemgroup = $('<div class="dds-itemgroup">')
                                    .append('<label>' + o.label + '</label>')
                                    .appendTo($items);
                            }
                            $.each(o.options, function(i, oo) {
                                if (options.filter(query, oo)) {
                                    var item = createOption(oo, items);
                                    if (item !== false) {
                                        items[key].$optgroup.append(item.$option);
                                        items[key].$itemgroup.append(item.$item);
                                    }
                                }
                            });
                            if (items[key].$optgroup.children().length === 0){
                                items[key].$optgroup.remove();
                                items[key].$itemgroup.remove();
                                delete items[key];
                            }

                        } else {
                            if (options.filter(query, o)) {
                                var item = createOption(o, items);
                                if (item !== false) {
                                    $this.append(item.$option.appendTo($this));
                                    $items.append(item.$item);
                                }
                            }
                        }

                    });
            });

            
            var def_data = [];
            var def_value = $this.val();
            $this.find('> *').each(function() {
                var $elem = $(this);
                if ($elem.prop('tagName') === 'OPTGROUP') {
                    var optgroup = {
                        is_optgroup: true,
                        label: $elem.attr('label'),
                        options: []
                    };
                    $elem.find('> option').each(function () {
                        optgroup.options.push({ value: this.value, name: this.innerHTML});
                    });
                    def_data.push(optgroup);
                } else if ($elem.prop('tagName') === 'OPTION') {
                    def_data.push({ value: this.value, name: this.innerHTML});
                }
            });
            $this.html('');
            options.source = options.source || def_data;
            if (def_data.length) {
                $this.trigger('dds.loadData', [def_data]);
                $this.val(def_value);
                $this.trigger('dds.refresh');
            } else {
                loadSource();
            }


        });
    }
});


