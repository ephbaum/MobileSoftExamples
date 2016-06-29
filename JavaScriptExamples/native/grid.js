/***********************************************
* 
* grid.js: A Javascript widget layout library
*
***********************************************/


/*******************************************************************************
 * 
 * GridNode object
 *
 * GridNode objects are tree nodes which represent the layout of widgets on a page
 * 
 * The layout is recursively represented by a tree. Leaf nodes are actual widget
 * container elements. Parent nodes are containers for other nodes, can be
 * split horizontally or vertically, and have an arbitrary number of children.
 *
 * TO USE:
 * - Create leaf nodes for each widget using the GridNode constructor (ie. new GridNode)
 * - Use combine[Horizontal,Vertical,Tab] static helpers to create parent nodes
 * - Use combineVertical only on elements with the same width
 * - Use combineHorizontal on nodes with a width sum less than 12
 * - Use combineTab only on leaf nodes
 * 
 * See dashboard/index.js for example usage
 * 
 * @param int width     width in bootstrap column units (integer out of 12)
 * @param float height  height in proportion of the maxheight of the window (float out of 1.0)
 * @param string id     id of the node
 * @param string prettyName  pretty name for display 
 *
 * GridNode.combine[Horizontal,Vertical,Tab]:
 * @return gridNode     A new GridNode which can be used as any other node in the tree
 * 
 ******************************************************************************/
function GridNode(width, height, id, prettyName) {
    this.id = id;
    this.prettyName = prettyName;
    /* Layout fields */
    this.width = width;
    this.height = height;
    this.type = null;
    this.nodes = [];
}

GridNode.combineHorizontal = function() {
    var newNode = new GridNode;
    newNode.nodes = Array.prototype.slice.call(arguments);  // convert arguments obj to array
    
    var widths = newNode.nodes.map(function(e) { return e.width; });
    newNode.width = widths.reduce(function(a,b) { return a+b; });

    var heights = newNode.nodes.map(function(e) { return e.height; });
    newNode.height = Math.max.apply(Math, heights);

    newNode.type = 'h';
    return newNode
};

GridNode.combineVertical = function() {
    var newNode = new GridNode;
    newNode.nodes = Array.prototype.slice.call(arguments);  // convert arguments obj to array
    
    var heights = newNode.nodes.map(function(e) { return e.height; });
    newNode.height = heights.reduce(function(a,b) { return a+b; });

    var widths = newNode.nodes.map(function(e) { return e.width; });
    newNode.width = Math.max.apply(Math, widths);

    newNode.type = 'v';
    return newNode;
};

GridNode.combineTab = function() {
    var newNode = new GridNode;
    newNode.nodes = Array.prototype.slice.call(arguments);

    var heights = newNode.nodes.map(function(e) { return e.height; });
    newNode.height = Math.max.apply(Math, heights);

    var widths = newNode.nodes.map(function(e) { return e.width; });
    newNode.width = Math.max.apply(Math, widths);

    newNode.type = 't';
    return newNode
}

/*******************************************************************************
 * 
 * GridLayout object
 * 
 * The GridLayout object creates, organizes, and manages layout and control of the widgets.
 * 
 * It:
 * - creates the HTML frame for the widget layout
 * - initially draws all of the widgets on the page (with data from localStorage)
 * - maintains the responsiveness of the page
 * - creates an interface for the widgets on the page
 *
 * Widget instances are stored in the object this.widgets, keyed by each widget's id.
 *
 * NOTE: For now, the GridNode -> HTML compiler does not do anything with the height attribute of a node.
 * NOTE: Your document must fire a 'dataready' event on the document when global ajax is done.
 *
 * @param jQuery root               The root container for the widgets
 * @param GridNode gridNodeDesktop  GridNode layout for desktop view (bootstrap sm,md,lg)
 * @param GridNode gridNodeMobile   GridNode layout for mobile view (bootstrap xs)
 * @param MTSLocalStorage MTSStorage An MTSLocalStorage interface to a field in window.localStorage
 * @param function widgetMaker      A function which takes a widget id and returns an instance of a Widget
 *
 ******************************************************************************/
