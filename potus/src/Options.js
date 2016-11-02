var IrisOptions = function( override ) {
	this.fillColors   =  [ "#78c679", "#d9f0a3", "#addd8e", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"];
	this.colorMap = { 
		'' : '#ffffff',
		'Workforce Genome' : '#ffffff',
		'Knowledge' : '#97080E',
		'Work Activities' : '#DA4B0F',
		'Work Values' : '#E9B104',
		'Interests' : '#488C13',
		'Skills' : '#1B55C0',
		'Abilities' : '#482344'
	};
	this.initialLocation =  [0.5,0.5];
	this.location =  [0.5,0.5];
	this.opacity  = 1;
	this.buildInDuration = 2000;
	this.title     = "";
	this.maxRadius = null;
	this.rotation = 0;
	this.capabilityRotation = 0;
	this.margin    =  {top: 0, right: 0, bottom: 0, left: 0};

	this.selectedCapability = 0;
	this.highlightSelectedCapability = false;
	this.defMain = [ "Clueless", "Aware", "Beginner", "Novice", "Competent", "Pro", "Expert", "Teacher", "Thought Leader" ];
	this.defWorkContext = [ "Unable", "Unwilling", "Uncomfortable", "Rare", "Common", "Frequent", "Enthusiastic", "Flow", "Purpose" ];

	this.valueProp = "level";

	this.dataLabels						= {};
	this.dataLabels.enabled				= true;
	this.dataLabels.suffix				= '%';
	this.dataLabels.prefix				= '';
	this.dataLabels.multiplier			= 1;
	this.dataLabels.decimals			= 1;
	this.dataLabels.labelWrapping		= 'wrap'; // 'none','trim','wrap'
	this.dataLabels.labelTextMaxWidth	= null;
	this.dataLabels.position			= 'outside';
	this.dataLabels.fontFamily			= "Source Sans Pro";
	this.dataLabels.fontStyle			= 'normal';
	this.dataLabels.textDecoration		= 'none';
	this.dataLabels.fontWeight			= 400;
	this.dataLabels.fontSize			= 15;
	this.dataLabels.textAnchor			=  'middle';
	this.dataLabels.textAlign			= 'center';

	this.legend						= {};
	this.legend.enabled				= true;
	this.legend.labelTextMaxWidth	= 300;
	this.legend.labelWrapping		= 'trim'; // 'none','trim','wrap'
	this.legend.markSize			= 20;
	this.legend.fontSize			= 14;
	this.legend.ySpacing			= 1.5;
	this.legend.fontFamily			= "Source Sans Pro";
	this.legend.fontStyle			= 'normal';
	this.legend.textDecoration		= 'none';
	this.legend.fontWeight			= 'normal';
	this.legend.textAlign			= 'left';


	for ( var prop in override ) {
		if ( override[ prop ].toString() === "[object Object]" && prop !== 'topology') {
			for ( var subProp in override[ prop ] ){
				this[ prop ][ subProp ] = override[ prop ][ subProp ];
			}
		}
		else this[ prop ] = override[ prop ];
	}
}