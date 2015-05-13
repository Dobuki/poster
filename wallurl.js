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
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET",
            imageURL
            ,true);
        xmlhttp.send();
        
        //  CHECK if it's ready
        var xmlhttp = new XMLHttpRequest();
        var readyURL = "http://free.pagepeeker.com/v2/thumbs_ready.php?size=x&url="+url;
        xmlhttp.onreadystatechange=function() {
          if (xmlhttp.readyState==4 && xmlhttp.status==200) {
                var obj = JSON.parse(xmlhttp.responseText);
                if(obj.isReady) {
                    callback(imageURL);
                }
                else {
                    xmlhttp.send();
                }
            }
        };   
        xmlhttp.open("GET",
            readyURL
            ,true);
        xmlhttp.send();        
    }
    
    
}