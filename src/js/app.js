// 1566826736

App = {

    web3Provider: null,
    contracts: {},
    account: '0x0',
    role: 'coordinator',
    typeOfCall: 'none',
    agreementCounter: 0,
    paymentMessageCounter: 0,
    transactionCounter: 0,
    agreementAbi: [],

    init: async function () {

        return await App.initWeb3();
    },

    initWeb3: function () {

        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);

        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://192.168.2.134:7545');
            web3 = new Web3(App.web3Provider);

        }

        return App.initContract();
    },

    initContract: function () {

        $.getJSON('Netereum.json', function (Netereum) {

            // alert("Netereum abi is : " + Netereum.abi);

            App.contracts.Netereum = TruffleContract(Netereum);
            App.contracts.Netereum.setProvider(App.web3Provider);

            // App.watchAgreementCreatedEvents();
            // App.watchAgreementApprovedOrDeclinedEvents();
            // App.watchPaymentMessageCreatedEvents();
            // App.watchTransactionCreatedEvents();

            return App.bindEvents();
        });

        // $.getJSON('Authentication.json', function (Authentication) {
        //
        //     App.contracts.Authentication = TruffleContract(Authentication);
        //     App.contracts.Authentication.setProvider(App.web3Provider);
        //
        // });

        $.getJSON('Agreement.json', function (Agreement) {
            App.contracts.Agreement = TruffleContract(Agreement);
            App.contracts.Agreement.setProvider(App.web3Provider);

        });

        // $.getJSON('PaymentMessage.json', function (PaymentMessage) {
        //     App.contracts.PaymentMessage = TruffleContract(PaymentMessage);
        //     App.contracts.PaymentMessage.setProvider(App.web3Provider);
        //
        // });

        $.getJSON('Transaction.json', function (Transaction) {
            App.contracts.Transaction = TruffleContract(Transaction);
            App.contracts.Transaction.setProvider(App.web3Provider);


        });
    },

    bindEvents: async function () {

        // var electionInstance;
        web3.eth.getCoinbase(function (err, account) {

            App.account = account;

            if (err === null) {

                // alert("we do not have an err");span
                if (account != null) {

                    // alert("account is detected" + App.typeOfCall);
                    // var selectedBox = document.getElementById("signAs");
                    // var signAs = selectedBox.options[selectedBox.selectedIndex].value;
                    // signAs = "provider";

                    $("#signed-as").text("signed as " + App.role);
                    $(".account-address").text(account);

                    // var selectedBox = document.getElementById("signAs");
                    // var signAs = selectedBox.options[selectedBox.selectedIndex].value;

                    // var addressBox = document.getElementByCla("accountAddress");
                    // addressBox.innerHTML = "<h5 class=\"text-center font-weight-bold\" style='padding-top: 25px;'>\n" + "<span class='text-danger' style='font-size: larger'>signed as: </span> " + App.role +
                    //     " <span class='text-danger' style='font-size: larger'>, your account:  </span>" + account + "\n" + "</h5>";
                    // addressBox.style.left = "180px";

                    App.contracts.Netereum.deployed().then(function (instance) {

                        // instance.authenticate.call(signAs).then(function (result) {
                        // alert("authentication result is : " + result);
                        if (App.typeOfCall === "signUp") {

                            if
                            // (result)
                            (false) {
                                alert("You have signed up before! try login ...");
                            } else {
                                // alert("sign as is : " + signAs);
                                App.displayPage();
                            }

                        } else if (App.typeOfCall === "login") {
                            if
                            // (result)
                            (true) {
                                App.displayPage();
                            } else {
                                alert("it is not a valid " + App.role + " account! please try again with another account ...");
                            }
                        }

                    })
                    // });

                } else {

                    if (!(App.role === "none")) {
                        alert("please login to your Metamask account and then try again!")
                    }

                    // alert("Please enter your Metamask account first");
                    // document.getElementById("accountAddress").innerHTML = "<h5 class=\"text-center font-weight-bold\" style=\"padding-top: 15px;\">Sign in to your Metamask account and then click <button class='btn-sm bg-white border-0' type='button' onclick='App.letsGo()'><h5 class='text-primary font-weight-bold'>here ...</h5></button></h5>\n" +
                    //     "<div class=\"center-content\">\n" +
                    //     "<h6>Don't have an account?<button class='btn-sm bg-white border-0 text-primary font-weight-bold' type='button' >sign up</button></h6>\n" +
                    //     "</div>";
                }

            } else {
                alert("we have an err");
                document.getElementById("accountAddress").innerHTML = "<p class=\"text-center\">\n" +
                    "    please connect to a network ..." + "\n" +
                    "</p>";

            }
        });

        return true;
    },

    // my functions ....................................................................................................

    login: function () {
        // alert("entered login");
        var selectedBox = document.getElementById("loginAs");
        App.role = selectedBox.options[selectedBox.selectedIndex].value;
        App.typeOfCall = "login";
        App.bindEvents();
    },

    signUp: function () {
        var selectedBox = document.getElementById("signAs");
        App.role = selectedBox.options[selectedBox.selectedIndex].value;
        App.typeOfCall = "signUp";
        App.bindEvents();
    },

    displayPage: function () {

        document.getElementById("logged-out-content").style.display = "none";
        document.getElementById("logged-in-content").style.display = "block";

        document.getElementById("coordinator-left-content").style.display = "none";
        document.getElementById("coordinator-right-content").style.display = "none";
        document.getElementById("provider-left-content").style.display = "none";
        document.getElementById("provider-right-content").style.display = "none";
        document.getElementById("customer-left-content").style.display = "none";
        document.getElementById("customer-right-content").style.display = "none";
        document.getElementById("admin-left-content").style.display = "none";
        document.getElementById("admin-right-content").style.display = "none";

        document.getElementById(App.role + "-left-content").style.display = "block";
        document.getElementById(App.role + "-right-content").style.display = "block";

    },

    showSpecialBox: function () {

        var selectedBox = $("#signAs");
        var signAs = selectedBox.options[selectedBox.selectedIndex].value;
        var specialForm = document.getElementById("specialForm");

        switch (signAs) {
            case "coordinator":
                specialForm.innerHTML = "<div id=\"specialForm\" class=\"form-group modal-form-item\">\n" +
                    "\n" +
                    "                            <label for=\"currency\" class=\"\">currency</label>\n" +
                    "                            <select id=\"currency\" class=\"form-control  my-form-control form-control-blue\">\n" +
                    "                                <option value=\"0\">Rial</option>\n" +
                    "                                <option value=\"1\">Dollar</option>\n" +
                    "                                <option value=\"2\">Ruble</option>\n" +
                    "                                <option value=\"3\">Yuan</option>\n" +
                    "                                <option value=\"4\">Euro</option>\n" +
                    "\n" +
                    "                            </select>\n" +
                    "                        </div>";


                break;

            case "provider":
                specialForm.innerHTML = "";
                break;

            case "customer":
                specialForm.innerHTML = "";
                break;
        }

        // alert(signAs);p
    },

    openTab: function (event, tabName) {
        // alert("hello");
        alert("role is : " + App.role);
        if (tabName == 'profile') tabName = App.role + '-' + tabName;
        var i, tabcontent, tablinks;
        var className1 = App.role + "-tab-content";
        tabcontent = document.getElementsByClassName(className1);
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        // var className2 = userType + "Tablink";
        // tablinks = document.getElementsByClassName(className2);
        // for (i = 0; i < tablinks.length; i++) {
        //     tablinks[i].className = tablinks[i].className.replace(" active", "");
        // }
        document.getElementById(tabName).style.display = "block";
        // event.currentTarget.className += " active";
    },


    //coordinators functions ...........................................................................................
    //agreement new request function

    addNewAgreementRequestRow: function (agreement, dateTime, account, roleInAgreement, partnerAccount, debtAmount, fee, view) {

        var counter = App.agreementCounter;

        var tempNewAgreementRequestNumberId = "newAgreementRequestNumber" + counter;
        var tempNewAgreementRequestProviderId = "newAgreementRequestProvider" + counter;
        var tempNewAgreementRequestRoleInAgreementId = "newAgreementRequestRoleInAgreement" + counter;
        var tempNewAgreementRequestPartnerId = "newAgreementRequestPartner" + counter;
        // var tempNewAgreementRequestPartnerCoordinatorId = "newAgreementRequestPartnerCoordinator" + counter;
        var tempNewAgreementRequestDebtAmountId = "newAgreementRequestDebtAmount" + counter;
        var tempNewAgreementRequestFeeId = "newAgreementRequestFee" + counter;
        var tempNewAgreementRequestViewId = "newAgreementRequestFee" + counter;
        var tempNewAgreementRequestConfirmationStatusId = "newAgreementRequestConfirmationStatus" + counter;
        // var tempNewAgreementRequestConfirmationStatusCheck1Id = "newAgreementRequestConfirmationStatusCheck1" + counter;
        // var tempNewAgreementRequestConfirmationStatusCheck2Id = "newAgreementRequestConfirmationStatusCheck2" + counter;
        // var tempNewAgreementRequestConfirmationStatusCheck3Id = "newAgreementRequestConfirmationStatusCheck3" + counter;
        // var tempNewAgreementRequestConfirmationStatusCheck4Id = "newAgreementRequestConfirmationStatusCheck4" + counter;
        var tempNewAgreementRequestApproveBtnId = "newAgreementRequestApproveBtn" + counter;
        var tempNewAgreementRequestDeclineBtnId = "newAgreementRequestDeclineBtn" + counter;
        var tempNewAgreementRequestAddressId = "newAgreementRequestAddress" + counter;

        var row = "<tr>\n" +
            "                    <td id='" + tempNewAgreementRequestNumberId + "' class=\"disabled text-center\" contenteditable=\"false\" style='font-size: small'>" + (parseInt(counter) + 1) + "</td>\n" +
            "                    <td id='" + tempNewAgreementRequestNumberId + "' class=\"disabled text-center\" contenteditable=\"false\" style='font-size: small'>" + dateTime + "</td>\n" +
            '                    <td id="' + tempNewAgreementRequestAddressId + '" style="display: none"  class="text-center disabled" contenteditable=\"false\">' + agreement + '</td>\n' +
            "                    <td id='" + tempNewAgreementRequestProviderId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + account + "</td>\n" +
            "                    <td id='" + tempNewAgreementRequestRoleInAgreementId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + roleInAgreement + "</td>\n" +
            "                    <td id='" + tempNewAgreementRequestPartnerId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + partnerAccount + "</td>\n" +
            "                    <td id='" + tempNewAgreementRequestDebtAmountId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + debtAmount + "</td>\n" +
            "                    <td id='" + tempNewAgreementRequestFeeId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + fee + "</td>\n" +
            "                    <td id='" + tempNewAgreementRequestViewId + "' class=\"text-center disabled\" style='font-size: small'>" + view + "</td>\n" +
            "                    <td id='" + tempNewAgreementRequestConfirmationStatusId + "'   class=\"text-center row no-gutters disabled\" contenteditable = false>\n" +
            "\n" +
            "                                <button id='" + tempNewAgreementRequestApproveBtnId + "' onclick='App.coordinatorApproveNewAgreementRequest(" + counter + ")' type=\"button\" class=\"btn btn-sm btn-success\" style=\"font-size: smaller; margin: auto\">approve</button>\n" +
            "                                <button id='" + tempNewAgreementRequestDeclineBtnId + "' onclick='App.coordinatorDeclineNewAgreementRequest(" + counter + ")' type=\"button\" class=\"btn btn-sm btn-success\" style=\"font-size: smaller; margin: auto\">decline</button>\n" +
            "                    </td>\n" +
            "                </tr>\n";

        var table = document.getElementById("newAgreementsRequestsTable");
        $(table).find('tbody').append(row);

        // document.getElementById(tempNewAgreementRequestConfirmationStatusCheck1Id).checked = debtorPermissionStatus;
        // document.getElementById(tempNewAgreementRequestConfirmationStatusCheck2Id).checked = creditorPermissionStatus;
        // document.getElementById(tempNewAgreementRequestConfirmationStatusCheck3Id).checked = debtorCoordinatorPermissionStatus;
        // document.getElementById(tempNewAgreementRequestConfirmationStatusCheck4Id).checked = creditorCoordinatorPermissionStatus;

        // if (debtorCoordinatorPermissionStatus) {

        // var newAgreementRequestApproveBtn = document.getElementById(tempNewAgreementRequestApproveBtnId);
        // newAgreementRequestApproveBtn.disabled = true;
        // newAgreementRequestApproveBtn.innerText = "done";
        // newAgreementRequestApproveBtn.classList.add("btn-dark");
        //
        // var newAgreementRequestDeclineBtn = document.getElementById(tempNewAgreementRequestDeclineBtnId);
        // newAgreementRequestDeclineBtn.disabled = true;
        // newAgreementRequestDeclineBtn.classList.add("btn-dark");
        // }

        App.agreementCounter++;
    },


    coordinatorRemoveNewAgreementsRequestsRows: function () {
        App.agreementCounter = 0;
        var table = document.getElementById("newAgreementsRequestsTable");
        $(table).find('tbody').html('');
    },

    coordinatorLoadNewAgreementsRequests: function () {
        // alert("entered loadNewAgreementOffersFunction");
        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                NetereumInstance.numberOfCreatedAgreements().then(function (numberOfAgreements) {

                    App.coordinatorRemoveNewAgreementsRequestsRows();

                    for (var i = 0; i < numberOfAgreements; i++) {

                        // alert("entered for loop");
                        NetereumInstance.createdAgreementsAddress(i).then(async function (agreementAddress) {
                            // alert(agreementAddress);
                            App.contracts.Agreement.at(agreementAddress).then(async function (instance) {

                                var providerAccount;
                                var partner;
                                // var partnerCoordinator;
                                var status = await NetereumInstance.agreementsStatus(agreementAddress);
                                // alert("status0 is :" + status);
                                var debtorCoordinator = await instance.debtorCoordinator();
                                var creditorCoordinator = await instance.creditorCoordinator();
                                var roleInAgreement;


                                // var debtorPermissionStatus = await instance.debtorPermission();
                                // var creditorPermissionStatus = await instance.creditorPermission();
                                var debtorCoordinatorPermissionStatus = await instance.debtorCoordinatorPermission();
                                var creditorCoordinatorPermissionStatus = await instance.creditorCoordinatorPermission();

                                var flag = false;

                                if (debtorCoordinator === account && status == 1 && debtorCoordinatorPermissionStatus == '0') {
                                    flag = true;
                                    roleInAgreement = 'debtor';
                                    providerAccount = await instance.debtor();
                                    partner = await instance.creditor();
                                    // partnerCoordinator = await instance.creditorCoordinator();

                                } else if (creditorCoordinator === account && status == 1 && creditorCoordinatorPermissionStatus == '0') {
                                    flag = true;
                                    roleInAgreement = 'creditor';
                                    providerAccount = await instance.creditor();
                                    partner = await instance.debtor();
                                    // partnerCoordinator = await instance.debtorCoordinator();
                                }

                                if (flag) {

                                    var dateTime = "2 minutes ago";
                                    var debtAmount = await instance.debtorCost();
                                    var view = "some views";
                                    var fee = await instance.debtorFee();
                                    App.addNewAgreementRequestRow(agreementAddress, dateTime, providerAccount, roleInAgreement, partner, debtAmount, fee, view);
                                }
                            });
                        });
                    }
                });
            });
        });
    },


    coordinatorApproveNewAgreementRequest: function (counter) {

        var targetAgreementRequestApproveBtnId = "newAgreementRequestApproveBtn" + counter;
        var targetAgreementRequestDeclineBtnId = "newAgreementRequestDeclineBtn" + counter;
        var targetAgreementRequestAddressId = "newAgreementRequestAddress" + counter;

        var agreementAddress = document.getElementById(targetAgreementRequestAddressId).innerText + '';

        App.contracts.Agreement.at(agreementAddress).then(async function (agreementInstance) {

            // alert("i am here");
            await agreementInstance.approve();
            var agreementRequestApproveBtn = document.getElementById(targetAgreementRequestApproveBtnId);
            agreementRequestApproveBtn.disabled = true;
            agreementRequestApproveBtn.innerText = "done";
            agreementRequestApproveBtn.classList.add("btn-dark");
            var agreementRequestDeclineBtn = document.getElementById(targetAgreementRequestDeclineBtnId);
            agreementRequestDeclineBtn.disabled = true;
            agreementRequestDeclineBtn.classList.add("btn-dark")

        });
    },

    coordinatorDeclineNewAgreementRequest: function (counter) {

        var targetAgreementRequestApproveBtnId = "agreementRequestApproveBtn" + counter;
        var targetAgreementRequestDeclineBtnId = "agreementRequestDeclineBtn" + counter;
        var targetAgreementRequestAddressId = "agreementRequestAddress" + counter;
        var agreementAddress = document.getElementById(targetAgreementRequestAddressId).innerText + '';

        // alert(" received here ");
        App.contracts.Agreement.at(agreementAddress).then(async function (agreementInstance) {

            // alert("i am here");
            await agreementInstance.decline();
            var agreementRequestApproveBtn = document.getElementById(targetAgreementRequestApproveBtnId);
            agreementRequestApproveBtn.disabled = true;
            agreementRequestApproveBtn.classList.add("btn-dark");
            var agreementRequestDeclineBtn = document.getElementById(targetAgreementRequestDeclineBtnId);
            agreementRequestDeclineBtn.innerText = "done";
            agreementRequestDeclineBtn.disabled = true;
            agreementRequestDeclineBtn.classList.add("btn-dark")

        });
    },

    //coordinator agreement previous requests function

    addPreviousAgreementRequestRow: function (agreement, dateTime, account, roleInAgreement, partnerAccount, debtAmount, fee, view, status) {

        var counter = App.agreementCounter;

        var tempPreviousAgreementRequestNumberId = "previousAgreementRequestNumber" + counter;
        var tempPreviousAgreementRequestProviderId = "previousAgreementRequestProvider" + counter;
        var tempPreviousAgreementRequestRoleInAgreementId = "previousAgreementRequestRoleInAgreement" + counter;
        var tempPreviousAgreementRequestPartnerId = "previousAgreementRequestPartner" + counter;
        // var tempNewAgreementRequestPartnerCoordinatorId = "previousAgreementRequestPartnerCoordinator" + counter;
        var tempPreviousAgreementRequestDebtAmountId = "previousAgreementRequestDebtAmount" + counter;
        var tempPreviousAgreementRequestFeeId = "previousAgreementRequestFee" + counter;
        var tempPreviousAgreementRequestViewId = "previousAgreementRequestFee" + counter;
        var tempPreviousAgreementRequestConfirmationStatusId = "previousAgreementRequestConfirmationStatus" + counter;

        var tempPreviousAgreementRequestApproveBtnId = "previousAgreementRequestApproveBtn" + counter;
        var tempPreviousAgreementRequestDeclineBtnId = "previousAgreementRequestDeclineBtn" + counter;
        var tempPreviousAgreementRequestAddressId = "previousAgreementRequestAddress" + counter;

        var row = "<tr>\n" +
            "                    <td id='" + tempPreviousAgreementRequestNumberId + "' class=\"disabled text-center\" contenteditable=\"false\">" + (parseInt(counter) + 1) + "</td>\n" +
            "                    <td id='" + tempPreviousAgreementRequestNumberId + "' class=\"disabled text-center\" contenteditable=\"false\">" + dateTime + "</td>\n" +
            '                    <td id="' + tempPreviousAgreementRequestAddressId + '" style="display: none"  class="text-center disabled" contenteditable=\"false\">' + agreement + '</td>\n' +
            "                    <td id='" + tempPreviousAgreementRequestProviderId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + account + "</td>\n" +
            "                    <td id='" + tempPreviousAgreementRequestRoleInAgreementId + "' class=\"text-center disabled\" contenteditable=\"false\">" + roleInAgreement + "</td>\n" +
            "                    <td id='" + tempPreviousAgreementRequestPartnerId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + partnerAccount + "</td>\n" +
            "                    <td id='" + tempPreviousAgreementRequestDebtAmountId + "' class=\"text-center disabled\" contenteditable=\"false\">" + debtAmount + "</td>\n" +
            "                    <td id='" + tempPreviousAgreementRequestFeeId + "' class=\"text-center disabled\" contenteditable=\"false\">" + fee + "</td>\n" +
            "                    <td id='" + tempPreviousAgreementRequestViewId + "' class=\"text-center disabled\"  contenteditable=\"false\">" + view + "</td>\n" +
            "                    <td id='" + tempPreviousAgreementRequestConfirmationStatusId + "'   class=\"text-center row no-gutters disabled\" contenteditable = false>" + status + " </td>\n" +
            "      </tr>\n";

        var table = document.getElementById("previous-agreements-requestsTable");
        $(table).find('tbody').append(row);

        App.agreementCounter++;
    },

    coordinatorRemovePreviousAgreementsRequestsRows: function () {
        App.agreementCounter = 0;
        var table = document.getElementById("previous-agreements-requestsTable");
        $(table).find('tbody').html('');
    },

    coordinatorLoadPreviousAgreementsRequests: function () {
        // alert("entered loadprevious-agreements-requestsFunction");
        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                    NetereumInstance.numberOfCreatedAgreements().then(function (numberOfAgreements) {

                        App.coordinatorRemoveprevious-agreements-requestsRows();

                        for (var i = 0; i < numberOfAgreements; i++) {

                            // alert("entered for loop");
                            NetereumInstance.createdAgreementsAddress(i).then(async function (agreementAddress) {
                                    // alert(agreementAddress);
                                    App.contracts.Agreement.at(agreementAddress).then(async function (instance) {

                                        var providerAccount;
                                        var partner;
                                        // var partnerCoordinator;

                                        var debtorCoordinator = await instance.debtorCoordinator();
                                        var creditorCoordinator = await instance.creditorCoordinator();
                                        var roleInAgreement;


                                        // var debtorPermissionStatus = await instance.debtorPermission();
                                        // var creditorPermissionStatus = await instance.creditorPermission();
                                        var debtorCoordinatorPermissionStatus = await instance.debtorCoordinatorPermission();
                                        var creditorCoordinatorPermissionStatus = await instance.creditorCoordinatorPermission();
                                        var statusCode = await NetereumInstance.agreementsStatus(agreementAddress);
                                        statusCode = statusCode + "";
                                        // alert(statusCode);

                                        var status;
                                        switch (statusCode) {
                                            case "0":
                                                status = "not created";
                                                break;
                                            case "1":
                                                status = "offered";
                                                break;
                                            case "2":
                                                status = "pending";
                                                break;
                                            case "3":
                                                status = "expired";
                                                break;
                                            case "4":
                                                status = "declined";
                                                break;
                                        }
                                        // alert("status is : " + status);

                                        var flag = false;

                                        // if (debtorCoordinator === account && !debtorCoordinatorPermissionStatus) {
                                        if (debtorCoordinator === account && statusCode === "2") {
                                            flag = true;
                                            roleInAgreement = 'debtor';
                                            providerAccount = await instance.debtor();
                                            partner = await instance.creditor();
                                            // partnerCoordinator = await instance.creditorCoordinator();

                                        } else
                                        // if (creditorCoordinator === account && !creditorCoordinatorPermissionStatus) {
                                        if (creditorCoordinator === account && statusCode === "2") {

                                            flag = true;
                                            roleInAgreement = 'creditor';
                                            providerAccount = await instance.creditor();
                                            partner = await instance.debtor();
                                            // partnerCoordinator = await instance.debtorCoordinator();
                                        }


                                        if (flag) {

                                            var debtAmount = await instance.debtorCost();
                                            var view = "some views";
                                            var dateTime = "2 minutes ago";
                                            var fee = await instance.debtorFee();
                                            // alert("entered if ");
                                            App.addPreviousAgreementRequestRow(agreementAddress, dateTime, providerAccount, roleInAgreement, partner, debtAmount, fee, view, status);
                                        }
                                    });
                                }
                            );
                        }
                    });
                }
            )
            ;
        })
        ;
    },

    //customer functions

    addNewTransactionRequestRow: function (transaction, dateTime, account, roleInTransaction, counterpart, counterpartCoordinator, amount, maxFee, view) {
        // alert("entered addNewTransactionRequestRow");
        var counter = App.transactionCounter;

        var tempNewTransactionRequestNumberId = "newTransactionRequestNumber" + counter;
        var tempNewTransactionRequestDateTimeId = "newTransactionRequestNumber" + counter;
        var tempNewTransactionRequestAccountId = "newTransactionRequestAccount" + counter;
        var tempNewTransactionRequestRoleInTransactionId = "newTransactionRequestRoleInTransaction" + counter;
        var tempNewTransactionRequestCounterpartId = "newTransactionRequestCounterpart" + counter;
        var tempNewTransactionRequestCounterpartCoordinatorId = "newTransactionRequestCounterpartCoordinator" + counter;
        var tempNewTransactionRequestAmountId = "newTransactionRequestAmount" + counter;
        var tempNewTransactionRequestMaxFeeId = "newTransactionRequestMaxFee" + counter;
        var tempNewTransactionRequestViewId = "newTransactionRequestFee" + counter;
        var tempNewTransactionRequestConfirmationStatusId = "newTransactionRequestConfirmationStatus" + counter;
        // var tempNewTransactionRequestConfirmationStatusCheck1Id = "newTransactionRequestConfirmationStatusCheck1" + counter;
        // var tempNewTransactionRequestConfirmationStatusCheck2Id = "newTransactionRequestConfirmationStatusCheck2" + counter;
        // var tempNewTransactionRequestConfirmationStatusCheck3Id = "newTransactionRequestConfirmationStatusCheck3" + counter;
        // var tempNewTransactionRequestConfirmationStatusCheck4Id = "newTransactionRequestConfirmationStatusCheck4" + counter;
        var tempNewTransactionRequestApproveBtnId = "newTransactionRequestApproveBtn" + counter;
        var tempNewTransactionRequestDeclineBtnId = "newTransactionRequestDeclineBtn" + counter;
        var tempNewTransactionRequestAddressId = "newTransactionRequestAddress" + counter;

        var row = "<tr>\n" +
            "                    <td id='" + tempNewTransactionRequestNumberId + "' class=\"disabled text-center\" contenteditable=\"false\" style='font-size: small'>" + (parseInt(counter) + 1) + "</td>\n" +
            "                    <td id='" + tempNewTransactionRequestDateTimeId + "' class=\"disabled text-center\" contenteditable=\"false\" style='font-size: small'>" + dateTime + "</td>\n" +
            '                    <td id="' + tempNewTransactionRequestAddressId + '" style="display: none"  class="text-center disabled" contenteditable=\"false\">' + transaction + '</td>\n' +
            "                    <td id='" + tempNewTransactionRequestAccountId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + account + "</td>\n" +
            "                    <td id='" + tempNewTransactionRequestRoleInTransactionId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + roleInTransaction + "</td>\n" +
            "                    <td id='" + tempNewTransactionRequestCounterpartId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + counterpart + "</td>\n" +
            "                    <td id='" + tempNewTransactionRequestCounterpartCoordinatorId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + counterpartCoordinator + "</td>\n" +
            "                    <td id='" + tempNewTransactionRequestAmountId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + amount + "</td>\n" +
            "                    <td id='" + tempNewTransactionRequestMaxFeeId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + maxFee + "</td>\n" +
            "                    <td id='" + tempNewTransactionRequestViewId + "' class=\"text-center disabled\" style='font-size: small'>" + view + "</td>\n" +
            "                    <td id='" + tempNewTransactionRequestConfirmationStatusId + "'   class=\"text-center row no-gutters disabled\" contenteditable = false>\n" +
            "\n" +
            "                                <button id='" + tempNewTransactionRequestDeclineBtnId + "' onclick='App.coordinatorApproveNewTransactionRequest(" + counter + ")' type=\"button\" class=\"btn btn-sm btn-success\" style=\"font-size: smaller; margin: auto\">approve</button>\n" +
            "                                <button id='" + tempNewTransactionRequestApproveBtnId + "' onclick='App.coordinatorDeclineNewTransactionRequest(" + counter + ")' type=\"button\" class=\"btn btn-sm btn-success\" style=\"font-size: smaller; margin: auto\">decline</button>\n" +
            "                    </td>\n" +
            "                </tr>\n";

        var table = document.getElementById("new-transactions-requests-table");
        $(table).find('tbody').append(row);

        App.transactionCounter++;

    },

    coordinatorRemoveNewTransactionsRequestsRows: function () {
        App.transactionCounter = 0;
        var table = document.getElementById("new-transactions-requests-table");
        $(table).find('tbody').html('');
    },

    coordinatorLoadNewTransactionsRequests: function () {
        // alert("entered coordinatorLoadnew-transactions-requests");

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                NetereumInstance.numberOfCreatedTransactions().then(function (numberOfTransactions) {

                    App.coordinatorRemoveNewTransactionsRequestsRows();

                    for (var i = 0; i < numberOfTransactions; i++) {

                        // alert("entered for loop");
                        NetereumInstance.createdTransactionsAddress(i).then(async function (transactionAddress) {
                            // alert();
                            App.contracts.Transaction.at(transactionAddress).then(async function (instance) {

                                var customer;
                                var counterpart;
                                var counterpartCoordinator;

                                var status = await NetereumInstance.transactionsStatus(transactionAddress);

                                var sender = await instance.senderAccount();
                                var receiver = await instance.receiverAccount();
                                var senderCoordinator = await instance.senderCoordinator();
                                var receiverCoordinator = await instance.receiverCoordinator();
                                var roleInTransaction;
                                var senderCoordinatorPermission = await instance.senderCoordinatorPermission();
                                var receiverCoordinatorPermission = await instance.receiverCoordinatorPermission();


                                var flag = false;

                                // alert("status is : "  + status);
                                // alert("account is :" + account + "\nsender Coordinator is : " + senderCoordinator);

                                if (senderCoordinator === account && status == 1 && senderCoordinatorPermission == 0) {
                                    // alert("entered first if ");
                                    flag = true;
                                    customer = sender;
                                    counterpart = receiver;
                                    counterpartCoordinator = receiverCoordinator;
                                    roleInTransaction = 'sender';

                                } else if (receiverCoordinator === account && status == 1 && receiverCoordinatorPermission == 0) {
                                    flag = true;
                                    customer = receiver;
                                    counterpart = sender;
                                    counterpartCoordinator = senderCoordinator;
                                    roleInTransaction = 'receiver';
                                }
                                if (flag) {
                                    // alert("entered second if ");

                                    var amount = await instance.transactionAmount();
                                    var view = "some views";
                                    var dateTime = "2 minutes ago";
                                    var maxFee = await instance.maxFee();

                                    App.addNewTransactionRequestRow(transactionAddress, dateTime, customer, roleInTransaction, counterpart, counterpartCoordinator, amount, maxFee, view);
                                }
                            });
                        });
                    }
                });
            });
        });
    },

    coordinatorApproveNewTransactionRequest: function (counter) {

        var targetTransactionRequestApproveBtnId = "newTransactionRequestApproveBtn" + counter;
        var targetTransactionRequestDeclineBtnId = "newTransactionRequestDeclineBtn" + counter;
        var targetTransactionRequestAddressId = "newTransactionRequestAddress" + counter;

        var transactionAddress = document.getElementById(targetTransactionRequestAddressId).innerText + '';

        App.contracts.Transaction.at(transactionAddress).then(async function (transactionInstance) {

            // alert("i am here");
            await transactionInstance.approve();
            var transactionRequestApproveBtn = document.getElementById(targetTransactionRequestApproveBtnId);
            transactionRequestApproveBtn.disabled = true;
            transactionRequestApproveBtn.innerText = "done";
            transactionRequestApproveBtn.classList.add("btn-dark");
            var transactionRequestDeclineBtn = document.getElementById(targetTransactionRequestDeclineBtnId);
            transactionRequestDeclineBtn.disabled = true;
            transactionRequestDeclineBtn.classList.add("btn-dark")

        });
    },


    coordinatorDeclineNewTransactionRequest: function (counter) {

        var targetTransactionRequestApproveBtnId = "transactionRequestApproveBtn" + counter;
        var targetTransactionRequestDeclineBtnId = "transactionRequestDeclineBtn" + counter;
        var targetTransactionRequestAddressId = "transactionRequestAddress" + counter;
        var TransactionAddress = document.getElementById(targetTransactionRequestAddressId).innerText + '';

        // alert(" received here ");
        App.contracts.Transaction.at(TransactionAddress).then(async function (transactionInstance) {

            // alert("i am here");
            await transactionInstance.decline();
            var transactionRequestApproveBtn = document.getElementById(targetTransactionRequestApproveBtnId);
            transactionRequestApproveBtn.disabled = true;
            transactionRequestApproveBtn.classList.add("btn-dark");
            var transactionRequestDeclineBtn = document.getElementById(targetTransactionRequestDeclineBtnId);
            transactionRequestDeclineBtn.innerText = "done";
            transactionRequestDeclineBtn.disabled = true;
            transactionRequestDeclineBtn.classList.add("btn-dark")

        });
    },

    //coordinator previous customers requests functions

    addPreviousTransactionRequestRow: function (transaction, dateTime, account, roleInTransaction, counterpart, counterpartCoordinator, amount, maxFee, view, status) {
        var counter = App.transactionCounter;

        var tempPreviousCustomerRequestNumberId = "previousCustomerRequestNumber" + counter;
        var tempPreviousCustomerRequestAccountId = "previousCustomerRequestAccount" + counter;
        var tempPreviousCustomerRequestRoleInTransactionId = "previousCustomerRequestRoleInTransaction" + counter;
        var tempPreviousCustomerRequestCounterpartId = "previousCustomerRequestCounterpart" + counter;
        var tempPreviousCustomerRequestCounterpartCoordinatorId = "previousCustomerRequestCounterpartCoordinator" + counter;
        var tempPreviousCustomerRequestAmountId = "previousCustomerRequestAmount" + counter;
        var tempPreviousCustomerRequestMaxFeeId = "previousCustomerRequestMaxFee" + counter;
        var tempPreviousCustomerRequestViewId = "previousCustomerRequestFee" + counter;
        var tempPreviousCustomerRequestConfirmationStatusId = "previousCustomerRequestConfirmationStatus" + counter;
        // var tempPreviousCustomerRequestConfirmationStatusCheck1Id = "previousCustomerRequestConfirmationStatusCheck1" + counter;
        // var tempPreviousCustomerRequestConfirmationStatusCheck2Id = "previousCustomerRequestConfirmationStatusCheck2" + counter;
        // var tempPreviousCustomerRequestConfirmationStatusCheck3Id = "previousCustomerRequestConfirmationStatusCheck3" + counter;
        // var tempPreviousCustomerRequestConfirmationStatusCheck4Id = "previousCustomerRequestConfirmationStatusCheck4" + counter;
        var tempPreviousCustomerRequestApproveBtnId = "previousCustomerRequestApproveBtn" + counter;
        var tempPreviousCustomerRequestDeclineBtnId = "previousCustomerRequestDeclineBtn" + counter;
        var tempPreviousCustomerRequestAddressId = "previousCustomerRequestAddress" + counter;

        var row = "<tr>\n" +
            "                    <td id='" + tempPreviousCustomerRequestNumberId + "' class=\"disabled text-center\" contenteditable=\"false\">" + (parseInt(counter) + 1) + "</td>\n" +
            "                    <td id='" + tempPreviousCustomerRequestNumberId + "' class=\"disabled text-center\" contenteditable=\"false\">" + dateTime + "</td>\n" +
            '                    <td id="' + tempPreviousCustomerRequestAddressId + '" style="display: none"  class="text-center disabled" contenteditable=\"false\">' + transaction + '</td>\n' +
            "                    <td id='" + tempPreviousCustomerRequestAccountId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + account + "</td>\n" +
            "                    <td id='" + tempPreviousCustomerRequestRoleInTransactionId + "' class=\"text-center disabled\" contenteditable=\"false\">" + roleInTransaction + "</td>\n" +
            "                    <td id='" + tempPreviousCustomerRequestCounterpartId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + counterpart + "</td>\n" +
            "                    <td id='" + tempPreviousCustomerRequestCounterpartCoordinatorId + "' class=\"text-center disabled\" style='font-size: small' contenteditable=\"false\">" + counterpartCoordinator + "</td>\n" +
            "                    <td id='" + tempPreviousCustomerRequestAmountId + "' class=\"text-center disabled\" contenteditable=\"false\">" + amount + "</td>\n" +
            "                    <td id='" + tempPreviousCustomerRequestMaxFeeId + "' class=\"text-center disabled\" contenteditable=\"false\">" + maxFee + "</td>\n" +
            "                    <td id='" + tempPreviousCustomerRequestViewId + "' class=\"text-center disabled\"  contenteditable=\"false\">" + view + "</td>\n" +
            "                    <td id='" + tempPreviousCustomerRequestConfirmationStatusId + "'   class=\"text-center row no-gutters disabled\" contenteditable = false>" + status + " </td>\n" +
            "      </tr>\n";

        var table = document.getElementById("previousTransactionsRequestsTable");
        $(table).find('tbody').append(row);

        App.transactionCounter++;


    },

    coordinatorRemovePreviousTransactionsRequestsRows: function () {
        App.transactionCounter = 0;
        var table = document.getElementById("newCustomersRequestsTable");
        $(table).find('tbody').html('');
    },

    coordinatorLoadPreviousTransactionsRequests: function () {

        // alert("entered loadPreviousCustomersRequestsFunction");
        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                    NetereumInstance.numberOfCreatedTransactions().then(function (numberOfTransactions) {

                        App.coordinatorRemovePreviousTransactionsRequestsRows();

                        for (var i = 0; i < numberOfTransactions; i++) {

                            // alert("entered for loop");
                            NetereumInstance.createdTransactionsAddress(i).then(async function (transactionAddress) {
                                    // alert(transactionAddress);
                                    App.contracts.Transaction.at(transactionAddress).then(async function (instance) {

                                        var customer;
                                        var counterpart;
                                        var counterpartCoordinator;
                                        var roleInTransaction;

                                        var sender = await instance.senderAccount();
                                        var receiver = await instance.receiverAccount();
                                        var senderCoordinator = await instance.senderCoordinator();
                                        var receiverCoordinator = await instance.receiverCoordinator();

                                        var senderCoordinatorPermission = await instance.senderCoordinatorPermission();
                                        var receiverCoordinatorPermission = await instance.receiverCoordinatorPermission();

                                        var statusCode = await NetereumInstance.transactionsStatus(transactionAddress);
                                        statusCode = statusCode + "";
                                        // alert(statusCode);

                                        var status;
                                        switch (statusCode) {
                                            case "0":
                                                status = "not created";
                                                break;
                                            case "1":
                                                status = "created";
                                                break;
                                            case "2":
                                                status = "pending";
                                                break;
                                            case "3":
                                                status = "done";
                                                break;
                                            case "4":
                                                status = "declined";
                                                break;
                                        }
                                        // alert("status is : " + status);

                                        var flag = false;

                                        // if (debtorCoordinator === account && debtorCoordinatorPermissionStatus == '0') {
                                        if (senderCoordinator === account) {
                                            flag = true;
                                            roleInTransaction = 'sender';
                                            customer = await instance.senderAccount();
                                            counterpart = await instance.receiverAccount();
                                            counterpartCoordinator = await instance.receiverCoordinator();

                                        } else
                                        // if (creditorCoordinator === account && creditorCoordinatorPermissionStatus == '0') {
                                        if (receiverCoordinator === account) {

                                            flag = true;
                                            roleInTransaction = 'receiver';
                                            customer = await instance.receiverAccount();
                                            counterpart = await instance.senderAccount();
                                            counterpartCoordinator = await instance.senderCoordinator();
                                        }


                                        if (flag) {
                                            var view = "some views";
                                            var dateTime = "2 minutes ago";
                                            var amount = await instance.transactionAmount();
                                            var maxFee = await instance.maxFee();
                                            // alert("entered if ");
                                            App.addPreviousTransactionRequestRow(transactionAddress, dateTime, customer, roleInTransaction, counterpart, counterpartCoordinator, amount, maxFee, view, status);
                                        }
                                    });
                                }
                            );
                        }
                    });
                }
            );
        });
    },

