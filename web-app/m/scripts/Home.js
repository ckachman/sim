/**
HOME MOBILE APP -- the home page with all the main app buttons

@class m.apps.Home
@augments appProto
*/
/*global $:true, u:true, m:true, window:true, document:true, pageload:true, m.apps:true */

m.apps.Home = {
/**
Individual page functions	
Any function named the same as a pagefrag ID will get called automatically after that pagefrag html 
loads (and is visible). 
Each pagefrag is responsible for itself and for calling the next one.
*/
	M001: function (data) { 
		// pull in homeUrls and load buttons.
		var str = '';
		for (var i in data.homeUrls) {
			if ($('.btn_' + i).length === 0) {
				str = [str, '<a class="app_btn btn_'+i+'" app="'+i+'" rel="'+data.homeUrls[i]+'"></a>'].join('');
			}
		}
		$('#M001 form').prepend(str);
	}
};
