App = {

    web3Provider: null,
    contracts: {},
    account: '0x0',
    role: 'coordinator',
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

            App.contracts.Netereum = TruffleContract(Netereum);
            App.contracts.Netereum.setProvider(App.web3Provider);

            // App.watchAgreementCreatedEvents();
            // App.watchAgreementApprovedOrDeclinedEvents();
            // App.watchPaymentMessageCreatedEvents();
            // App.watchTransactionCreatedEvents();
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

        $.getJSON('MainGraph.json', function (MainGraph) {
            App.contracts.MainGraph = TruffleContract(MainGraph);
            App.contracts.MainGraph.setProvider(App.web3Provider);
        });

    },

    bindEvents: async function () {

        // var electionInstance;
        web3.eth.getCoinbase(function (err, account) {

            App.account = account;

            if (err === null) {

                if (account != null) {

                    $("#signed-as").text("signed as " + App.role);
                    $(".account-address").text(account);

                    App.displayPage();

                } else {
                    alert("please login to your Metamask account and then try again!")
                }

            } else {
                alert("we have an err, please connect to a network");
            }
        });
    },

    // my functions ....................................................................................................

    login: function () {
        App.role = $("#login-as").val();
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

    openTab: function (event, tabName) {

        if (tabName == 'profile') tabName = App.role + '-' + tabName;
        var i, tabContent;
        var className1 = App.role + "-tab-content";
        tabContent = document.getElementsByClassName(className1);
        for (i = 0; i < tabContent.length; i++) {
            tabContent[i].style.display = "none";
        }
        document.getElementById(tabName).style.display = "block";
    },

    removeTableTbody: function (tableId) {
        App.paymentMessageCounter = 0;
        App.agreementCounter = 0;
        App.transactionCounter = 0;
        $("#" + tableId).find('tbody').html('');
    },

    appendTableTbody: function (tableId, row) {
        $("#" + tableId).find('tbody').append(row);
    },

    takeAction1: function (btnId, btnNewText) {
        $("#" + btnId).prop('disabled', 'true').removeClass("btn-bg-blue").addClass("btn-dark").text(btnNewText).css('cursor', 'default');
    },

    takeAction2: function (clickedBtnId, notClickedBtnId, clickedBtnNewText) {
        $("#" + clickedBtnId).prop('disabled', 'true').removeClass("btn-bg-blue").addClass("btn-dark").attr("colspan", "2").text(clickedBtnNewText).css('cursor', 'default');
        $("#" + notClickedBtnId).css('display', 'none');
    },

//coordinators functions ...........................................................................................

    addNewAgreementRequestRow: function (agreement, dateTime, account, roleInAgreement, partnerAccount, partnerCoordinator, debtAmount, exchangeRate, view) {

        var counter = App.agreementCounter;

        var newAgreementRequestNumberId = "newAgreementRequestNumber" + counter;
        var newAgreementRequestProviderId = "newAgreementRequestProvider" + counter;
        var newAgreementRequestRoleInAgreementId = "newAgreementRequestRoleInAgreement" + counter;
        var newAgreementRequestPartnerId = "newAgreementRequestPartner" + counter;
        var newAgreementRequestPartnerCoordinatorId = "newAgreementRequestPartnerCoordinator" + counter;
        var newAgreementRequestDebtAmountId = "newAgreementRequestDebtAmount" + counter;
        var newAgreementRequestExchangeRateId = "newAgreementRequestExchangeRate" + counter;
        var newAgreementRequestViewId = "newAgreementRequestExchangeRate" + counter;
        var newAgreementRequestConfirmationStatusId = "newAgreementRequestConfirmationStatus" + counter;
        var newAgreementRequestApproveBtnId = "newAgreementRequestApproveBtn" + counter;
        var newAgreementRequestDeclineBtnId = "newAgreementRequestDeclineBtn" + counter;
        var newAgreementRequestAddressId = "newAgreementRequestAddress" + counter;

        var row = `<tr contenteditable="false">
                    <td id='${newAgreementRequestNumberId}' class="">${parseInt(counter) + 1}</td>
<!--                    <td id='${newAgreementRequestNumberId}' class="">${dateTime}</td>-->
                    <td id="${newAgreementRequestAddressId}"   class=" display-none">${agreement}</td>
                    <td id='${newAgreementRequestProviderId}' class="">${account}</td>
                    <td id='${newAgreementRequestRoleInAgreementId}' class="">${roleInAgreement}</td>
                    <td id='${newAgreementRequestPartnerId}' class="">${partnerAccount}</td>
                    <td id='${newAgreementRequestPartnerId}' class="">${partnerCoordinator}</td>
                    <td id='${newAgreementRequestDebtAmountId}' class="">${debtAmount}</td>
                    <td id='${newAgreementRequestExchangeRateId}' class="">${exchangeRate}</td>
                    <td id='${newAgreementRequestApproveBtnId}' onclick='App.coordinatorTakeActionOnNewAgreementRequest(${counter}, true)' class=' custom-btn btn-bg-blue btn-general'>approve</td>
                    <td id='${newAgreementRequestDeclineBtnId}' onclick='App.coordinatorTakeActionOnNewAgreementRequest(${counter}, false)' class=' custom-btn btn-bg-blue btn-general'>decline</td>
                </tr>`;

        App.appendTableTbody("new-agreements-requests-table", row);
        App.agreementCounter++;
    },

    coordinatorLoadNewAgreementsRequests: function () {

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                NetereumInstance.numberOfCreatedAgreements().then(function (numberOfAgreements) {

                    App.removeTableTbody("new-agreements-requests-table");

                    for (var i = 0; i < numberOfAgreements; i++) {

                        NetereumInstance.createdAgreementsAddress(i).then(async function (agreementAddress) {
                            App.contracts.Agreement.at(agreementAddress).then(async function (instance) {


                                var providerAccount;
                                var partner;
                                var partnerCoordinator;
                                var status = await NetereumInstance.agreementsStatus(agreementAddress);
                                var debtorCoordinator = await instance.debtorCoordinator();
                                var creditorCoordinator = await instance.creditorCoordinator();
                                var roleInAgreement;

                                var debtorCoordinatorPermissionStatus = await instance.debtorCoordinatorPermission();
                                var creditorCoordinatorPermissionStatus = await instance.creditorCoordinatorPermission();

                                var flag = false;

                                if (debtorCoordinator === account && status == 1 && debtorCoordinatorPermissionStatus == '0') {
                                    flag = true;
                                    roleInAgreement = 'debtor';
                                    providerAccount = await instance.debtor();
                                    partner = await instance.creditor();
                                    partnerCoordinator = await instance.creditorCoordinator();

                                } else if (creditorCoordinator === account && status == 1 && creditorCoordinatorPermissionStatus == '0') {
                                    flag = true;
                                    roleInAgreement = 'creditor';
                                    providerAccount = await instance.creditor();
                                    partner = await instance.debtor();
                                    partnerCoordinator = await instance.debtorCoordinator();
                                }

                                if (flag) {

                                    var dateTime = "2 minutes ago";
                                    var debtAmount = await instance.debtorCost();
                                    var view = "some views";
                                    var exchangeRate = await instance.exchangeRate();
                                    App.addNewAgreementRequestRow(agreementAddress, dateTime, providerAccount, roleInAgreement, partner, partnerCoordinator, debtAmount, exchangeRate, view);
                                }
                            });
                        });
                    }
                });
            });
        });
    },

    coordinatorTakeActionOnNewAgreementRequest: function (counter, isApproved) {

        var targetAgreementRequestApproveBtnId = "newAgreementRequestApproveBtn" + counter;
        var targetAgreementRequestDeclineBtnId = "newAgreementRequestDeclineBtn" + counter;
        var targetAgreementRequestAddressId = "newAgreementRequestAddress" + counter;

        var agreementAddress = document.getElementById(targetAgreementRequestAddressId).innerText + '';

        if (isApproved) {
            App.contracts.Agreement.at(agreementAddress).then(async function (agreementInstance) {
                await agreementInstance.approve();
                App.takeAction2(targetAgreementRequestApproveBtnId, targetAgreementRequestDeclineBtnId, 'approved');
            });
        } else {
            App.contracts.Agreement.at(agreementAddress).then(async function (agreementInstance) {
                await agreementInstance.decline();
                App.takeAction2(targetAgreementRequestDeclineBtnId, targetAgreementRequestApproveBtnId, 'declined');
            });
        }
    },

    //..................................................................................................................

    addRecentAgreementRequestRow: function (agreement, dateTime, account, roleInAgreement, partnerAccount, partnerCoordinator, debtAmount, exchangeRate, view, status) {
        //to add confirmation status
        var counter = App.agreementCounter;

        var recentAgreementRequestNumberId = "recentAgreementRequestNumber" + counter;
        var recentAgreementRequestProviderId = "recentAgreementRequestProvider" + counter;
        var recentAgreementRequestRoleInAgreementId = "recentAgreementRequestRoleInAgreement" + counter;
        var recentAgreementRequestPartnerId = "recentAgreementRequestPartner" + counter;
        var recentAgreementRequestPartnerCoordinatorId = "recentAgreementRequestPartnerCoordinator" + counter;
        var recentAgreementRequestDebtAmountId = "recentAgreementRequestDebtAmount" + counter;
        var recentAgreementRequestExchangeRateId = "recentAgreementRequestExchangeRate" + counter;
        var recentAgreementRequestViewId = "recentAgreementRequestExchangeRate" + counter;
        var recentAgreementRequestConfirmationStatusId = "recentAgreementRequestConfirmationStatus" + counter;
        var recentAgreementRequestAddressId = "recentAgreementRequestAddress" + counter;

        var row = "<tr contenteditable='false'>\n" +
            "                    <td id='" + recentAgreementRequestNumberId + "' class=\"disabled \">" + (parseInt(counter) + 1) + "</td>\n" +
            // "                    <td id='" + recentAgreementRequestNumberId + "' class=\"disabled \">" + dateTime + "</td>\n" +
            '                    <td id="' + recentAgreementRequestAddressId + '"   class=" display-none">' + agreement + '</td>\n' +
            "                    <td id='" + recentAgreementRequestProviderId + "' class=\"\">" + account + "</td>\n" +
            "                    <td id='" + recentAgreementRequestRoleInAgreementId + "' class=\"\">" + roleInAgreement + "</td>\n" +
            "                    <td id='" + recentAgreementRequestPartnerId + "' class=\"\">" + partnerAccount + "</td>\n" +
            "                    <td id='" + recentAgreementRequestPartnerCoordinatorId + "' class=\"\">" + partnerCoordinator + "</td>\n" +
            "                    <td id='" + recentAgreementRequestDebtAmountId + "' class=\"\">" + debtAmount + "</td>\n" +
            "                    <td id='" + recentAgreementRequestExchangeRateId + "' class=\"\">" + exchangeRate + "</td>\n" +
            // "                    <td id='" + recentAgreementRequestViewId + "'>" + view + "</td>\n" +
            "                    <td id='" + recentAgreementRequestConfirmationStatusId + "'   class=\"\">" + status + " </td>\n" +
            "      </tr>\n";

        App.appendTableTbody("recent-agreements-requests-table", row);
        App.agreementCounter++;
    },

    coordinatorLoadRecentAgreementsRequests: function () {

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                    NetereumInstance.numberOfCreatedAgreements().then(function (numberOfAgreements) {

                        App.removeTableTbody("recent-agreements-requests-table");

                        for (var i = 0; i < numberOfAgreements; i++) {

                            NetereumInstance.createdAgreementsAddress(i).then(async function (agreementAddress) {

                                    App.contracts.Agreement.at(agreementAddress).then(async function (instance) {

                                        var providerAccount;
                                        var partner;
                                        var partnerCoordinator;

                                        var debtorCoordinator = await instance.debtorCoordinator();
                                        var creditorCoordinator = await instance.creditorCoordinator();
                                        var roleInAgreement;


                                        // var debtorPermissionStatus = await instance.debtorPermission();
                                        // var creditorPermissionStatus = await instance.creditorPermission();
                                        var debtorCoordinatorPermissionStatus = await instance.debtorCoordinatorPermission();
                                        var creditorCoordinatorPermissionStatus = await instance.creditorCoordinatorPermission();
                                        var statusCode = await NetereumInstance.agreementsStatus(agreementAddress);
                                        statusCode = statusCode + "";

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

                                        var flag = false;

                                        // if (debtorCoordinator === account && !debtorCoordinatorPermissionStatus) {
                                        if (debtorCoordinator === account) {
                                            flag = true;
                                            roleInAgreement = 'debtor';
                                            providerAccount = await instance.debtor();
                                            partner = await instance.creditor();
                                            partnerCoordinator = await instance.creditorCoordinator();

                                        } else
                                        // if (creditorCoordinator === account && !creditorCoordinatorPermissionStatus) {
                                        if (creditorCoordinator === account) {

                                            flag = true;
                                            roleInAgreement = 'creditor';
                                            providerAccount = await instance.creditor();
                                            partner = await instance.debtor();
                                            partnerCoordinator = await instance.debtorCoordinator();
                                        }


                                        if (flag) {

                                            var debtAmount = await instance.debtorCost();
                                            var view = "some views";
                                            var dateTime = "2 minutes ago";
                                            var exchangeRate = await instance.exchangeRate();

                                            App.addRecentAgreementRequestRow(agreementAddress, dateTime, providerAccount, roleInAgreement, partner, partnerCoordinator, debtAmount, exchangeRate, view, status);
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

    //..................................................................................................................

    addNewTransactionRequestRow: function (transaction, dateTime, account, roleInTransaction, counterpart, counterpartCoordinator, senderAmount, receiverAmount, view) {
        var counter = App.transactionCounter;

        var newTransactionRequestNumberId = "newTransactionRequestNumber" + counter;
        var newTransactionRequestDateTimeId = "newTransactionRequestNumber" + counter;
        var newTransactionRequestAccountId = "newTransactionRequestAccount" + counter;
        var newTransactionRequestRoleInTransactionId = "newTransactionRequestRoleInTransaction" + counter;
        var newTransactionRequestCounterpartId = "newTransactionRequestCounterpart" + counter;
        var newTransactionRequestCounterpartCoordinatorId = "newTransactionRequestCounterpartCoordinator" + counter;
        var newTransactionRequestAmountId = "newTransactionRequestAmount" + counter;
        var newTransactionRequestReceiverAmountId = "newTransactionRequestReceiverAmount" + counter;
        var newTransactionRequestViewId = "newTransactionRequestExchangeRate" + counter;
        var newTransactionRequestConfirmationStatusId = "newTransactionRequestConfirmationStatus" + counter;
        var newTransactionRequestApproveBtnId = "newTransactionRequestApproveBtn" + counter;
        var newTransactionRequestDeclineBtnId = "newTransactionRequestDeclineBtn" + counter;
        var newTransactionRequestAddressId = "newTransactionRequestAddress" + counter;

        var row = `<tr>
                    <td id='${newTransactionRequestNumberId}' class="disabled " contenteditable="false" >${parseInt(counter) + 1}</td>
<!--                    <td id='${newTransactionRequestDateTimeId}' class="disabled " contenteditable="false" >${dateTime}</td>-->
                    <td id="${newTransactionRequestAddressId}"   class="disabled display-none" contenteditable="false">${transaction}</td>
                    <td id='${newTransactionRequestAccountId}' class=""  contenteditable="false">${account}</td>
                    <td id='${newTransactionRequestRoleInTransactionId}' class=" disabled"  contenteditable="false">${roleInTransaction}</td>
                    <td id='${newTransactionRequestCounterpartId}' class=" disabled"  contenteditable="false">${counterpart}</td>
                    <td id='${newTransactionRequestCounterpartCoordinatorId}' class=" disabled"  contenteditable="false">${counterpartCoordinator}</td>
                    <td id='${newTransactionRequestAmountId}' class=" disabled"  contenteditable="false">${senderAmount}</td>
                    <td id='${newTransactionRequestReceiverAmountId}' class=" disabled"  contenteditable="false">${receiverAmount}</td>
<!--                    <td id='${newTransactionRequestViewId}' class=" disabled" >${view}</td>-->
                    <td id='${newTransactionRequestApproveBtnId}' class=' custom-btn btn-bg-blue btn-general' onclick='App.coordinatorTakeActionOnNewTransactionRequest(${counter}, true)'>approve</td>
                    <td id='${newTransactionRequestDeclineBtnId}' class=' custom-btn btn-bg-blue btn-general' onclick='App.coordinatorTakeActionOnNewTransactionRequest(${counter}, false)'>decline</td>
                </tr>`;

        App.appendTableTbody("new-transactions-requests-table", row);
        App.transactionCounter++;

    },

    coordinatorLoadNewTransactionsRequests: function () {

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                NetereumInstance.numberOfCreatedTransactions().then(function (numberOfTransactions) {

                    App.removeTableTbody("new-transactions-requests-table");

                    for (var i = 0; i < numberOfTransactions; i++) {

                        NetereumInstance.createdTransactionsAddress(i).then(async function (transactionAddress) {

                            App.contracts.Transaction.at(transactionAddress).then(async function (instance) {

                                var customer;
                                var counterpart;
                                var counterpartCoordinator;

                                var status = await NetereumInstance.transactionsStatus(transactionAddress);

                                var sender = await instance.buyer();
                                var receiver = await instance.seller();
                                var senderCoordinator = await instance.buyerCoordinator();
                                var receiverCoordinator = await instance.sellerCoordinator();
                                var roleInTransaction;
                                var senderCoordinatorPermission = await instance.buyerCoordinatorPermission();
                                var receiverCoordinatorPermission = await instance.sellerCoordinatorPermission();

                                var flag = false;

                                if (senderCoordinator === account && status == 1 && senderCoordinatorPermission == 0) {

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

                                    var senderAmount = await instance.buyerCost();
                                    var view = "some views";
                                    var dateTime = "2 minutes ago";
                                    var receiverAmount = await instance.sellerCost();

                                    App.addNewTransactionRequestRow(transactionAddress, dateTime, customer, roleInTransaction, counterpart, counterpartCoordinator, senderAmount, receiverAmount, view);
                                }
                            });
                        });
                    }
                });
            });
        });
    },

    coordinatorTakeActionOnNewTransactionRequest: function (counter, isApproved) {

        var targetTransactionRequestApproveBtnId = "newTransactionRequestApproveBtn" + counter;
        var targetTransactionRequestDeclineBtnId = "newTransactionRequestDeclineBtn" + counter;
        var targetTransactionRequestAddressId = "newTransactionRequestAddress" + counter;

        var transactionAddress = document.getElementById(targetTransactionRequestAddressId).innerText + '';

        if (isApproved) {
            App.contracts.Transaction.at(transactionAddress).then(async function (transactionInstance) {
                await transactionInstance.approve();
                App.takeAction2(targetTransactionRequestApproveBtnId, targetTransactionRequestDeclineBtnId, 'approved');
            });
        } else {
            App.contracts.Transaction.at(transactionAddress).then(async function (transactionInstance) {
                await transactionInstance.decline();
                App.takeAction2(targetTransactionRequestDeclineBtnId, targetTransactionRequestApproveBtnId, 'declined');
            });
        }
    },

    //..................................................................................................................

    addRecentTransactionRequestRow: function (transaction, dateTime, account, roleInTransaction, counterpart, counterpartCoordinator, amount, receiverAmount, view, status) {
        var counter = App.transactionCounter;

        var recentTransactionRequestNumberId = "recentTransactionRequestNumber" + counter;
        var recentTransactionRequestAccountId = "recentTransactionRequestAccount" + counter;
        var recentTransactionRequestRoleInTransactionId = "recentTransactionRequestRoleInTransaction" + counter;
        var recentTransactionRequestCounterpartId = "recentTransactionRequestCounterpart" + counter;
        var recentTransactionRequestCounterpartCoordinatorId = "recentTransactionRequestCounterpartCoordinator" + counter;
        var recentTransactionRequestAmountId = "recentTransactionRequestAmount" + counter;
        var recentTransactionRequestReceiverAmountId = "recentTransactionRequestReceiverAmount" + counter;
        var recentTransactionRequestViewId = "recentTransactionRequestExchangeRate" + counter;
        var recentTransactionRequestConfirmationStatusId = "recentTransactionRequestConfirmationStatus" + counter;

        var recentTransactionRequestApproveBtnId = "recentTransactionRequestApproveBtn" + counter;
        var recentTransactionRequestDeclineBtnId = "recentTransactionRequestDeclineBtn" + counter;
        var recentTransactionRequestAddressId = "recentTransactionRequestAddress" + counter;

        var row = `<tr>
                    <td id='${recentTransactionRequestNumberId}' class="disabled " contenteditable="false">${parseInt(counter) + 1}</td>
<!--                    <td id='${recentTransactionRequestNumberId}' class="disabled " contenteditable="false">${dateTime}</td>-->
                    <td id="${recentTransactionRequestAddressId}"   class=" disabled" contenteditable="false">${transaction}</td>
                    <td id='${recentTransactionRequestAccountId}' class=""  contenteditable="false">${account}</td>
                    <td id='${recentTransactionRequestRoleInTransactionId}' class=" disabled" contenteditable="false">${roleInTransaction}</td>
                    <td id='${recentTransactionRequestCounterpartId}' class=" disabled"  contenteditable="false">${counterpart}</td>
                    <td id='${recentTransactionRequestCounterpartCoordinatorId}' class=" disabled"  contenteditable="false">${counterpartCoordinator}</td>
                    <td id='${recentTransactionRequestAmountId}' class=" disabled" contenteditable="false">${amount}</td>
                    <td id='${recentTransactionRequestReceiverAmountId}' class=" disabled" contenteditable="false">${receiverAmount}</td>
<!--                    <td id='${recentTransactionRequestViewId}' class=" disabled"  contenteditable="false">${view}</td>-->
                    <td id='${recentTransactionRequestConfirmationStatusId}'   class=" row no-gutters disabled" contenteditable = false>${status} </td>
      </tr>
`;

        App.appendTableTbody("recent-transactions-requests-table", row);
        App.transactionCounter++;

    },

    coordinatorLoadRecentTransactionsRequests: function () {


        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                    NetereumInstance.numberOfCreatedTransactions().then(function (numberOfTransactions) {

                        App.removeTableTbody("recent-transactions-requests-table");

                        for (var i = 0; i < numberOfTransactions; i++) {

                            NetereumInstance.createdTransactionsAddress(i).then(async function (transactionAddress) {

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

                                        var flag = false;

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
                                            var receiverAmount = await instance.receiverAmount();

                                            App.addRecentTransactionRequestRow(transactionAddress, dateTime, customer, roleInTransaction, counterpart, counterpartCoordinator, amount, receiverAmount, view, status);
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

//providers functions ..................................................................................................

    addEmptyNewAgreementRow: function () {
        App.addNewAgreementRow("", "", "", "", "", "", "", false, false, false);
    },

    addNewAgreementRow: function (agreement, coordinator, partnerAccount, partnerCoordinator, debtAmount, exchangeRate, expireTime, creditorPermissionStatus, debtorCoordinatorPermissionStatus, creditorCoordinatorPermissionStatus) {

        var counter = App.agreementCounter;

        var newAgreementNumberId = "newAgreementNumber" + counter;
        var newAgreementCoordinatorId = "newAgreementCoordinator" + counter;
        var newAgreementPartnerAccountId = "newAgreementPartnerAccount" + counter;
        var newAgreementPartnerCoordinatorId = "newAgreementPartnerCoordinator" + counter;
        var newAgreementDebtAmountId = "newAgreementDebtAmount" + counter;
        var newAgreementExchangeRateId = "newAgreementExchangeRate" + counter;
        var newAgreementConfirmationStatusId = "newAgreementConfirmationStatus" + counter;
        var newAgreementConfirmationStatusCheck1Id = "newAgreementConfirmationStatusCheck1" + counter;
        var newAgreementConfirmationStatusCheck2Id = "newAgreementConfirmationStatusCheck2" + counter;
        var newAgreementConfirmationStatusCheck3Id = "newAgreementConfirmationStatusCheck3" + counter;
        var newAgreementConfirmationStatusCheck4Id = "newAgreementConfirmationStatusCheck4" + counter;
        var newAgreementSubmitBtnId = "newAgreementSubmitBtn" + counter;
        var newAgreementAddressId = "newAgreementAddress" + counter;

        var row = `<tr class='' contenteditable>
                    <td id='${newAgreementNumberId}' class="disabled " contenteditable="false">${parseInt(counter) + 1}</td>
                    <td id="${newAgreementAddressId}"   class=" display-none">${agreement}</td>
                    <td id='${newAgreementCoordinatorId}' class="">${coordinator}</td>
                    <td id='${newAgreementPartnerAccountId}' class="">${partnerAccount}</td>
                    <td id='${newAgreementPartnerCoordinatorId}' class="">${partnerCoordinator}</td>
                    <td id='${newAgreementDebtAmountId}' class="">${debtAmount}</td>
                    <td id='${newAgreementExchangeRateId}' class="">${exchangeRate}</td>
                    <td id='${newAgreementSubmitBtnId}' class=' custom-btn btn-bg-blue btn-general' onclick='App.startNewAgreement(${counter})'>submit</td>
                    </tr>`;

        App.appendTableTbody("new-agreement-table", row);
        App.agreementCounter++;
    },

    loadNewAgreements: function () {

        App.removeTableTbody("new-agreement-table");
    },

    startNewAgreement: async function (counter) {//this is provider function

        var targetNewAgreementCoordinatorId = "newAgreementCoordinator" + counter;
        var targetNewAgreementPartnerAccountId = "newAgreementPartnerAccount" + counter;
        var targetNewAgreementPartnerCoordinatorId = "newAgreementPartnerCoordinator" + counter;
        var targetNewAgreementDebtAmountId = "newAgreementDebtAmount" + counter;
        var targetNewAgreementExchangeRateId = "newAgreementExchangeRate" + counter;

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
        var exchangeRate = document.getElementById(targetNewAgreementExchangeRateId).innerText;


        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(async function (NetereumInstance) {

                await NetereumInstance.createAgreement(account, partnerAccountValue, coordinatorValue, partnerCoordinatorValue, debtAmountValue, exchangeRate, 10, 0);

                App.takeAction1(targetNewAgreementSubmitBtnId, 'submitted');

            });
        });
    },

    //..................................................................................................................

    addAgreementRow: function (agreementAddress, yourCoordinator, roleInAgreement, partner, partnerCoordinator, debtAmount, exchangeRate, creditorPermissionStatus, debtorCoordinatorPermissionStatus, creditorCoordinatorPermissionStatus, statusCode) {

        var status;

        if (statusCode == "0") status = "not created";
        if (statusCode == "1") status = "offered";
        if (statusCode == "2") status = "pending";
        if (statusCode == "3") status = "expired";
        if (statusCode == "4") status = "declined";

        var counter = App.agreementCounter;

        var agreementNumberId = "agreementNumber" + counter;
        var agreementCoordinatorId = "agreementCoordinator" + counter;
        var agreementPartnerId = "agreementPartnerAccount" + counter;
        var agreementRoleInAgreementId = "agreementRoleInAgreement" + counter;
        var agreementPartnerCoordinatorId = "agreementPartnerCoordinator" + counter;
        var agreementDebtAmountId = "agreementDebtAmount" + counter;
        var agreementExchangeRateId = "agreementExchangeRate" + counter;
        var agreementStatusId = "agreementStatus" + counter;
        var agreementConfirmationStatusId = "agreementConfirmationStatus" + counter;
        var agreementConfirmationStatusCheck1Id = "agreementConfirmationStatusCheck1" + counter;
        var agreementConfirmationStatusCheck2Id = "agreementConfirmationStatusCheck2" + counter;
        var agreementConfirmationStatusCheck3Id = "agreementConfirmationStatusCheck3" + counter;
        var agreementConfirmationStatusCheck4Id = "agreementConfirmationStatusCheck4" + counter;
        var agreementSubmitBtnId = "agreementSubmitBtn" + counter;
        var agreementAddressId = "agreementAddress" + counter;

        var row = "<tr>\n" +
            "                    <td id='" + agreementNumberId + "' class=\"disabled \" contenteditable=\"false\" >" + (parseInt(counter) + 1) + "</td>\n" +
            '                    <td id="' + agreementAddressId + '"   class=" display-none">' + agreementAddress + '</td>\n' +
            "                    <td id='" + agreementCoordinatorId + "' class=\"\" >" + yourCoordinator + "</td>\n" +
            "                    <td id='" + agreementRoleInAgreementId + "' class=\"\" >" + roleInAgreement + "</td>\n" +
            "                    <td id='" + agreementPartnerId + "' class=\"\" >" + partner + "</td>\n" +
            "                    <td id='" + agreementPartnerCoordinatorId + "' class=\"\" >" + partnerCoordinator + "</td>\n" +
            "                    <td id='" + agreementDebtAmountId + "' class=\"\" >" + debtAmount + "</td>\n" +
            "                    <td id='" + agreementExchangeRateId + "' class=\"\" >" + exchangeRate + "</td>\n" +
            "                    <td id='" + agreementConfirmationStatusId + "'   class=\"\" contenteditable = false>\n" +
            "\n" +
            // "                            <div class=\"col-1\"><input id='" + agreementConfirmationStatusCheck1Id + "' type=\"checkbox\" class=\"form-check-input\" style=\"margin: auto; width: 20px; height: 20px; display: none\">\n" +
            // "                            </div>\n" +
            "<form class='form row no-gutters'>" +
            "                               <div class='col-4'><input id='" + agreementConfirmationStatusCheck2Id + "' type=\"checkbox\" class=\"form-check-input \" style=\"\" disabled></div>\n" +
            "                               <div class='col-4'><input id='" + agreementConfirmationStatusCheck3Id + "' type=\"checkbox\" class=\"form-check-input \" style=\"\" disabled></div>\n" +
            "                               <div class='col-4'><input id='" + agreementConfirmationStatusCheck4Id + "' type=\"checkbox\" class=\"form-check-input \" style=\"\" disabled></div>\n" +
            "</form>" +

            "                    </td>\n" +
            "                    <td id='" + agreementStatusId + "' class=\"\" >" + status + "</td>\n" +
            "</tr>\n";

        App.appendTableTbody("agreements-list-table", row);

        // document.getElementById(agreementConfirmationStatusCheck1Id).checked = debtorPermissionStatus;
        if (creditorPermissionStatus == "1") document.getElementById(agreementConfirmationStatusCheck2Id).checked = true;
        if (debtorCoordinatorPermissionStatus == "1") document.getElementById(agreementConfirmationStatusCheck3Id).checked = true;
        if (creditorCoordinatorPermissionStatus == "1") document.getElementById(agreementConfirmationStatusCheck4Id).checked = true;

        App.agreementCounter++;
    },

    loadAgreementsList: function () {

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(function (NetereumInstance) {
                //
                NetereumInstance.numberOfCreatedAgreements().then(function (numberOfAgreements) {
                        //
                        App.removeTableTbody("agreements-list-table");

                        for (var i = 0; i < numberOfAgreements; i++) {

                            NetereumInstance.createdAgreementsAddress(i).then(async function (agreementAddress) {

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
                                        var exchangeRate = await instance.exchangeRate();
                                        var expireTime = 100;

                                        var creditorPermissionStatus = await instance.creditorPermission();
                                        var debtorCoordinatorPermissionStatus = await instance.debtorCoordinatorPermission();
                                        var creditorCoordinatorPermissionStatus = await instance.creditorCoordinatorPermission();

                                        var counterPermission = await instance.counterPermission();

                                        App.addAgreementRow(agreementAddress, yourCoordinator, roleInAgreement, partner, partnerCoordinator, debtAmount, exchangeRate, creditorPermissionStatus, debtorCoordinatorPermissionStatus, creditorCoordinatorPermissionStatus, statusCode);

                                    }
                                });
                            });
                        }
                    }
                );
            });
        });
    },

    //..................................................................................................................

    addAgreementOfferRow: function (agreement, yourCoordinator, debtor, debtorCoordinator, debtAmount, exchangeRate, details) {

        var counter = App.agreementCounter;

        var agreementOfferNumberId = "agreementOfferNumber" + counter;
        var agreementOfferCoordinatorId = "agreementOfferCoordinator" + counter;
        var agreementOfferPartnerAccountId = "agreementOfferPartnerAccount" + counter;
        var agreementOfferPartnerCoordinatorId = "agreementOfferPartnerCoordinator" + counter;
        var agreementOfferDebtAmountId = "agreementOfferDebtAmount" + counter;
        var agreementOfferExchangeRateId = "agreementOfferExchangeRate" + counter;
        var agreementOfferDetailsId = "agreementOfferDetails" + counter;
        var agreementOfferApproveBtnId = "agreementOfferApproveBtn" + counter;
        var agreementOfferDeclineBtnId = "agreementOfferDeclineBtn" + counter;
        var agreementOfferAddressId = "agreementOfferAddress" + counter;

        var row = `<tr>
                    <td id='${agreementOfferNumberId}' class=" " >${parseInt(counter) + 1}</td>
                    <td id="${agreementOfferAddressId}"   class=" display-none">${agreement}</td>
                    <td id='${agreementOfferCoordinatorId}' class="" >${yourCoordinator}</td>
                    <td id='${agreementOfferPartnerAccountId}' class="" >${debtor}</td>
                    <td id='${agreementOfferPartnerCoordinatorId}' class="" >${debtorCoordinator}</td>
                    <td id='${agreementOfferDebtAmountId}' class="" >${debtAmount}</td>
                    <td id='${agreementOfferExchangeRateId}' class="" >${exchangeRate}</td>
                    <td id='${agreementOfferApproveBtnId}' onclick='App.takeActionOnAgreementOffer(${counter}, true)' class=' custom-btn btn-bg-blue btn-general'>approve</td>
                    <td id='${agreementOfferDeclineBtnId}' onclick='App.takeActionOnAgreementOffer(${counter}, false)' class=' custom-btn btn-bg-blue btn-general'>decline</td>
                </tr>`;

        App.appendTableTbody("agreements-offers-table", row);
        App.agreementCounter++;
    },

    takeActionOnAgreementOffer: function (counter, isApproved) {

        var targetAgreementOfferApproveBtnId = "agreementOfferApproveBtn" + counter;
        var targetAgreementOfferDeclineBtnId = "agreementOfferDeclineBtn" + counter;
        var targetAgreementOfferAddressId = "agreementOfferAddress" + counter;

        var agreementAddress = document.getElementById(targetAgreementOfferAddressId).innerText + '';

        if (isApproved) {
            App.contracts.Agreement.at(agreementAddress).then(async function (agreementInstance) {
                await agreementInstance.approve();
                App.takeAction2(targetAgreementOfferApproveBtnId, targetAgreementOfferDeclineBtnId, 'approved');
            });
        } else {
            App.contracts.Agreement.at(agreementAddress).then(async function (agreementInstance) {
                await agreementInstance.decline();
                App.takeAction2(targetAgreementOfferDeclineBtnId, targetAgreementOfferApproveBtnId, 'declined');
            });
        }
    },

    loadAgreementsOffers: function () {

        web3.eth.getCoinbase(function (err, account) {

            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                NetereumInstance.numberOfCreatedAgreements().then(function (numberOfAgreements) {

                    App.removeTableTbody("agreements-offers-table");

                    for (var i = 0; i < numberOfAgreements; i++) {

                        NetereumInstance.createdAgreementsAddress(i).then(async function (agreementAddress) {
                            App.contracts.Agreement.at(agreementAddress).then(async function (instance) {
                                var status = await NetereumInstance.agreementsStatus(agreementAddress);
                                var creditor = await instance.creditor();
                                var creditorPermissionStatus = await instance.creditorPermission();

                                if (creditor === account && status == 1 && creditorPermissionStatus == '0') {

                                    var debtorAccount = await instance.debtor();
                                    var debtorCoordinator = await instance.debtorCoordinator();
                                    var creditorCoordinator = await instance.creditorCoordinator();
                                    var debtAmount = await instance.debtorCost();
                                    var exchangeRate = await instance.exchangeRate();
                                    var details = "some details";

                                    var debtorCoordinatorPermissionStatus = await instance.debtorCoordinatorPermission();
                                    var creditorCoordinatorPermissionStatus = await instance.creditorCoordinatorPermission();


                                    App.addAgreementOfferRow(agreementAddress, creditorCoordinator, debtorAccount, debtorCoordinator, debtAmount, exchangeRate, details);

                                }
                            });
                        });
                    }
                });
            });
        });
    },


//customer functions ...............................................................................................

    addEmptyNewTransactionRow: function () {
        App.addNewTransactionRow("", "", "", "", "", "", false, false, false);
    },

    addNewTransactionRow: function (transaction, coordinator, destination, destinationCoordinator, senderAmount, receiverAmount, coordinatorPermissionStatus, destinationPermissionStatus, destinationCoordinatorPermissionStatus) {

        var counter = App.transactionCounter;

        var newTransactionNumberId = "newTransactionNumber" + counter;
        var newTransactionCoordinatorId = "newTransactionCoordinator" + counter;
        var newTransactionDestinationId = "newTransactionDestination" + counter;
        var newTransactionDestinationCoordinatorId = "newTransactionDestinationCoordinator" + counter;
        var newTransactionSenderAmountId = "newTransactionSenderAmount" + counter;
        var newTransactionReceiverAmountId = "newTransactionReceiverAmount" + counter;
        var newTransactionConfirmationStatusId = "newTransactionConfirmationStatus" + counter;
        var newTransactionSubmitBtnId = "newTransactionSubmitBtn" + counter;
        var newTransactionAddressId = "newTransactionAddress" + counter;

        var row = `<tr contenteditable>
                    <td id='${newTransactionNumberId}' class="" contenteditable="false">${parseInt(counter) + 1}</td>
                    <td id="${newTransactionAddressId}"  class="display-none">${transaction}</td>
                    <td id='${newTransactionCoordinatorId}' class="" >${coordinator}</td>
                    <td id='${newTransactionDestinationId}' class="" >${destination}</td>
                    <td id='${newTransactionDestinationCoordinatorId}' class="" >${destinationCoordinator}</td>
                    <td id='${newTransactionSenderAmountId}' class="" >${senderAmount}</td>
                    <td id='${newTransactionReceiverAmountId}' class="" >${receiverAmount}</td>
                    <td id='${newTransactionSubmitBtnId}' onclick='App.startNewTransaction(${counter})' class=' custom-btn btn-bg-blue btn-general' contenteditable="false">submit</td>
                </tr>`;


        App.appendTableTbody("new-transaction-table", row);
        App.transactionCounter++;
    },

    loadNewTransactions: function () {
        App.removeTableTbody("new-transaction-table");
    },

    startNewTransaction: function (counter) {

        var targetNewTransactionCoordinatorId = "newTransactionCoordinator" + counter;
        var targetNewTransactionDestinationId = "newTransactionDestination" + counter;
        var targetNewTransactionDestinationCoordinatorId = "newTransactionDestinationCoordinator" + counter;
        var targetNewTransactionSenderAmountId = "newTransactionSenderAmount" + counter;
        var targetNewTransactionReceiverAmountId = "newTransactionReceiverAmount" + counter;
        var targetNewAgreementSubmitBtnId = "newTransactionSubmitBtn" + counter;

        var coordinatorValue = document.getElementById(targetNewTransactionCoordinatorId).innerText + '';
        var destinationValue = document.getElementById(targetNewTransactionDestinationId).innerText + '';
        var destinationCoordinatorValue = document.getElementById(targetNewTransactionDestinationCoordinatorId).innerText + '';
        var senderAmountValue = document.getElementById(targetNewTransactionSenderAmountId).innerText + '';
        var receiverAmountValue = document.getElementById(targetNewTransactionReceiverAmountId).innerText + '';

        web3.eth.getCoinbase(function (err, account) {
            App.contracts.Netereum.deployed().then(async function (NetereumInstance) {
                await NetereumInstance.createTransaction(account, destinationValue, coordinatorValue, destinationCoordinatorValue, senderAmountValue, receiverAmountValue);
                App.takeAction1(targetNewAgreementSubmitBtnId, 'submitted');

            });
        });
    },

    //..................................................................................................................

    addOfferedTransactionRow: function (transaction, yourCoordinator, sender, senderCoordinator, senderAmount, receiverAmount, yourPermissionStatus, yourCoordinatorPermissionStatus, senderCoordinatorPermissionStatus, statusCode) {

        var counter = App.transactionCounter;

        var transactionOfferNumberId = "transactionOfferNumber" + counter;
        var transactionOfferCoordinatorId = "transactionOfferCoordinator" + counter;
        var transactionOfferSenderAccountId = "transactionOfferSenderAccount" + counter;
        var transactionOfferSenderCoordinatorId = "transactionOfferSenderCoordinator" + counter;
        var transactionOfferSenderAmountId = "transactionOffer" + counter;
        var transactionOfferReceiverAmountId = "transactionOfferReceiverAmount" + counter;
        var transactionOfferApproveBtnId = "transactionOfferApproveBtn" + counter;
        var transactionOfferDeclineBtnId = "transactionOfferDeclineBtn" + counter;
        var transactionOfferAddressId = "transactionOfferAddress" + counter;

        var row = `<tr contenteditable="false">
                    <td id='${transactionOfferNumberId}' class="disabled ">${parseInt(counter) + 1}</td>
                    <td id="${transactionOfferAddressId}" class="display-none">${transaction}</td>
                    <td id='${transactionOfferCoordinatorId}' class="">${yourCoordinator}</td>
                    <td id='${transactionOfferSenderAccountId}' class="">${sender}</td>
                    <td id='${transactionOfferSenderCoordinatorId}' class="">${senderCoordinator}</td>
                    <td id='${transactionOfferSenderAmountId}' class="">${senderAmount}</td>
                    <td id='${transactionOfferReceiverAmountId}' class="">${receiverAmount}</td>
                    <td id='${transactionOfferApproveBtnId}' onclick='App.takeActionOnTransactionOffer(${counter}, true)' class=' custom-btn btn-bg-blue btn-general'>approve</td>
                    <td id='${transactionOfferDeclineBtnId}' onclick='App.takeActionOnTransactionOffer(${counter}, false)' class=' custom-btn btn-bg-blue btn-general'>decline</td>
                </tr>`;

        App.appendTableTbody("offered-transactions-table", row);
        App.transactionCounter++;
    },

    loadOfferedTransactions: function () {
        web3.eth.getCoinbase(function (err, account) {

            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                NetereumInstance.numberOfCreatedTransactions().then(function (numberOfTransactions) {

                    App.removeTableTbody("offered-transactions-table");

                    for (var i = 0; i < numberOfTransactions; i++) {

                        NetereumInstance.createdTransactionsAddress(i).then(async function (transactionAddress) {
                            App.contracts.Transaction.at(transactionAddress).then(async function (instance) {

                                var receiver = await instance.seller();
                                var receiverPermissionStatus = await instance.sellerPermission();

                                if (receiver === account && receiverPermissionStatus == '0') {

                                    var sender = await instance.buyer();
                                    var senderCoordinator = await instance.buyerCoordinator();
                                    var receiverCoordinator = await instance.sellerCoordinator();
                                    var senderAmount = await instance.buyerCost();
                                    var receiverAmount = await instance.sellerCost();
                                    // var details = "some details";
                                    var senderCoordinatorPermissionStatus = await instance.buyerCoordinatorPermission();
                                    var receiverCoordinatorPermissionStatus = await instance.sellerCoordinatorPermission();

                                    App.addOfferedTransactionRow(transactionAddress, receiverCoordinator, sender, senderCoordinator, senderAmount, receiverAmount, receiverPermissionStatus, receiverCoordinatorPermissionStatus, senderCoordinatorPermissionStatus);
                                }
                            });
                        });
                    }
                });
            });
        });
    },

    takeActionOnTransactionOffer: function (counter, isApproved) {

        var targetTransactionOfferApproveBtnId = "transactionOfferApproveBtn" + counter;
        var targetTransactionOfferDeclineBtnId = "transactionOfferDeclineBtn" + counter;
        var targetTransactionOfferAddressId = "transactionOfferAddress" + counter;

        var transactionAddress = document.getElementById(targetTransactionOfferAddressId).innerText + '';

        if (isApproved) {
            App.contracts.Transaction.at(transactionAddress).then(async function (transactionInstance) {
                await transactionInstance.approve();
                App.takeAction2(targetTransactionOfferApproveBtnId, targetTransactionOfferDeclineBtnId, 'approved');
            });
        } else {
            App.contracts.Transaction.at(transactionAddress).then(async function (transactionInstance) {
                await transactionInstance.decline();
                App.takeAction2(targetTransactionOfferDeclineBtnId, targetTransactionOfferApproveBtnId, 'declined');
            });
        }
    },


    //..................................................................................................................

    addTransactionRow: function (transaction, yourCoordinator, counterpart, counterpartCoordinator, type, senderAmount, receiverAmount, receiverPermission, senderCoordinatorPermission, receiverCoordinatorPermission, statusCode) {

        var status;
        if (statusCode == '0') status = "not created";
        if (statusCode == '1') status = "offered";
        if (statusCode == '2') status = "pending";
        if (statusCode == '3') status = "added";
        if (statusCode == '4') status = "declined";

        var counter = App.transactionCounter;

        var transactionNumberId = "transactionNumber" + counter;
        var transactionYourCoordinatorId = "transactionCoordinator" + counter;
        var transactionCounterpartAccountId = "transactionCounterpartAccount" + counter;
        var transactionCounterpartCoordinatorId = "transactionCounterpartCoordinator" + counter;
        var transactionSenderAmountId = "transactionSenderAmount" + counter;
        var transactionReceiverAmountId = "transactionReceiverAmount" + counter;
        var transactionTypeId = "transactionType" + counter;
        var transactionStatusId = "transactionState" + counter;
        var transactionAddressId = "transactionAddress" + counter;
        var transactionConfirmationStatusId = 'transactionConfirmationsStatus' + counter;
        var transactionConfirmationStatusCheck2Id = "transactionConfirmationStatusCheck2" + counter;
        var transactionConfirmationStatusCheck3Id = "transactionConfirmationStatusCheck3" + counter;
        var transactionConfirmationStatusCheck4Id = "transactionConfirmationStatusCheck4" + counter;

        var row = `<tr contenteditable>
                    <td id='${transactionNumberId}' class="disabled " >${parseInt(counter) + 1}</td>
                    <td id="${transactionAddressId}"  class="display-none">${transaction}</td>
                    <td id='${transactionYourCoordinatorId}' class="">${yourCoordinator}</td>
                    <td id='${transactionCounterpartAccountId}' class="">${counterpart}</td>
                    <td id='${transactionCounterpartCoordinatorId}' class="">${counterpartCoordinator}</td>
                    <td id='${transactionTypeId}' class="">${type}</td>
                    <td id='${transactionSenderAmountId}' class="">${senderAmount}</td>
                    <td id='${transactionReceiverAmountId}' class="">${receiverAmount}</td>
                    <td id='${transactionConfirmationStatusId}' class="">
                        <form class='form row no-gutters'>
                           <div class='col-4'><input id='${transactionConfirmationStatusCheck2Id}' type="checkbox" class="form-check-input "  disabled></div>
                           <div class='col-4'><input id='${transactionConfirmationStatusCheck3Id}' type="checkbox" class="form-check-input "  disabled></div>
                           <div class='col-4'><input id='${transactionConfirmationStatusCheck4Id}' type="checkbox" class="form-check-input "  disabled></div>
                        </form>                   
                    </td>
                    <td id='${transactionStatusId}' class="">${status}</td>
                </tr>`;

        App.appendTableTbody("transactions-list-table", row);

        if (receiverPermission == "1") document.getElementById(transactionConfirmationStatusCheck2Id).checked = true;
        if (senderCoordinatorPermission == "1") document.getElementById(transactionConfirmationStatusCheck3Id).checked = true;
        if (receiverCoordinatorPermission == "1") document.getElementById(transactionConfirmationStatusCheck4Id).checked = true;

        App.transactionCounter++;
    },

    loadTransactionsList: function () {

        web3.eth.getCoinbase(function (err, account) {

            App.contracts.Netereum.deployed().then(function (NetereumInstance) {

                NetereumInstance.numberOfCreatedTransactions().then(function (numberOfTransactions) {

                    App.removeTableTbody("transactions-list-table");

                    for (var i = 0; i < numberOfTransactions; i++) {

                        NetereumInstance.createdTransactionsAddress(i).then(async function (transactionAddress) {

                            App.contracts.Transaction.at(transactionAddress).then(async function (instance) {

                                var statusCode = await NetereumInstance.transactionsStatus(transactionAddress);

                                var sender = await instance.buyer();
                                var receiver = await instance.seller();
                                var receiverCoordinator = await instance.sellerCoordinator();
                                var senderCoordinator = await instance.buyerCoordinator();
                                var roleInTransaction;
                                var state = "it will be executed in 2:00 AM";

                                var counterpart;
                                var counterpartCoordinator;
                                var yourCoordinator;
                                var flag = false;

                                if (receiver === account) {

                                    flag = true;
                                    counterpart = sender;
                                    counterpartCoordinator = senderCoordinator;
                                    yourCoordinator = receiverCoordinator;
                                    roleInTransaction = "receiver";

                                } else if (sender === account) {

                                    flag = true;
                                    counterpart = receiver;
                                    counterpartCoordinator = receiverCoordinator;
                                    yourCoordinator = senderCoordinator;
                                    roleInTransaction = "sender";
                                }

                                if (flag) {

                                    var senderAmount = await instance.buyerCost();
                                    var receiverAmount = await instance.sellerCost();

                                    var receiverPermissionStatus = await instance.sellerPermission();
                                    var senderCoordinatorPermissionStatus = await instance.buyerCoordinatorPermission();
                                    var receiverCoordinatorPermissionStatus = await instance.sellerCoordinatorPermission();
                                    var counterPermission = await instance.counterPermission();

                                    App.addTransactionRow(transactionAddress, yourCoordinator, counterpart, counterpartCoordinator, roleInTransaction, senderAmount, receiverAmount, receiverPermissionStatus, senderCoordinatorPermissionStatus, receiverCoordinatorPermissionStatus, statusCode);
                                }
                            });
                        });
                    }
                });
            });
        });
    },

    //admin functions ..................................................................................................

    setMainGraphContractRequirements: function () {

        var netereumContractAddressValue = $("#Netereum-contract-address").val();
        App.contracts.MainGraph.deployed().then(async function (mainGraphInstance) {
            await mainGraphInstance.setNetereum(netereumContractAddressValue);
        });
    },

    setNetereumContractRequirements: function () {

        var mainGraphContractAddressValue = $("#MainGraph-contract-address").val();
        App.contracts.Netereum.deployed().then(async function (netereumInstance) {
            await netereumInstance.setMainGraph(mainGraphContractAddressValue);
        });
    },

    adminAddCoordinator: function (adderess) {

        var coordinatorAddressValue = $("#coordinator-address").val();
        App.contracts.Netereum.deployed().then(async function (netereumInstance) {
            await netereumInstance.addCoordinator(coordinatorAddressValue);
        });
    },
};

$(function () {
    App.init();
});

