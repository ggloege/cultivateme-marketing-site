function Utils(){
	var utils = this;
	utils.trimString = function(str) { return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); };
	utils.numberWithSeparator = function(x) {
	    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	};
	utils.makeId = function( str ) { return str.replace(/^[^a-z]+|[^\w:.-]+/gi, "").replace(/\./gi,""); };
	utils.formatValue = function( value ){
	    if ( isNaN(value) || !isFinite(value) ) { return ''; }
	    return utils.numberWithSeparator( value.toFixed( utils.options.dataLabels.decimals ) );

	    // var formattedValue;
		// if ( Math.abs( value ) > 1000000 ) 	formattedValue = utils.numberWithSeparator( Math.round( value/100000 )/10 ) + "M";
		// else if ( Math.abs( value ) > 50000 ) formattedValue = utils.numberWithSeparator( Math.round( value/1000 ) ) + "K";
		// else if ( Math.abs( value ) > 1000 ) formattedValue = utils.numberWithSeparator( Math.round( value/100 )/10 ) + "K";
		// else if ( Math.abs( value ) > 10 ) formattedValue = Math.round( value );
		// else formattedValue = Math.round( 10*value )/10;

	 //    return formattedValue;
	};
	utils.guid = function() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	    s4() + '-' + s4() + s4() + s4();
	}
	utils.componentToHex = function(c) {
	    var hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	};
	utils.rgbToHex = function(color) {
	    return "#" + utils.componentToHex( Math.round( color.r) ) + utils.componentToHex( Math.round( color.g ) ) + utils.componentToHex( Math.round( color.b ) );
	};
	utils.getThresholdColorDomain = function( paletteLength, data ){
		var entries = d3.entries( data );
		var min = d3.min( entries, function(d) { return d3.min(d.value, function(d) { return +d[utils.options.valueProp] ;}); } );
		var max = d3.max( entries, function(d) { return d3.max(d.value, function(d) { return +d[utils.options.valueProp] ;}); } );
		var valueExtent = [min, max];
		// var valueExtent = d3.extent( values, function(d) {
		// 	return +d[utils.options.valueProp]; 
		// });
		var valueExtentLength = valueExtent[1]-valueExtent[0];
		
		var colorDomain = [];
		for ( var i = 0; i < paletteLength; ++i )
			colorDomain.push( valueExtent[0] +0.01+ valueExtentLength*i/(paletteLength-1) );
		
		return colorDomain;
	};
	utils.sortDataBy = function( data, prop ){
		data.sort( function (a, b) {
		  return b[prop] - a[prop];
		});
	};
	utils.hexToRgb = function(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	};
	utils.rgbToBrightness = function(r,g,b) {
		return 0.2126*r + 0.7152*g + 0.0722*b;
	};
	utils.hexToBrightness = function(hex) {
		var rgb = utils.hexToRgb(hex);
		return 0.2126*rgb.r + 0.7152*rgb.g + 0.0722*rgb.b;
	};
	utils.detectBrowser = function() { // http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
		if ( !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0 ) 	    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
			return 'Opera';

		if ( typeof InstallTrigger !== 'undefined')   // Firefox 1.0+
			return 'Firefox';

		if ( Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ) 		    // At least Safari 3+: "[object HTMLElementConstructor]"
			return 'Safari';

		if ( !!window.chrome && !( !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0 ) )              // Chrome 1+
			return 'Chrome';

		if ( /*@cc_on!@*/false || !!document.documentMode ) // At least IE6
			return 'IE';

		return 'Unknown';
	};
	utils.styleLabel = function( selection ){ utils.styleYLabel(selection);};
	utils.styleYLabel = function( selection ) {

		function style(selection) {
			selection.attr({
				"font-size":   		utils.options.yAxis.fontSize, // For Firefox
			});
			return selection.style({
				"font-family": 		utils.options.yAxis.fontFamily,
				"font-size":   		utils.options.yAxis.fontSize,
				"font-weight": 		utils.options.yAxis.fontWeight,
				"font-style": 		utils.options.yAxis.fontStyle,
				"text-decoration": 	utils.options.yAxis.textDecoration,
				"text-anchor": 		utils.options.textDirection === 'ltr' ? 'end' : 'start',
				"direction": 		utils.options.textDirection,
				"fill": 			utils.options.yAxis.textColor,
				"cursor": 	   "default",
				"-moz-user-select": "none",
				"-webkit-user-select": "none",
				"-ms-user-select": "none"
			});
		}

		selection.each( function(d){
			var textElement = d3.select(this);
			textElement.transition().attr('transform','translate(' + (utils.options.yAxis.ticksPosition === 'inside' ? -3 :-9) + ',0)')
			var text = textElement.text();
			var words = text.split(' ');
			textElement.text('');
			var xPos = utils.options.yAxis.ticksPosition === 'inside' ? 0 : 0; //+textElement.attr('x');

			var tspan = textElement.append('tspan').attr('x',xPos).call(style);
			var tspanText = '';
			if ( utils.options.yAxis.labelWrapping === 'wrap' ){
				var tspanCount = 1;
				words.forEach( function(word,i) {
					tspan.text( tspanText + word + ' ' );
					if ( utils.getTSpanApprxWidth( tspan.node(), utils.options.yAxis.fontSize )*1.1 > (utils.options.yAxis.labelTextMaxWidth ? utils.options.yAxis.labelTextMaxWidth : utils.options.margin.left) ) {
						tspan.text( tspanText.trim() );
						tspan = textElement.append('tspan')
							.attr('x',xPos)
							.attr('dy','1.2em')
							.text( word + ' ' )
							.call(style);
						tspanCount++;
						tspanText = word + ' ';
					} else tspanText += (word+' ');
				});
				textElement.attr('dy',(-(tspanCount-1)/2 + 0.25)+'em')
			} 
			else if ( utils.options.yAxis.labelWrapping === 'trim' ){
				for ( var i = 0; i < words.length; i++) {
					word = words[i];
					tspan.text( tspanText + word + ' ' );
					if ( utils.getTSpanApprxWidth( tspan.node(), utils.options.yAxis.fontSize )*1.1 > (utils.options.yAxis.labelTextMaxWidth ? utils.options.yAxis.labelTextMaxWidth : utils.options.margin.left)-10 ) {
						tspan.text( tspanText + '...' );
						break;
					} else tspanText += (word+' ');
				};
			} else {
				tspan.text( text );
			}

		});

		return selection;
	};
	utils.styleXLabel = function( selection ) {
		selection.attr({
			"font-size":   		utils.options.xAxis.fontSize, // For Firefox
		});
		return selection.style({
			"font-family": 		utils.options.xAxis.fontFamily,
			"font-size":   		utils.options.xAxis.fontSize,
			"font-weight": 		utils.options.xAxis.fontWeight,
			"font-style": 		utils.options.xAxis.fontStyle,
			"text-decoration": 	utils.options.xAxis.textDecoration,
			"text-anchor": 		'middle',
			"fill": 			utils.options.xAxis.textColor,
			"cursor": 	   "default",
			"-moz-user-select": "none",
			"-webkit-user-select": "none",
			"-ms-user-select": "none"
		});
	};
	utils.wrapLabel = function(selection) {
		selection.each( function(d){
			var textElement = d3.select(this);
			var text = textElement.text();
			var words = text.split(' ');
			textElement.text('');

			var xPos = +textElement.attr('x');

			var tspan = textElement.append('tspan').attr('x',xPos).call( utils.styleDataLabel );
			var tspanText = words[0]+' ';
			tspan.text( tspanText );
			if ( utils.options.dataLabels.labelWrapping === 'wrap' ){
				var tspanCount = 1;
				words.forEach( function(word,i) {
					if (i===0) return;
					tspan.text( tspanText + word + ' ' );
					if ( tspan.node().getComputedTextLength() > (utils.options.dataLabels.labelTextMaxWidth ? utils.options.dataLabels.labelTextMaxWidth : d.labelTextMaxWidth) ) {
						tspan.text( tspanText.trim() );
						tspan = textElement.append('tspan')
							.attr('x',xPos)
							.attr('dy','1.2em')
							.text( word + ' ' )
							.call( utils.styleDataLabel );

						tspanCount++;
						tspanText = word + ' ';
					} else tspanText += (word+' ');
				});
				textElement.attr('dy',(-(tspanCount-1)/2 )+'em')
			} 
			else if ( utils.options.dataLabels.labelWrapping === 'trim' ){
				for ( var i = 0; i < words.length; i++) {
					word = words[i];
					tspan.text( tspanText + word + ' ' );
					if ( tspan.node().getComputedTextLength() > (utils.options.dataLabels.labelTextMaxWidth ? utils.options.dataLabels.labelTextMaxWidth : d.labelTextMaxWidth)-10 ) {
						tspan.text( tspanText + '...' );
						break;
					} else tspanText += (word+' ');
				};
			} else {
				tspan.text( text );
			}
		});
	}
	utils.styleDataLabel =  function( selection ) {
		return selection.attr({
			"font-family": 		utils.options.dataLabels.fontFamily,
			"font-size":   		utils.options.dataLabels.fontSize,
			"font-weight": 		utils.options.dataLabels.fontWeight,
			"font-style": 		utils.options.dataLabels.fontStyle,
			"text-decoration": 	utils.options.dataLabels.textDecoration,
			"text-anchor": 		'middle',
			"stroke": "none",
			"cursor": 	   "default",
			'pointer-events': 'none'
		}).style({
			"-moz-user-select": "none",
			"-webkit-user-select": "none",
			"-ms-user-select": "none"
		});
	};
	utils.styleLegend = function( selection ) {
		selection.attr({
			"font-size":   		utils.options.legend.fontSize, // For Firefox
		});
		return selection.style({
			"font-family": 		utils.options.legend.fontFamily,
			"font-size":   		utils.options.legend.fontSize,
			"font-weight": 		utils.options.legend.fontWeight,
			"font-style": 		utils.options.legend.fontStyle,
			"text-decoration": 	utils.options.legend.textDecoration,
			// "cursor": 	   "pointer",
			"-moz-user-select": "none",
			"-webkit-user-select": "none",
			"-ms-user-select": "none"
		});
	};
	utils.styleAxis = function( selection ) {
		return selection.style({
			"fill":            "none",
		    "stroke":          "black",
		    "stroke-width":    2,
		    "shape-rendering": "crispEdges",
		});
	};
	utils.styleGrid = function( selection ) {
		selection.selectAll("path").remove();
		return selection.style({
			stroke: "lightgrey"
		});
	};
	utils.styleTitle = function( selection ) {
		return selection.style({
			"font-family": "Source Sans Pro",
			"font-size":   "2.5em",
			"font-weight": "300",
			"text-anchor": "middle",
			"fill":        "black",
			"cursor": 	   "default",
			"-moz-user-select": "none",
			"-webkit-user-select": "none",
			"-ms-user-select": "none"
		});
	};
	utils.renderLegend = function( selection, data, getColor, x, y, width ) {
		if ( !utils.options.legend.enabled ) return d3.selectAll('EmptySelection');
		var markType = markType ? markType : 'circle';
		var markSize = utils.options.legend.markSize;

		selection.selectAll(".chartLegend").remove();
		var legend = selection.append("g")
			.attr("class","chartLegend")
			.attr('transform', 'translate(' + x + ',' + y + ')');

		var legendItems = legend.selectAll(".legendItem")
			.data( data )
			.enter()
			.append("g")
			.attr("class","legendItem")
			.attr("enabled",true);

		legendItems
			.append("rect")
			.attr({
				y: -markSize/4,
				width: 		markSize,
				height: 	markSize/2,
				fill: 	function(d,i) { return utils.options.hideSeries.indexOf( d.id ) === -1 ? getColor(d[utils.options.valueProp]) : 'none'; },
				stroke: function(d,i) { return d3.rgb( getColor(d[utils.options.valueProp]) ).darker(); },
				'pointer-events': 'all'
			});


		legendItems
			.append("text")
			.call(utils.styleLegend)
			.attr({
				// x: markSize*1.5,
				lines: 1,
				y: utils.options.legend.fontSize/4
			})
			// .text( function(d) { return d.name;} )
			.each( function(d){
				var textElement = d3.select(this);
				var words = (utils.options.dataLabels.prefix + d[ utils.options.labelProp ]*utils.options.dataLabels.multiplier + utils.options.dataLabels.suffix).split(' ');

				var tspan = textElement.append('tspan').attr('x',markSize*1.5).call(utils.styleLegend);
				var tspanText = '';
				if ( utils.options.legend.labelWrapping === 'wrap' ){
					var tspanCount = 1;
					words.forEach( function(word,i) {
						tspan.text( tspanText + word + ' ' );
						if ( utils.getTSpanApprxWidth( tspan.node(), utils.options.legend.fontSize ) > utils.options.legend.labelTextMaxWidth ) {
							tspan.text( tspanText );
							tspan = textElement.append('tspan')
								.attr('x',markSize*1.5)
								.attr('dy','1em')
								.text( word + ' ' )
								.call(utils.styleLegend);
							tspanCount++;
							tspanText = word + ' ';
							textElement.attr('lines', +textElement.attr('lines')+1 );
						} else tspanText += (word+' ');
					});
					textElement.attr('dy',(-(tspanCount-1)/2)+'em')
				} 
				else if ( utils.options.legend.labelWrapping === 'trim' ){
					for ( var i = 0; i < words.length; i++) {
						word = words[i];
						tspan.text( tspanText + word + ' ' );
						if ( utils.getTSpanApprxWidth( tspan.node(), utils.options.legend.fontSize ) > utils.options.legend.labelTextMaxWidth ) {
							tspan.text( tspanText + '...' );
							break;
						} else tspanText += (word+' ');
					};
				} else {
					tspan.text( d[ utils.options.labelProp ] );
				}
			});
		

		var labelPadding = {x:30, y:utils.options.legend.fontSize*1.35};
		var left = 0;
		var top = 0;
		legendItems.each( function() {
			var labelWidth = this.getBBox().width;
			// var numLines = +d3.select(this).select('text').attr('lines');
			d3.select(this).attr('transform', 'translate(' + left + ',' + top + ')');
			left += labelWidth + labelPadding.x;

			if ( left + labelWidth > width ) {
				left = 0;
				top += labelPadding.y * utils.options.legend.ySpacing; //*numLines;
			}
			
	        
	    })

		return legend;
	};
	utils.xAxis = function( scale, properties ){
		var properties = properties ? properties : {};
		var axis = d3.svg.axis()
					.scale(scale)
					.orient("bottom")
					.ticks( utils.options.xAxis.ticksCount )
					.tickSize( utils.options.xAxis.showTicks ?  
								  utils.options.xAxis.ticksPosition == 'outside' ? 6 : -6
								: 0 )
					.outerTickSize(1);

		if ( properties.ticksLabels ) axis.tickFormat(function(d) { return properties.ticksLabels[d]; })
		if ( properties.tickFormat )  axis.tickFormat( properties.tickFormat );
		if ( properties.orient )      axis.orient( properties.orient );
		return axis;
		    
	};
	utils.yAxis = function( scale, properties ) {
		var properties = properties ? properties : {};
		var axis = d3.svg.axis()
			    .scale(scale)
			    .tickFormat(function(d) { return d; })
			    .orient("left")
			    .ticks( utils.options.yAxis.ticksCount )
			    .tickSize( utils.options.yAxis.showTicks ?  
								  utils.options.yAxis.ticksPosition == 'outside' ? 6 : -6
								: 0  )
			    .outerTickSize(0);
		
		if ( properties.ticksLabels ) axis.tickFormat(function(d) { return properties.ticksLabels[d]; })
		if ( properties.tickFormat ) axis.tickFormat( d3.format(properties.tickFormat) );
		return axis;
	};
	utils.verticalGrid = function( scale, length ) {    
	    return d3.svg.axis()
	        .scale(scale)
	         .orient("top")
	         .ticks( utils.options.verticalGrid.lines )
	         .tickSize(length, 0, 0)
	         .tickFormat("");
	};
	utils.horizontalGrid = function( scale, length ) {        
	    return d3.svg.axis()
	        .scale(scale)
	        .orient("left")
	        .ticks( utils.options.horizontalGrid.lines )
	        .tickSize(-length, 0, 0)
			.tickFormat("");
	};
	utils.getTSpanApprxWidth = function( tspanNode, fontSize ) {
		return tspanNode.getComputedTextLength();
		// innerHTML.length*fontSize/2;
		// return tspanNode.getBoundingClientRect().width;   // Doesn't work properly in Firefox and Safari
		// return tspanNode.offsetWidth;                     // Depricated in Chrome, doesn't work in Firefox
	};
	utils.renderStepSlider = function( selection, props ) {
		selection.selectAll('.stepSlider').remove();

		var position = (+props.selected);
		var positionPrev = position;
		var dragBehaviour = d3.behavior.drag()
			.on('dragstart', function(){d3.event.sourceEvent.stopPropagation();})
			.on('drag',onDragMove)
			.on('dragend',onDragEnd);;
		var stepSlider = selection.append('g').attr({
			class: 'stepSlider',
			fill: '#ddd',
			'pointer-events': 'none',
			cursor: 'default'
		});

		stepSlider.append('rect').attr({
			width: props.width,
			height: 8,
			rx: 10,
			ry: 10
		});

		var stateGroups = stepSlider.selectAll('.stateGroup')
			.data( props.steps ).enter()
			.append('g').attr('class','stateGroup');

		stateGroups.append('circle').attr({
			cx: function(d,i) { return i*props.width/(props.steps.length-1); },
			cy: 4,
			r: 8,
			cursor: 'pointer',
			'pointer-events': 'all'
		}).on('click', function(d,i){
			position = i;
			handle.attr('cx', position*props.width/(props.steps.length-1) );
			onDragEnd();
		});

		stateGroups.append('text').attr({
			x: function(d,i) { return i*props.width/(props.steps.length-1); },
			y: 16,
			fill: 'black',
			'text-anchor': 'middle',
			'dy': '1em'
		}).text( function(d) { return d.name; })
		.call( utils.styleDataLabel );

		var handle = stepSlider.append('circle').attr({
			class: 'handle',
			cx: position*props.width/(props.steps.length-1),
			cy: 4,
			r: 5,
			fill: '#588C73',
			cursor: 'pointer',
			'pointer-events': 'all'
		}).call( dragBehaviour );

		function resize(newWidth) {
			props.width = newWidth;

			stepSlider.select('rect').attr('width', props.width);
			handle.attr('cx', position*props.width/(props.steps.length-1) );
			stateGroups.select('circle').attr('cx',function(d,i) { return i*props.width/(props.steps.length-1); } );
			stateGroups.select('text').attr('x',function(d,i) { return i*props.width/(props.steps.length-1); } );
		}

		function onDragMove(){
			var dx = +this.getAttribute('dx');
			var step = props.width/(props.steps.length-1);
			if ( Math.abs(dx) > step/2 ) {
				// var cx = +this.getAttribute('cx');
				// this.setAttribute('cx', cx += step*Math.sign(dx) );
				position += Math.sign(dx)
				if ( position < 0 ) position = 0;
				if ( position >= props.steps.length ) position = props.steps.length - 1;
				this.setAttribute('cx', position*props.width/(props.steps.length-1) );
				this.setAttribute('dx', 0 );

			} else
				this.setAttribute('dx', dx + d3.event.dx );

		}
		function onDragEnd(){
			if ( position !== positionPrev ) if( props.onChange ) props.onChange( position, props.steps[position] );
			positionPrev = position;
		}

		return {
			slider: stepSlider,
			resize: resize,
			setPosition: function(i) { position = i; }
		}

	}
	utils.createHTMLTooltip = function(svg){
	    var tipElement = d3.select(svg.node().parentNode).append('div').attr('class', 'iris-tip n').style('transform','translate(0,-15px)');
	    var tip = {
	      div: tipElement.node(),
	      show: function() { tipElement.style('pointer-events','visible').style('opacity',1); },
	      hide: function() { tipElement.style('pointer-events','none').style('opacity',0); },
	      html: function(html) { tipElement.html(html); },
	      // update: function() { if ( this._node ) setTooltipHTML.call(this._node, this._node.__data__); },
	      position:  function(x, y) {
		    if ( arguments.length === 1 ) {
		    	this._node = x;
		    	var clientRect = x.getBoundingClientRect();
		        var x = clientRect.left + clientRect.width/2, 
		            y = clientRect.top;
		    } 
	        
	        var w = tipElement.node().offsetWidth;
	        var h = tipElement.node().offsetHeight;

	        tipElement
	            .style("left", (x-w/2) + "px")             
	            .style("top",  (y-h) + "px");
	      }
	    };

	    tip.hide();

	    return tip;
    }
}

d3.selection.prototype.td = function( duration, easeType ) { 
	if ( duration ) { 
		var t = this.transition().duration( duration );
		if ( easeType ) t.ease( easeType );
		return t;
	}
	else return this;
}

Array.prototype.get = function( prop, value ) {
	var filtered = this.filter( function(d) { return d[prop] === value; } );
	if ( filtered.length !== 0 ) return filtered[0];
}

Array.prototype.getIndex = function( prop, value ) {
	if ( value === undefined ) {
		for (var i = 0; i < this.length; i++) {
			if ( this[i] === prop ) return i;
		}
	} else {
		for (var i = 0; i < this.length; i++) {
			if ( this[i][prop] === value ) return i;
		}
	}

	return -1;
}

Array.prototype.get2 = function( prop, value, prop2, value2 ) {
	var filtered = this.filter( function(d) { return (d[prop] === value) && (d[prop2] === value2); } );
	if ( filtered.length !== 0 ) return filtered[0];
}

Array.prototype.getAll = function( prop, value ) {
	var filtered = this.filter( function(d) { return d[prop] === value; } );
	if ( filtered.length !== 0 ) return filtered;
}


Number.prototype.degree = function() {
	return Math.trunc( this ).toString().length-1;
}


  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
