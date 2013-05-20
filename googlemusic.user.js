// ==UserScript==
// @name Google Music Highres Screensaver
// @description Makes Google Music use High Resoultion background images in the fullscreen screensaver mode
// @match *://play.google.com/music/listen*
// ==/UserScript==

(function () {
	var ssNode;
	var artObserver = new MutationObserver(artObserverCallback);

	artObserver.observe(document.body, {childList: true});

	if((ssNode = document.querySelector("body > .screensaver")) != null)
		observeSSNode(ssNode);

	function observeSSNode(ssNode) {
		var artNodes = ssNode.querySelectorAll(".art-image");
		for(var i=0;i<artNodes.length;i++) {
			fixArtUrl(artNodes[i]);
			artObserver.observe(artNodes[i], {attributes: true});
		}

		artObserver.observe(ssNode, {childList: true, subtree: true});
	}

	function artObserverCallback(records, observer) {
		for(var i=0;i<records.length;i++) {
			if(records[i].type == "attributes") {
				if(records[i].attributeName = "src")
					fixArtUrl(records[i].target);
			}
			else if(records[i].type == "childList")
				for(var j=0;j<records[i].addedNodes.length;j++) {
					var node = records[i].addedNodes[j];
					if(node.className == "art-image") {
						artObserver.observe(node, {attributes: true});
					}
					else if(node.className == "screensaver") {
						observeSSNode(node);
					}
				}
		}
	}

	function fixArtUrl(img) {
		if(img.src && img.src.indexOf("=s2560", img.src.length - 6) === -1)
			img.src = img.src.replace(/(?:=[-0-9a-z]*)?$/, "=s2560");
	}
})();