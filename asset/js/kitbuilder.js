$('#previewFrame').load(function(){
	var frame    = this.contentWindow,
		mdParser = new Showdown.converter();

	// get kit authors and convert into makes.org links
	var makeAuthorHTML = function(input){
		var rtn = 'Made by ';
		if(!input) return rtn;

		input = input.split(/, ?/);
		
		input.filter(function(author){
			if(author.match(/^@[a-zA-Z0-9_]+$/)){
				rtn += '['+ author + '](https://' + author.substr(1) + '.makes.org/), ';
			}
			else if(author.match(/\w+/)){
				rtn += author + ', ';
			}
		});

		return mdParser.makeHtml(rtn.substr(0, rtn.length -2).trim());
	};

	// inject on keypress
	$('#kitName').keyup(function(){
		frame.document.querySelector('header > hgroup > h1').innerHTML = $('#kitName').val() || $('#kitName').attr('placeholder');
	});

	$('#kitAuthor').keyup(function(){
		frame.document.querySelector('#made-by').innerHTML = makeAuthorHTML($(this).val());
	});

	$('#kitShortDescription').keyup(function(){
		frame.document.querySelector('header > hgroup > h2').innerHTML = mdParser.makeHtml($(this).val());
	});

	$('#kitContent').keyup(function(){
		frame.document.querySelector('main').innerHTML = mdParser.makeHtml($(this).val());
	});

	// inject initial state
	frame.document.querySelector('main').innerHTML = mdParser.makeHtml($('#kitContent').val());
	frame.document.querySelector('header > hgroup > h2').innerHTML = mdParser.makeHtml($('#kitShortDescription').val());
	frame.document.querySelector('#made-by').innerHTML = makeAuthorHTML($('#kitAuthor').val() || $('#kitAuthor').attr('placeholder'));
	frame.document.querySelector('header > hgroup > h1').innerHTML = $('#kitName').val() || $('#kitName').attr('placeholder');
});