//manage functions .................................................................................................

    createNewPaymentMessage: async function (counter) { //this is coordinator function

        // alert("entered addMessage");
        // alert("counter is " + counter);
        var targetPaymentMessageReceiverId = "coordinatorPaymentMessageReceiver" + counter;
        var targetPaymentMessageDestinationId = "coordinatorPaymentMessageDestination" + counter;
        var targetPaymentMessageAmountId = "coordinatorPaymentMessageAmount" + counter;
        var targetSendBtnId = "coordinatorSendMessageBtn" + counter;
        var sendBtn = document.getElementById(targetSendBtnId);
        sendBtn.disabled = true;
        sendBtn.innerText = "done";
        sendBtn.classList.add("btn-dark");

        var receiverValue = document.getElementById(targetPaymentMessageReceiverId);
        var destinationValue = document.getElementById(targetPaymentMessageDestinationId);
        var amountValue = document.getElementById(targetPaymentMessageAmountId);

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(async function (NetereumInstance) {
                await NetereumInstance.createAndAddPaymentMessage("0x78bc47CeA54A29a3604F0750f77a67C1Ab399B55", 123456789, 500);
            });
        });
    }
    ,

    coordinatorAddPaymentMessageRow: function (transaction, receiver, destination, amount, submitStatus, isSent) { //this is coordinator function

        var counter = App.paymentMessageCounter;

        var tempPaymentMessageNumberId = "coordinatorPaymentMessageNumber" + counter;
        var tempPaymentTransactionId = "coordinatorPaymentTransaction" + counter;
        var tempPaymentMessageReceiverId = "coordinatorPaymentMessageCoordinator" + counter;
        var tempPaymentMessageDestinationId = "coordinatorPaymentMessageDestination" + counter;
        var tempPaymentMessageAmountId = "coordinatorPaymentMessageAmount" + counter;
        var tempPaymentMessagePerformStatusId = "coordinatorPaymentMessagePerformStatus" + counter;
        var tempSendMessageBtnId = "coordinatorSendMessageBtn" + counter;

        var row = '              <tr class="no-padding">\n' +
            '                        <td id="' + tempPaymentMessageNumberId + '" class="disabled text-center" contenteditable="false">1</td>\n' +
            '                        <td id="' + tempPaymentTransactionId + '" style="display: none"  class="text-center">' + transaction + '</td>\n' +
            '                        <td id="' + tempPaymentMessageReceiverId + '" class="text-center">' + receiver + '</td>\n' +
            '                        <td id="' + tempPaymentMessageDestinationId + '" class="text-center">' + destination + '</td>\n' +
            '                        <td id="' + tempPaymentMessageAmountId + '" class="text-center">' + amount + '</td>\n' +
            '                        <td id="' + tempPaymentMessagePerformStatusId + '" class="text-center">' + submitStatus + '</td>\n' +
            '                        <td style="" id="" class="text-center no-padding td-50 center-content"><div class="td-50">\n' +
            '                            <button type="button" id="' + tempSendMessageBtnId + '" class="btn btn-bg-blue btn-general td-button no-margin" style="">send</button>' +
            '                        </div></td>\n' +
            '                    </tr>\n';


        var table = document.getElementById("coordinator-payment-messages-table");
        $(table).find('tbody').append(row);

        if (isSent) {

            var tempSendMessageBtn = document.getElementById(tempSendMessageBtnId);
            tempSendMessageBtn.disabled = true;
            tempSendMessageBtn.innerText = "done";
            tempSendMessageBtn.classList.add("btn-dark");
        }

        App.paymentMessageCounter++;
    },

    coordinatorAddEmptyPaymentMessageRow: function () {
        App.coordinatorAddPaymentMessageRow("", "", "", "", "", false);
    }
    ,

    coordinatorRemovePaymentMessagesRows: function () {
        App.paymentMessageCounter = 0;
        var table = document.getElementById("coordinator-payment-messages-table");
        $(table).find('tbody').html('');
    }
    ,

    coordinatorLoadPaymentMessages: function () {

        // alert("entered coordinatorLoadPreviousPaymentMessages function");

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                App.coordinatorRemovePaymentMessagesRows();

                NetereumInstance.numberOfPaymentMessages().then(function (numberOfPaymentMessages) {

                    if (numberOfPaymentMessages == 0) {
                        // alert("i am here");
                        App.coordinatorAddEmptyPaymentMessageRow();
                    } else {

                        // alert(" i am here instead!");
                    }

                    for (var i = 0; i < numberOfPaymentMessages; i++) {

                        // alert("entered for loop");
                        NetereumInstance.paymentMessagesAddress(i).then(async function (paymentMessageAddress) {
                            App.contracts.PaymentMessage.at(paymentMessageAddress).then(async function (instance) {

                                var coordinatorAccount = await instance.coordinator();

                                // alert("entered before if");

                                if (coordinatorAccount === account) {

                                    // alert("entered if");
                                    var receiverAccount = await instance.receiverAddress();
                                    var destination = await instance.destinationAccount();
                                    var amount = await instance.paymentAmount();
                                    var performStatus = await instance.isPerformed();
                                    var submitStatus;
                                    if (performStatus === true) {
                                        submitStatus = "performed";
                                    } else {

                                        submitStatus = "not performed";
                                    }

                                    App.coordinatorAddPaymentMessageRow(paymentMessageAddress, receiverAccount, destination, amount, submitStatus, true);
                                }
                            });
                        });
                    }
                });
            });
        });
    },

