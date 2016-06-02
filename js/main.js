// var elements = document.getElementsByClassName('row');
// for (var i = 0; i < elements.length; i++) {
// 	var e = elements[i];
// 	e.style.opacity = 0;
// 	setUpBuildIn(e,function(){
// 		e.style.opacity = 1;
// 		e.style.transition = 'opacity 1s';
// 		e.style.transitionDelay = '1s';
// 	});
// }

// function setUpBuildIn( element, callback ) {
// 	window.addEventListener('scroll', listener, false);
	
// 	function listener() {
// 		var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
// 		var viewportTop = document.querySelector(scrollElem).scrollTop;
// 		var viewportBottom = viewportTop + window.innerHeight;

// 	    var elemTop = Math.round( element.offsetTop );
// 	    var elemBottom = elemTop + element.offsetHeight;

// 	    // A hack to fix Safari scrolling behaviour
// 		if ( viewportTop === elemTop )
// 			return;

// 	    if ( viewportBottom > elemTop+75 ) {
// 	    	callback();
// 	    	// window.removeEventListener('scroll', listener, false );
// 	    }
// 	}
// } 