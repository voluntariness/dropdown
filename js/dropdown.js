

$.fn.extend({
    dropdown: function (options) {

        return this.each(function () {


            var $this = $(this).hide();
            var $wrap = $('<div class="btn-group dropdown">').insertAfter($this);
            var $button = $('<button type="button">')
                            .attr({
                                'class': 'btn btn-default dropdown-toggle',
                                'aria-expanded': 'false'
                            })
                            .css('width', options.width || 'auto')
                            .html(($this.attr('title') || '請選擇'))
                            .appendTo($wrap);
            var $menu = $('<ul class="dropdown-menu" role="menu"/>')
                            .appendTo($wrap);
            var $search = $('<input type="text" class="form-control">');
            var $line = $('<li class="divider">');
            var $clear = $('<button class="btn btn-default">取消選取</button>');
            var $finish = $('<button class="btn btn-info">完成</button>');
            var $items = $('<li class="dropdown-items"/>');
            var $loading = $('<li class="dropdown-loading" />');

            $this.data('dropdown', $wrap);

            $menu.append($('<li>').append($search))
                .append('<li class="divider">')
                .append($('<li class="options">').append([$clear, $finish]))
                .append($line)
                .append($items)
                .append($loading);

            if (! options.source) {
                options.source = [];
                $this.find('option').each(function() {
                    options.source.push({value: this.value, name: this.innerHTML});
                });
            }

            $button.bind('click', function () {
                if ($menu.is(':visible')) {
                    $this.trigger('dropdown-hide');
                } else {
                    $this.trigger('dropdown-show');

                }
            });
            
            $clear.bind('click', function () {
                $this.trigger('set-value', [null]);
            });

            $finish.bind('click', function () {
                $this.trigger('dropdown-hide');
            });

            $(document).bind('mousedown', function (e) {
                if ($(e.target).parents('.dropdown').length === 0) {
                    $this.trigger('dropdown-hide');
                }
            });


            $search.bind('input', function () {

                $(this)
                    .attr('title', ' 按 Enter 查詢 ')
                    .tooltip('show');

            }).bind('keydown', function (e) {

                if (e.keyCode == 13) {
                    $(this)
                        .removeAttr('title')
                        .tooltip('destroy');

                    $this.trigger('get-source');

                }

            })

            $this
                .bind('dropdown-hide', function () {
                    $menu.hide();
                })
                .bind('dropdown-show', function () {
                    $menu.show();
                })
                .bind('set-value', function (e, value) {
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
                    $button.html(name);

                })
                .bind('get-source', function () {

                    var query = $(this).val();

                    if (typeof options.source === 'string') {

                        $.ajax(options.source, {data: {query: query}, dataType: 'json'})
                            .done(function (request) {
                                $this.trigger('load-data', [request]);
                            })
                            .fail(function (request) {
                                console.log(request);
                            });
                    } else {
                        $this.trigger('load-data', [options.source]);
                    }

                })
                .bind('load-data', function (e, data) {

                    var query = $search.val();

                    $items.find('.item').not('.selected').remove();
                    $menu.find('option').not(':selected').remove();

                    $this.data('items', []);
                    var items = $this.data('items');

                    $.each(data, function (i, o) {

                        if (typeof options.filter === 'function') {
                            if (options.filter(query, o) === false) return;
                        }


                        if ($items.find('[item-value=' + o.value + ']').length === 0) {

                            $('<option/>')
                                .val(o.value)
                                .html(o.name)
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
                                        $this.trigger('dropdown-hide');
                                    }
                                    $this.trigger('set-value', [selected]);

                                });
                        }
                    });

                    $this.trigger('set-value', $this.val());                    

            });

            
            $this.trigger('get-source');


        });
    }
});


