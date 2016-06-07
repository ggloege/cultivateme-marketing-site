var elements = document.getElementsByClassName('row');
for (var i = 0; i < elements.length; i++) {
	var e = elements[i];
	elements[i].style.opacity = 0;
	setUpBuildIn(elements[i],function(e){
		e.style.opacity = 1;
		e.style.transition = 'opacity 1s';
		e.style.transitionDelay = '0.2s';
	});
}

function setUpBuildIn( element, callback ) {
	window.addEventListener('scroll', listener, false);
	listener();
	function listener() {
		var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
		var viewportTop = document.querySelector(scrollElem).scrollTop;
		var viewportBottom = viewportTop + window.innerHeight;

	    var elemTop = Math.round( element.offsetTop );
	    var elemBottom = elemTop + element.offsetHeight;

	    // A hack to fix Safari scrolling behaviour
		if ( viewportTop === elemTop )
			return;

	    if ( viewportBottom > elemTop+275 ) {
	    	callback( element );
	    	// window.removeEventListener('scroll', listener, false );
	    }
	}
} 