//providers functions ..............................................................................................
//payment messages functions

    providerAddPaymentMessageRow: function (transaction, coordinator, destination, amount, performStatus) {

        var counter = App.paymentMessageCounter;

        var tempPaymentMessageNumberId = "providerPaymentMessageNumber" + counter;
        var tempPaymentTransactionId = "providerPaymentTransaction" + counter;
        var tempPaymentMessageCoordinatorId = "providerPaymentMessageCoordinator" + counter;
        var tempPaymentMessageDestinationId = "providerPaymentMessageDestination" + counter;
        var tempPaymentMessageAmountId = "providerPaymentMessageAmount" + counter;
        var tempPaymentMessagePerformStatusId = "providerPaymentMessagePerformStatus" + counter;
        var tempPerformTransactionBtnId = "providerPerformTransactionBtn" + counter;


        var row = '                    <tr>\n' +
            '                        <td id="' + tempPaymentMessageNumberId + '" class="disabled text-center" contenteditable="false">1</td>\n' +
            '                        <td id="' + tempPaymentTransactionId + '" style="display: none"  class="text-center">' + transaction + '</td>\n' +
            '                        <td id="' + tempPaymentMessageCoordinatorId + '" class="text-center">' + coordinator + '</td>\n' +
            '                        <td id="' + tempPaymentMessageDestinationId + '" class="text-center">' + destination + '</td>\n' +
            '<td id="' + tempPaymentMessagePerformStatusId + '" class="center-content row no-gutters">\\n\' +\n' +
            '            \'                            <button id="' + tempPerformTransactionBtnId + '" class="btn btn-success" onclick="App.providerPerformTransaction(\' + counter + \')">perform transaction</button>\\n\' +\n' +
            '            \'                        </td>\\n\' +' +
            '                        <td id="' + tempPaymentMessageAmountId + '" class="text-center">' + amount + '</td>\n' +
            '                    </tr>\n';

        var table = document.getElementById("providerPaymentTable");
        $(table).find('tbody').append(row);
        App.paymentMessageCounter++;
    }
    ,

    providerRemovePaymentMessagesRows: function () {
        App.paymentMessageCounter = 0;
        var table = document.getElementById("providerPayments");
        $(table).find('tbody').html('');
    }
    ,

    providerPreviousPaymentMessages: function () {

        // alert("entered providerLoadPreviousPaymentMessages function");
        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                App.providerRemovePaymentMessagesRows();
                // NetereumInstance.numberOfPaymentMessages().then(function (numberOfPaymentMessages) {
                //
                //     for (var i = 0; i < numberOfPaymentMessages; i++) {
                //
                //         // alert("entered for loop");
                //         NetereumInstance.paymentMessagesAddress(i).then(async function (paymentMessageAddress) {
                //             // alert(agreementAddress);
                //             App.contracts.PaymentMessage.at(paymentMessageAddress).then(async function (instance) {
                //
                //                 var receiverAccount = await instance.receiverAddress();
                //                 var amount2 = await instance.paymentAmount();
                //                 var destination2 = await instance.destinationAccount();
                //                 // alert("before if!");
                //
                //                 // alert("receiver account is : " + receiverAccount + "\naccount is : " + account + "\namount is " + amount2 + "\ndestination" + destination2);
                //                 if (receiverAccount === account) {
                //                     // alert("after if!");
                //
                //                     var coordinatorAccount = await instance.coordinator();
                //                     var destination = await instance.destinationAccount();
                //                     var amount = await instance.paymentAmount();
                //                     var performStatus = await instance.isPerformed();
                //
                //                     App.providerAddPaymentMessageRow(paymentMessageAddress, coordinatorAccount, destination, amount, performStatus);
                //                 }
                //             });
                //         });
                //     }
                // });
            });
        });
    }
    ,

    providerPerformTransaction: function (counter) {

        // alert("entered performTransaction function");
        // alert(counter);
        var targetPerformTransactionBtnId = "providerPerformTransactionBtn" + counter;
        var performTransactionBtn = document.getElementById(targetPerformTransactionBtnId);
        performTransactionBtn.disabled = true;
        performTransactionBtn.innerText = "done";
        performTransactionBtn.classList.add("btn-dark");

        var targetTransactionId = "providerPaymentTransaction" + counter;
        var targetTransaction = document.getElementById(targetTransactionId);
        var transactionAddress = targetTransaction.innerText;

        App.contracts.PaymentMessage.at(transactionAddress).then(async function (instance) {
            await instance.performIt()
        });
    }
    ,

