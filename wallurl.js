function fetchImage(wallID,firebaseNode,callback) {
    
    var wallbase = firebaseNode;
    wallbase.child("registry").child(wallID).once("value",
        function(snapshot) {
            var o = snapshot.val();
            if(o) {
                if(o.image) {
                    callback(o);
                }
                else {
                    fetchScreenshot(o.url,
                        function(imageURL) {
                            wallbase.child("registry").child(id).child("image").set(imageURL,
                                function(error) {
                                    console.log(o);
                                });
                        });
                }
            }
        });
    
    function fetchScreenshot(url,callback) {
        
        //  REQUEST the image
        var imageURL = "http://free.pagepeeker.com/v2/thumbs.php?size=x&url="+url;
        var url = new URL(url).href;
        
        var xhr = createCORSRequest("GET",imageURL);
        xhr.send();
        
        //  CHECK if it's ready
        var readyURL = "http://free.pagepeeker.com/v2/thumbs_ready.php?size=x&url="+url;
        var xhr = createCORequest("GET",readyURL);

        xhr.onerror = function(error) {
            console.log(error);
        };
        
        xhr.onload =
            function(responseText) {
                var obj = JSON.parse(responseText);
                if(obj.isReady) {
                    callback(imageURL);
                }
                else {
                    xhr.send();
                }
            });
        xhr.send();
    }
    
    // Create the XHR object.
    function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            // XHR for Chrome/Firefox/Opera/Safari.
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            // XDomainRequest for IE.
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            // CORS not supported.
            xhr = null;
        }
        return xhr;
    }

}