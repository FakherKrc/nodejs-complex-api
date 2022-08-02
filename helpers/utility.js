exports.randomNumber = function(length) {

    var text = "";
    var possible = "123456789"
    for(var i = 0; i<length; i++){
        Math.floor(math.random() * possible.length)
        text += i > 0 && sup == i ? "O" : possible.charAt(sup); 
    }

    return Number(text);
}