//start a new agreement functions ..............................................................................

    addEmptyNewAgreementRow: function () {
        App.addNewAgreementRow("", "", "", "", "", "", "", false, false, false);
    }
    ,

    addNewAgreementRow: function (agreement, coordinator, partnerAccount, partnerCoordinator, debtAmount, fee, expireTime, creditorPermissionStatus, debtorCoordinatorPermissionStatus, creditorCoordinatorPermissionStatus) {

        var counter = App.agreementCounter;

        var tempNewAgreementNumberId = "newAgreementNumber" + counter;
        var tempNewAgreementCoordinatorId = "newAgreementCoordinator" + counter;
        var tempNewAgreementPartnerAccountId = "newAgreementPartnerAccount" + counter;
        var tempNewAgreementPartnerCoordinatorId = "newAgreementPartnerCoordinator" + counter;
        var tempNewAgreementDebtAmountId = "newAgreementDebtAmount" + counter;
        var tempNewAgreementFeeId = "newAgreementFee" + counter;
        var tempNewAgreementConfirmationStatusId = "newAgreementConfirmationStatus" + counter;
        var tempNewAgreementConfirmationStatusCheck1Id = "newAgreementConfirmationStatusCheck1" + counter;
        var tempNewAgreementConfirmationStatusCheck2Id = "newAgreementConfirmationStatusCheck2" + counter;
        var tempNewAgreementConfirmationStatusCheck3Id = "newAgreementConfirmationStatusCheck3" + counter;
        var tempNewAgreementConfirmationStatusCheck4Id = "newAgreementConfirmationStatusCheck4" + counter;
        var tempNewAgreementSubmitBtnId = "newAgreementSubmitBtn" + counter;
        var tempNewAgreementAddressId = "newAgreementAddress" + counter;

        var row = "<tr>\n" +
            "                    <td id='" + tempNewAgreementNumberId + "' class=\"disabled text-center\" contenteditable=\"false\" style='font-size: small'>" + (parseInt(counter) + 1) + "</td>\n" +
            '                    <td id="' + tempNewAgreementAddressId + '" style="display: none"  class="text-center">' + agreement + '</td>\n' +
            "                    <td id='" + tempNewAgreementCoordinatorId + "' class=\"text-center\" style='font-size: small'>" + coordinator + "</td>\n" +
            "                    <td id='" + tempNewAgreementPartnerAccountId + "' class=\"text-center\" style='font-size: small'>" + partnerAccount + "</td>\n" +
            "                    <td id='" + tempNewAgreementPartnerCoordinatorId + "' class=\"text-center\" style='font-size: small'>" + partnerCoordinator + "</td>\n" +
            "                    <td id='" + tempNewAgreementDebtAmountId + "' class=\"text-center\" style='font-size: small'>" + debtAmount + "</td>\n" +
            "                    <td id='" + tempNewAgreementFeeId + "' class=\"text-center\" style='font-size: small'>" + fee + "</td>\n" +
            "                    <td id='" + tempNewAgreementFeeId + "' class=\"text-center\" style='font-size: small'>" +
            "                                <button id='" + tempNewAgreementSubmitBtnId + "' onclick='App.startNewAgreement(" + counter + ")' type=\"button\" class=\"btn btn-success\" style=\"margin: auto\">submit</button>\n" +
            "</td>\n" +
            "                </tr>\n";

        var table = document.getElementById("newAgreementTable");
        $(table).find('tbody').append(row);

        App.agreementCounter++;
    }
    ,

    removeNewAgreementsRows: function () {
        App.agreementCounter = 0;
        var table = document.getElementById("newAgreementTable");
        $(table).find('tbody').html('');
    }
    ,

    loadNewAgreements: function () {
        //
        //     // alert("entered loadPreviousNewAgreementsFunction");
        //     web3.eth.getCoinbase(function (err, account) {
        //         App.contracts.Netereum.deployed().then(function (NetereumInstance) {
        //
        //             NetereumInstance.numberOfCreatedAgreements().then(function (numberOfAgreements) {
        //
        App.removeNewAgreementsRows();
        //
        //                 // alert("number of agreements is " + numberOfAgreements);
        //                 // if (numberOfAgreements == 0) {
        //                 // alert("i am here");
        //                 // App.addEmptyNewAgreementRow();
        //                 // } else {
        //
        //                 // alert(" i am here instead!");
        //                 // }
        //
        //                 // alert("entered before loop");
        //                 for (var i = 0; i < numberOfAgreements; i++) {
        //
        //                     // alert("entered for loop");
        //                     NetereumInstance.createdAgreementsAddress(i).then(async function (agreementAddress) {
        //                         // alert(agreementAddress);
        //                         App.contracts.Agreement.at(agreementAddress).then(async function (instance) {
        //
        //                             var debtorAccount = await instance.debtor();
        //                             // alert("debtor account is " + debtorAccount);
        //                             // alert("account is :" + account);
        //                             if (debtorAccount === account) {
        //
        //                                 // alert("entered if");
        //                                 var creditorAccount = await instance.creditor();
        //                                 var debtorCoordinator = await instance.debtorCoordinator();
        //                                 var creditorCoordinator = await instance.creditorCoordinator();
        //
        //
        //                                 var debtAmount = await instance.debtorCost();
        //                                 var debtorFee = await instance.debtorFee();
        //                                 var expireTime = 100;
        //                                 var creditorPermissionStatus = await instance.creditorPermission();
        //                                 var debtorCoordinatorPermissionStatus = await instance.debtorCoordinatorPermission();
        //                                 var creditorCoordinatorPermissionStatus = await instance.creditorCoordinatorPermission();
        //
        //                                 // alert("creditor permission is : " + creditorPermissionStatus);
        //                                 // alert("debtor coordinator permission is : " + debtorCoordinatorPermissionStatus);
        //                                 // alert("creditor coordinator permission is : " + creditorCoordinatorPermissionStatus);
        //
        //                                 if
        //                                 App.addPreviousNewAgreementRow(agreementAddress, creditorAccount, debtorCoordinator, creditorCoordinator, debtAmount, debtorFee, expireTime);
        //                             }
        //                         });
        //                     });
        //                 }
        //             });
        //         });
        //     });
    },

    startNewAgreement: async function (counter) {//this is provider function
        // alert("entered startAgreement");
        // alert("counter is " + counter);
        // var targetNewAgreementNumberId = "newAgreementNumber" +  counter;
        var targetNewAgreementCoordinatorId = "newAgreementCoordinator" + counter;
        var targetNewAgreementPartnerAccountId = "newAgreementPartnerAccount" + counter;
        var targetNewAgreementPartnerCoordinatorId = "newAgreementPartnerCoordinator" + counter;
        var targetNewAgreementDebtAmountId = "newAgreementDebtAmount" + counter;
        var targetNewAgreementFeeId = "newAgreementFee" + counter;

        // var targetNewAgreementConfirmationStatusId = "newAgreementConfirmationStatus" + counter;
        var targetNewAgreementConfirmationStatusCheck1Id = "newAgreementConfirmationStatusCheck1" + counter;
        // var targetNewAgreementConfirmationStatusCheck2Id = "newAgreementConfirmationStatusCheck2" + counter;
        // var targetNewAgreementConfirmationStatusCheck3Id = "newAgreementConfirmationStatusCheck3" + counter;
        // var targetNewAgreementConfirmationStatusCheck4Id = "newAgreementConfirmationStatusCheck4" + counter;
        var targetNewAgreementSubmitBtnId = "newAgreementSubmitBtn" + counter;

        var coordinatorValue = document.getElementById(targetNewAgreementCoordinatorId).innerText;
        var partnerAccountValue = document.getElementById(targetNewAgreementPartnerAccountId).innerText;
        var partnerCoordinatorValue = document.getElementById(targetNewAgreementPartnerCoordinatorId).innerText;
        var debtAmountValue = document.getElementById(targetNewAgreementDebtAmountId).innerText;
        var feeValue = document.getElementById(targetNewAgreementFeeId).innerText;

        // alert(coordinatorValue);

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(async function (NetereumInstance) {

                // await NetereumInstance.createAgreement(account, "0xDCcDB028fBEb84Ea5117c95F7d504595915fe0d2", "0x1667db815A474Ea70B4B71eC34F505dD0D754Bda", "0x8dB8E88505567A0A3E4c64D647E16e2b03c205Cd", 5000, 5, 10);
                await NetereumInstance.createAgreement(account, partnerAccountValue, coordinatorValue, partnerCoordinatorValue, debtAmountValue, feeValue, 10);

                var newAgreementSubmitBtn = document.getElementById(targetNewAgreementSubmitBtnId);
                newAgreementSubmitBtn.disabled = true;
                newAgreementSubmitBtn.innerText = "done";
                newAgreementSubmitBtn.classList.add("btn-dark");

            });
        });
    }
    ,

