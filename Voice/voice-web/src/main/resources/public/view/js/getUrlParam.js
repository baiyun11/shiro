/*
* @Author: zhang.wei121
* @Date:   2018-08-02 15:11:22
* @Last Modified by:   zhang.wei121
* @Last Modified time: 2018-08-02 15:11:53
*/

'use strict';

(function($){
	$.getUrlParam=function(name){
		var reg=new RegExp("(^|&)"+name +"=([^&]*)(&|$)");
		var r=window.location.search.substr(1).match(reg);
		if(r!=null)return unescape(r[2]); return null;
	}
})(jQuery);
