function calculateLoan() {
    var loanAmount = parseFloat(document.getElementById("loanAmount").value);
    var interestRate = parseFloat(document.getElementById("interestRate").value);
    var loanTerm = parseFloat(document.getElementById("loanTerm").value);
    var loanType = document.getElementById("loanType").value;
    var extraPayments = parseFloat(document.getElementById("extraPayments").value);
    var gracePeriod = parseFloat(document.getElementById("gracePeriod").value);

    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm)) {
        alert("Please enter valid numerical values.");
        return;
    }

    var monthlyInterest = (interestRate / 100) / 12;
    var totalPayments = loanTerm * 12;
    var monthlyPayment = 0;
    var totalPayment = 0;
    var totalInterest = 0;
    var totalPrincipalPaid = 0;

    if (loanType === "amortizing") {
        monthlyPayment = (loanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -totalPayments));
        totalPayment = monthlyPayment * totalPayments;
        totalInterest = totalPayment - loanAmount;

        totalPrincipalPaid = loanAmount;
        var balance = loanAmount;
        for (var i = 1; i <= totalPayments; i++) {
            var interest = balance * monthlyInterest;
            var principal = monthlyPayment - interest;
            var extraPayment = (i > gracePeriod) ? extraPayments : 0;
            principal += extraPayment;
            balance -= principal;

            totalPrincipalPaid -= principal;
        }
    } else if (loanType === "interest-only") {
        monthlyPayment = (loanAmount * monthlyInterest);
        totalPayment = monthlyPayment * totalPayments;
        totalInterest = totalPayment;

        totalPrincipalPaid = 0;
    }

    var result = document.getElementById("result");
    result.innerHTML = "Monthly Payment: $" + monthlyPayment.toFixed(2) + "<br>"
                    + "Total Payment: $" + totalPayment.toFixed(2) + "<br>"
                    + "Total Interest: $" + totalInterest.toFixed(2) + "<br>"
                    + "Total Principal Paid: $" + totalPrincipalPaid.toFixed(2);

    if (loanType === "amortizing") {
        generateAmortizationTable(loanAmount, monthlyInterest, totalPayments, monthlyPayment, extraPayments, gracePeriod);
    } else if (loanType === "interest-only") {
        clearAmortizationTable();
    }
}

function generateAmortizationTable(loanAmount, monthlyInterest, totalPayments, monthlyPayment, extraPayments, gracePeriod) {
    var table = document.createElement("table");
    table.innerHTML = "<tr><th>Payment Number</th><th>Principal</th><th>Interest</th><th>Balance</th></tr>";

    var balance = loanAmount;
    for (var i = 1; i <= totalPayments; i++) {
        var interest = balance * monthlyInterest;
        var principal = monthlyPayment - interest;
        var extraPayment = (i > gracePeriod) ? extraPayments : 0;
        principal += extraPayment;
        balance -= principal;

        var row = document.createElement("tr");
        row.innerHTML = "<td>" + i + "</td><td>$" + principal.toFixed(2) + "</td><td>$" + interest.toFixed(2) + "</td><td>$" + balance.toFixed(2) + "</td>";
        table.appendChild(row);
    }

    var amortization = document.getElementById("amortization");
    amortization.innerHTML = "<h2>Amortization Schedule</h2>";
    amortization.appendChild(table);
}

function clearAmortizationTable() {
    var amortization = document.getElementById("amortization");
    amortization.innerHTML = "";
}