function GridLayout(root, gridNodeDesktop, gridNodeMobile, MTSStorage, widgetMaker) {
    var self = this;
    /* Instance variables */
    this.root = root;
    this.gridNodeDesktop = gridNodeDesktop;
    this.gridNodeMobile = gridNodeMobile;
    this._storage = MTSStorage;
    this.widgets = {};
    /* Initialization sequence */
    this.widgetMaker = widgetMaker;
    this._insertLayout(this.gridNode);
    this.oldSize = $(window).width();
    this._bindResize();
    $.each(this.widgets, function(id, widget) {
        self.widgets[id] = widgetMaker(id);
    });
    /* If there's no existing data to show, hide everthing until loaded */
    if ($.isEmptyObject(this._storage.getAllObjects())) {
        this.root.css('opacity', 0);
        window.ajaxSpin.start();
        $(document).on('dataready', function() {
            window.ajaxSpin.stop();
            self.root.addClass('loading');
            self.root.css('opacity', '');
        });
    }
    this.drawAll();
}

/* Insert a GridNode tree into the DOM */
GridLayout.prototype._insertLayout = function() {
    var self = this;

    /************************************/
    /* Parse a GridNode tree, emit HTML */
    /************************************/
    var createLayout = function createLayout(gridNode) {
        var layout = [];
        // at a leaf node (individual widget)
        if (gridNode.nodes.length === 0) {
            layout.push('<div id="container-' + type + '-' + gridNode.id + '" class="container-leaf">');
            layout.push('</div>');
            self.widgets[gridNode.id] = gridNode.id;
        }
        // vertical widget container
        else if (gridNode.type === 'v') {
            for (var i = 0; i < gridNode.nodes.length; i++) {
                var subNode = gridNode.nodes[i];
                layout.push('<div class="row nopadding nomargin" container-height="' + subNode.height + '">');
                layout.push(createLayout(subNode));
                layout.push('</div>');
            };
        }
        // horizontal widget container
        else if (gridNode.type === 'h') {
            for (var i = 0; i < gridNode.nodes.length; i++) {
                var subNode = gridNode.nodes[i];
                layout.push('<div class="col-md-' + subNode.width + ' nopadding nomargin">');
                layout.push(createLayout(subNode));
                layout.push('</div>');
            };
        }
        // tabbed widget container
        else if (gridNode.type === 't') {
            layout.push('<div class="container-leaf">');
            // Tab headers
            layout.push('<ul class="nav nav-tabs" role="tablist">');
            for (var i = 0; i < gridNode.nodes.length; i++) {
                var subNode = gridNode.nodes[i];
                layout.push('<li role="presentation" class="' + (i === 0 ? 'active' : '') + '">');
                layout.push('<a href="#container-' + type + '-' + subNode.id + '" role="tab" data-toggle="tab">');
                layout.push(subNode.prettyName);
                layout.push('</a>');
                layout.push('</li>');
            }
            layout.push('</ul>');
            // Tab content
            layout.push('<div class="tab-content">');
            for (var i = 0; i < gridNode.nodes.length; i++) {
                var subNode = gridNode.nodes[i];
                layout.push('<div role="tabpanel" class="tab-pane ' + (i === 0 ? 'active' : '') + '" id="container-' + type + '-' + subNode.id + '">');
                layout.push('</div>');
                self.widgets[subNode.id] = subNode.id;
            }
            layout.push('</div>');
            layout.push('</div>');
        }
        return layout.join('\n');
    };

    /**************************************************************/
    /* Insert divs with ids of the widgets into mobile or desktop */
    /**************************************************************/
    var insertIds = function() {
        var type = 'mobile';
        if ($(window).width() >= 992) {
            type = 'desktop';
        }
        var $root = $('#container-' + type);
        $.each(self.widgets, function(id, widget) {
            var $newElem = $('<div/>', {'id': id});
            var $container = $root.find('#container-' + type + '-' + id);
            $newElem.appendTo($container);
        });
    };

    // Need to add a wrapper row class div to get outer margins right
    var type = 'desktop';
    this.desktopHtml = '<div id="container-desktop" class="row hidden-xs hidden-sm">' + createLayout(this.gridNodeDesktop) + '</div>';
    var type = 'mobile';
    this.mobileHtml = '<div id="container-mobile" class="row hidden-md hidden-lg">' + createLayout(this.gridNodeMobile) + '</div>';
    this.root.html(this.desktopHtml + this.mobileHtml); 
    insertIds();
};

