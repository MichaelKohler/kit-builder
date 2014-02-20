/* global $, Showdown */

// Array Remove - By John Resig (MIT Licensed)
if(!Array.prototype.remove) Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

$('#previewFrame').load(function(){
	var frame    = this.contentWindow,
		mdParser = new Showdown.converter();

	// get kit authors and convert into makes.org links
	var makeAuthorHTML = function(input){
		var rtn = 'Made by ';
		if(!input) return rtn;

		input = splitCommaSeparatedList(input);
		
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

	var splitCommaSeparatedList = function(str){
		var rtn = str.split(/, ?/);
		rtn.forEach(function(el, idx, ary){
			el = el.trim();
			if(el === ''){
				ary.remove(idx);
			}
		});
		return rtn;
	};

	// inject on keypress
	$('#kitName').keyup(function(){
		frame.document.querySelector('header > hgroup > h1').innerHTML = $(this).val() || $(this).attr('placeholder');
	});

	$('#kitAuthor').keyup(function(){
		frame.document.querySelector('#made-by').innerHTML = makeAuthorHTML($(this).val() || $(this).attr('placeholder'));
	});

	$('#kitShortDescription').keyup(function(){
		frame.document.querySelector('header > hgroup > h2').innerHTML = mdParser.makeHtml($(this).val());
	});

	$('#kitThumbnail').keyup(function(){
		frame.document.querySelector('#header-image').src = $(this).val() || $(this).attr('placeholder');
	});

	$('#kitContent').keyup(function(){
		frame.document.querySelector('main').innerHTML = mdParser.makeHtml($(this).val());
	});

	$('#kitTags').keyup(function(e){
		var tagList = $(this).val() || $(this).attr('placeholder'),
			tagListAside = '';

		tagList = splitCommaSeparatedList(tagList);

		tagList.filter(function(tag){
			tagListAside += '<li><a href="https://webmaker.org/t/'+tag+'" target="_blank">#'+tag+'</a></li>';

			if(!frame.document.querySelector('meta[name="webmaker:tags"][content="'+tag+'"]')){
				var meta = document.createElement('meta');
				meta.name = 'webmaker:tags';
				meta.content = tag;
				frame.document.head.appendChild(meta);
			}
		});

		tagListMeta = frame.document.querySelectorAll('meta[name="webmaker:tags"]');
		Array.prototype.forEach.call(tagListMeta, function(element){
			if(tagList.indexOf(element.content) === -1 && element.content !== 'kit' && element.content !== 'kit-builder'){
				element.parentNode.removeChild(element);
			}
		});

		frame.document.querySelector('aside > .tags > ul').innerHTML = tagListAside;
	});

	// inject initial state
	frame.document.querySelector('main').innerHTML = mdParser.makeHtml($('#kitContent').val());
	frame.document.querySelector('header > hgroup > h2').innerHTML = mdParser.makeHtml($('#kitShortDescription').val());
	frame.document.querySelector('#made-by').innerHTML = makeAuthorHTML($('#kitAuthor').val() || $('#kitAuthor').attr('placeholder'));
	frame.document.querySelector('header > hgroup > h1').innerHTML = $('#kitName').val() || $('#kitName').attr('placeholder');
	frame.document.querySelector('#header-image').src = $('#kitThumbnail').val() || $('#kitThumbnail').attr('placeholder');
});