// agreements lists functions ..........................................................................................


    addAgreementRow: function (agreementAddress, yourCoordinator, roleInAgreement, partner, partnerCoordinator, debtAmount, fee, creditorPermissionStatus, debtorCoordinatorPermissionStatus, creditorCoordinatorPermissionStatus, statusCode) {

        var status;

        // 0: not created 1:offered 2:pending 3:expired 4:declined
        // alert("statusCode is : " + statusCode);

        if (statusCode == "0") status = "not created";
        if (statusCode == "1") status = "offered";
        if (statusCode == "2") status = "pending";
        if (statusCode == "3") status = "expired";
        if (statusCode == "4") status = "declined";

        // alert("status is " + status);

        var counter = App.agreementCounter;

        var tempNewAgreementNumberId = "newAgreementNumber" + counter;
        var tempNewAgreementCoordinatorId = "newAgreementCoordinator" + counter;
        var tempNewAgreementPartnerId = "newAgreementPartnerAccount" + counter;
        var tempNewAgreementRoleInAgreementId = "newAgreementRoleInAgreement" + counter;
        var tempNewAgreementPartnerCoordinatorId = "newAgreementPartnerCoordinator" + counter;
        var tempNewAgreementDebtAmountId = "newAgreementDebtAmount" + counter;
        var tempNewAgreementFeeId = "newAgreementFee" + counter;
        var tempNewAgreementStatusId = "newAgreementStatus" + counter;
        var tempNewAgreementConfirmationStatusId = "newAgreementConfirmationStatus" + counter;
        var tempNewAgreementConfirmationStatusCheck1Id = "newAgreementConfirmationStatusCheck1" + counter;
        var tempNewAgreementConfirmationStatusCheck2Id = "newAgreementConfirmationStatusCheck2" + counter;
        var tempNewAgreementConfirmationStatusCheck3Id = "newAgreementConfirmationStatusCheck3" + counter;
        var tempNewAgreementConfirmationStatusCheck4Id = "newAgreementConfirmationStatusCheck4" + counter;
        var tempNewAgreementSubmitBtnId = "newAgreementSubmitBtn" + counter;
        var tempNewAgreementAddressId = "newAgreementAddress" + counter;

        var row = "<tr>\n" +
            "                    <td id='" + tempNewAgreementNumberId + "' class=\"disabled text-center\" contenteditable=\"false\" style='font-size: small'>" + (parseInt(counter) + 1) + "</td>\n" +
            '                    <td id="' + tempNewAgreementAddressId + '" style="display: none"  class="text-center">' + agreementAddress + '</td>\n' +
            "                    <td id='" + tempNewAgreementCoordinatorId + "' class=\"text-center\" style='font-size: small'>" + yourCoordinator + "</td>\n" +
            "                    <td id='" + tempNewAgreementRoleInAgreementId + "' class=\"text-center\" style='font-size: small'>" + roleInAgreement + "</td>\n" +
            "                    <td id='" + tempNewAgreementPartnerId + "' class=\"text-center\" style='font-size: small'>" + partner + "</td>\n" +
            "                    <td id='" + tempNewAgreementPartnerCoordinatorId + "' class=\"text-center\" style='font-size: small'>" + partnerCoordinator + "</td>\n" +
            "                    <td id='" + tempNewAgreementDebtAmountId + "' class=\"text-center\" style='font-size: small'>" + debtAmount + "</td>\n" +
            "                    <td id='" + tempNewAgreementFeeId + "' class=\"text-center\" style='font-size: small'>" + fee + "</td>\n" +
            "                    <td id='" + tempNewAgreementConfirmationStatusId + "'   class=\"text-center\" contenteditable = false>\n" +
            "\n" +
            // "                            <div class=\"col-1\"><input id='" + tempNewAgreementConfirmationStatusCheck1Id + "' type=\"checkbox\" class=\"form-check-input\" style=\"margin: auto; width: 20px; height: 20px; display: none\">\n" +
            // "                            </div>\n" +
            "<form class='form row no-gutters'>" +
            "                               <div class='col-4'><input id='" + tempNewAgreementConfirmationStatusCheck2Id + "' type=\"checkbox\" class=\"form-check-input \" style=\"\" disabled></div>\n" +
            "                               <div class='col-4'><input id='" + tempNewAgreementConfirmationStatusCheck3Id + "' type=\"checkbox\" class=\"form-check-input \" style=\"\" disabled></div>\n" +
            "                               <div class='col-4'><input id='" + tempNewAgreementConfirmationStatusCheck4Id + "' type=\"checkbox\" class=\"form-check-input \" style=\"\" disabled></div>\n" +
            "</form>" +

            "                    </td>\n" +
            "                    <td id='" + tempNewAgreementStatusId + "' class=\"text-center\" style='font-size: small'>" + status + "</td>\n" +
            "</tr>\n";

        var table = document.getElementById("agreementListTable");
        $(table).find('tbody').append(row);

        // document.getElementById(tempNewAgreementConfirmationStatusCheck1Id).checked = debtorPermissionStatus;
        if (creditorPermissionStatus == "1") document.getElementById(tempNewAgreementConfirmationStatusCheck2Id).checked = true;
        if (debtorCoordinatorPermissionStatus == "1") document.getElementById(tempNewAgreementConfirmationStatusCheck3Id).checked = true;
        if (creditorCoordinatorPermissionStatus == "1") document.getElementById(tempNewAgreementConfirmationStatusCheck4Id).checked = true;

        App.agreementCounter++;
    },

    removeAgreementsRows: function () {

        App.agreementCounter = 0;
        var table = document.getElementById("agreementListTable");
        $(table).find('tbody').html('');

    },

    loadAgreementsList: function () {

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {
                //
                NetereumInstance.numberOfCreatedAgreements().then(function (numberOfAgreements) {
                        //
                        App.removeAgreementsRows();

                        // alert("entered before loop");
                        for (var i = 0; i < numberOfAgreements; i++) {
                            //
                            //                     // alert("entered for loop");
                            NetereumInstance.createdAgreementsAddress(i).then(async function (agreementAddress) {
                                //                         // alert(agreementAddress);
                                App.contracts.Agreement.at(agreementAddress).then(async function (instance) {
                                    //

                                    var debtorAccount = await instance.debtor();
                                    var creditorAccount = await instance.creditor();

                                    var debtorCoordinator = await instance.debtorCoordinator();
                                    var creditorCoordinator = await instance.creditorCoordinator();


                                    var yourCoordinator;
                                    var roleInAgreement;
                                    var partner;
                                    var partnerCoordinator;

                                    var statusCode = await NetereumInstance.agreementsStatus(agreementAddress);

                                    var flag = false;

                                    if (debtorAccount === account) {
                                        flag = true;
                                        yourCoordinator = debtorCoordinator;
                                        roleInAgreement = "debtor";
                                        partner = creditorAccount;
                                        partnerCoordinator = creditorCoordinator;


                                    } else if (creditorAccount === account) {
                                        flag = true;
                                        roleInAgreement = "creditor";
                                        yourCoordinator = creditorCoordinator;
                                        partner = debtorAccount;
                                        partnerCoordinator = debtorCoordinator;

                                    }

                                    if (flag) {

                                        var debtAmount = await instance.debtorCost();
                                        var fee = await instance.debtorFee();
                                        var expireTime = 100;

                                        var creditorPermissionStatus = await instance.creditorPermission();
                                        var debtorCoordinatorPermissionStatus = await instance.debtorCoordinatorPermission();
                                        var creditorCoordinatorPermissionStatus = await instance.creditorCoordinatorPermission();
                                        var counterPermission = await instance.counterPermission();
                                        // alert("counterPermission is : " + counterPermission);

                                        App.addAgreementRow(agreementAddress, yourCoordinator, roleInAgreement, partner, partnerCoordinator, debtAmount, fee, creditorPermissionStatus, debtorCoordinatorPermissionStatus, creditorCoordinatorPermissionStatus, statusCode);

                                    }
                                });
                            });
                        }
                    }
                );
            });
        });
    },


// offers functions ....................................................................................................

    addAgreementOfferRow: function (agreement, yourCoordinator, debtor, debtorCoordinator, debtAmount, fee, details, yourPermissionStatus, debtorCoordinatorPermissionStatus, yourCoordinatorPermissionStatus) {

        var counter = App.agreementCounter;

        var tempAgreementOfferNumberId = "agreementOfferNumber" + counter;
        var tempAgreementOfferCoordinatorId = "agreementOfferCoordinator" + counter;
        var tempAgreementOfferPartnerAccountId = "agreementOfferPartnerAccount" + counter;
        var tempAgreementOfferPartnerCoordinatorId = "agreementOfferPartnerCoordinator" + counter;
        var tempAgreementOfferDebtAmountId = "agreementOfferDebtAmount" + counter;
        var tempAgreementOfferDetailsId = "agreementOfferDetails" + counter;
        var tempAgreementOfferFeeId = "agreementOfferFee" + counter;
        var tempAgreementOfferConfirmationStatusId = "agreementOfferConfirmationStatus" + counter;
        var tempAgreementOfferConfirmationStatusCheck1Id = "agreementOfferConfirmationStatusCheck1" + counter;
        var tempAgreementOfferConfirmationStatusCheck2Id = "agreementOfferConfirmationStatusCheck2" + counter;
        var tempAgreementOfferConfirmationStatusCheck3Id = "agreementOfferConfirmationStatusCheck3" + counter;
        var tempAgreementOfferConfirmationStatusCheck4Id = "agreementOfferConfirmationStatusCheck4" + counter;
        var tempAgreementOfferApproveBtnId = "agreementOfferApproveBtn" + counter;
        var tempAgreementOfferDeclineBtnId = "agreementOfferDeclineBtn" + counter;
        var tempAgreementOfferAddressId = "agreementOfferAddress" + counter;

        var row = "<tr>\n" +
            "                    <td id='" + tempAgreementOfferNumberId + "' class=\"disabled text-center\" contenteditable=\"false\" style='font-size: small'>" + (parseInt(counter) + 1) + "</td>\n" +
            '                    <td id="' + tempAgreementOfferAddressId + '" style="display: none"  class="text-center">' + agreement + '</td>\n' +
            "                    <td id='" + tempAgreementOfferCoordinatorId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + yourCoordinator + "</td>\n" +
            "                    <td id='" + tempAgreementOfferPartnerAccountId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + debtor + "</td>\n" +
            "                    <td id='" + tempAgreementOfferPartnerCoordinatorId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + debtorCoordinator + "</td>\n" +
            "                    <td id='" + tempAgreementOfferDebtAmountId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + debtAmount + "</td>\n" +
            "                    <td id='" + tempAgreementOfferFeeId + "' class=\"text-center\" style='font-size: small'>" + fee + "</td>\n" +
            "                    <td id='" + tempAgreementOfferDetailsId + "' class=\"text-center\" style='font-size: small'>" + details + "</td>\n" +
            "                    <td id='" + tempAgreementOfferConfirmationStatusId + "'   class=\"text-center row no-gutters\" contenteditable = false>\n" +
            "\n" +
            // "                            <div class=\"col-1\"><input id='" + tempAgreementOfferConfirmationStatusCheck1Id + "' type=\"checkbox\" class=\"form-check-input\" style=\"margin: auto; width: 20px; height: 20px; display: none\" disabled>\n" +
            // "                            </div>\n" +
            // "                            <div class=\"col-3\"><input id='" + tempAgreementOfferConfirmationStatusCheck2Id + "' type=\"checkbox\" class=\"form-check-input\" style=\"margin: auto; width: 20px; height: 20px; display: none\">\n" +
            // "                            </div>\n" +
            // "                            <div class=\"col-2\"><input id='" + tempAgreementOfferConfirmationStatusCheck3Id + "' type=\"checkbox\" class=\"form-check-input\" style=\"margin: auto; width: 20px; height: 20px;\" disabled>\n" +
            // "                            </div>\n" +
            // "                            <div class=\"col-3\"><input id='" + tempAgreementOfferConfirmationStatusCheck4Id + "' type=\"checkbox\" class=\"form-check-input\" style=\"margin: auto; width: 20px; height: 20px;\" disabled>\n" +
            // "                            </div>\n" +
            "                            <div class=\"\">\n" +
            "                                <button id='" + tempAgreementOfferApproveBtnId + "' onclick='App.approveAgreementOffer(" + counter + ")' type=\"button\" class=\"btn btn-sm btn-success\" style=\"font-size: smaller; \">approve</button>\n" +
            "                                <button id='" + tempAgreementOfferDeclineBtnId + "' onclick='App.declineAgreementOffer(" + counter + ")' type=\"button\" class=\"btn btn-sm btn-success\" style=\"font-size: smaller; \">decline</button>\n" +
            "                            </div>\n" +
            "                    </td>\n" +
            "                </tr>\n";

        var table = document.getElementById("agreementsOffersTable");
        $(table).find('tbody').append(row);

        // document.getElementById(tempAgreementOfferConfirmationStatusCheck1Id).checked = debtorPermissionStatus;
        // document.getElementById(tempAgreementOfferConfirmationStatusCheck2Id).checked = yourPermissionStatus;
        // document.getElementById(tempAgreementOfferConfirmationStatusCheck3Id).checked = yourCoordinatorPermissionStatus;
        // document.getElementById(tempAgreementOfferConfirmationStatusCheck4Id).checked = debtorCoordinatorPermissionStatus;

        // if (yourPermissionStatus) {
        //
        //     var agreementOfferSubmitBtn = document.getElementById(tempAgreementOfferApproveBtnId);
        //     agreementOfferSubmitBtn.disabled = true;
        //     agreementOfferSubmitBtn.innerText = "done";
        //     agreementOfferSubmitBtn.classList.add("btn-dark");
        //
        // }

        App.agreementCounter++;
    }
    ,

    approveAgreementOffer: function (counter) {

        // alert("entered providerConfirmAgreementOffer");
        // alert("counter is " + counter);
        var targetAgreementOfferConfirmationStatusCheck2Id = "agreementOfferConfirmationStatusCheck2" + counter;
        // var targetAgreementOfferConfirmationStatusCheck3Id = "agreementOfferConfirmationStatusCheck3" + counter;
        // var targetAgreementOfferConfirmationStatusCheck4Id = "agreementOfferConfirmationStatusCheck4" + counter;
        var targetAgreementOfferApproveBtnId = "agreementOfferApproveBtn" + counter;
        var targetAgreementOfferDeclineBtnId = "agreementOfferDeclineBtn" + counter;
        var targetAgreementOfferAddressId = "agreementOfferAddress" + counter;

        var agreementAddress = document.getElementById(targetAgreementOfferAddressId).innerText + '';
        // alert(agreementAddress);
        // alert(coordinatorValue);

        // alert(" received here ");
        App.contracts.Agreement.at(agreementAddress).then(async function (agreementInstance) {

            // alert("i am here");
            await agreementInstance.approve();
            var agreementOfferApproveBtn = document.getElementById(targetAgreementOfferApproveBtnId);
            agreementOfferApproveBtn.disabled = true;
            agreementOfferApproveBtn.innerText = "done";
            agreementOfferApproveBtn.classList.add("btn-dark");
            var agreementOfferDeclineBtn = document.getElementById(targetAgreementOfferDeclineBtnId);
            agreementOfferDeclineBtn.disabled = true;
            agreementOfferDeclineBtn.classList.add("btn-dark")

        });
    }
    ,

    declineAgreementOffer: function (counter) {

        var targetAgreementOfferApproveBtnId = "agreementOfferApproveBtn" + counter;
        var targetAgreementOfferDeclineBtnId = "agreementOfferDeclineBtn" + counter;
        var targetAgreementOfferAddressId = "agreementOfferAddress" + counter;
        var agreementAddress = document.getElementById(targetAgreementOfferAddressId).innerText + '';

        // alert(" received here ");
        App.contracts.Agreement.at(agreementAddress).then(async function (agreementInstance) {

            // alert("i am here");
            await agreementInstance.decline();
            var agreementOfferApproveBtn = document.getElementById(targetAgreementOfferApproveBtnId);
            agreementOfferApproveBtn.disabled = true;
            agreementOfferApproveBtn.classList.add("btn-dark");
            var agreementOfferDeclineBtn = document.getElementById(targetAgreementOfferDeclineBtnId);
            agreementOfferDeclineBtn.innerText = "done";
            agreementOfferDeclineBtn.disabled = true;
            agreementOfferDeclineBtn.classList.add("btn-dark")

        });
    },

    removeAgreementsOffersRows: function () {
        App.agreementCounter = 0;
        var table = document.getElementById("agreementsOffersTable");
        $(table).find('tbody').html('');
    },

    loadAgreementsOffers: function () {
        // alert("entered loadPrevious`AgreementOffers`Function");
        web3.eth.getCoinbase(function (err, account) {

            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                NetereumInstance.numberOfCreatedAgreements().then(function (numberOfAgreements) {

                    App.removeAgreementsOffersRows();

                    for (var i = 0; i < numberOfAgreements; i++) {

                        // alert("entered for loop");
                        NetereumInstance.createdAgreementsAddress(i).then(async function (agreementAddress) {
                            // alert(agreementAddress);
                            App.contracts.Agreement.at(agreementAddress).then(async function (instance) {
                                var status = await NetereumInstance.agreementsStatus(agreementAddress);
                                // alert("status here is " + status);
                                var creditor = await instance.creditor();
                                // alert("creditor is : " + creditor);
                                // if (status == 1 )alert("ok1");
                                // if (creditor === account)alert("ok2");
                                // alert("entered before if");
                                var creditorPermissionStatus = await instance.creditorPermission();
                                // alert("creditorPermissionStatus is :" + creditorPermissionStatus);
                                if (creditor === account && status == 1 && creditorPermissionStatus == '0') {

                                    // alert("entered if");
                                    var debtorAcount = await instance.debtor();
                                    var debtorCoordinator = await instance.debtorCoordinator();
                                    var creditorCoordinator = await instance.creditorCoordinator();
                                    var debtAmount = await instance.debtorCost();
                                    var fee = await instance.debtorFee();
                                    var details = "some details";
                                    // var debtorPermissionStatus = await instance.debtorPermission();
                                    var debtorCoordinatorPermissionStatus = await instance.debtorCoordinatorPermission();
                                    var creditorCoordinatorPermissionStatus = await instance.creditorCoordinatorPermission();

                                    App.addAgreementOfferRow(agreementAddress, creditorCoordinator, debtorAcount, debtorCoordinator, debtAmount, fee, details, creditorPermissionStatus, debtorCoordinatorPermissionStatus, creditorCoordinatorPermissionStatus);

                                }
                            });
                        });
                    }
                });
            });
        });
    }
    ,