/* Redraw all widget */
GridLayout.prototype.drawAll = function() {
    var local = this._storage.getAllObjects();
    $.each(this.widgets, function(id, widget) {
        widget.draw(local);
    });
};

/* Get new data for all widgets */
GridLayout.prototype.updateAll = function(updateAllPath) {
    var self = this;
    var req = $.ajax({
        type: 'GET',
        url: updateAllPath,
        global: false,
        dataType: 'json'
    }).done(function(data) {
        $.each(data, function(id, widget) {
            self._storage.setObject(id, widget);
        });
        self.drawAll();
    });
    return req;
};

/* Bind resize events to move all widgets into other frame if needed */
GridLayout.prototype._bindResize = function() {
    var self = this;
    $(window).resize(function() {
        var newSize = window.innerWidth;
        var oldSize = self.oldSize;
        /* Immediately set the instance oldsize to prevent race conditions */
        self.oldSize = newSize;
        var breakpoint = 992;
        if (newSize < breakpoint && oldSize >= breakpoint) {
            var $mobileContainer = $('#container-mobile');
            $.each(self.widgets, function(id, widget) {
                widget.container.detach().appendTo($mobileContainer.find('#container-mobile-' + id));
            });
        } else if (newSize >= breakpoint && oldSize < breakpoint ) {
            var $desktopContainer = $('#container-desktop');
            $.each(self.widgets, function(id, widget) {
                widget.container.detach().appendTo($desktopContainer.find('#container-desktop-' + id));
            })
        }
    });
};

/*******************************************************************************
 *
 * Widget object
 * 
 * An instance of the widget object represents a widget. It provides an interface
 * to update the widget's data and redraw it.
 * 
 * After instantiating and instance of a Widget, you must set the updateData
 * and getHtml functions:
 *
 * - getHtml should take and argument object as input, and return html to insert
 * into the widget's container.
 * - updateData should return a promise object. When the promise resolves, getHtml
 * will be called with the promise's .data field as the first item in an arguments
 * object.
 *
 * Every time a widget is redrawn, there will be a 'widgetId_redraw' event triggered on the document
 *
 ******************************************************************************/

function Widget(id) {
    this.id = id;
    this.container = $('#' + id);
    this.updateData = null;
    this.getHtml = null;
}

Widget.prototype.update = function(callbackFn, noDraw) {
    var self = this;
    var pr = this.updateData();
    pr.done(function() {
        if (noDraw !== true) {
            self.draw(pr.data);
        }
        if (typeof callbackFn === 'function') {
            callbackFn();
        }
    });
}

Widget.prototype.draw = function() {
    var html = this.getHtml(arguments);
    this.container.html(html);
    $(document).trigger(this.id + '_redraw');
}


/*******************************************************************************
 *
 * Handlebars widget
 *
 * An example extension of the Widget object. The updateData and getHtml
 * functions are preset to use the Handlebars templating engine.
 * 
 ******************************************************************************/

function HandlebarsWidget(id, updatePath, MTSStorage) {
    var self = this;
    Widget.call(this, id);
    Handlebars.partials = Handlebars.templates;
    this.updatePath = updatePath;
    this.template = Handlebars.templates[id];
    this._storage = MTSStorage;
    
    // Preset update fn for handlebars template
    this.updateData = function() {
        var req = $.ajax({
            type: 'GET',
            url: this.updatePath + '?type=' + this.id,
            global: false,
            dataType: 'json'
        }).done(function(data) {
            $.each(data, function(id, widgetData) {
                self._storage.setObject(id, widgetData);
            });
            req.data = self._storage.getAllObjects();
        });
        return req;
    };

    // Preset html fn calls handlebars template
    this.getHtml = function(widgetData) {
        if (widgetData.length === 0) {
           widgetData = this._storage.getAllObjects(); 
        } else {
            widgetData = widgetData[0];
        }
        if (typeof this.template === 'function') {
            return this.template(widgetData);
        } else {
            return '';
        }
    };
}

HandlebarsWidget.prototype = Object.create(Widget.prototype);
HandlebarsWidget.prototype.constructor = HandlebarsWidget;
