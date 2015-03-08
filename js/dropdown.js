

$.fn.extend({
    dropdown: function (options) {
        
        options = options || {};
        options.ajaxType = (options.ajaxType && options.ajaxType.toUpperCase() == 'POST') ? 'post' : 'get';
        return this.each(function () {


            var $this = $(this).hide();
            var $wrap = $('<div class="btn-group dropdown dropdown-select">')
                .css('width', options.width || 'auto')
                .insertAfter($this);
            var $button = $('<button type="button">')
                .attr({
                    'class': 'btn btn-default dropdown-toggle',
                    'aria-expanded': 'false'
                })
                .html(($this.attr('title') || '請選擇'))
                .appendTo($wrap);
            var $menu = $('<ul class="dropdown-menu" role="menu"/>')
                            .appendTo($wrap);
            var $field = $('<input type="text" class="form-control">');
            var $line = $('<li class="divider">');
            var $clear = $('<button type="button" class="btn btn-default">取消選取</button>');
            var $search = $('<button type="button" class="btn btn-info">查詢</button>');
            var $items = $('<li class="dropdown-items"/>');
            var $loading = $('<li class="dropdown-loading" />');


            $menu.append($('<li>').append($field))
                .append('<li class="divider">')
                .append($('<li class="options">').append([$clear, $search]))
                .append($line)
                .append($items)
                .append($loading);


            $this.data('dropdown', $wrap);
            $this.data('items', []);


            $button.bind('click', function () {
                if ($menu.is(':visible')) {
                    $this.trigger('dds.hide');
                } else {
                    $this.trigger('dds.show');
                }
            });
            
            $clear.bind('click', function () {
                $this.trigger('dds.setValue', [null]);
            });

            $search.bind('click', function () {
                $this.trigger('dds.getSource');
            });

            $(document).bind('mousedown', function (e) {
                if ($(e.target).parents('.dropdown').length === 0) {
                    $this.trigger('dds.hide');
                }
            });


            $field.bind('input', function () {

                $(this)
                    .attr('title', ' 按 Enter 查詢 ')
                    .tooltip('show');

            }).bind('keydown', function (e) {

                if (e.keyCode == 13) {
                    $(this)
                        .removeAttr('title')
                        .tooltip('destroy');
                    $this.trigger('dds.getSource');
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
                .bind('dds.setValue', function (e, value) {
                    var name = [];
                    var items = $this.data('items');
                    $items.find('.selected').removeClass('selected');
                    if ($this.prop('multiple')) {
                        value = $.isArray(value) ? value : [];
                        $.each(value, function (i, v) {
                            items[v].addClass('selected');
                            name.push(items[v].data('item-data').name);
                        });
                        name = name.join(', ');
                    } else {
                        value = (items[value]) ? value.toString() : Object.keys(items)[0];
                        items[value].addClass('selected');
                        name = items[value].data('item-data').name;
                    }

                    $this.val(value);
                    $button.html(name || '請選擇');

                })
                .bind('dds.clear.noSelect', function () {

                })
                .bind('dds.getSource', function () {

                    var query = $field.val();
                    if (typeof options.source === 'string') {

                        $.ajax(options.source, {type: options.ajaxType , data: {query: query}, dataType: 'json'})
                            .done(function (request) {
                                $this.trigger('dds.loadData', [request]);
                            })
                            .fail(function (request) {
                                console.log(request);
                            });
                    } else {

                        $this.trigger('dds.loadData', [options.source]);

                    }

                })
                .bind('dds.loadData', function (e, data) {

                    var query = $field.val();
                    var items = $this.data('items');

                    $this.trigger('dds.clear.noSelect');

                    $.each(data, function (i, o) {

                        if (typeof options.filter === 'function') {
                            if (options.filter(query, o) === false) return;
                        }


                        if (! items[o.value]) {

                            $('<option/>')
                                .val(o.value)
                                .appendTo($this);


                            items[o.value] = $('<a class="item" />')
                                .data('item-data', o)
                                .attr('item-value', o.value)
                                .html(o.name)
                                .appendTo($items)
                                .bind('click', function () {

                                    var selected = $this.val() || [];
                                    var value = $(this).data('item-data').value.toString();
                                    if ($this.prop('multiple')) {
                                        var idx = selected.indexOf(value);

                                        if (idx >= 0) {
                                            selected.splice(idx, 1);
                                        } else {
                                            selected.push(value);
                                        }

                                    } else {
                                        selected = value;
                                        $this.trigger('dds.hide');
                                    }
                                    $this.trigger('dds.setValue', [selected]);

                                });
                        }
                    });
                    $this.trigger('dds.setValue', [$this.val()]);                    

            });

            
            var items = [];
            var def_value = $this.val();
            $this.find('option').each(function() {
                items.push({ value: this.value, name: this.innerHTML});
            });
            $this.find('option').remove();
            options.source = options.source || items;

            if (items.length) {
                $this.trigger('dds.loadData', [items]);
                $this.trigger('dds.setValue', [def_value]);
            } else {
                $this.trigger('dds.getSource');
            }


        });
    }
});


