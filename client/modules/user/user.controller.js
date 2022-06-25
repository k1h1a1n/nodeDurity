(function() {
  "use strict";

  angular
    .module("app.user", [])
    .controller("UserController", UserController)
    .filter("trusteefilter", function($filter) {
      return function(list, arrayFilter, element) {
        if (arrayFilter) {
          return $filter("filter")(list, function(listItem) {
            return arrayFilter.indexOf(listItem[element]) === -1;
          });
        }
      };
    })
    .constant("config", {
      Beneficiary1: "Beneficiary1",
      Beneficiary2: "Beneficiary2",
      Beneficiary3: "Beneficiary3"
    });

  UserController.$inject = [
    "$document",
    "$scope",
    "$http",
    "$cookies",
    "config",
    "$state",
    "$timeout",
    "UserFactory",
    "logger",
    "Upload",
    "$stateParams",
    "$filter"
  ];

  /* @ngInject */
  function UserController(
    $document,
    $scope,
    $http,
    $cookies,
    config,
    $state,
    $timeout,
    UserFactory,
    logger,
    Upload,
    $stateParams,
    filter
  ) {
    var vm = this;
    vm.resetCred = vm.editProfile = vm.loginCred = {};
    vm.UserFactory = UserFactory;
    var doc = $document[0];
    vm.Files = {};

    $scope.getmytrusteeIds = function(myitems) {
      var data = [];
      angular.forEach(myitems, function(value, key) {
        data.push(value.contactId);
      });
      return data;
    };

    vm.contactList = function(success) {
      $http.get("api/Contacts/").then(
        function(response) {
          vm.contactList = response.data;
          $scope.personalDetails = response.data;
          // return response.data
        },
        function(error) {
          console.log("error");
        }
      );
    };

    $scope.addNew = function(personalDetail) {
      $scope.existingUser = false;
      $scope.personalDetails.push({
        firstName: "",
        mobilePhone: "",
        primaryEmail: null,
        relationship: "null",
        addressLine1: "",
        addressLine2: "",
        city: "",
        country: "",
        dob: "",
        gender: "",
        lastName: "",
        role: "",
        secondaryEmail: "",
        state: "",
        user_id: "",
        zipCode: ""
      });
    };

    $scope.remove = function() {
      $scope.existingUser = false;
      var newDataList = [];
      $scope.selectedAll = false;
      try {
        angular.forEach($scope.personalDetails, function(selected) {
          if (!selected.selected) {
            newDataList.push(selected);
          } else {
            if (selected._id != undefined) {
              UserFactory.deleteContact(selected._id);
            }
          }
        });
      } catch (err) {
        console.log(err);
      }
      vm.contactList = newDataList;
      $scope.personalDetails = vm.contactList;
    };

    $scope.checkAll = function() {
      if (!$scope.selectedAll) {
        $scope.selectedAll = true;
      } else {
        $scope.selectedAll = false;
      }
      angular.forEach($scope.personalDetails, function(personalDetail) {
        personalDetail.selected = $scope.selectedAll;
      });
    };

    $scope.addContacts = function() {
      var i = true;
      var keepGoing = true;
      $scope.existingUser = false;

      angular.forEach($scope.personalDetails, function(selected) {
        if (keepGoing) {
          if (selected.firstName != "") {
            if (
              selected.mobilePhone != null &&
              selected.relationship != "null"
            ) {
              if (validateEmail(selected.primaryEmail)) {
                if (selected._id) {
                  $http
                    .put("/api/Contacts/" + selected._id, {
                      contacts: selected
                    })
                    .then(function(response) {
                      if (i) {
                        logger.success(
                          "Contact successfully updated",
                          response
                        );
                        i = false;
                      }
                    });
                } else {
                  $http
                    .post("/api/Contacts", {
                      contacts: selected
                    })
                    .then(function(response) {
                      if (response.data.message === "EMAIL ALREADY EXISTS") {
                        $scope.existingUser = true;
                      } else if (response.statusText === "Created") {
                        selected._id = response.data._id;
                        $scope.personalDetails[
                          $scope.personalDetails.length - 1
                        ]._id = response.data._id;
                        $scope.personalDetails[
                          $scope.personalDetails.length - 1
                        ].user_id = response.data.user_id;
                        $scope.existingUser = false;
                        if (i) {
                          logger.success(
                            "Contact successfully added",
                            response
                          );
                          i = false;
                        }
                      }
                    });
                }
              } else {
                alert("Email ID should be valid");
              }
            } else {
              alert("All the fields are required!");
              i = false;
            }
          } else {
            alert("All the fields are required!");
            i = false;
          }
        }
      });
    };

    function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }

    var container = doc.getElementsByClassName("editor");

    var toolbarOptions = [
      ["bold", "italic", "underline", "strike"], // toggled buttons
      ["blockquote", "code-block"],

      // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      // [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      // [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      // [{ 'direction': 'rtl' }],                         // text direction

      [{ size: ["small", false, "large", "huge"] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ["clean"] // remove formatting button
    ];

    vm.refreshApiToken = function() {
      UserFactory.resetApiToken();
    };
    vm.find = function() {
      vm.editProfile = angular.copy(UserFactory.user);
    };
    vm.login = function(validated) {
      if (validated) UserFactory.login(vm);
      else logger.warning("Data not valid", vm, "Login Validation");
    };
    vm.signup = function(validated) {
      if (validated) UserFactory.signup(vm);
      else logger.warning("Data not valid", vm, "Signup Validation");
    };
    vm.forgot = function(validated) {
      if (validated) UserFactory.forgot(vm);
      else logger.warning("Data not valid", vm, "Forgot Password Validation");
    };
    vm.notifymail = function(validated) {
      if (validated) UserFactory.notifymail(vm);
      else
        logger.warning("Data not valid", vm, "Email Notification Validation");
    };
    vm.resetTokenCheck = function() {
      UserFactory.resetTokenCheck(vm);
    };
    vm.activateTokenCheck = function() {
      console.log(vm);
      UserFactory.activateTokenCheck(vm);
    };
    vm.activateToken = $stateParams.token;

    vm.reset = function(validated) {
      if (validated) UserFactory.resetpassword(vm);
      else logger.warning("Data not valid", vm, "Reset Password Validation");
    };
    vm.resetToken = $stateParams.token;
    vm.update = function(validated) {
      if (validated) UserFactory.update(vm);
      else logger.warning("Data not valid", vm, "Profile Validation");
    };
    vm.upload = function(file) {
      Upload.upload({
        url: "/api/user/photos/upload",
        data: { file: file, user: UserFactory }
      }).then(
        function(resp) {
          console.log(
            "Success " +
              resp.config.data.file.name +
              "uploaded. Response: " +
              resp.data
          );
        },
        function(resp) {
          console.log("Error status: " + resp.status);
        },
        function(evt) {
          var progressPercentage = parseInt((100.0 * evt.loaded) / evt.total); // eslint-disable-line
          console.log(
            "progress: " + progressPercentage + "% " + evt.config.data.file.name
          );
        }
      );
    };

    // upload later on form submit or something similar
    vm.submit = function(file) {
      // if ($scope.form.file.$valid && $scope.file) {
      vm.uploadFile(vm.Files.uploadFile);
      //}
    };

    // upload on file select or drop
    vm.uploadFile = function(file) {
      //  $http.post('/api/user/getcount', {
      //          file: file.name,
      //        url: 'http://localhost:3000/upload'
      //       }).then(function (response) {
      //        logger.success('File successfully uploaded', response)
      //        $scope.getMyFiles.push(response.data.result)
      //       })

      Upload.upload({
        url: "/api/user/files/upload",
        data: { file: file, user: UserFactory }
      }).then(
        function(resp) {
          console.log(resp);
          if (resp.data.error_code == 0) {
            $scope.getMyFiles.push(resp.data.result);
          }
          console.log(
            "Success " +
              resp.config.data.file.name +
              "uploaded. Response: " +
              resp.data
          );
        },
        function(resp) {
          console.log("Error status: " + resp.status);
        },
        function(evt) {
          var progressPercentage = parseInt((100.0 * evt.loaded) / evt.total); // eslint-disable-line
          console.log(
            "progress: " + progressPercentage + "% " + evt.config.data.file.name
          );
        }
      );
    };
    // for multiple files:
    // $scope.uploadFiles = function (files) {
    //   if (files && files.length) {
    //     for (var i = 0; i < files.length; i++) {
    //       Upload.upload({ data: {file: files[i]},{});
    //     }
    //     // or send them all together for HTML5 browsers:
    //     Upload.upload({..., data: {file: files}, ...})...;
    //   }
    // }

    vm.postmyfiles = function(files, beneficiaryDetail, status, type) {
      UserFactory.postmyfiles(files, beneficiaryDetail, status, type);
    };

    $scope.deleteFile = function(file) {
      var deleteConfirm = confirm("Are you sure want to delete this File?");
      if (deleteConfirm === true) {
        console.log("remove");
        var newDataList = [];
        try {
          angular.forEach($scope.getMyFiles, function(selected) {
            if (selected.file_id == file) {
              UserFactory.deleteFile(file);
              //  UserFactory.deleteFsFile(selected);
            } else {
              newDataList.push(selected);
            }
          });
        } catch (err) {
          console.log(err);
        }
        vm.getMyFiles = newDataList;
        $scope.getMyFiles = vm.getMyFiles;
      }
    };

    $scope.deleteNotes = function(notes) {
      var deleteConfirm = confirm(
        "Are you sure you want to delete this Notes?"
      );
      if (deleteConfirm === true) {
        var newDataList = [];
        //UserFactory.deleteNotes(notes);
        try {
          angular.forEach($scope.editorlist, function(selected) {
            if (selected._id == notes) {
              UserFactory.deleteNotes(notes);
            } else {
              newDataList.push(selected);
            }
          });
        } catch (err) {
          console.log(err);
        }
        vm.editorlist = newDataList;
        $scope.editorlist = vm.editorlist;
      }
    };

    doc.reSendVerificationMail = function(email) {
      UserFactory.reSendVerificationMail(email);
    };

    function fileCtrl($scope) {
      $scope.partialDownloadLink = "http://localhost:3000/download?filename=";
      $scope.filename = "";

      $scope.uploadFile = function() {
        $scope.processDropzone();
      };

      $scope.reset = function() {
        $scope.resetDropzone();
      };
    }

    vm.getMyFiles = function(success) {
      $http.get("/api/myfiles/").then(
        function(response) {
          vm.getMyFiles = response.data;
          $scope.getMyFiles = response.data;
          // return response.data
        },
        function(error) {
          console.log("error");
        }
      );
    };

    vm.editorlist = function(success) {
      $http.get("api/editor/").then(
        function(response) {
          vm.editorlist = response.data;
          $scope.editorlist = response.data;
          // console.log(vm.editorlist);
          // return response.data
        },
        function(error) {
          console.log("error");
        }
      );
    };

    $scope.selectedBeneficiary = [];
    $scope.selectedNotesBeneficiary = [];

    $scope.getMySelectedTrustees1 = function(file, checkedStatus, beneficiary) {
      var data = [];
      $scope.selectedBeneficiary1 = null;
      angular.forEach(file.Beneficiary1, function(selected) {
        if (selected.status) {
          for (var i in $scope.personalDetails) {
            if (selected.contactId == $scope.personalDetails[i]._id) {
              data.push($scope.personalDetails[i].firstName);
            }
          }
        }
      });

      if (checkedStatus) {
        data.push(beneficiary.firstName);
      } else {
        if (beneficiary) {
          var index = data.indexOf(beneficiary.firstName);
          if (index != -1) {
            var r = data.splice(index, 1);
          }
        }
      }

      if (data.length == 0) {
        data.push("Nothing Selected");
        $scope.selectedBeneficiary1 = data.toString();
      } else if (data.length >= 1) {
        if (data[0].length > 8) data[0] = data[0].substring(0, 8);
        if (data.length > 1) {
          var count = data.length - 1;
          $scope.selectedBeneficiary1 = data[0] + " +" + count.toString();
        } else {
          $scope.selectedBeneficiary1 = data.toString();
        }
      }
      return $scope.selectedBeneficiary1;
    };

    $scope.getMySelectedTrustees2 = function(file, checkedStatus, beneficiary) {
      var data1 = [];
      $scope.selectedBeneficiary2 = null;
      angular.forEach(file.Beneficiary2, function(selected) {
        if (selected.status) {
          for (var i in $scope.personalDetails) {
            if (selected.contactId == $scope.personalDetails[i]._id) {
              data1.push($scope.personalDetails[i].firstName);
            }
          }
        }
      });

      if (checkedStatus) {
        data1.push(beneficiary.firstName);
      } else {
        if (beneficiary) {
          var index = data1.indexOf(beneficiary.firstName);
          if (index != -1) {
            var r = data1.splice(index, 1);
          }
        }
      }

      if (data1.length == 0) {
        data1.push("Nothing Selected");
        $scope.selectedBeneficiary2 = data1.toString();
      } else if (data1.length >= 1) {
        if (data1[0].length > 8) data1[0] = data1[0].substring(0, 8);
        if (data1.length > 1) {
          var count = data1.length - 1;

          $scope.selectedBeneficiary2 = data1[0] + " +" + count.toString();
        } else {
          $scope.selectedBeneficiary2 = data1.toString();
        }
      }

      return $scope.selectedBeneficiary2;
    };

    $scope.getMySelectedTrustees3 = function(file, checkedStatus, beneficiary) {
      var data = [];
      $scope.selectedBeneficiary3 = null;
      angular.forEach(file.Beneficiary3, function(selected) {
        if (selected.status) {
          for (var i in $scope.personalDetails) {
            if (selected.contactId == $scope.personalDetails[i]._id) {
              data.push($scope.personalDetails[i].firstName);
            }
          }
        }
      });

      if (checkedStatus) {
        data.push(beneficiary.firstName);
      } else {
        if (beneficiary) {
          var index = data.indexOf(beneficiary.firstName);
          if (index != -1) {
            var r = data.splice(index, 1);
          }
        }
      }

      if (data.length == 0) {
        data.push("Nothing Selected");
        $scope.selectedBeneficiary3 = data.toString();
      } else if (data.length >= 1) {
        if (data[0].length > 8) data[0] = data[0].substring(0, 8);
        if (data.length > 1) {
          var count = data.length - 1;
          $scope.selectedBeneficiary3 = data[0] + " +" + count.toString();
        } else {
          $scope.selectedBeneficiary3 = data.toString();
        }
      }

      return $scope.selectedBeneficiary3;
    };

    // Onload: param-> file,null,null
    //OnChange: param -> file,true/false,ContactInfo

    $scope.getSelectedBeneficiary = function(file, checkedStatus, beneficiary) {
      var b1 = $scope.getMySelectedTrustees1(file, checkedStatus, beneficiary);
      var b2 = $scope.getMySelectedTrustees2(file, checkedStatus, beneficiary);
      var b3 = $scope.getMySelectedTrustees3(file, checkedStatus, beneficiary);

      $scope.selectedBeneficiary.push({
        Beneficiary1: b1,
        Beneficiary2: b2,
        Beneficiary3: b3
      });
      return $scope.selectedBeneficiary;
    };

    $scope.getSelectedBeneficiaryOnChange = function(
      file,
      index,
      checkedStatus,
      trusteeLevel,
      beneficiary
    ) {
      if (trusteeLevel == config.Beneficiary1) {
        var b1 = $scope.getMySelectedTrustees1(
          file,
          checkedStatus,
          beneficiary
        );
        $scope.selectedBeneficiary[index].Beneficiary1 = b1;
      } else if (trusteeLevel == config.Beneficiary2) {
        var b2 = $scope.getMySelectedTrustees2(
          file,
          checkedStatus,
          beneficiary
        );
        $scope.selectedBeneficiary[index].Beneficiary2 = b2;
      } else if (trusteeLevel == config.Beneficiary3) {
        var b3 = $scope.getMySelectedTrustees3(
          file,
          checkedStatus,
          beneficiary
        );
        $scope.selectedBeneficiary[index].Beneficiary3 = b3;
      }

      return $scope.selectedBeneficiary;
    };

    $scope.getMySelectedTrusteesNotes1 = function(
      file,
      checkedStatus,
      beneficiary
    ) {
      var data = [];
      $scope.selectedBeneficiaryNotes1 = null;
      angular.forEach(file.Beneficiary1, function(selected) {
        if (selected.status) {
          for (var i in $scope.personalDetails) {
            if (selected.contactId == $scope.personalDetails[i]._id) {
              data.push($scope.personalDetails[i].firstName);
            }
          }
        }
      });

      if (checkedStatus) {
        data.push(beneficiary.firstName);
      } else {
        if (beneficiary) {
          var index = data.indexOf(beneficiary.firstName);
          if (index != -1) {
            var r = data.splice(index, 1);
          }
        }
      }

      if (data.length == 0) {
        data.push("Nothing Selected");
        $scope.selectedBeneficiaryNotes1 = data.toString();
      } else if (data.length >= 1) {
        if (data[0].length > 8) data[0] = data[0].substring(0, 8);
        if (data.length > 1) {
          var count = data.length - 1;
          $scope.selectedBeneficiaryNotes1 = data[0] + " +" + count.toString();
        } else {
          $scope.selectedBeneficiaryNotes1 = data.toString();
        }
      }

      return $scope.selectedBeneficiaryNotes1;
    };

    $scope.getMySelectedTrusteesNotes2 = function(
      file,
      checkedStatus,
      beneficiary
    ) {
      var data = [];
      $scope.selectedBeneficiaryNotes2 = null;
      angular.forEach(file.Beneficiary2, function(selected) {
        if (selected.status) {
          for (var i in $scope.personalDetails) {
            if (selected.contactId == $scope.personalDetails[i]._id) {
              data.push($scope.personalDetails[i].firstName);
            }
          }
        }
      });

      if (checkedStatus) {
        data.push(beneficiary.firstName);
      } else {
        if (beneficiary) {
          var index = data.indexOf(beneficiary.firstName);
          if (index != -1) {
            var r = data.splice(index, 1);
          }
        }
      }

      if (data.length == 0) {
        data.push("Nothing Selected");
        $scope.selectedBeneficiaryNotes2 = data.toString();
      } else if (data.length >= 1) {
        if (data[0].length > 8) data[0] = data[0].substring(0, 8);
        if (data.length > 1) {
          var count = data.length - 1;
          $scope.selectedBeneficiaryNotes2 = data[0] + " +" + count.toString();
        } else {
          $scope.selectedBeneficiaryNotes2 = data.toString();
        }
      }

      return $scope.selectedBeneficiaryNotes2;
    };

    $scope.getMySelectedTrusteesNotes3 = function(
      file,
      checkedStatus,
      beneficiary
    ) {
      var data = [];
      $scope.selectedBeneficiaryNotes3 = null;
      angular.forEach(file.Beneficiary3, function(selected) {
        if (selected.status) {
          for (var i in $scope.personalDetails) {
            if (selected.contactId == $scope.personalDetails[i]._id) {
              data.push($scope.personalDetails[i].firstName);
            }
          }
        }
      });

      if (checkedStatus) {
        data.push(beneficiary.firstName);
      } else {
        if (beneficiary) {
          var index = data.indexOf(beneficiary.firstName);
          if (index != -1) {
            var r = data.splice(index, 1);
          }
        }
      }

      if (data.length == 0) {
        data.push("Nothing Selected");
        $scope.selectedBeneficiaryNotes3 = data.toString();
      } else if (data.length >= 1) {
        if (data[0].length > 8) data[0] = data[0].substring(0, 8);
        if (data.length > 1) {
          var count = data.length - 1;
          $scope.selectedBeneficiaryNotes3 = data[0] + " +" + count.toString();
        } else {
          $scope.selectedBeneficiaryNotes3 = data.toString();
        }
      }

      return $scope.selectedBeneficiaryNotes3;
    };

    $scope.getSelectedNotesBeneficiary = function(
      file,
      checkedStatus,
      beneficiary
    ) {
      var b1 = $scope.getMySelectedTrusteesNotes1(
        file,
        checkedStatus,
        beneficiary
      );
      var b2 = $scope.getMySelectedTrusteesNotes2(
        file,
        checkedStatus,
        beneficiary
      );
      var b3 = $scope.getMySelectedTrusteesNotes3(
        file,
        checkedStatus,
        beneficiary
      );

      $scope.selectedNotesBeneficiary.push({
        Beneficiary1: b1,
        Beneficiary2: b2,
        Beneficiary3: b3
      });
      return $scope.selectedNotesBeneficiary;
    };

    $scope.getSelectedNotesBeneficiaryOnChange = function(
      file,
      index,
      checkedStatus,
      trusteeLevel,
      beneficiary
    ) {
      if (trusteeLevel == config.Beneficiary1) {
        var b1 = $scope.getMySelectedTrusteesNotes1(
          file,
          checkedStatus,
          beneficiary
        );
        $scope.selectedNotesBeneficiary[index].Beneficiary1 = b1;
      } else if (trusteeLevel == config.Beneficiary2) {
        var b2 = $scope.getMySelectedTrusteesNotes2(
          file,
          checkedStatus,
          beneficiary
        );
        $scope.selectedNotesBeneficiary[index].Beneficiary2 = b2;
      } else if (trusteeLevel == config.Beneficiary3) {
        var b3 = $scope.getMySelectedTrusteesNotes3(
          file,
          checkedStatus,
          beneficiary
        );
        $scope.selectedNotesBeneficiary[index].Beneficiary3 = b3;
      }

      return $scope.selectedNotesBeneficiary;
    };

    // $scope.myFunction = function(lstBeneficiary,beneficiaryDetail,status) {
    //     var data=[];
    //       angular.forEach(lstBeneficiary, function(selected){
    //         if(selected.status)
    //         {
    //           for (var i in $scope.personalDetails) {
    //               if (selected.contactId==$scope.personalDetails[i]._id) {
    //                     data.push($scope.personalDetails[i].firstName)
    //               }
    //           }

    //         }
    //       });

    //       if(status)
    //       {
    //         data.push(beneficiaryDetail.firstName);

    //       } else{
    //         if(beneficiaryDetail){
    //          // data.remove(beneficiaryDetail.firstName)
    //             var index=data.indexOf(beneficiaryDetail.firstName)
    //            var r= data.splice(index,1);
    //         }
    //       }

    //       if(data.length==0){
    //         data.push("Nothing Selected")
    //       }

    //     return data.toString();
    // }

    // vm.setButtonText = function(btn,file,beneficiaryDetail,status)
    // {
    //     console.log("setButtonText");
    //     var result=$scope.myFunction(file.Beneficiary1,beneficiaryDetail,status)
    //     console.log(result)
    //     btn.innerText=result.toString()
    //   // $(this).html("<span>+</span>Add to Friends List");
    // }

    $scope.change = function(file, index, beneficiaryDetail, $event, type) {
      var btn =
        $event.currentTarget.parentElement.parentElement.parentElement
          .parentElement.childNodes[1];
      var lstUL =
        $event.currentTarget.parentElement.parentElement.parentElement;

      // vm.setButtonText(btn,file,beneficiaryDetail,$event.currentTarget.checked);
      // btn.innerText="selected text "

      // vm.NotifyEmail = function (file,beneficiaryDetail) {
      //   console.log(file.filename)
      //   console.log(beneficiaryDetail.primaryEmail)
      //   console.log(beneficiaryDetail.firstName)
      //   $http.post('/api/editor', {
      //   filename: file.filename,
      //   email: beneficiaryDetail.primaryEmail,
      //   firstName: beneficiaryDetail.firstName
      // }).then(function (response) {
      //   console.log(response)
      //  // $scope.editorlist.push(response.data)
      // logger.success('Email Succesfully Sent', response)
      // })

      console.log(file);
      $http
        .post("/api/user/notifymail", {
          filename: file.filename,
          email: beneficiaryDetail.primaryEmail,
          firstName: beneficiaryDetail.firstName
        })
        .then(function(response) {
          console.log(response);
          // $scope.editorlist.push(response.data)
          logger.success("Email Succesfully Sent", response);
        });

      if (beneficiaryDetail) {
        console.log("***************************");
        console.log(beneficiaryDetail);
        vm.postmyfiles(
          file,
          beneficiaryDetail,
          $event.currentTarget.checked,
          type
        );
      } else {
        console.log("Error occured!");
      }

      if (type == config.Beneficiary1) {
        if (!$event.currentTarget.checked) {
          angular.forEach(file.Beneficiary1, function(selected) {
            if (selected.status) {
              if (selected.contactId == beneficiaryDetail._id) {
                var index = selected.contactId.indexOf(beneficiaryDetail._id);
                if (index != -1) {
                  file.Beneficiary1.splice(index, 1);
                }
              }
            }
          });
        }

        // var i;
        // for (i = 0; i < file.Beneficiary1.length; i++) {
        //   if (file.Beneficiary1[i].contactId==beneficiaryDetail._id) {
        //     var index=selected.contactId.indexOf(beneficiaryDetail._id)
        //     if(index!=-1)
        //     {
        //       file.Beneficiary1.splice(index,1)
        //     }
        //   }
        // }

        $scope.getSelectedBeneficiaryOnChange(
          file,
          index,
          $event.currentTarget.checked,
          type,
          beneficiaryDetail
        );
      } else if (type == config.Beneficiary2) {
        angular.forEach(file.Beneficiary2, function(selected) {
          if (selected.status) {
            if (selected.contactId == beneficiaryDetail._id) {
              var index = selected.contactId.indexOf(beneficiaryDetail._id);
              file.Beneficiary2.splice(index, 1);
            }
          }
        });

        $scope.getSelectedBeneficiaryOnChange(
          file,
          index,
          $event.currentTarget.checked,
          type,
          beneficiaryDetail
        );
      } else if (type == config.Beneficiary3) {
        angular.forEach(file.Beneficiary3, function(selected) {
          if (selected.status) {
            if (selected.contactId == beneficiaryDetail._id) {
              var index = selected.contactId.indexOf(beneficiaryDetail._id);
              file.Beneficiary3.splice(index, 1);
            }
          }
        });
        $scope.getSelectedBeneficiaryOnChange(
          file,
          index,
          $event.currentTarget.checked,
          type,
          beneficiaryDetail
        );
      }
    };
    $scope.changeNotes = function(
      file,
      index,
      beneficiaryDetail,
      $event,
      type
    ) {
      console.log(file);
      $http
        .post("/api/user/notifymail", {
          title: file.title,
          email: beneficiaryDetail.primaryEmail,
          firstName: beneficiaryDetail.firstName
        })
        .then(function(response) {
          console.log(response);
          // $scope.editorlist.push(response.data)
          logger.success("Email Succesfully Sent", response);
        });

      vm.postmyNotes(
        file,
        beneficiaryDetail,
        $event.currentTarget.checked,
        type
      );
      if (type == config.Beneficiary1) {
        if (!$event.currentTarget.checked) {
          angular.forEach(file.Beneficiary1, function(selected) {
            if (selected.status) {
              if (selected.contactId == beneficiaryDetail._id) {
                var index = selected.contactId.indexOf(beneficiaryDetail._id);
                if (index != -1) {
                  file.Beneficiary1.splice(index, 1);
                }
              }
            }
          });
        }
        $scope.getSelectedNotesBeneficiaryOnChange(
          file,
          index,
          $event.currentTarget.checked,
          type,
          beneficiaryDetail
        );
      } else if (type == config.Beneficiary2) {
        angular.forEach(file.Beneficiary2, function(selected) {
          if (selected.status) {
            if (selected.contactId == beneficiaryDetail._id) {
              var index = selected.contactId.indexOf(beneficiaryDetail._id);
              file.Beneficiary2.splice(index, 1);
            }
          }
        });
        $scope.getSelectedNotesBeneficiaryOnChange(
          file,
          index,
          $event.currentTarget.checked,
          type,
          beneficiaryDetail
        );
      } else if (type == config.Beneficiary3) {
        angular.forEach(file.Beneficiary3, function(selected) {
          if (selected.status) {
            if (selected.contactId == beneficiaryDetail._id) {
              var index = selected.contactId.indexOf(beneficiaryDetail._id);
              file.Beneficiary3.splice(index, 1);
            }
          }
        });
        $scope.getSelectedNotesBeneficiaryOnChange(
          file,
          index,
          $event.currentTarget.checked,
          type,
          beneficiaryDetail
        );
      }
    };

    vm.postmyNotes = function(files, beneficiaryDetail, status, type) {
      UserFactory.postmyNotes(files, beneficiaryDetail, status, type);
    };

    vm.getSelectedBeneficiary = function(val) {
      vm.postmyfiles(val);
    };

    $scope.$on("click", ".dropdown-menu", function(e) {
      e.stopPropagation(); // it will not propagate the action to parent for closing
    });

    // $scope.$on('click', '#item', function (e) {
    //   e.stopPropagation(); // it will not propagate the action to parent for closing
    // });

    //  $scope.onBlur = function($event) {
    //         console.log($event);
    //     }

    $scope.$on("$viewContentLoaded", function(event) {});

    $scope.$on("update", function() {
      contactList(); // load after update of any person
      fileslist();
    });

    //     $scope.heroImage = {
    //     background: 'url(images/banner.jpg)'
    // };

    $scope.showEditor = function(data) {
      var url = "api/editor/" + data;
      $http.get("api/editor/" + data._id).then(
        function(response) {
          document.getElementById("editTextTitle").value = response.data.title;
          document.getElementById("notesId").value = response.data._id;
          // vm.editor.editTextTitle=response.data.title
          // vm.editor.notesId=response.data._id
          pasteHtmlIntoEditor(response.data.data);
          // return response.data
        },
        function(error) {
          console.log("error");
        }
      );
    };

    vm.saveMe = function(data) {
      var editor = doc.getElementById("editor-container").children[0];
      //  var editr=editor.getElementById("ql-editor").innerHTML;
      //  var html = editor.root.innerHTML;
      //  console.log(editor.getElementsByTagName('p')[0].innerHTML);

      SaveOption(true);
      if (vm.editor.editTextTitle != "") {
        document
          .getElementById("btnSave")
          .setAttribute("data-dismiss", "modal");
        if (vm.editor.notesId == null) {
          vm.saveNotes(
            doc.getElementById("editor-container").children[0].innerHTML,
            vm.editor.editTextTitle
          );
        } else {
          $scope.updateNotes(
            doc.getElementById("editor-container").children[0].innerHTML,
            vm.editor.editTextTitle,
            vm.editor.notesId
          );
          logger.success("Notes successfully updated");
        }
      } else {
        console.log("title is required!");
      }
    };

    $scope.updateNotes = function(vm, title, id) {
      $http
        .put("/api/editor/" + id, {
          text: vm,
          title: title,
          id: id
        })
        .then(function(response) {
          console.log(response);
          //  $scope.editorlist.update(response.data)
          for (var i = 0; i < $scope.editorlist.length; i++) {
            if ($scope.editorlist[i]._id == id) {
              console.log($scope.editorlist[i]._id);
              $scope.editorlist[i] = response.data;
            }
          }
        });
    };

    vm.saveNotes = function(vm, title) {
      $http
        .post("/api/editor", {
          text: vm,
          title: title
        })
        .then(function(response) {
          console.log(response);
          $scope.editorlist.push(response.data);
          logger.success("Notes successfully Saved", response);
        });
    };

    /*---------------------------------------------------------------------------------
    Call to sendOTP ( To send OTP.)
    ---------------------------------------------------------------------------------*/

    $scope.sendOTP = function() {
      UserFactory.otp(vm.UserFactory.user._id);
    };

    vm.download = function(data) {
      console.log("donwload called");

      $http.get("api/editor/" + data._id).then(
        function(response) {
          var pom = document.createElement("a");
          pom.setAttribute(
            "href",
            "data:text/html;charset=utf-8," +
              encodeURIComponent(response.data.data)
          );
          pom.setAttribute("download", response.data.title);

          if (document.createEvent) {
            var event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            pom.dispatchEvent(event);
          } else {
            pom.click();
          }

          // return response.data
        },
        function(error) {
          console.log("error");
        }
      );
    };

    vm.downloadAsHtml = function FetchCtrl(data) {
      console.log("downloadAsHtml");

      $http
        .get("/api/user/getfilebyid/" + data, { responseType: "arraybuffer" })
        .then(
          function(response) {
            console.log(response); // Full information
            console.log(response.data); // holds your Data
            console.log(response.config); // holds more Specific information like the Url and more
            console.log(response.headers()); // Specific headers Information
            console.log(response.headers(["content-type"]));

            var file = new Blob([response.data], {
              type: response.headers(["content-type"])
            });
            var disposition = response.headers(["content-disposition"]);
            var res = disposition.split(";")[1];
            var res1 = res.split("=")[1];
            res1 = res1.replace(/^"(.*)"$/, "$1");

            console.log(file);
            var fileURL = URL.createObjectURL(file);
            console.log(fileURL);
            //  window.open(fileURL);
            var a = document.createElement("a");
            a.href = fileURL;
            a.download = res1;

            a.click();
            window.URL.revokeObjectURL(fileURL);
          },
          function(error) {
            console.log("error");
          }
        );

      // $scope.URL = "./client/uploads/2kb.jpg";
      // $scope.ORIGINAL_SIZE = 473831;
      // $scope.info = "";

      //    console.log("Trying saveBlob method 1...");
      //   delete $http.defaults.headers.common['X-Requested-With'];
      //   $http.get($scope.URL, {
      //     responseType: "arraybuffer"
      //   }).
      //   success(function(data) {
      //     $scope.info =
      //       "Read '" + $scope.URL + "' with " + data.byteLength + " bytes in a variable of type '" + typeof(data) + "'. The original file has " + $scope.ORIGINAL_SIZE + " bytes."
      //     console.log("Trying saveBlob method ...");
      //     var blob = new Blob([data], {
      //       type: 'image/png'
      //     });
      //     console.log(blob);
      //     if (navigator.msSaveBlob)
      //       navigator.msSaveBlob(blob, 'Lenna.png');
      //     else {
      //       // Try using other saveBlob implementations, if available
      //       var saveBlob = navigator.webkitSaveBlob || navigator.mozSaveBlob || navigator.saveBlob;
      //       if (saveBlob === undefined) throw "Not supported";
      //       saveBlob(blob, filename);
      //     }
      //     console.log("saveBlob succeeded");

      //   }).
      //   error(function(data, status) {
      //     $scope.info = "Request failed with status: " + status;
      //   });
    };

    activate();

    function activate() {
      // Handle redirects
      $scope.$on("$stateChangeSuccess", function(
        ev,
        toState,
        toParams,
        fromState,
        fromParams
      ) {
        var redirectPath = $state.href(fromState.name, fromParams);
        $cookies.put("redirect", redirectPath);
      });
    }
  }
})();
