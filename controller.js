var app = angular.module('app', []).controller('mainCtrl', function($scope) {
  $scope.productsW = [],
  $scope.productsB = [],
  $scope.htmlDecode = function htmlDecode(input){
  var e = document.createElement('div');
  e.innerHTML = input;
  return e.childNodes[0].nodeValue;
  },
  $scope.search = function (product) {
      $("body").css("cursor", "progress");
      $scope.productsW = [];
      $scope.productsB = [];
      var nameW, nameB, categoryW, categoryB, urlW, urlB;
      if(product.name)
      {
        nameB = 'name=' + product.name + '*&';
        nameW = 'query=' + product.name + '&';
      }
      else
      {
        nameB = '';
        nameW = 'query=*&';
      }
      switch (product.category) {
        case '0':
          categoryB = 'salePrice>1';
          categoryW = '3944';
          break;
        case '1':
          categoryB = 'categoryPath.name=3D Printers';
          categoryW = '3944_1228636';
          break;
        case '2':
          categoryB = 'categoryPath.name=All Desktops';
          categoryW = '3944_3951_132982';
          break;
        case '3':
          categoryB = 'categoryPath.name=Games';
          categoryW = '2636';
          break;
        case '4':
          categoryB = 'categoryPath.name=iPad';
          categoryW = '3944_1229722_1229728';
          break;
        case '5':
          categoryB = 'categoryPath.name=iPhone';
          categoryW = '3944_1229722_1229734';
          break;
        case '6':
          categoryB = 'categoryPath.name=Laptops';
          categoryW = '3944_3951_132960';
          break;
        case '7':
          categoryB = 'categoryPath.name=Monitors';
          categoryW = '3944_3951_1230331';
          break;
        case '8':
          categoryB = 'categoryPath.name=Routers';
          categoryW = '3944_3951_126297';
          break;
        case '9':
          categoryB = 'categoryPath.name=Cell Phones';
          categoryW = '3944_542371';
          break;
        case '10':
          categoryB = 'categoryPath.name=All Printers';
          categoryW = '3944_3951_37807';
          break;
        case '11':
          categoryB = 'categoryPath.name=All Tablets';
          categoryW = '3944_1078524';
          break;
        case '12':
          categoryB = 'categoryPath.name=TVs';
          categoryW = '3944_1060825_447913';
          break;
        default:
          categoryB = 'salePrice>1';
          categoryW = '3944';
          break;

      }
      urlB = "//api.bestbuy.com/v1/products(" + nameB + categoryB + ")";
      urlW = "http://api.walmartlabs.com/v1/search?" + nameW + "format=json&categoryId=" + categoryW + "&apiKey=ph7azxukzfkf3trxc2zs4e9m";
      console.log(urlB);
      console.log(urlW);
      // We had to use $.ajax instead of $http because the Best Buy is only compatible with ajax
      $.ajax({
        method: 'GET',
        url:  urlB,
        data: {
          format: 'json',
          apiKey: 'c9xwjxw9c7zcssmbgc2zxpx7'
        },
        cache: true,
        dataType: 'jsonp'
      }).always(
      function(result) {
        if (!result.error && result.products) {
          console.log('success');
          console.log(result.products);
          for (var i = 0; i < result.products.length; i++) {
            var available;
            var description;
            console.log(i);
            if (result.products[i].onlineAvailability)
            {
              available = "In Stock";
            }
            else
            {
              available = "Out of Stock";
            }
            if (result.products[i].shortDescription)
            {
              description = $scope.htmlDecode(result.products[i].shortDescription);
            }
            else
            {
              description = "";
            }
            $scope.productsB.push({
             name: result.products[i].name,
             imgUrl: result.products[i].image,
             shortDescription: description,
             price: result.products[i].salePrice,
             availability: available,
             rating: result.products[i].customerReviewAverage,
             productUrl: result.products[i].url,
           });
           $scope.$digest();
         }
        } else {
          output = "Unable to access products (see browser console for more information)";
          console.log(result);
        }
      }
      );
      // We had to use $.ajax instead of $http because the Walmart is only compatible with ajax
      $.ajax({
        url: urlW,
        dataType: 'jsonp',
        success: function( data ){

          console.log(data.items);
          if(data.items)
          {
            for (var i = 0; i < data.items.length; i++) {
              var available;
              var description;
              console.log(i);
              if (data.items[i].availableOnline)
              {
                available = "In Stock";
              }
              else
              {
                available = "Out of Stock";
              }
              if (data.items[i].shortDescription)
              {
                description = $scope.htmlDecode(data.items[i].shortDescription);
              }
              else
              {
                description = "";
              }
             $scope.productsW.push({
               name: data.items[i].name,
               imgUrl: data.items[i].mediumImage,
               shortDescription: description,
               price: data.items[i].salePrice,
               availability: available,
               rating: data.items[i].customerRating,
               productUrl: data.items[i].productUrl
             });
             $scope.$digest();
             $("body").css("cursor", "default");
            }
          }

        }
      })
      product.name = '';
  }
});

app.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

app.directive('product', avatarDirective);

function avatarDirective () {
  return {
    scope: {
      product: '='
    },
    restrict: 'E',
    template: (
      '<br/>' +
      '<div class="row boxColor">' +
        '<div class="row">' +
          '<img class="productImage" ng-src="{{product.imgUrl}}" />' +
        '</div>' +
        '<div class="row">' +
          '<h4>{{product.name}}</h4>' +
        '</div>' +
        '<div class="row">' +
          "<p ng-bind-html='product.shortDescription | sanitize'></p>" +
        '</div>' +
        '<div class="row">' +
          '<div class="col-xs-6">' +
            '<h4>Price: ${{product.price}}</h4>' +
          '</div>' +
          '<div class="col-xs-6">' +
            '<h4>Rating: {{product.rating}}</h4>' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-xs-12">' +
            '<h4>Availability: {{product.availability}}</h4>' +
          '</div>' +
        '</div>' +
        '<div class="row">' +
          '<div class="col-xs-12">' +
            "<a href='{{product.productUrl}}'>Go to site</a>" +
          '</div>' +
        '</div>' +
      '</div>' +
      '<br/>'
    )
  };
}