//customer functions ...............................................................................................


    customerAddPaymentMessageRow: function (transaction, coordinator, destination, amount, performStatus) {
        var counter = App.paymentMessageCounter;

        var tempPaymentMessageNumberId = "customerPaymentMessageNumber" + counter;
        var tempPaymentTransactionId = "customerPaymentTransaction" + counter;
        var tempPaymentMessageCoordinatorId = "customerPaymentMessageCoordinator" + counter;
        var tempPaymentMessageDestinationId = "customerPaymentMessageDestination" + counter;
        var tempPaymentMessageAmountId = "customerPaymentMessageAmount" + counter;
        var tempPaymentMessagePerformStatusId = "customerPaymentMessagePerformStatus" + counter;
        var tempPerformTransactionBtnId = "customerPerformTransactionBtn" + counter;


        var row = '                    <tr>\n' +
            '                        <td id="' + tempPaymentMessageNumberId + '" class="disabled text-center" contenteditable="false">1</td>\n' +
            '                        <td id="' + tempPaymentTransactionId + '" style="display: none"  class="text-center">' + transaction + '</td>\n' +
            '                        <td id="' + tempPaymentMessageCoordinatorId + '" class="text-center">' + coordinator + '</td>\n' +
            '                        <td id="' + tempPaymentMessageDestinationId + '" class="text-center">' + destination + '</td>\n' +
            '                        <td id="' + tempPaymentMessageAmountId + '" class="text-center">' + amount + '</td>\n' +
            '                        <td id="' + tempPaymentMessagePerformStatusId + '" class="center-content row no-gutters">\n' +
            '                            <button id="' + tempPerformTransactionBtnId + '" class="btn btn-success" onclick="App.customerPerformTransaction(' + counter + ')">perform transaction</button>\n' +
            '                        </td>\n' +
            '                    </tr>\n';

        var table = document.getElementById("providerPaymentTable");
        $(table).find('tbody').append(row);

        if (performStatus === true) {

            var tempPerformTransactionBtn = document.getElementById(tempPerformTransactionBtnId);
            tempPerformTransactionBtn.disabled = true;
            tempPerformTransactionBtn.innerText = "done";
            tempPerformTransactionBtn.classList.add("btn-dark");
        }
        App.paymentMessageCounter++;
    },

    customerLoadPaymentMessages: function () {

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                App.providerRemovePaymentMessagesRows();
                NetereumInstance.numberOfPaymentMessages().then(function (numberOfPaymentMessages) {

                    for (var i = 0; i < numberOfPaymentMessages; i++) {

                        // alert("entered for loop");
                        NetereumInstance.paymentMessagesAddress(i).then(async function (paymentMessageAddress) {
                            // alert(agreementAddress);
                            App.contracts.PaymentMessage.at(paymentMessageAddress).then(async function (instance) {

                                var receiverAccount = await instance.receiverAddress();
                                if (receiverAccount === account) {
                                    // alert("after if!");

                                    var coordinatorAccount = await instance.coordinator();
                                    var destination = await instance.destinationAccount();
                                    var amount = await instance.paymentAmount();
                                    var performStatus = await instance.isPerformed();

                                    App.customerAddPaymentMessageRow(paymentMessageAddress, coordinatorAccount, destination, amount, performStatus);
                                }
                            });
                        });
                    }
                });
            });
        });
    },

    customerPerformTransaction: function (counter) {

        // alert("entered performTransaction function");
        // alert(counter);
        var targetPerformTransactionBtnId = "customerPerformTransactionBtn" + counter;
        var performTransactionBtn = document.getElementById(targetPerformTransactionBtnId);
        performTransactionBtn.disabled = true;
        performTransactionBtn.innerText = "done";
        performTransactionBtn.classList.add("btn-dark");

        var targetTransactionId = "customerPaymentTransaction" + counter;
        var targetTransaction = document.getElementById(targetTransactionId);
        var transactionAddress = targetTransaction.innerText;

        App.contracts.PaymentMessage.at(transactionAddress).then(async function (instance) {
            await instance.performIt();
        });
    },

    //start new transaction function ...................................................................................

    addEmptyNewTransactionRow: function () {
        App.addNewTransactionRow("", "", "", "", "", "", false, false, false, false);
    },

    addNewTransactionRow: function (transaction, coordinator, destination, destinationCoordinator, debtAmount, fee, coordinatorPermissionStatus, destinationPermissionStatus, destinationCoordinatorPermissionStatus, isCreated) {

        var counter = App.transactionCounter;

        var tempNewTransactionNumberId = "newTransactionNumber" + counter;
        var tempNewTransactionCoordinatorId = "newTransactionCoordinator" + counter;
        var tempNewTransactionDestinationId = "newTransactionDestination" + counter;
        var tempNewTransactionDestinationCoordinatorId = "newTransactionDestinationCoordinator" + counter;
        var tempNewTransactionDebtAmountId = "newTransactionDebtAmount" + counter;
        var tempNewTransactionMaxFeeId = "nweTransactionMaxFee" + counter;
        var tempNewTransactionConfirmationStatusId = "newTransactionConfirmationStatus" + counter;
        var tempNewTransactionConfirmationStatusCheck1Id = "newTransactionConfirmationStatusCheck1" + counter;
        var tempNewTransactionConfirmationStatusCheck2Id = "newTransactionConfirmationStatusCheck2" + counter;
        var tempNewTransactionConfirmationStatusCheck3Id = "newTransactionConfirmationStatusCheck3" + counter;
        var tempNewTransactionConfirmationStatusCheck4Id = "newTransactionConfirmationStatusCheck4" + counter;
        var tempNewTransactionSubmitBtnId = "newTransactionSubmitBtn" + counter;
        var tempNewTransactionAddressId = "newTransactionAddress" + counter;

        var row = "<tr>\n" +
            "                    <td id='" + tempNewTransactionNumberId + "' class=\"disabled text-center\" style='font-size: small'>" + (parseInt(counter) + 1) + "</td>\n" +
            '                    <td id="' + tempNewTransactionAddressId + '" style="display: none"  class="text-center">' + transaction + '</td>\n' +
            "                    <td id='" + tempNewTransactionCoordinatorId + "' class=\"text-center\" style='font-size: small'>" + coordinator + "</td>\n" +
            "                    <td id='" + tempNewTransactionDestinationId + "' class=\"text-center\" style='font-size: small'>" + destination + "</td>\n" +
            "                    <td id='" + tempNewTransactionDestinationCoordinatorId + "' class=\"text-center\" style='font-size: small'>" + destinationCoordinator + "</td>\n" +
            "                    <td id='" + tempNewTransactionDebtAmountId + "' class=\"text-center\" style='font-size: small'>" + debtAmount + "</td>\n" +
            "                    <td id='" + tempNewTransactionMaxFeeId + "' class=\"text-center\" style='font-size: small'>" + fee + "</td>\n" +
            "                    <td id='" + tempNewTransactionConfirmationStatusId + "'   class=\"text-center row no-gutters\">\n" +
            "                                <button id='" + tempNewTransactionSubmitBtnId + "' onclick='App.startNewTransaction(" + counter + ")' type=\"button\" class=\"btn btn-sm btn-success\" style=\"font-size: smaller; margin: auto\">submit</button>\n" +
            "                    </td>\n" +
            "                </tr>\n";


        var table = document.getElementById("newTransactionTable");
        $(table).find('tbody').append(row);

        // document.getElementById(tempNewTransactionConfirmationStatusCheck2Id).checked = coordinatorPermissionStatus;
        // document.getElementById(tempNewTransactionConfirmationStatusCheck3Id).checked = destinationPermissionStatus;
        // document.getElementById(tempNewTransactionConfirmationStatusCheck4Id).checked = destinationCoordinatorPermissionStatus;

        if (isCreated) {

            var newAgreementSubmitBtn = document.getElementById(tempNewTransactionSubmitBtnId);
            newAgreementSubmitBtn.disabled = true;
            newAgreementSubmitBtn.innerText = "done";
            newAgreementSubmitBtn.classList.add("btn-dark");

        }

        App.transactionCounter++;
    },

    RemoveNewTransactionsRows: function () {
        App.transactionCounter = 0;
        var table = document.getElementById("newTransactionTable");
        $(table).find('tbody').html('');
    },


    loadNewTransactions: function () {

        // alert("entered loadNewAgreementsFunction");
        // web3.eth.getCoinbase(function (err, account) {
        //     App.contracts.Netereum.deployed().then(function (NetereumInstance) {
        //
        //         NetereumInstance.numberOfCreatedTransactions().then(function (numberOfCreatedTransactions) {
        //
        App.RemoveNewTransactionsRows();

        //             if (numberOfCreatedTransactions == 0) {
        //                 // alert("i am here");
        //                 App.addEmptyNewTransactionRow();
        //             } else {
        //
        //                 // alert(" i am here instead!");
        //             }
        //
        //             for (var i = 0; i < numberOfCreatedTransactions; i++) {
        //
        //                 // alert("entered for loop");
        //                 NetereumInstance.createdTransactionsAddress(i).then(async function (transactionAddress) {
        //                     // alert(transactionAddress);
        //                     App.contracts.Transaction.at(transactionAddress).then(async function (instance) {
        //
        //                         var sender = await instance.senderAccount();
        //
        //                         if (sender === account) {
        //
        //                             // alert("entered if");
        //                             var senderCoordinator = await instance.senderCoordinator();
        //                             var receiver = await instance.receiverAccount();
        //                             var receiverCoordinator = await instance.receiverCoordinator();
        //                             var amount = await instance.transactionAmount();
        //                             var maxFee = await instance.maxFee();
        //                             // var senderPermission = await instance.senderPremission();
        //                             var receiverPermission = await instance.receiverPermission();
        //                             var senderCoordinatorPermission = await instance.senderCoordinatorPermission();
        //                             var receiverCoordinatorPermission = await instance.receiverCoordinatorPermission();
        //
        //                             App.addNewTransactionRow(transactionAddress, senderCoordinator, receiver, receiverCoordinator, amount, maxFee, senderCoordinatorPermission, receiverPermission, receiverCoordinatorPermission, true);
        //                         }
        //                     });
        //                 });
        //             }
        //         });
        //     });
        // });
    },

    startNewTransaction: function (counter) {

        var targetNewTransactionNumberId = "newTransactionNumber" + counter;
        var targetNewTransactionCoordinatorId = "newTransactionCoordinator" + counter;
        var targetNewTransactionDestinationId = "newTransactionDestination" + counter;
        var targetNewTransactionDestinationCoordinatorId = "newTransactionDestinationCoordinator" + counter;
        var targetNewTransactionDebtAmountId = "newTransactionDebtAmount" + counter;
        var targetNewTransactionMaxFeeId = "nweTransactionMaxFee" + counter;

        // var targetNewTransactionConfirmationStatusId = "newTransactionConfirmationStatus" + counter;
        var targetNewTransactionConfirmationStatusCheck1Id = "newTransactionConfirmationStatusCheck1" + counter;
        // var targetNewTransactionConfirmationStatusCheck2Id = "newTransactionConfirmationStatusCheck2" + counter;
        // var targetNewTransactionConfirmationStatusCheck3Id = "newTransactionConfirmationStatusCheck3" + counter;
        // var targetNewTransactionConfirmationStatusCheck4Id = "newTransactionConfirmationStatusCheck4" + counter;
        var targetNewTransactionSubmitBtnId = "newTransactionSubmitBtn" + counter;

        var coordinatorValue = document.getElementById(targetNewTransactionCoordinatorId).innerText + '';
        var destinationValue = document.getElementById(targetNewTransactionDestinationId).innerText + '';
        var destinationCoordinatorValue = document.getElementById(targetNewTransactionDestinationCoordinatorId).innerText + '';
        var amountValue = document.getElementById(targetNewTransactionDebtAmountId).innerText + '';
        var maxFeeValue = document.getElementById(targetNewTransactionMaxFeeId).innerText + '';

        // alert(coordinatorValue);

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(async function (NetereumInstance) {

                // await NetereumInstance.createTransaction(account, "0x892ACf0E80E4f1c9b6BcA4CAB0147eAac554E389", "0x8dB8E88505567A0A3E4c64D647E16e2b03c205Cd", "0x1667db815A474Ea70B4B71eC34F505dD0D754Bda", 100, 15);
                await NetereumInstance.createTransaction(account, destinationValue, coordinatorValue, destinationCoordinatorValue, amountValue, maxFeeValue);
                var newTransactionSubmitBtn = document.getElementById(targetNewTransactionSubmitBtnId);
                newTransactionSubmitBtn.disabled = true;
                newTransactionSubmitBtn.innerText = "done";
                newTransactionSubmitBtn.classList.add("btn-dark");

            });
        });
    },

    //offered transactions functions ...................................................................................

    addOfferedTransactionRow: function (transaction, yourCoordinator, sender, senderCoordinator, debtAmount, maxFee, yourPermissionStatus, yourCoordinatorPermissionStatus, senderCoordinatorPermissionStatus, statusCode) {
        // transactionAddress, receiverCoordinator, sender, senderCoordinator, amount, maxFee, receiverPermissionStatus, receiverCoordinatorPermissionStatus, senderCoordinatorPermissionStatus, statusCode
        var status;
        // 0: not created  1:offered 2: pending 3:added 4:declined

        var counter = App.transactionCounter;

        var tempTransactionOfferNumberId = "transactionOfferNumber" + counter;
        var tempTransactionOfferCoordinatorId = "transactionOfferCoordinator" + counter;
        var tempTransactionOfferSenderAccountId = "transactionOfferSenderAccount" + counter;
        var tempTransactionOfferSenderCoordinatorId = "transactionOfferSenderCoordinator" + counter;
        var tempTransactionOfferDebtAmountId = "transactionOfferDebtAmount" + counter;
        var tempTransactionOfferMaxFeeId = "transactionOfferMaxFee" + counter;
        // var tempTransactionOfferDetailsId = "transactionOfferDetails" + counter;
        var tempTransactionOfferConfirmationStatusId = "transactionOfferConfirmationStatus" + counter;
        var tempTransactionOfferConfirmationStatusCheck1Id = "transactionOfferConfirmationStatusCheck1" + counter;
        var tempTransactionOfferConfirmationStatusCheck2Id = "transactionOfferConfirmationStatusCheck2" + counter;
        var tempTransactionOfferConfirmationStatusCheck3Id = "transactionOfferConfirmationStatusCheck3" + counter;
        var tempTransactionOfferConfirmationStatusCheck4Id = "transactionOfferConfirmationStatusCheck4" + counter;
        var tempTransactionOfferApproveBtnId = "transactionOfferApproveBtn" + counter;
        var tempTransactionOfferDeclineBtnId = "transactionOfferDeclineBtn" + counter;
        var tempTransactionOfferAddressId = "transactionOfferAddress" + counter;

        var row = "<tr>\n" +
            "                    <td id='" + tempTransactionOfferNumberId + "' class=\"disabled text-center\" contenteditable=\"false\" style='font-size: small'>" + (parseInt(counter) + 1) + "</td>\n" +
            '                    <td id="' + tempTransactionOfferAddressId + '" style="display: none"  class="text-center">' + transaction + '</td>\n' +
            "                    <td id='" + tempTransactionOfferCoordinatorId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + yourCoordinator + "</td>\n" +
            "                    <td id='" + tempTransactionOfferSenderAccountId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + sender + "</td>\n" +
            "                    <td id='" + tempTransactionOfferSenderCoordinatorId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + senderCoordinator + "</td>\n" +
            "                    <td id='" + tempTransactionOfferDebtAmountId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + debtAmount + "</td>\n" +
            "                    <td id='" + tempTransactionOfferMaxFeeId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + maxFee + "</td>\n" +
            "                    <td id='" + tempTransactionOfferConfirmationStatusId + "'   class=\"text-center row no-gutters\" contenteditable = false>\n" +
            "\n" +
            // "                            <div class=\"col-1\"><input id='" + tempTransactionOfferConfirmationStatusCheck1Id + "' type=\"checkbox\" class=\"form-check-input\" style=\"margin: auto; width: 20px; height: 20px; display: none\" disabled>\n" +
            // "                            </div>\n" +
            // "                            <div class=\"col-3\"><input id='" + tempTransactionOfferConfirmationStatusCheck2Id + "' type=\"checkbox\" class=\"form-check-input\" style=\"margin: auto; width: 20px; height: 20px; display: none\">\n" +
            // "                            </div>\n" +
            // "                            <div class=\"col-2\"><input id='" + tempTransactionOfferConfirmationStatusCheck3Id + "' type=\"checkbox\" class=\"form-check-input\" style=\"margin: auto; width: 20px; height: 20px;\" disabled>\n" +
            // "                            </div>\n" +
            // "                            <div class=\"col-3\"><input id='" + tempTransactionOfferConfirmationStatusCheck4Id + "' type=\"checkbox\" class=\"form-check-input\" style=\"margin: auto; width: 20px; height: 20px;\" disabled>\n" +
            // "                            </div>\n" +
            // "                            <div class=\"col-3\">\n" +
            "                                <button id='" + tempTransactionOfferApproveBtnId + "' onclick='App.approveOfferedTransaction(" + counter + ")' type=\"button\" class=\"btn btn-sm btn-success\" style=\"font-size: smaller; margin: auto\">approve</button>\n" +
            "                                <button id='" + tempTransactionOfferDeclineBtnId + "' onclick='App.declineOfferedTransaction(" + counter + ")' type=\"button\" class=\"btn btn-sm btn-success\" style=\"font-size: smaller; margin: auto\">decline</button>\n" +
            // "                            </div>\n" +
            "                    </td>\n" +
            "                </tr>\n";

        var table = document.getElementById("offeredTransactionsTable");
        $(table).find('tbody').append(row);

        // document.getElementById(tempTransactionOfferConfirmationStatusCheck1Id).checked = yourPermissionStatus;
        // document.getElementById(tempTransactionOfferConfirmationStatusCheck2Id).checked = yourCoordinatorPermissionStatus;
        // document.getElementById(tempTransactionOfferConfirmationStatusCheck3Id).checked = debtorCoordinatorPermissionStatus;
        // document.getElementById(tempTransactionOfferConfirmationStatusCheck4Id).checked = senderCoordinatorPermissionStatus;
        App.transactionCounter++;
    },

    removeOfferedTransactionsRows: function () {

        App.transactionCounter = 0;
        var table = document.getElementById("offeredTransactionsTable");
        $(table).find('tbody').html('');
    },

    loadOfferedTransactions: function () {
        web3.eth.getCoinbase(function (err, account) {

            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                NetereumInstance.numberOfCreatedTransactions().then(function (numberOfTransactions) {

                    App.removeOfferedTransactionsRows();

                    for (var i = 0; i < numberOfTransactions; i++) {

                        // alert("entered for loop");
                        NetereumInstance.createdTransactionsAddress(i).then(async function (transactionAddress) {
                            // alert(transactionAddress);
                            App.contracts.Transaction.at(transactionAddress).then(async function (instance) {

                                var receiver = await instance.receiverAccount();
                                var receiverPermissionStatus = await instance.receiverPermission();

                                if (receiver === account && receiverPermissionStatus == '0') {

                                    // alert("entered if");

                                    var sender = await instance.senderAccount();
                                    var senderCoordinator = await instance.senderCoordinator();
                                    var receiverCoordinator = await instance.receiverCoordinator();
                                    var amount = await instance.transactionAmount();
                                    var maxFee = await instance.maxFee();
                                    // var details = "some details";
                                    var senderCoordinatorPermissionStatus = await instance.senderCoordinatorPermission();
                                    var receiverCoordinatorPermissionStatus = await instance.receiverCoordinatorPermission();

                                    App.addOfferedTransactionRow(transactionAddress, receiverCoordinator, sender, senderCoordinator, amount, maxFee, receiverPermissionStatus, receiverCoordinatorPermissionStatus, senderCoordinatorPermissionStatus);
                                }
                            });
                        });
                    }
                });
            });
        });
    },

    approveOfferedTransaction: function (counter) {

        // alert("entered approveOfferedTransaction ");
        // alert("counter is " + counter);
        // var targetTransactionOfferConfirmationStatusCheck2Id = "transactionOfferConfirmationStatusCheck2" + counter;
        // var targetTransactionOfferConfirmationStatusCheck3Id = "transactionOfferConfirmationStatusCheck3" + counter;
        // var targetTransactionOfferConfirmationStatusCheck4Id = "transactionOfferConfirmationStatusCheck4" + counter;
        var targetTransactionOfferApproveBtnId = "transactionOfferApproveBtn" + counter;
        var targetTransactionOfferDeclineBtnId = "transactionOfferDeclineBtn" + counter;
        var targetTransactionOfferAddressId = "transactionOfferAddress" + counter;

        var transactionAddress = document.getElementById(targetTransactionOfferAddressId).innerText + '';
        // alert(transactionAddress);
        // alert(coordinatorValue);

        // alert(" received here ");
        App.contracts.Transaction.at(transactionAddress).then(async function (transactionInstance) {

            // alert("i am here");
            await transactionInstance.approve();
            var transactionOfferApproveBtn = document.getElementById(targetTransactionOfferApproveBtnId);
            transactionOfferApproveBtn.disabled = true;
            transactionOfferApproveBtn.innerText = "done";
            transactionOfferApproveBtn.classList.add("btn-dark");
            var transactionOfferDeclineBtn = document.getElementById(targetTransactionOfferDeclineBtnId);
            transactionOfferDeclineBtn.disabled = true;
            transactionOfferDeclineBtn.classList.add("btn-dark")

        });
    },

    declineOfferedTransaction: function (counter) {

        var targetTransactionOfferApproveBtnId = "transactionOfferApproveBtn" + counter;
        var targetTransactionOfferDeclineBtnId = "transactionOfferDeclineBtn" + counter;
        var targetTransactionOfferAddressId = "transactionOfferAddress" + counter;
        var transactionAddress = document.getElementById(targetTransactionOfferAddressId).innerText + '';

        // alert(" received here ");
        App.contracts.Agreement.at(transactionAddress).then(async function (transactionInstance) {

            // alert("i am here");
            await transactionInstance.decline();
            var transactionOfferApproveBtn = document.getElementById(targetTransactionOfferApproveBtnId);
            transactionOfferApproveBtn.disabled = true;
            transactionOfferApproveBtn.classList.add("btn-dark");
            var transactionOfferDeclineBtn = document.getElementById(targetTransactionOfferDeclineBtnId);
            transactionOfferDeclineBtn.innerText = "done";
            transactionOfferDeclineBtn.disabled = true;
            transactionOfferDeclineBtn.classList.add("btn-dark")

        });
    },

    //pending transaction functions ....................................................................................

    addTransactionRow: function (transaction, yourCoordinator, counterpart, counterpartCoordinator, type, amount, maxFee, receiverPermission, senderCoordinatorPermission, receiverCoordinatorPermission, statusCode) {

        // alert("senderCoordinatorPermission is : " + senderCoordinatorPermission);
        // alert("receiverCoordinatorPermission is : " + receiverCoordinatorPermission);
        // alert("receiverPermission is : " + receiverPermission);


        var status;
        if (statusCode == '0') status = "not created";
        if (statusCode == '1') status = "offered";
        if (statusCode == '2') status = "pending";
        if (statusCode == '3') status = "added";
        if (statusCode == '4') status = "declined";

        var counter = App.transactionCounter;

        var tempPendingTransactionNumberId = "pendingTransactionNumber" + counter;
        var tempPendingTransactionYourCoordinatorId = "pendingTransactionCoordinator" + counter;
        var tempPendingTransactionCounterpartAccountId = "pendingTransactionCounterpartAccount" + counter;
        var tempPendingTransactionCounterpartCoordinatorId = "pendingTransactionCounterpartCoordinator" + counter;
        var tempPendingTransactionAmountId = "pendingTransactionAmount" + counter;
        var tempPendingTransactionMaxFeeId = "pendingTransactionMaxFee" + counter;
        var tempPendingTransactionTypeId = "pendingTransactionType" + counter;
        var tempPendingTransactionStatusId = "pendingTransactionState" + counter;
        var tempPendingTransactionAddressId = "pendingTransactionAddress" + counter;
        var tempPendingConfirmationStatusId = 'pendingTransactionConfirmationsStatus' + counter;
        var tempNewAgreementConfirmationStatusCheck2Id = "newTransactionConfirmationStatusCheck2" + counter;
        var tempNewAgreementConfirmationStatusCheck3Id = "newTransactionConfirmationStatusCheck3" + counter;
        var tempNewAgreementConfirmationStatusCheck4Id = "newTransactionConfirmationStatusCheck4" + counter;

        var row = "<tr>\n" +
            "                    <td id='" + tempPendingTransactionNumberId + "' class=\"disabled text-center\" contenteditable=\"false\" style='font-size: small'>" + (parseInt(counter) + 1) + "</td>\n" +
            '                    <td id="' + tempPendingTransactionAddressId + '" style="display: none"  class="text-center">' + transaction + '</td>\n' +
            "                    <td id='" + tempPendingTransactionYourCoordinatorId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + yourCoordinator + "</td>\n" +
            "                    <td id='" + tempPendingTransactionCounterpartAccountId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + counterpart + "</td>\n" +
            "                    <td id='" + tempPendingTransactionCounterpartCoordinatorId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + counterpartCoordinator + "</td>\n" +
            "                    <td id='" + tempPendingTransactionTypeId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + type + "</td>\n" +
            "                    <td id='" + tempPendingTransactionAmountId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + amount + "</td>\n" +
            "                    <td id='" + tempPendingTransactionMaxFeeId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + maxFee + "</td>\n" +

            "                    <td id='" + tempPendingConfirmationStatusId + "'   class=\"text-center\" contenteditable = false>\n" +
            "\n" +
            // "                            <div class=\"col-1\"><input id='" + tempNewAgreementConfirmationStatusCheck1Id + "' type=\"checkbox\" class=\"form-check-input\" style=\"margin: auto; width: 20px; height: 20px; display: none\">\n" +
            // "                            </div>\n" +
            "<form class='form row no-gutters'>" +
            "                               <div class='col-4'><input id='" + tempNewAgreementConfirmationStatusCheck2Id + "' type=\"checkbox\" class=\"form-check-input \" style=\"\" disabled></div>\n" +
            "                               <div class='col-4'><input id='" + tempNewAgreementConfirmationStatusCheck3Id + "' type=\"checkbox\" class=\"form-check-input \" style=\"\" disabled></div>\n" +
            "                               <div class='col-4'><input id='" + tempNewAgreementConfirmationStatusCheck4Id + "' type=\"checkbox\" class=\"form-check-input \" style=\"\" disabled></div>\n" +
            "</form>" +

            "                    </td>\n" +
            "                    <td id='" + tempPendingTransactionStatusId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + status + "</td>\n" +
            "                </tr>\n";

        var table = document.getElementById("transactionsListTable");
        $(table).find('tbody').append(row);

        if (receiverPermission == "1") document.getElementById(tempNewAgreementConfirmationStatusCheck2Id).checked = true;
        if (senderCoordinatorPermission == "1") document.getElementById(tempNewAgreementConfirmationStatusCheck3Id).checked = true;
        if (receiverCoordinatorPermission == "1") document.getElementById(tempNewAgreementConfirmationStatusCheck4Id).checked = true;

        App.transactionCounter++;
    },

    removeTransactionsRows: function () {
        App.transactionCounter = 0;
        var table = document.getElementById("transactionsListTable");
        $(table).find('tbody').html('');
    },

    loadTransactions: function () {

        // alert("entered loadTransaction function");

        web3.eth.getCoinbase(function (err, account) {

            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                NetereumInstance.numberOfCreatedTransactions().then(function (numberOfTransactions) {

                    App.removeTransactionsRows();

                    for (var i = 0; i < numberOfTransactions; i++) {

                        // alert("entered for loop");
                        NetereumInstance.createdTransactionsAddress(i).then(async function (transactionAddress) {
                            // alert(transactionAddress);
                            App.contracts.Transaction.at(transactionAddress).then(async function (instance) {

                                var statusCode = await NetereumInstance.transactionsStatus(transactionAddress);

                                var sender = await instance.senderAccount();
                                var receiver = await instance.receiverAccount();
                                var receiverCoordinator = await instance.receiverCoordinator();
                                var senderCoordinator = await instance.senderCoordinator();
                                var roleInTransaction;
                                var state = "it will be executed in 2:00 AM";

                                var counterpart;
                                var counterpartCoordinator;
                                var yourCoordinator;
                                var flag = false;

                                if (receiver === account) {
                                    // alert("entered first if ");

                                    flag = true;
                                    counterpart = sender;
                                    counterpartCoordinator = senderCoordinator;
                                    yourCoordinator = receiverCoordinator;
                                    roleInTransaction = "receiver";

                                } else if (sender === account) {
                                    // alert("entered second if ");

                                    flag = true;
                                    counterpart = receiver;
                                    counterpartCoordinator = receiverCoordinator;
                                    yourCoordinator = senderCoordinator;
                                    roleInTransaction = "sender";
                                }

                                if (flag) {

                                    var amount = await instance.transactionAmount();
                                    var maxFee = await instance.maxFee();

                                    var receiverPermissionStatus = await instance.receiverPermission();
                                    var senderCoordinatorPermissionStatus = await instance.senderCoordinatorPermission();
                                    var receiverCoordinatorPermissionStatus = await instance.receiverCoordinatorPermission();
                                    var counterPermission = await instance.counterPermission();

                                    App.addTransactionRow(transactionAddress, yourCoordinator, counterpart, counterpartCoordinator, roleInTransaction, amount, maxFee, receiverPermissionStatus, senderCoordinatorPermissionStatus, receiverCoordinatorPermissionStatus, statusCode);
                                }
                            });
                        });
                    }
                });
            });
        });
    },

    // previous transaction functions ..................................................................................

    // addPreviousTransactionRow: function (transaction, yourCoordinator, counterpart, counterpartCoordinator, type, amount, maxFee, status) {
    //
    //     var counter = App.transactionCounter;
    //
    //     var tempPreviousTransactionNumberId = "previousTransactionNumber" + counter;
    //     var tempPreviousTransactionYourCoordinatorId = "previousTransactionCoordinator" + counter;
    //     var tempPreviousTransactionCounterpartAccountId = "previousTransactionCounterpartAccount" + counter;
    //     var tempPreviousTransactionCounterpartCoordinatorId = "previousTransactionCounterpartCoordinator" + counter;
    //     var tempPreviousTransactionAmountId = "previousTransactionAmount" + counter;
    //     var tempPreviousTransactionMaxFeeId = "previousTransactionMaxFee" + counter;
    //     var tempPreviousTransactionTypeId = "previousTransactionType" + counter;
    //     var tempPreviousTransactionStatusId = "previousTransactionState" + counter;
    //     var tempPreviousTransactionAddressId = "previousTransactionAddress" + counter;
    //
    //     var row = "<tr>\n" +
    //         "                    <td id='" + tempPreviousTransactionNumberId + "' class=\"disabled text-center\" contenteditable=\"false\" style='font-size: small'>" + (parseInt(counter) + 1) + "</td>\n" +
    //         '                    <td id="' + tempPreviousTransactionAddressId + '" style="display: none"  class="text-center">' + transaction + '</td>\n' +
    //         "                    <td id='" + tempPreviousTransactionYourCoordinatorId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + yourCoordinator + "</td>\n" +
    //         "                    <td id='" + tempPreviousTransactionCounterpartAccountId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + counterpart + "</td>\n" +
    //         "                    <td id='" + tempPreviousTransactionCounterpartCoordinatorId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + counterpartCoordinator + "</td>\n" +
    //         "                    <td id='" + tempPreviousTransactionTypeId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + type + "</td>\n" +
    //         "                    <td id='" + tempPreviousTransactionAmountId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + amount + "</td>\n" +
    //         "                    <td id='" + tempPreviousTransactionMaxFeeId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + maxFee + "</td>\n" +
    //         "                    <td id='" + tempPreviousTransactionStatusId + "' class=\"text-center\" style='font-size: small' contenteditable=\"false\">" + status + "</td>\n" +
    //         "                </tr>\n";
    //
    //     var table = document.getElementById("previousTransactionsTable");
    //     $(table).find('tbody').append(row);
    //
    //     App.transactionCounter++;
    // },
    //
    // removePreviousTransactionsRows: function () {
    //     App.transactionCounter = 0;
    //     var table = document.getElementById("previousTransactionsTable");
    //     $(table).find('tbody').html('');
    // },
    //
    // loadPreviousTransactions: function () {
    //
    //     web3.eth.getCoinbase(function (err, account) {
    //
    //         App.contracts.Netereum.deployed().then(function (NetereumInstance) {
    //
    //             NetereumInstance.numberOfCreatedTransactions().then(function (numberOfTransactions) {
    //
    //                 App.removePreviousTransactionsRows();
    //
    //                 for (var i = 0; i < numberOfTransactions; i++) {
    //
    //                     // alert("entered for loop");
    //                     NetereumInstance.createdTransactionsAddress(i).then(async function (transactionAddress) {
    //                         // alert(transactionAddress);
    //                         App.contracts.Transaction.at(transactionAddress).then(async function (instance) {
    //
    //                             var sender = await instance.senderAccount();
    //                             var receiver = await instance.receiverAccount();
    //                             var receiverCoordinator = await instance.receiverCoordinator();
    //                             var senderCoordinator = await instance.senderCoordinator();
    //                             var amount = await instance.transactionAmount();
    //                             var maxFee = await instance.maxFee();
    //                             var roleInTransaction;
    //                             var status;
    //
    //                             var statusCode = await NetereumInstance.transactionsStatus(transactionAddress);
    //                             statusCode = statusCode + "";
    //                             alert(statusCode);
    //
    //                             var status;
    //                             switch (statusCode) {
    //                                 case "0":
    //                                     status = "not created";
    //                                     break;
    //                                 case "1":
    //                                     status = "created";
    //                                     break;
    //                                 case "2":
    //                                     status = "pending";
    //                                     break;
    //                                 case "3":
    //                                     status = "done";
    //                                     break;
    //                                 case "4":
    //                                     status = "declined";
    //                                     break;
    //                             }
    //
    //
    //                             var counterpart;
    //                             var counterpartCoordinator;
    //                             var yourCoordinator;
    //                             var flag = false;
    //
    //                             if (receiver === account) {
    //
    //                                 flag = true;
    //                                 counterpart = sender;
    //                                 counterpartCoordinator = senderCoordinator;
    //                                 yourCoordinator = receiverCoordinator;
    //                                 roleInTransaction = receiver;
    //
    //                             } else if (sender === account) {
    //                                 flag = true;
    //                                 counterpart = receiver;
    //                                 counterpartCoordinator = receiverCoordinator;
    //                                 yourCoordinator = senderCoordinator;
    //                                 roleInTransaction = sender;
    //                             }
    //
    //                             if (flag) {
    //                                 App.addPreviousTransactionRow(transactionAddress, yourCoordinator, counterpart, counterpartCoordinator, roleInTransaction, amount, maxFee, status);
    //                             }
    //                         });
    //                     });
    //                 }
    //             });
    //         });
    //     });
    // },


