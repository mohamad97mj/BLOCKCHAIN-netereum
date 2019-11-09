//events

// watchPaymentMessageCreatedEvents: function () {
//     App.contracts.Netereum.deployed().then(function (instance) {
//         instance.paymentMessageCreated({}, {
//             fromBlock: 0,
//             toBlock: 'latest'
//         }).watch(function (err, event) {
//
//             // var selectedBox = document.getElementById("signAs");
//             // var signAs = selectedBox.options[selectedBox.selectedIndex].value;
//
//             switch (App.role) {
//                 case "coordinator":
//                     App.coordinatorLoadPaymentMessages();
//                     break;
//
//                 case "provider":
//                     App.providerPreviousPaymentMessages();
//                     break;
//
//                 case "customer":
//                     App.customerLoadPaymentMessages();
//                     break;
//
//             }
//         })
//     });
// },
//
// // agreement events ...........................................................................................................
//
// watchAgreementCreatedEvents: function () {
//     App.contracts.Netereum.deployed().then(function (instance) {
//         instance.agreementCreated({}, {
//             fromBlock: 0,
//             toBlock: 'latest'
//         }).watch(function (err, event) {
//
//             // alert("agreement created");
//             // var selectedBox = document.getElementById("signAs");
//             // var signAs = selectedBox.options[selectedBox.selectedIndex].value;
//             // alert("signed as : " + signAs);
//             // var signAs = "provider";
//             //to do : load only for parties not all
//
//             switch (App.role) {
//                 case "coordinator":
//                     App.coordinatorLoadNewAgreementsRequests();
//                     break;
//
//                 case "provider":
//                     // alert("signed as provider");
//                     App.loadAgreementsOffers();
//                     // App.loadNewAgreements();
//                     break;
//             }
//         });
//     });
// },
//
// watchAgreementApprovedOrDeclinedEvents: function () {
//     App.contracts.Netereum.deployed().then(function (instance) {
//         instance.agreementApprovedOrDeclined({}, {
//             fromBlock: 0,
//             toBlock: 'latest'
//         }).watch(function (err, event) {
//
//             // var selectedBox = document.getElementById("signAs");
//             // var signAs = selectedBox.options[selectedBox.selectedIndex].value;
//
//             switch (App.role) {
//                 case "coordinator":
//                     App.coordinatorLoadNewAgreementsRequests();
//                     App.coordinatorLoadPreviousAgreementsRequests();
//                     break;
//
//                 case "provider":
//                     App.loadAgreementsOffers();
//                     break;
//
//             }
//         })
//     });
// },
//
// // transaction event ...............................................................................................
//
// watchTransactionCreatedEvents: function () {
//     App.contracts.Netereum.deployed().then(function (instance) {
//         instance.transactionCreated({}, {
//             fromBlock: 0,
//             toBlock: 'latest'
//         }).watch(function (err, event) {
//
//             // var selectedBox = document.getElementById("signAs");
//             // var signAs = selectedBox.options[selectedBox.selectedIndex].value;
//             //to do : load only for parties not all
//
//             switch (App.role) {
//                 case "coordinator":
//                     App.coordinatorLoadNewTransactionsRequests();
//                     break;
//
//                 case "customer":
//                     App.loadNewTransactions();
//                     break;
//             }
//         });
//     });
// },
//
// watchTransactionApprovedOrDeclinedEvent: function () {
//
//     App.contracts.Netereum.deployed().then(function (instance) {
//         instance.transactionApprovedOrDeclined({}, {
//             fromBlock: 0,
//             toBlock: 'latest'
//         }).watch(function (err, event) {
//
//             // var selectedBox = document.getElementById("signAs");
//             // var signAs = selectedBox.options[selectedBox.selectedIndex].value;
//
//             switch (App.role) {
//                 case "coordinator":
//                     App.coordinatorLoadNewTransactionsRequests();
//                     App.coordinatorLoadPreviousTransactionsRequests();
//                     break;
//
//                 case "provider":
//                     App.loadOfferedTransactions();
//                     App.loadTransactions();
//                     break;
//
//             }
//         })
//     });
// }


//future functions .....................................................................................................

