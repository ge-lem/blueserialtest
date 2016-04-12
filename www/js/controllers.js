
function stringToBytes(string) {
  var array = new Uint8Array(string.length);
  for (var i = 0, l = string.length; i < l; i++) {
    array[i] = string.charCodeAt(i);
  }
  return array.buffer;
}

function bytesToString(buffer) {
  return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

function uinttoa(buf) {

  var array = new Uint8Array(buf.length);
  for (var i = 0, l = buf.length; i < l; i++) {
    array[i] = buf[i];
  }
  //console.log(JSON.stringify(array));
  return array.buffer;
}

ctrlble = function($scope, $timeout) {


  redbear = {
    /** @lends {CochiseMobile.redbear} */
    /** Service UUID */
    serviceUUID: "713D0000-503E-4C75-BA94-3148F18D941E",
    txCharacteristic: "713D0003-503E-4C75-BA94-3148F18D941E", // transmit is from the phone's perspective
    rxCharacteristic: "713D0002-503E-4C75-BA94-3148F18D941E" // receive is from the phone's perspective
  };
  $scope.devices = [];
  $scope.rx = "";
  $scope.tx = "";
  $scope.log = "Log";

  this.success = function()
  {
      $scope.log="Sucess";
      $timeout(function() {
      $scope.$apply();
      }, 0);
  }
  this.fail = function(mess )
  {
      $scope.log="Fail" +mess;
      $timeout(function() {
      $scope.$apply();
      }, 0);
  }

  if(ionic.Platform.isAndroid())
  {
    ionic.Platform.ready(function(){

      ble.scan([], 5, function(device) {
          console.log(JSON.stringify(device));
          $scope.devices.push(device);
          $timeout(function() {
          $scope.$apply();
          }, 0);
      }, this.fail);
    });
  }
  else {
    $scope.devices.push({name:"Device 1"});
    $scope.devices.push({name:"Device 2"});
  }

  $scope.connectionState = 0;

    $scope.connect = function()
    {
      if($scope.connectionState)
      {
        ble.disconnect($scope.device.id,this.success,this.fail);
        ble.stopNotification($scope.device.id, redbear.serviceUUID, redbear.rxCharacteristic,this.success,this.fail);
        $scope.connectionState = 0;
      }else {

        ble.connect($scope.device.id, function(){
          $scope.connectionState = 1;
          ble.startNotification($scope.device.id, redbear.serviceUUID, redbear.rxCharacteristic, function(data) {
            $scope.rx+=bytesToString(data);
            $timeout(function() {
            $scope.$apply();

            var textarea = document.getElementById('rx');
            textarea.scrollTop = textarea.scrollHeight;
            }, 0);
          },this.fail);
          $timeout(function() {
          $scope.$apply();
          }, 0);
        }, function(mess)
        {
          $scope.connectionState =0;

          $timeout(function() {
          $scope.$apply();
          }, 0);
        });
      }
    }


    $scope.scan = function()
    {
      $scope.devices=[];
      ble.scan([], 5, function(device) {
          console.log(JSON.stringify(device));
          $scope.devices.push(device);
          $timeout(function() {
          $scope.$apply();
          }, 0);
      }, this.fail);
    }
    $scope.send = function()
    {
      ble.writeWithoutResponse($scope.device.id, redbear.serviceUUID, redbear.txCharacteristic, stringToBytes("ATT14"+$scope.tx+"\r\n"), this.success, this.fail);
    }
    $scope.atv = function()
    {
      if(ionic.Platform.isAndroid())
      {
          ble.writeWithoutResponse($scope.device.id, redbear.serviceUUID, redbear.txCharacteristic, stringToBytes("AT/V\r\n"), this.success, this.fail);


      } else {
        console.log($scope.device);
        $scope.rx+=JSON.stringify($scope.device)+"\r\n";
        var textarea = document.getElementById('rx');
        textarea.scrollTop = textarea.scrollHeight;
      }

    }
    $scope.att24 = function()
    {
      ble.writeWithoutResponse($scope.device.id, redbear.serviceUUID, redbear.txCharacteristic, stringToBytes("ATT24\r\n"), this.success, this.fail);
    }
    $scope.esc = function()
    {
      ble.writeWithoutResponse($scope.device.id, redbear.serviceUUID, redbear.txCharacteristic, (new Uint8Array([0x1B, 0x0D])).buffer, this.success, this.fail);
    }
    $scope.clear = function()
    {
      $scope.rx="";
    }

}



ctrlblue = function($scope, $timeout) {


  $scope.devices = [];
  $scope.rx = "";
  $scope.tx = "";
  $scope.log = "Log";
  var self =this;
  self.success = function()
  {
      $scope.log="Sucess";
      $timeout(function() {
      $scope.$apply();
      }, 0);
  }
  self.fail = function(mess )
  {
      $scope.log="Fail" +mess;
      $timeout(function() {
      $scope.$apply();
      }, 0);
  }

  if(ionic.Platform.isAndroid())
  {
    ionic.Platform.ready(function(){

      bluetoothSerial.list(function(devices) {
          console.log(JSON.stringify(devices));
          $scope.devices=devices;
          $timeout(function() {
          $scope.$apply();
          }, 0);
      }, self.fail);
    });
  }
  else {
    $scope.devices.push({name:"Device 1"});
    $scope.devices.push({name:"Device 2"});
  }

  $scope.connectionState = 0;

    $scope.connect = function()
    {
      if($scope.connectionState)
      {
        bluetoothSerial.disconnect(self.success, self.fail,$scope.device.id);
        bluetoothSerial.unsubscribeRawData(self.success, self.fail,$scope.device.id);
        $scope.connectionState = 0;
      }else {

        bluetoothSerial.connect($scope.device.id, function(){
          $scope.connectionState = 1;
          bluetoothSerial.subscribeRawData(function(data) {
            $scope.rx+=bytesToString(data);
            $timeout(function() {
            $scope.$apply();

            var textarea = document.getElementById('rx');
            textarea.scrollTop = textarea.scrollHeight;
            }, 0);
          },self.fail,$scope.device.id);
          $timeout(function() {
          $scope.$apply();
          }, 0);
        }, function(mess)
        {
          $scope.connectionState =0;

          $timeout(function() {
          $scope.$apply();
          }, 0);
        });
      }
    }


    $scope.send = function()
    {
      bluetoothSerial.write(stringToBytes("ATT14"+$scope.tx+"\r\n"), self.success, self.fail,$scope.device.id);
    }
    $scope.atv = function()
    {
      if(ionic.Platform.isAndroid())
      {
          bluetoothSerial.write( stringToBytes("AT/V\r\n"), self.success, self.fail,$scope.device.id);


      } else {
        console.log($scope.device);
        $scope.rx+=JSON.stringify($scope.device)+"\r\n";
        var textarea = document.getElementById('rx');
        textarea.scrollTop = textarea.scrollHeight;
      }

    }
    $scope.att24 = function()
    {
      bluetoothSerial.write( stringToBytes("ATT24\r\n"), self.success, self.fail,$scope.device.id);
    }
    $scope.esc = function()
    {
      bluetoothSerial.write( (new Uint8Array([0x1B, 0x0D])).buffer, self.success, self.fail,$scope.device.id);
    }
    $scope.clear = function()
    {
      $scope.rx="";
    }

}

angular.module('starter.controllers', [])

.directive('showTail', function () {
    return function (scope, elem, attr) {
        scope.$watch(function () {
            return elem[0].value;
        },
        function (e) {
            elem[0].scrollTop = elem[0].scrollHeight;
        });
    }

})

.controller('DashCtrl', ctrlblue)

.controller('ChatsCtrl', ctrlblue)

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
});
