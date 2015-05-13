function key(url) {
    var url = new URL(url);
    return url.host.split(".").join("_")+":"+CryptoJS.MD5(url.href);
}

function resolveURL(url,wallID,firebaseNode) {
    var wallbase = firebaseNode;
    function fetchWallID(callback) {
        wallbase.child("count").transaction(
            function(count) {
                return count+1;
            },
            function(error,commited,snapshot) {
                var count = snapshot.val();
                callback(count.toString(16));
            }
        );
    }

    function setWall(id,url,callback) {
        var url = new URL(url).href;
        wallbase.child("registry").child(id).set(
            {
                url:url,
                type:"url",
                updated:Firebase.ServerValue.TIMESTAMP
            },
            function(error) {
                if(!error) {
                    completedStep(1);
                }
            }
        );


        wallbase.child("lookup").child(key(url)).set(
            {
                url:url,
                id:id
            },
            function(error) {
                if(!error) {
                    completedStep(2);
                }
            }
        );

        var bits = 0;
        function completedStep(step) {
            bits |= step;
            if(bits==3) {
                callback();
            }
        }
    }

    function resetPage() {
        location = "#wallID="+wallID;
    }

    if(!wallID) {
        wallbase.child("lookup").child(key(url)).once("value",
            function(snapshot) {
                var o = snapshot.val();
                if(!o) {
                    fetchWallID(
                        function(id) {
                            wallID = id;
                            setWall(id,url,resetPage);
                        }
                    );
                }
                else {
                    wallID = o.id;
                    resetPage();
                }
            });
    }
    else {
        setWall(wallID,url,resetPage);
    }
}