// createNewPaymentMessage: async function (counter) { //this is coordinator function
//
//     // alert("entered addMessage");
//     // alert("counter is " + counter);
//     var targetPaymentMessageReceiverId = "coordinatorPaymentMessageReceiver" + counter;
//     var targetPaymentMessageDestinationId = "coordinatorPaymentMessageDestination" + counter;
//     var targetPaymentMessageAmountId = "coordinatorPaymentMessageAmount" + counter;
//     var targetSendBtnId = "coordinatorSendMessageBtn" + counter;
//     var sendBtn = document.getElementById(targetSendBtnId);
//     sendBtn.disabled = true;
//     sendBtn.innerText = "done";
//     sendBtn.classList.add("btn-dark");
//
//     var receiverValue = document.getElementById(targetPaymentMessageReceiverId);
//     var destinationValue = document.getElementById(targetPaymentMessageDestinationId);
//     var amountValue = document.getElementById(targetPaymentMessageAmountId);
//
//     web3.eth.getCoinbase(function (err, account) {
//         App.contracts.Netereum.deployed().then(async function (NetereumInstance) {
//             await NetereumInstance.createAndAddPaymentMessage("0x78bc47CeA54A29a3604F0750f77a67C1Ab399B55", 123456789, 500);
//         });
//     });
// }
// ,
//
// coordinatorAddPaymentMessageRow: function (transaction, receiver, destination, amount, submitStatus, isSent) { //this is coordinator function
//
//     var counter = App.paymentMessageCounter;
//
//     var tempPaymentMessageNumberId = "coordinatorPaymentMessageNumber" + counter;
//     var tempPaymentTransactionId = "coordinatorPaymentTransaction" + counter;
//     var tempPaymentMessageReceiverId = "coordinatorPaymentMessageCoordinator" + counter;
//     var tempPaymentMessageDestinationId = "coordinatorPaymentMessageDestination" + counter;
//     var tempPaymentMessageAmountId = "coordinatorPaymentMessageAmount" + counter;
//     var tempPaymentMessagePerformStatusId = "coordinatorPaymentMessagePerformStatus" + counter;
//     var tempSendMessageBtnId = "coordinatorSendMessageBtn" + counter;
//
//     var row = '              <tr class="no-padding">\n' +
//         '                        <td id="' + tempPaymentMessageNumberId + '" class="disabled " contenteditable="false">1</td>\n' +
//         '                        <td id="' + tempPaymentTransactionId + '"   class="">' + transaction + '</td>\n' +
//         '                        <td id="' + tempPaymentMessageReceiverId + '" class="">' + receiver + '</td>\n' +
//         '                        <td id="' + tempPaymentMessageDestinationId + '" class="">' + destination + '</td>\n' +
//         '                        <td id="' + tempPaymentMessageAmountId + '" class="">' + amount + '</td>\n' +
//         '                        <td id="' + tempPaymentMessagePerformStatusId + '" class="">' + submitStatus + '</td>\n' +
//         '                        <td  id="" class=" no-padding center-content">' +
//         '                            <button type="button" id="' + tempSendMessageBtnId + '" class="btn btn-bg-blue btn-general btn-block no-margin td-button" style="height: 50px;">send</button>' +
//         '</td>\n' +
//         '                    </tr>\n';
//
//
//     var table = document.getElementById("coordinator-payment-messages-table");
//     $(table).find('tbody').append(row);
//
//     if (isSent) {
//
//         var tempSendMessageBtn = document.getElementById(tempSendMessageBtnId);
//         tempSendMessageBtn.disabled = true;
//         tempSendMessageBtn.innerText = "done";
//         tempSendMessageBtn.classList.add("btn-dark");
//     }
//
//     App.paymentMessageCounter++;
// },
//
// coordinatorAddEmptyPaymentMessageRow: function () {
//     App.coordinatorAddPaymentMessageRow("", "", "", "", "", false);
// }
// ,
//
// coordinatorRemovePaymentMessagesRows: function () {
//     App.paymentMessageCounter = 0;
//     var table = document.getElementById("coordinator-payment-messages-table");
//     $(table).find('tbody').html('');
// }
// ,
//
// coordinatorLoadPaymentMessages: function () {
//
//     // alert("entered coordinatorLoadPreviousPaymentMessages function");
//
//     web3.eth.getCoinbase(function (err, account) {
//         App.contracts.Netereum.deployed().then(function (NetereumInstance) {
//
//             App.coordinatorRemovePaymentMessagesRows();
//
//             NetereumInstance.numberOfPaymentMessages().then(function (numberOfPaymentMessages) {
//
//                 if (numberOfPaymentMessages == 0) {
//                     // alert("i am here");
//                     App.coordinatorAddEmptyPaymentMessageRow();
//                 } else {
//
//                     // alert(" i am here instead!");
//                 }
//
//                 for (var i = 0; i < numberOfPaymentMessages; i++) {
//
//                     // alert("entered for loop");
//                     NetereumInstance.paymentMessagesAddress(i).then(async function (paymentMessageAddress) {
//                         App.contracts.PaymentMessage.at(paymentMessageAddress).then(async function (instance) {
//
//                             var coordinatorAccount = await instance.coordinator();
//
//                             // alert("entered before if");
//
//                             if (coordinatorAccount === account) {
//
//                                 // alert("entered if");
//                                 var receiverAccount = await instance.receiverAddress();
//                                 var destination = await instance.destinationAccount();
//                                 var amount = await instance.paymentAmount();
//                                 var performStatus = await instance.isPerformed();
//                                 var submitStatus;
//                                 if (performStatus === true) {
//                                     submitStatus = "performed";
//                                 } else {
//
//                                     submitStatus = "not performed";
//                                 }
//
//                                 App.coordinatorAddPaymentMessageRow(paymentMessageAddress, receiverAccount, destination, amount, submitStatus, true);
//                             }
//                         });
//                     });
//                 }
//             });
//         });
//     });
// },

