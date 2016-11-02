queue()
	.defer( d3.json, "data/IrisHillary.json" )
	.defer( d3.json, "data/IrisTrump.json" )
	.defer( d3.json, "data/POTUSRole.json" )
	.defer( d3.tsv, "data/POTUS_CEs.tsv" )
	.await( createVisualization );

if ( localStorage.voted ) {
	d3.select('.candidate.'+localStorage.opponent).select('.candidateButton').style('background-color','lightgrey').style('cursor','default');
	d3.select('.candidate.'+localStorage.opponent).select('.voteText').text(' ');

	d3.select('.candidate.'+localStorage.voted).select('.voteText').text("You've voted already");
}

var pageWidth = document.body.clientWidth;
// if (!window.dataLayer) window.dataLayer = [];
// d3.selectAll('#clintonImg, #trumpImg').style('width', (100*pageWidth/1440)+ 'px');

function createVisualization(error, sequence,sequenceTrump, potusRoleSequence, ceDataTSV) {
	if (error) throw error;
	var capabilityLevels = ['Clueless','Aware','Beginner','Novice','Competent','Pro','Expert','Teacher','Thought Leader'];
	var isGapAnalysisActive = false;
	var options = {
		 buildInDuration: 1600,
		 initialLocation: [-0.2,0.5],
		 location: [0.2,0.5],
		 maxRadius: 300*pageWidth/1600,
		 name: 'Clinton'
	};
	//{title:'Take a selfie of your skills',initialLocation: [0,0], location: [0,0.5], buildInDuration: 1000, rotation: 90};
	// resetScore( sequence, null );
	var ceData = parseConcreteEngadgements( ceDataTSV );

	
	

	// grayOutIris(sequenceTrump,ceData.engagements);
	// grayOutIris(sequence,ceData.engagements);
	var iris = Iris( '#irisA', sequence, options );
	var options2 = {
		 buildInDuration: 1600,
		 initialLocation: [1.2,0.5],
		 location: [0.8,0.5],
		 maxRadius: 300*pageWidth/1600,
		 name: 'Trump'
	};
	var iris2 = Iris( '#irisB', sequenceTrump, options2 );
	
	var potusRoleIrisOption = {
		buildInDuration: 1600,
		initialLocation: [0.5,0.5],
		location: [0.5,0.5],
		maxRadius: 220*pageWidth/1600,
		colorMap: {
			""								: "#ffffff",
			"Awareness and decision making"	: "#DB3340",
			"Campaigning"					: "#71d362",
			"Commander in chief"			: "#ffd16f",
			"International relations"		: "#ff3d5d",
			"Political discourse"			: "#ff7218",
			"Publicity and communications"	: "#04b3f3",
		}
	};
	var potusRoleIris = Iris( '#irisC', potusRoleSequence, potusRoleIrisOption );

	var potusSoulSequence = _.cloneDeep( sequence );
	setLevelsByCEs( potusSoulSequence, ceData );

	grayOutIris(potusSoulSequence,ceData.engagements);
	var potusSoulIris = Iris( '#irisD', potusSoulSequence, potusRoleIrisOption );
	potusSoulIris.update(1);
	var clonedPotusSoulIris;
	setTimeout( function(){
		clonedPotusSoulIris = document.querySelector('#irisD > svg').cloneNode(true);
		clonedPotusSoulIris.setAttribute('id','clonedPotusSoulIris');
		document.querySelector('#irisD').appendChild(clonedPotusSoulIris);
	},100);


	[iris,iris2,potusRoleIris,potusSoulIris].forEach( function(ir){
		ir.onRayMouseOver( function(d){  setDescription(d); });
		ir.onRayMouseLeave( function(d){ setDescription({name:'', description:''});});
	});

	function setDescription(d) {
		d3.select('.irisDescription>h2').html( '<span style="font-weight: 600">' + d.name + ( d.level ? ': '+capabilityLevels[d.level] : '' ) +"</span>" );
		d3.select('.irisDescription>p').text( d.description );
	}

	console.log( ceData )
	

	// var pta = false;
	// d3.select('.gapAnalysisButton').on('click', function(){
	// 	// pta = !pta;
	// 	// potusRoleIris.setData( pta ? potusRoleSequence : sequence );
	// 	// potusRoleIris.update(1000);
		
		
	// });

	d3.select('.gapAnalysisButton').on('click', function(){
		isGapAnalysisActive = !isGapAnalysisActive;
		// d3.select(this).td(500).style('opacity', 0);
		d3.select('.roleIrisCaption').td(500).style('opacity', +(!isGapAnalysisActive));
		
		var button = d3.select(this);
		setTimeout( function(){
			button.select('#GA_run').attr('hidden', isGapAnalysisActive ? '' : null );
			button.select('#GA_back').attr('hidden', !isGapAnalysisActive ? '' : null );
		}, 1400); 
		
		// this.style.pointerEvents = 'none';
		
		if ( isGapAnalysisActive ) runGapAnalysis();
		else backFromGapAnalysis();
	});


	d3.selectAll('.candidateButton').on('click', function(){
		if ( localStorage.voted ) return;

		var candidate = this.getAttribute('value');
		var opponent = this.getAttribute('opponent');
		d3.select('.candidate.'+opponent).select('.candidateButton').style('background-color','lightgrey').style('cursor','default');
		d3.select('.candidate.'+opponent).select('.voteText').text(' ');

		d3.select(this.parentNode).select('.voteText').text('Thank you!');
		localStorage.voted = candidate;
		localStorage.opponent = opponent;

		// window.dataLayer.push({
		//     "ecommerce": {
		//         "add": {
		//             "products": [
		//                 {
		//                     "id": candidate,
		//                 }
		//             ]
		//         }
		//     }
		// });

		yaCounter40624390.reachGoal(candidate);
	});

	function runGapAnalysis() {
		document.getElementById("flip-container").classList.toggle('flipped');

		setTimeout( function(){ 
			iris.options.location	= [0.30,0.5];
			iris2.options.location	= [0.70,0.5];
			potusSoulIris.options.location	= [0.30,0.5];
			
			d3.select('#clintonImg').td(700).style('left','30%');
			d3.select('#trumpImg').td(700).style('left','70%');
			d3.select('#clonedPotusSoulIris>g').td(700).attr('transform','translate('+0.2*document.body.clientWidth+',0)');
			
			iris.update(700);
			iris2.update(700);
			potusSoulIris.update(700);


			setTimeout( function(){ 
				grayOutIris(sequence,ceData.engagements);
				grayOutIris(sequenceTrump,ceData.engagements);

				iris.analyzeGaps( potusSoulSequence ); 
				iris.setMode('gapAnalysis');
				iris.update(700);

				iris2.analyzeGaps( potusSoulSequence ); 
				iris2.setMode('gapAnalysis');
				iris2.update(700);

				potusSoulIris.options.opacity = 0;
				potusSoulIris.update(500);
				d3.select( "#flip-container" ).td(700).style('opacity',0);
			},700);

			// d3.select('.backButton').td(700).style('opacity', 1);
			// d3.select('.backButton').style('pointer-events', null);
		}, 800 );
	}

	function backFromGapAnalysis() {
		// d3.select(this).td(500).style('opacity', 0);
		// this.style.pointerEvents = 'none';

		grayOutIris(sequence,[]);
		iris.setMode('normal');
		iris.update(700);

		grayOutIris(sequenceTrump,[]);
		iris2.setMode('normal');
		iris2.update(700);

		potusSoulIris.options.opacity	= 1;
		potusSoulIris.update(700);

		setTimeout( function(){ 
			iris.options.location	= [0.2,0.5];
			iris2.options.location	= [0.8,0.5];
			potusSoulIris.options.location	= [0.5,0.5];
			
			d3.select('#clintonImg').td(700).style('left','20%');
			d3.select('#trumpImg').td(700).style('left','80%');
			d3.select('#clonedPotusSoulIris>g').td(700).attr('transform','translate(0,0)');
			d3.select( "#flip-container" ).td(700).style('opacity',1);
			
			iris.update(700);
			iris2.update(700);
			potusSoulIris.update(700);
		},700);

		setTimeout( function(){ 
			document.getElementById("flip-container").classList.toggle('flipped');
		}, 1400);

		// d3.select('.gapAnalysisButton').td(700).style('opacity', 1);
		// d3.select('.gapAnalysisButton').style('pointer-events', null);
	}
	function resetScore(d,score){
		if ( d.hasOwnProperty("children") ) {
			d.children.forEach( function(c){ 
				resetScore( c, score );
			});
		} else d.level = score;
	}

	function randomizeScore(d){
		if ( d.hasOwnProperty("children") ) {
			d.children.forEach( function(c){ 
				randomizeScore( c );
			});
		} else d.level = Math.ceil( (d.level + Math.round( Math.random()*8 ))/2 );
	}

	function setScore(d,tier2,tier3,score){
		if ( d.hasOwnProperty("children") ) {
			d.children.forEach( function(c){ 
				setScore( c,tier2,tier3,score );
			});
		} else {
			if ( d.name == tier3 && d.parent.name == tier2 )
				d.level = score;
		}
	}

	function setLevelsByCEs(obj, ceData ){
		if ( obj.hasOwnProperty("children") ) {
			obj.children.forEach( function(c){ 
				setLevelsByCEs( c, ceData );
			});
		} else {
			setCapabilityLevelByCE( obj, ceData );
		}
	}

	function setCapabilityLevelByCE( capability, ceData ) {
		var n = 0;
		var numCEs = ceData.engagements.length;
		ceData.engagements.forEach( function(ce) {
			if ( ce.links.indexOf( capability.name ) !== -1 ) n += 1;
		});
		capability.level = n === 0 ? 0 : 3 + Math.ceil(n/numCEs);
	}

	function grayOutIris( obj, ce ) {
		var engagements;
		if ( ce instanceof Array ) engagements = ce;
		else engagements = [ ce ];
			
		if ( obj.hasOwnProperty("children") ) {
			var grayout = true;
			for (var i = 0; i < obj.children.length; i++) {
				c = obj.children[i];
				if ( !grayOutIris(c, engagements) ) 
					grayout = false;
			}
			obj.grayedout = grayout;
			return grayout;
		} else {
			var grayout = (engagements.length === 0) ? false : true;
			engagements.forEach( function(engagement) {
				var links = engagement.links;
				if  ( links.indexOf( obj.name.trim() ) !== -1 ) grayout = false;
			});
			obj.grayedout = grayout;
			// obj.grayedout = ( links.indexOf( obj.name ) !== -1 || links.length === 0 ) ? false : true;
			return obj.grayedout;
		}
	}


	function parseConcreteEngadgements( data ) {
		var listOfCapabilities = ["Artistic","Conventional","Enterprising","Investigative","Realistic","Social","Active Listening","Mathematics","Reading Comprehension","Science","Speaking","Writing","Active Learning","Critical Thinking","Learning Strategies","Monitoring","Complex Problem Solving","Management of Financial Resources","Management of Material Resources","Management of Personnel Resources","Time Management","Coordination","Instructing","Negotiation","Persuasion","Service Orientation","Social Perceptiveness","Judgment and Decision Making","Systems Analysis","Systems Evaluation","Equipment Maintenance","Equipment Selection","Installation","Operation and Control","Operation Monitoring","Operations Analysis","Programming","Quality Control Analysis","Repairing","Technology Design","Troubleshooting","Selective Attention","Time Sharing","Category Flexibility","Deductive Reasoning","Fluency of Ideas","Inductive Reasoning","Information Ordering","Originality","Problem Sensitivity","Memorization","Flexibility of Closure","Perceptual Speed","Speed of Closure","Mathematical Reasoning","Number Facility","Spatial Orientation","Visualization","Oral Comprehension","Oral Expression","Written Comprehension","Written Expression","Control Precision","Multilimb Coordination","Rate Control","Response Orientation","Arm-Hand Steadiness","Finger Dexterity","Manual Dexterity","Reaction Time","Speed of Limb Movement","Wrist-Finger Speed","Dynamic Flexibility","Extent Flexibility","Gross Body Coordination","Gross Body Equilibrium","Dynamic Strength","Explosive Strength","Stamina","Static Strength","Trunk Strength","Auditory Attention","Hearing Sensitivity","Sound Localization","Speech Clarity","Speech Recognition","Depth Perception","Far Vision","Glare Sensitivity","Near Vision","Night Vision","Peripheral Vision","Visual Color Discrimination","English Language","Fine Arts","Foreign Language","History and Archeology","Philosophy and Theology","Administration and Management","Clerical","Customer and Personal Service","Economics and Accounting","Personnel and Human Resources","Sales and Marketing","Communications and Media","Telecommunications","Education and Training","Building and Construction","Computers and Electronics","Design","Engineering and Technology","Mechanical","Medicine and Dentistry","Therapy and Counseling","Law and Government","Public Safety and Security","Food Production","Production and Processing","Biology","Chemistry","Geography","Mathematics","Physics","Psychology","Sociology and Anthropology","Transportation","Estimating the Quantifiable Characteristics of Products, Events, or Information ","Getting Information","Identifying Objects, Actions, and Events ","Inspecting Equipment, Structures, or Material ","Monitor Processes, Materials, or Surroundings ","Monitoring and Controlling Resources","Performing Administrative Activities","Staffing Organizational Units","Assisting and Caring for Others","Communicating with Persons Outside Organization","Communicating with Supervisors, Peers, or Subordinates ","Establishing and Maintaining Interpersonal Relationships","Interpreting the Meaning of Information for Others","Performing for or Working Directly with the Public","Resolving Conflicts and Negotiating with Others","Selling or Influencing Others","Coaching and Developing Others","Coordinating the Work and Activities of Others","Developing and Building Teams","Guiding, Directing, and Motivating Subordinates ","Provide Consultation and Advice to Others","Training and Teaching Others","Analyzing Data or Information","Evaluating Information to Determine Compliance with Standards","Judging the Qualities of Things, Services, or People ","Processing Information","Developing Objectives and Strategies","Making Decisions and Solving Problems","Organizing, Planning, and Prioritizing Work ","Scheduling Work and Activities","Thinking Creatively","Updating and Using Relevant Knowledge","Documenting/Recording Information","Drafting, Laying Out, and Specifying Technical Devices, Parts, and Equipment ","Interacting With Computers","Repairing and Maintaining Electronic Equipment","Repairing and Maintaining Mechanical Equipment","Controlling Machines and Processes","Handling and Moving Objects","Operating Vehicles, Mechanized Devices, or Equipment ","Performing General Physical Activities","Achievement","Independence","Recognition","Relationships","Support","Working Conditions"];
		var ceList = [];
		var roles = [];
		data.forEach( function(d){
			var ceName = d.Engagement;//.toTitleCase();
			var capabilityName = listOfCapabilities[ (+d.Capability) ];
			// console.log(d.Engagement, ceName);
			var ce = ceList.get('name', ceName);
			if ( ce ) ce.links.push( capabilityName );
			else {
				ce = {name: ceName, links: [capabilityName]};
				ceList.push( ce );
			}

			var roleList = d.Roles.split(',');
			roleList.forEach( function(roleName) {
				roleName = roleName;//.toTitleCase();
				var role = roles.get('name', roleName);
				if ( role ) {
					if ( !role.engagements.get('name', ce.name) )
						role.engagements.push(ce);
				} else roles.push({
					name: roleName,
					engagements: [ce]
				});
			});
		});

		return {
			roles: roles,
			engagements: ceList
		}
	}
}

function activateModal(selector) {
	jQuery(selector).modal({inverted: false}).modal('show');
}
