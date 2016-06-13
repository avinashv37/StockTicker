var app=angular.module("yahooStockApi",[]);
app.controller("canvasText",["$scope","stockService",function($scope,stockService){
	$scope.symbol=["YHOO","T","GOOGL"];
	

	// Document ready to load a docuent automatially
		angular.element(document).ready( function(){
			var canvas = document.getElementById("paper");
			box=canvas.getContext("2d");

			stockService.value($scope.symbol,box,canvas,function(a,b){
				// $scope.pricing=a;
				// $scope.ext=b;
			});
		});
}]);

app.controller("quote",["$scope","stockService",function($scope,stockService){
	

	// add button
	$scope.add= function(){
		//add the input in array
		
		if($scope.symbol.indexOf($scope.inputSymbol)<0 ||$scope.symbol.length==0)
		{
			$scope.symbol.push($scope.inputSymbol);
		} 

		// Clear content from the canvas
		canvas = document.getElementById('paper');
		ctx = canvas.getContext('2d');
		clearInterval(interval1);
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// restart the content in canvas
			stockService.value($scope.symbol,box,canvas,function(a,b){
				// $scope.pricing=a;
				// $scope.ext=b;
			});
		
	}

	// subtract button
	$scope.subtract = function(){
		//delete the input from array
		// var index = $scope.symbol.indexOf($scope.inputSymbol);
		// $scope.symbol.slice(index,1);
		$scope.symbol.pop();

		// Clear content from the canvas
		canvas = document.getElementById('paper');
		ctx = canvas.getContext('2d');
		clearInterval(interval1);
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// restart the content in canvas
			stockService.value($scope.symbol,box,canvas,function(a,b){

			});
	}

}]);


app.service("stockService",["$http",function($http){

	var getStock={};

		getStock.value = function(symbol,box,canvas,cb){

			symbolArray=[];
			priceArray=[];
			changeArray=[];
		
				
			for(i=0;i<symbol.length;i++)
			{
					
				$http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D"+
					"'http%3A%2F%2Fdownload.finance.yahoo.com%2Fd%2Fquotes.csv%3Fs%3D"+symbol[i]+"%26f%3Dsl1d1t1c1ohgv%26e%3D.csv"+
					"'%20and%20columns%3D'symbol%2Cprice%2Cdate%2Ctime%2Cchange%2Ccol1%2Chigh%2Clow%2Ccol2'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys")
				.then(function(resp){
					symbol=resp.data.query.results.row.symbol;
					price=resp.data.query.results.row.price;
					change=resp.data.query.results.row.change;
					

					symbolArray.splice(i,0,symbol)
					priceArray.splice(i,0,price)
					changeArray.splice(i,0,change)
					swap(symbol,price,change);
					//cb(p,c);
				},function(resp){

				});


			}
			temp="";
			ext="";
			box.fillStyle="white";
			box.fillRect(0,0,canvas.width,canvas.height);
			var posX=canvas.width;
				
			interval1=setInterval( moveText,30);

			function moveText(){
				box.fillStyle="white";
				box.fillRect(0,0,canvas.width,canvas.height);
				
				posX-=1;
					if(posX==-(ext.length)*20)
					{
						posX=canvas.width;
					}
				// instantiating text size to be 0
				sizeSymbol=0;sizePrice=0;sizeChange=0;sizetemp=0
				box.fillStyle="black";
				box.beginPath();
				box.font="30px Helvetica";
				for(i=0;i<symbolArray.length;i++)
				{	
					//calculates size of the text and adds .
					sizeSymbol=box.measureText(symbolArray[i]).width+sizetemp;
					sizePrice=sizeSymbol+box.measureText(priceArray[i]).width;
					sizeChange=sizePrice+box.measureText(changeArray[i]).width;

					// assigning 3 fill text for 3 variables
						box.fillStyle="black"
						box.fillText(symbolArray[i],posX+sizetemp,50);
						box.fillStyle="black"
						box.fillText(priceArray[i],posX+sizeSymbol+20,50);
						if(changeArray[i]<0){
						box.fillStyle="red"}
						if(changeArray[i]>0)
						{box.fillStyle="green"}
						box.fillText(changeArray[i],posX+sizePrice+40,50);

						// change the 150 value to increase + or decrease - distance in teh next cycle
						sizetemp=150+sizeChange;
				}

				box.closePath();
						
			}

			// swaping to for a string of all variables to get a string of all variables together
			function swap(symbol,price,changes)
			{

				temp=ext;
				ext=symbol+":"+price+","+change+"   ";
				ext=temp+ext;
			}

		};
		return getStock;

}]);
