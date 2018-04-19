function doSomeThing()
{
var name = prompt("Enter Phone" , "");
var timeout = prompt("Enter Timeout" , "")
var quantity = prompt("Enter Quantity" , "")
var price = prompt("Enter Price" , "");
var ajaxparam = {
	url: "http://localhost:9999/start-deal?model="+name+"&time="+timeout+"&quantity="+quantity+"&price="+price, 
        success: function(data) {
            console.log(data);
        },
        error: function(data) {
             console.log(data);
             alert ("error");
        }
};

$.ajax(ajaxparam);


/** post
var ajaxparam = {
	url: "http://54.148.248.214:8080/calc/sum", 
        data: {num1: 20, num2: 30 },
        success: function(data) {
            console.log(data);
        },
        error: function(data) {
             console.log(data);
             alert ("error");
        }
};

$.ajax(ajaxparam);
**/
}
