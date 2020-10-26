module.exports =
        function getSession(){
            var xhr = new XMLHttpRequest();
            // we defined the xhr

            xhr.onreadystatechange = function () {
                if (this.readyState != 4) return;

                if (this.status == 200) {
                    var data = this.responseText;
                    console.log(data);
                    showLogin(data);

                    // we get the returned data
                }

                // end of state change: it can be after some time (async)
            };

            xhr.open('GET', "getSession", true);
            xhr.send();
        }