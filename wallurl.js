//function requestSiteImage(wall

function fetchImage(wallID,firebaseNode,callback) {
    
    var wallbase = firebaseNode;
    wallbase.child("registry").child(wallID).on("value",
        function(snapshot) {
            var o = snapshot.val();
            if(o) {
                callback(o);
            }
        });
    
    function fetchScreenshot(url,callback) {
        
        //
        http://api.page2images.com/restfullink?p2i_url=http://www.dobuki.com&p2i_device=6&p2i_screen=1024x768&p2i_size=300x300&p2i_imageformat=jpg&p2i_wait=0&p2i_key=68a9464390f1efcf
        
        
        //  REQUEST the image
        var imageURL = "http://free.pagepeeker.com/v2/thumbs.php?size=x&url="+url;
        var url = new URL(url).href;
        
        var xhr = createCORSRequest("GET",imageURL);
        xhr.send();
        
        //  CHECK if it's ready
        var readyURL = "http://free.pagepeeker.com/v2/thumbs_ready.php?size=x&url="+url;
        var xhr = createCORSRequest("GET",readyURL);

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
            };
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