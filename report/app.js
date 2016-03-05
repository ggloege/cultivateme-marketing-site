var app = angular.module('irislist', []);

app.controller('MainCtrl', ['$scope', function($scope, $sce) {
	$scope.irises = [
		{name: "Gabe Gloege", irisUrl: "http://52.91.231.213/index?token=460965676e0f44a50a3f2fc91855a484"},
		{name: "Doug Weitz", irisUrl: "http://52.91.231.213/index?token=a92583167c2a62c53a684e8cf8061a45"},
		{name: "Greg Reichert", irisUrl: "http://52.91.231.213/index?token=5d38b13f826005af84ae4514a1ce35de"},
		{name: "Matt Lebo", irisUrl: "http://52.91.231.213/index?token=1e3c0d892ba24754f7f9f2afa40cf49a"},
		{name: "Judie Taylor", irisUrl: "http://52.91.231.213/index?token=3a73e13837cd470b53cb96a223b8dfbb"},
		{name: "Bar Owner", irisUrl: "http://52.91.231.213/index?token=374f699322441e2d638fc521a0019097"},
		{name: "Lighting Designer", irisUrl: "http://52.91.231.213/index?token=a2a2125a5857b5cdb85d30a334045c5a"},
		{name: "Personal Trainer (Doug)", irisUrl: "http://52.91.231.213/index?token=aa84cd98a86eb25f89d764cf5d934892"},
		{name: "Personal Trainer (Gabe", irisUrl: "http://52.91.231.213/index?token=34f8afed23a3cfbbd429c34d82f6a8ab"},
		{name: "Car Salesman", irisUrl: "http://52.91.231.213/index?token=5e46ea95217bc519256f45a829e82d9b"},
		{name: "Software Engineer", irisUrl: "http://52.91.231.213/index?token=cef9167f67b69721d90e6d56e1166def"},
		{name: "Food Scientist", irisUrl: "http://52.91.231.213/index?token=d9358b71a069063eb3a6686fdabd041d"},
		{name: "Geneologist", irisUrl: "http://52.91.231.213/index?token=7c87eea7121356fe87d44487f53035fa"},
		{name: "Casting Director", irisUrl: "http://52.91.231.213/index?token=9668cec3d2679db74a71799af40e3240"},
		{name: "Funeral Director", irisUrl: "http://52.91.231.213/index?token=a9e6af173eba755a5c143637cacf6261"},
		{name: "Physician's Assistant", irisUrl: "http://52.91.231.213/index?token=3a90238fe668e21b9b0497c37efa9c29"},
		{name: "Joey Cota", irisUrl: "http://52.91.231.213/index?token=05cc8da9bba78881693f2e57bb367df2"},
		{name: "Ted Weitz", irisUrl: "http://52.91.231.213/index?token=1d4621db3d6c84adcfc0b45da1e19d39"},
		{name: "Michael Mezzancello", irisUrl: "http://52.91.231.213/index?token=befedf16438f3854e145d6621c76f80f"},
		{name: "Mark Duslak", irisUrl: "http://52.91.231.213/index?token=7953ffd4cc89490c0dcdb995ac5d75d5"},
		{name: "Rodger Stevens", irisUrl: "http://52.91.231.213/index?token=d1e3385abc94195d5cc226eb184770f2"},
		{name: "Brandon Rigoli", irisUrl: "http://52.91.231.213/index?token=a872a91cc67b93fba12ad7bf34778c89"},
		{name: "Daniel Diorio", irisUrl: "http://52.91.231.213/index?token=d59879216c432110949fb29c2d48385a"},
		{name: "izak", irisUrl: "http://52.91.231.213/index?token=93d556302d37a149475d7641206ff4f1"},
		{name: "Barbara Hockstader", irisUrl: "http://52.91.231.213/index?token=dfca34caab7f443a00fe4dfb684932bd"},
		{name: "Joni Mezzancello", irisUrl: "http://52.91.231.213/index?token=746165b85f97bc86c37a410a72500cbb"},
		{name: "Technical Cofounder - Doug", irisUrl: "http://52.91.231.213/index?token=e3d5a65daea958d2a1f461546fe6ab08"},
		{name: "Technical Cofounder - Gabe", irisUrl: "http://52.91.231.213/index?token=21cc79d0a2f83ad71a37c11d2fd90180"}
	];
	// $scope.iframeUrl = $scope.irises[0].irisUrl;
	// $scope.iframeUrl = $sce.trustAsResourceUrl($scope.iframeUrl);
	// console.log($scope.iframeUrl);
	// $scope.changeIrisUrl = function(iris) {
	// 	$scope.iframeUrl = iris.irisUrl;
	// 	console.log($scope.iframeUrl);
	// 	$scope.iframeUrl = $sce.trustAsResourceUrl($scope.iframeUrl);
	// };
}]);