function Iris( element, data, options ) {
	var options = new IrisOptions( options );
	var utils   = new Utils( options );
	var data = data ? data : {};
	utils.options = options;
	var hideTooltipTimeout = null;

	var onRayClick   = function() {};
	var onRotate = function() {};
	var onRayMouseOver   = function() {};
	var onRayMouseLeave = function() {};

	var maxDepth	= 3;
	var rootRadius	= 0.1;
	var activeDepth	= 0;
	var initialRotation	= options.rotation;
	var irisMode	= 'normal'; // normal or gapAnalysis

	var dragBehaviour = d3.behavior.drag().on('drag', onDragMove ).on('dragend',onDragEnd);

	var selectionWidth, selectionHeight, width, height;
	var sel = d3.select(element);
	sel.selectAll("svg").remove();
	sel.style('opacity', 0)
		.transition()
		.duration( 1000 )
		.style('opacity', 1);

	var angle = d3.scale.linear().range([0, 2 * Math.PI]);
	var radius = d3.scale.linear();
	var r;

	var arc = d3.svg.arc()
		.startAngle(function(d)  { return Math.max(0, Math.min(2 * Math.PI, angle(d.x))); })
		.endAngle(function(d)    { return Math.max(0, Math.min(2 * Math.PI, angle(d.x + d.dx))); })
		.innerRadius(function(d) { return d.depth === 0 ? 0 : Math.max(0, radius(d.y)); })
		.outerRadius(function(d) { return Math.max(0, radius(d.y + d.dy)); });

	var partition = d3.layout.partition();
	var partData = null;

	var svg = sel.append("svg").style("pointer-events", "none").style({
		position: 'absolute',
		left: 0,
		top: 0,
	});
	var mainGroup = svg.append("g").attr('class','mainGroup').style("pointer-events", "fill");;
	var title = mainGroup.append('text');
	var tip = utils.createHTMLTooltip( svg );
	// var tip = d3.tip().attr('class', 'd3-tip');
	// .style('transform','translate(0,-10px)'); 
		// svg.call(tip);
	// var 

	var arcsGroup = mainGroup.append("g").attr('class','arcsGroup').call( dragBehaviour );
	var competencyRings = arcsGroup.selectAll('.competencyRing')
		.data([ 0.75, 1.25, 1.75] ).enter().append('circle')
		.attr({
			cx: 0,
			cy: 0,
			r:  0
		})
		.style({
			stroke: '#666',
			fill: '#ccc',
			opacity: 0.2
		});

	var arcs = mainGroup.selectAll('.dataArc');
	d3.select(window).on('resize.iris_'+utils.guid(), update);
	var buildIn = true;
	update(options.buildInDuration);
	function update( transitionDuration ) {
		var td = transitionDuration;

		selectionWidth  = parseInt( sel.style('width'), 10 );//selection[0][0].clientWidth,
		selectionHeight = parseInt( sel.style('height'), 10 )-5;

		width  = selectionWidth  - options.margin.left - options.margin.right;
		height = selectionHeight - options.margin.top  - options.margin.bottom;

		svg.attr('width',selectionWidth).attr('height',selectionHeight);

		r = Math.min(width, height) / 2.1;
		if ( options.maxRadius && r > options.maxRadius ) r = options.maxRadius;
		radius.range( [10, r] );

		mainGroup.attr("transform", "translate(" + [options.margin.left, options.margin.top] + ")");
		mainGroup.td(td).attr('opacity', options.opacity );

		if ( buildIn ) arcsGroup.attr("transform", "translate(" + [options.initialLocation[0]*width, options.initialLocation[1]*height] + ")");
		arcsGroup.td(td).attr("transform", "translate(" + [options.location[0]*width, options.location[1]*height] + ")" + " rotate("+(options.rotation+options.capabilityRotation)+")");
		
		title.text( options.title ).attr({dy: '1em', x: width/2}).call( utils.styleTitle );

		partition.value(function(d) { return d[ options.valueProp ] === null ? 4 : d[ options.valueProp ]; })
			.sort( null );

		partData = partition.nodes( data ); 
		calculateScore( data );
		applyColors( data );
		partData = partition.value(function(d){return 1;}).nodes( data ); 
		magic( partData );
		competencyRings.td(td,'back-out').attr('r', function(d){ return radius(rootRadius + d*(1-rootRadius)/maxDepth ); } );

		arcs = arcsGroup.selectAll('.dataArc').data( partData );
		arcs.exit().remove();
		
		var arcsTd = td ? arcs.td(td).attrTween('d', tweenArc ) : arcs.attr('d', function(d){ return arc( getState(d) );} );
		arcsTd.style("fill", getColor ).style("fill-opacity", getOpacity );
		// if (td) arcs.td(td).attrTween('d', tweenArc );
		// else arcs.attr('d', function(d){ return arc( getState(d) );} );
			// .attr('d',arc );
			// .attr('d', function(){ arc( this._currentState );} );


		var arcsEnter = arcs.enter().append("path").attr('class','dataArc')
			.attr("id", function(d){ return d.name ? utils.makeId( d.name ) : null;} )
			.style("fill", getColor )
			.style("fill-opacity", getOpacity );

		if ( !td ) arcsEnter.attr('d',arc);
		else 
			arcsEnter.each( function(d) { this._currentState = {x: -d.x, dx: d.dx, y: 0, dy: 0, depth: d.depth }; })
				.td(td).delay( function() { return 500*Math.random(); } )
				.attrTween("d", tweenArc);

		arcs
			.on("click", onArcClick)
			.on("mouseover", onArcMouseOver)
			.on("mouseleave", onArcMouseLeave);

		arcs.filter( function(d) { return !d.children; })
			.on("mouseover.tip", onArcMouseOverTip)
			.on("mouseleave.tip", onArcMouseLeaveTip);

		if ( options.highlightSelectedCapability ){
			arcs.filter( function(d) { return !d.children;} ).attr('stroke','null')
				.filter( function(d,idx) { 
					if ( typeof options.selectedCapability === 'number') 
						return idx === options.selectedCapability;
					else return d === options.selectedCapability;
				})
				.attr('stroke', function(d){
					// console.log( d.level, d.y, d.dy )
					return d.grayedout || d.level === null || utils.hexToBrightness( getColor(d) ) > 128 ? d3.rgb( getColor(d) ).darker(1).toString() : 'white';
				});
		}

		buildIn = false;
	}

	function analyzeGaps( sequence2 ) {
		calcDiff( data, sequence2 );

		function calcDiff( seq1, seq2 ) {
			loop( seq1, function(child){
				var cap = getCapability( seq2, child.name, child.category );
				if ( cap ) child.gap = -child.level + cap.level;
			});

			function loop( obj, callback ) {
				if ( obj.children ) obj.children.forEach( function(c){ loop(c,callback);});
				else callback( obj );
			}
		}
	}

	function onDragMove() {
		var numberOfCapabilities = partData.filter( function(d) { return !d.children ; }).length;

		var xRel = d3.event.x/width;
		var m = Math.sign( xRel - options.location[0] );

		options.capabilityRotation += m * d3.event.dy/5;

		if ( options.capabilityRotation > 360 ) options.capabilityRotation -= 360;
		if ( options.capabilityRotation < 0 )   options.capabilityRotation += 360;
		// initialSelectedCapability +
		var i =  (numberOfCapabilities - Math.ceil( (options.capabilityRotation)/360 * numberOfCapabilities));
		options.selectedCapability = i;
		update();

		onRotate(i, options.rotation);
	}

	function onDragEnd(){
		// var numberOfCapabilities = partData.filter( function(d) { return !d.children ; }).length;
		// var step = (1/numberOfCapabilities)*360	
		// var d1 = (options.rotation+step/2)%step
		// var d2 = step-(options.rotation+step/2)%step;
		// options.rotation = options.rotation + ((d1 > d2) ? -d1 : d2);
		// update();
	}

	return {
	 	update: update,
	 	analyzeGaps: analyzeGaps,
	 	options: options,
	 	onRayClick: function(f) { onRayClick = f; },
	 	onRotate: function(f) { onRotate = f; },
	 	onRayMouseOver: function(f) { onRayMouseOver = f; },
		onRayMouseLeave: function(f) { onRayMouseLeave = f; },
	 	setMode: function( newMode ) { irisMode = newMode; },
	 	setData: function( newData ) { data = newData; },
	 	rotate: function(degrees, td) {
	 		options.rotation = degrees;
	 		// update(td);
	 	},
	 	getRayGeometry: function(d) {
	 		var r = radius(d.y + d.dy);
			var a = angle(d.x + d.dx/2) + options.rotation/180*Math.PI;
			return {
				radius: r,
				angle: a,
				x: options.margin.left + width*options.location[0] + r*Math.sin(a),
				y: options.margin.top + height*options.location[1] - r*Math.cos(a),
			}
	 	}
	};

	function log(d,i){
		if ( i<10 ) console.log(this._currentState );
	}

	function tweenArc(d) {
		var arcNode = this;
		var newState    = getState(d);
		// console.log( arcNode._currentState, newState  );
		var datum = d3.interpolate( arcNode._currentState, newState );
        return function(t) {
            var b = datum(t);
            arcNode._currentState = b;
            return arc(b);
        };
	}

	function getState(d) {
		var state = {};
		if ( irisMode === 'gapAnalysis' ) {
			var y = !d.children   ? 0.625 :
			         d.depth === 2 ? 0.2 :
			         d.depth === 1 ? 0.1 : 0;

			var dy = !d.children  ? -d.gap/8/2 :
			          d.depth === 2 ? 0.1 :
			          d.depth === 1 ? 0.1 : d.y;

			state = {x: d.x, dx: d.dx, y: y, dy: dy, depth: d.depth };
		} else state = {x: d.x, dx: d.dx, y: d.y, dy: d.dy, depth: d.depth };

		return state;
	}

	function getCapability( obj, name, catName ) {
		if ( obj.hasOwnProperty("children") ) {
			for (var i = 0; i < obj.children.length; i++) {
				c = obj.children[i];
				var capability = getCapability( c, name, catName);
				if ( capability !== undefined ) return capability;
			}
		} else if ( obj.name === name && obj.category === catName ){
			return obj;
		}
	}


	function onArcClick(d,i) {
		if (!d.hasOwnProperty("children")) {
			onRayClick(d,i);
			return;
		}
		return;
		var prevDepth = activeDepth;
		activeDepth = d.depth;				

		arcs.transition()
			.duration(750)
			.attrTween("d", arcTween(d));
	}

	function onArcMouseOver(d) {
		d3.select( this ).style("fill",function(d){ 
			var col = getColor(d);
			return col.brighter(0.5);
		});
		
		// if ( d.hasOwnProperty('parent') ) {
		// 	var val = Math.round(9*(0+d.score/d.maxScore));
		// 	var htmlContent = '<tspan font-size="0.9em">'+d.name+'</tspan>';
		// 	if ( d.depth > 1 ) htmlContent += '<tspan font-size="0.7em" x="50%" dy="1.1em">'+options.defMain[val-1]+'</tspan>';
		// 	title.html( htmlContent );
		// }

		onRayMouseOver.call(this,d);
	}

	function onArcMouseLeave(d) {
		d3.select( this ).style("fill", getColor );
		// title.text( options.title );

		onRayMouseLeave.call(this,d);
	}
	
	function onArcMouseOverTip(d) {
		if ( irisMode !== 'gapAnalysis' ) return;

		clearTimeout( hideTooltipTimeout );
		setTooltipHTML(d);
		var dir = ['n','e','s','w','n'];
		// tip.direction( dir[Math.floor(4*(d.x+0.125))] );
		var m =  d3.mouse( svg.node() );
		tip.position( m[0], m[1] );
		tip.show();
	}

	function onArcMouseLeaveTip(d) {
		clearTimeout( hideTooltipTimeout );
		hideTooltipTimeout = setTimeout( tip.hide, 100 );
	}

	function arcTween(d) {
		var xd = d3.interpolate(angle.domain(), [d.x, d.x + d.dx]),
			yd = d3.interpolate(radius.domain(), [d.y, 1]),
			yr = d3.interpolate(radius.range(), [d.y ? 10: 10, r]);
		return function(d, i) {
			return i ? function(t) { return arc(d); }
					 : function(t) { 
				   		angle.domain( xd(t) ); 
				   		radius.domain( yd(t) ).range( yr(t) ); 
				   		return arc(d); 
				   	};
		};
	}

	function magic(partitionDataArray) {
		partitionDataArray.forEach(function(d){
			if ( d.hasOwnProperty("parent") ) {
				d.y = d.parent.y + d.parent.dy;
				d.dy = (1-rootRadius)*d.score/d.maxScore/maxDepth;// - rootRadius/maxDepth;
			} else {
				d.y = 0;
				d.dy = rootRadius;
			}
		});	
	}

	function calculateScore(d){
		d.score = d.value;
		if ( d.hasOwnProperty("children") ) {
			d.maxScore = 0;
			d.children.forEach( function(c){ 
				calculateScore( c );
				d.maxScore += c.maxScore;
			});
		} else d.maxScore = 9;
	}

	function getColor(d) {
		return d3.rgb( d.color );
	}

	function getOpacity(d) {
		if ( d.children ) {
			var hasNoNullValues = false;
			var hasNoGrayedOut = false;
			for (var i = 0; i < d.children.length; i++) {
				if ( d.children[i].level !== null ) {
					hasNoNullValues = true;
					break;
				}
			}
			// for (var i = 0; i < d.children.length; i++) {
			// 	if ( d.children[i].grayedout ) {
			// 		hasNoGrayedOut = true;
			// 		break;
			// 	}
			// }
			// if ( !hasNoNullValues ) return 0.2;
			// if ( hasNoGrayedOut ) return 0.2;
		}
		if ( d.grayedout === true ) return 0.2;
		else if ( d.grayedout === false ) return 1.0;
		if ( d.level === null ) return 0.2;
		return 0.7 + 0.3*d.score/d.maxScore;
	}

	function applyColors( obj, parent ) {
		if ( obj.depth <= 1 ) obj.color = options.colorMap[ obj.name ];
		else {
			obj.color = d3.rgb(parent.color).brighter(0.3).toString();
		}

		if ( obj.children ) {
			obj.children.forEach( function(child){
				applyColors( child, obj );
			});
		} 
	}

    function setTooltipHTML(d) {
		var valIrisA = Math.round(9*(0+d.score/d.maxScore));
		var defIrisA = options.defMain[valIrisA];

		var valIrisB = Math.floor(valIrisA + d.gap);
		var defIrisB = options.defMain[valIrisB];

		var color = d.gap > 0 ? 'red' : 'green';
		var tipHTML = '';
		tipHTML += '<div style="display:block; font-size: 12pt; font-weight: 500; margin: 0 auto">'+d.name+'</div>';
		tipHTML += '<div style="float: left; font-size: 14pt; width: 115px">'+options.name+'<div style="font-weight: 700; font-size: 16pt;">'+defIrisA+'</div></div>';
		tipHTML += '<div style="float: left; font-size: 14pt; width: 115px">'+'Gap' +'<div style="font-weight: 700; font-size: 16pt; color:'+color+';">'+Math.abs(d.gap.toFixed())+'</div></div>';
		tipHTML += '<div style="float: left; font-size: 14pt; width: 115px">'+'Role'+'<div style="font-weight: 700; font-size: 16pt;">'+defIrisB+'</div></div>';
		// tipHTML += '<div class="ui small statistics">';
		// tipHTML += '<div class="statistic"><div class="value">'+valIrisA+'</div><div class="label">'+defIrisA+'</div></div>';
		// tipHTML += '<div class="statistic"><div class="value">'+Math.abs(d.gap)+'</div><div class="label">Gap</div></div>';
		// tipHTML += '<div class="statistic"><div class="value">'+valIrisB+'</div><div class="label">'+defIrisB+'</div></div>';
		// tipHTML += '<div class="statistic"><div class="value"><i class="plane icon"></i> 5</div><div class="label">Flights</div></div>';
		// tipHTML += '</div>';

		tip.html( tipHTML );
	}
}