//shared functions .....................................................................................................
    //payment message event

    watchPaymentMessageCreatedEvents: function () {
        App.contracts.Netereum.deployed().then(function (instance) {
            instance.paymentMessageCreated({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function (err, event) {

                // var selectedBox = document.getElementById("signAs");
                // var signAs = selectedBox.options[selectedBox.selectedIndex].value;

                switch (App.role) {
                    case "coordinator":
                        App.coordinatorLoadPaymentMessages();
                        break;

                    case "provider":
                        App.providerPreviousPaymentMessages();
                        break;

                    case "customer":
                        App.customerLoadPaymentMessages();
                        break;

                }
            })
        });
    },

    // agreement events ...........................................................................................................

    watchAgreementCreatedEvents: function () {
        App.contracts.Netereum.deployed().then(function (instance) {
            instance.agreementCreated({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function (err, event) {

                // alert("agreement created");
                // var selectedBox = document.getElementById("signAs");
                // var signAs = selectedBox.options[selectedBox.selectedIndex].value;
                // alert("signed as : " + signAs);
                // var signAs = "provider";
                //to do : load only for parties not all

                switch (App.role) {
                    case "coordinator":
                        App.coordinatorLoadNewAgreementsRequests();
                        break;

                    case "provider":
                        // alert("signed as provider");
                        App.loadAgreementsOffers();
                        // App.loadNewAgreements();
                        break;
                }
            });
        });
    },

    watchAgreementApprovedOrDeclinedEvents: function () {
        App.contracts.Netereum.deployed().then(function (instance) {
            instance.agreementApprovedOrDeclined({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function (err, event) {

                // var selectedBox = document.getElementById("signAs");
                // var signAs = selectedBox.options[selectedBox.selectedIndex].value;

                switch (App.role) {
                    case "coordinator":
                        App.coordinatorLoadNewAgreementsRequests();
                        App.coordinatorLoadprevious-agreements-requests();
                        break;

                    case "provider":
                        App.loadAgreementsOffers();
                        break;

                }
            })
        });
    },

    // transaction event ...............................................................................................

    watchTransactionCreatedEvents: function () {
        App.contracts.Netereum.deployed().then(function (instance) {
            instance.transactionCreated({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function (err, event) {

                // var selectedBox = document.getElementById("signAs");
                // var signAs = selectedBox.options[selectedBox.selectedIndex].value;
                //to do : load only for parties not all

                switch (App.role) {
                    case "coordinator":
                        App.coordinatorLoadnew-transactions-requests();
                        break;

                    case "customer":
                        App.loadNewTransactions();
                        break;
                }
            });
        });
    },

    watchTransactionApprovedOrDeclinedEvent: function () {

        App.contracts.Netereum.deployed().then(function (instance) {
            instance.transactionApprovedOrDeclined({}, {
                fromBlock: 0,
                toBlock: 'latest'
            }).watch(function (err, event) {

                // var selectedBox = document.getElementById("signAs");
                // var signAs = selectedBox.options[selectedBox.selectedIndex].value;

                switch (App.role) {
                    case "coordinator":
                        App.coordinatorLoadnew-transactions-requests();
                        App.coordinatorLoadprevious-transactions-requests();
                        break;

                    case "provider":
                        App.loadOfferedTransactions();
                        App.loadTransactions();
                        break;

                }
            })
        });
    }
};

$(function () {
    App.init();
});


