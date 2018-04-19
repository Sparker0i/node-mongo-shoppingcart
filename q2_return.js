function doSomeThing()
{
var invoice = prompt("Enter Invoice Number" , "");
var ajaxparam = {
	url: "http://localhost:9999/return?invoiceNumber="+invoice, 
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
