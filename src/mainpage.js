let xhttp = new XMLHttpRequest();
xhttp.open('GET', 'http://localhost:9699/test', true);
xhttp.send(null);
xhttp.onreadystatechange = function() {
    if (xhttp.readyState == XMLHttpRequest.DONE) {
        let test = document.getElementById('test');
        let ctx = test.getContext('2d');
        let json = JSON.parse(xhttp.responseText);
        console.log(json);
        // json.forEach((board) => {
        //     console.log('b');
        //     board.strips.forEach((strip) => {
        //         console.log('s');
        //
        //         strip.elements.forEach((element) => {
        //             console.log(element);
        //             ctx.rect(element.x, element.y, element.height, element.width);
        //         });
        //     });
        // });
        json[0].strips[0].elements.forEach((element, index)=> {
            ctx.rect(element.x, element.y, element.height, element.width);
        });
        ctx.stroke();
    }
};
