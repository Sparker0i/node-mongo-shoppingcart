function doSomeThing()
{
var name = prompt("Enter Phone" , "");
var username = prompt("Enter Username" , "")
var qty = prompt("Enter Quantity" , "")
var ajaxparam = {
	url: "http://localhost:9999/buy?model="+name+"&username="+username+"&qty="+qty, 
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