// providerAddPaymentMessageRow: function (transaction, coordinator, destination, amount, performStatus) {
//
//     var counter = App.paymentMessageCounter;
//
//     var tempPaymentMessageNumberId = "providerPaymentMessageNumber" + counter;
//     var tempPaymentTransactionId = "providerPaymentTransaction" + counter;
//     var tempPaymentMessageCoordinatorId = "providerPaymentMessageCoordinator" + counter;
//     var tempPaymentMessageDestinationId = "providerPaymentMessageDestination" + counter;
//     var tempPaymentMessageAmountId = "providerPaymentMessageAmount" + counter;
//     var tempPaymentMessagePerformStatusId = "providerPaymentMessagePerformStatus" + counter;
//     var tempPerformTransactionBtnId = "providerPerformTransactionBtn" + counter;
//
//
//     var row = '                    <tr>\n' +
//         '                        <td id="' + tempPaymentMessageNumberId + '" class="disabled " contenteditable="false">1</td>\n' +
//         '                        <td id="' + tempPaymentTransactionId + '"   class="">' + transaction + '</td>\n' +
//         '                        <td id="' + tempPaymentMessageCoordinatorId + '" class="">' + coordinator + '</td>\n' +
//         '                        <td id="' + tempPaymentMessageDestinationId + '" class="">' + destination + '</td>\n' +
//         '<td id="' + tempPaymentMessagePerformStatusId + '" class="center-content row no-gutters">\\n\' +\n' +
//         '            \'                            <button id="' + tempPerformTransactionBtnId + '" class="btn btn-success" onclick="App.providerPerformTransaction(\' + counter + \')">perform transaction</button>\\n\' +\n' +
//         '            \'                        </td>\\n\' +' +
//         '                        <td id="' + tempPaymentMessageAmountId + '" class="">' + amount + '</td>\n' +
//         '                    </tr>\n';
//
//     var table = document.getElementById("provider-payment-messages-table");
//     $(table).find('tbody').append(row);
//     App.paymentMessageCounter++;
// }
// ,
//
// providerRemovePaymentMessagesRows: function () {
//     App.paymentMessageCounter = 0;
//     var table = document.getElementById("providerPayments");
//     $(table).find('tbody').html('');
// }
// ,
//
// providerPreviousPaymentMessages: function () {
//
//     // alert("entered providerLoadPreviousPaymentMessages function");
//     web3.eth.getCoinbase(function (err, account) {
//         App.contracts.Netereum.deployed().then(function (NetereumInstance) {
//
//             App.providerRemovePaymentMessagesRows();
//             // NetereumInstance.numberOfPaymentMessages().then(function (numberOfPaymentMessages) {
//             //
//             //     for (var i = 0; i < numberOfPaymentMessages; i++) {
//             //
//             //         // alert("entered for loop");
//             //         NetereumInstance.paymentMessagesAddress(i).then(async function (paymentMessageAddress) {
//             //             // alert(agreementAddress);
//             //             App.contracts.PaymentMessage.at(paymentMessageAddress).then(async function (instance) {
//             //
//             //                 var receiverAccount = await instance.receiverAddress();
//             //                 var amount2 = await instance.paymentAmount();
//             //                 var destination2 = await instance.destinationAccount();
//             //                 // alert("before if!");
//             //
//             //                 // alert("receiver account is : " + receiverAccount + "\naccount is : " + account + "\namount is " + amount2 + "\ndestination" + destination2);
//             //                 if (receiverAccount === account) {
//             //                     // alert("after if!");
//             //
//             //                     var coordinatorAccount = await instance.coordinator();
//             //                     var destination = await instance.destinationAccount();
//             //                     var amount = await instance.paymentAmount();
//             //                     var performStatus = await instance.isPerformed();
//             //
//             //                     App.providerAddPaymentMessageRow(paymentMessageAddress, coordinatorAccount, destination, amount, performStatus);
//             //                 }
//             //             });
//             //         });
//             //     }
//             // });
//         });
//     });
// }
// ,
//
// providerPerformTransaction: function (counter) {
//
//     // alert("entered performTransaction function");
//     // alert(counter);
//     var targetPerformTransactionBtnId = "providerPerformTransactionBtn" + counter;
//     var performTransactionBtn = document.getElementById(targetPerformTransactionBtnId);
//     performTransactionBtn.disabled = true;
//     performTransactionBtn.innerText = "done";
//     performTransactionBtn.classList.add("btn-dark");
//
//     var targetTransactionId = "providerPaymentTransaction" + counter;
//     var targetTransaction = document.getElementById(targetTransactionId);
//     var transactionAddress = targetTransaction.innerText;
//
//     App.contracts.PaymentMessage.at(transactionAddress).then(async function (instance) {
//         await instance.performIt()
//     });
// }
// ,


// customerAddPaymentMessageRow: function (transaction, coordinator, destination, amount, performStatus) {
//     var counter = App.paymentMessageCounter;
//
//     var tempPaymentMessageNumberId = "customerPaymentMessageNumber" + counter;
//     var tempPaymentTransactionId = "customerPaymentTransaction" + counter;
//     var tempPaymentMessageCoordinatorId = "customerPaymentMessageCoordinator" + counter;
//     var tempPaymentMessageDestinationId = "customerPaymentMessageDestination" + counter;
//     var tempPaymentMessageAmountId = "customerPaymentMessageAmount" + counter;
//     var tempPaymentMessagePerformStatusId = "customerPaymentMessagePerformStatus" + counter;
//     var tempPerformTransactionBtnId = "customerPerformTransactionBtn" + counter;
//
//
//     var row = '                    <tr>\n' +
//         '                        <td id="' + tempPaymentMessageNumberId + '" class="disabled " contenteditable="false">1</td>\n' +
//         '                        <td id="' + tempPaymentTransactionId + '"   class="">' + transaction + '</td>\n' +
//         '                        <td id="' + tempPaymentMessageCoordinatorId + '" class="">' + coordinator + '</td>\n' +
//         '                        <td id="' + tempPaymentMessageDestinationId + '" class="">' + destination + '</td>\n' +
//         '                        <td id="' + tempPaymentMessageAmountId + '" class="">' + amount + '</td>\n' +
//         '                        <td id="' + tempPaymentMessagePerformStatusId + '" class="center-content row no-gutters">\n' +
//         '                            <button id="' + tempPerformTransactionBtnId + '" class="btn btn-success" onclick="App.customerPerformTransaction(' + counter + ')">perform transaction</button>\n' +
//         '                        </td>\n' +
//         '                    </tr>\n';
//
//     var table = document.getElementById("provider-payment-messages-table");
//     $(table).find('tbody').append(row);
//
//     if (performStatus === true) {
//
//         var tempPerformTransactionBtn = document.getElementById(tempPerformTransactionBtnId);
//         tempPerformTransactionBtn.disabled = true;
//         tempPerformTransactionBtn.innerText = "done";
//         tempPerformTransactionBtn.classList.add("btn-dark");
//     }
//     App.paymentMessageCounter++;
// },

// customerLoadPaymentMessages: function () {
//
//     web3.eth.getCoinbase(function (err, account) {
//         App.contracts.Netereum.deployed().then(function (NetereumInstance) {
//
//             App.providerRemovePaymentMessagesRows();
//             NetereumInstance.numberOfPaymentMessages().then(function (numberOfPaymentMessages) {
//
//                 for (var i = 0; i < numberOfPaymentMessages; i++) {
//
//                     // alert("entered for loop");
//                     NetereumInstance.paymentMessagesAddress(i).then(async function (paymentMessageAddress) {
//                         // alert(agreementAddress);
//                         App.contracts.PaymentMessage.at(paymentMessageAddress).then(async function (instance) {
//
//                             var receiverAccount = await instance.receiverAddress();
//                             if (receiverAccount === account) {
//                                 // alert("after if!");
//
//                                 var coordinatorAccount = await instance.coordinator();
//                                 var destination = await instance.destinationAccount();
//                                 var amount = await instance.paymentAmount();
//                                 var performStatus = await instance.isPerformed();
//
//                                 App.customerAddPaymentMessageRow(paymentMessageAddress, coordinatorAccount, destination, amount, performStatus);
//                             }
//                         });
//                     });
//                 }
//             });
//         });
//     });
// },
//
// customerPerformTransaction: function (counter) {
//
//     // alert("entered performTransaction function");
//     // alert(counter);
//     var targetPerformTransactionBtnId = "customerPerformTransactionBtn" + counter;
//     var performTransactionBtn = document.getElementById(targetPerformTransactionBtnId);
//     performTransactionBtn.disabled = true;
//     performTransactionBtn.innerText = "done";
//     performTransactionBtn.classList.add("btn-dark");
//
//     var targetTransactionId = "customerPaymentTransaction" + counter;
//     var targetTransaction = document.getElementById(targetTransactionId);
//     var transactionAddress = targetTransaction.innerText;
//
//     App.contracts.PaymentMessage.at(transactionAddress).then(async function (instance) {
//         await instance.performIt();
//     });
// },


