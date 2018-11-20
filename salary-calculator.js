/*jslint browser:true */
window.onload = function () {
    'use strict';
    (function (document) {
        function getBaseSalary(role) {
            var baseSalarys = {
                programmer: 30000,
                teacher: 27000,
                assistant: 25000
            };

            return baseSalarys[role];
        }

        function getTaxRate(city, salaryYear) {
            var basicTaxRates = [{
                city: 'stockholm',
                year: 2016,
                taxRate: 0.3
            }, {
                city: 'stockholm',
                year: 2017,
                taxRate: 0.29
            }, {
                city: 'göteborg',
                year: 2016,
                taxRate: 0.25
            }, {
                city: 'göteborg',
                year: 2017,
                taxRate: 0.22
            }];

            return basicTaxRates.filter(function (r) {
                return r.city === city && r.year === salaryYear;
            })[0].taxRate;
        }

        function getRaise(experience) {
            var RAISE = {
                BETWEEN_4_AND_7: 1.2,
                BETWEEN_8_AND_10: 1.4,
                MORE_THAN_10: 1.6
            };

            if (experience < 4) {
                return 1;
            }
            if (experience < 8) {
                return RAISE.BETWEEN_4_AND_7;
            }
            if (experience < 11) {
                return RAISE.BETWEEN_8_AND_10;
            }
            return RAISE.MORE_THAN_10;
        }

        function getTotalSalary(salary, raise) {
            return salary * raise;
        }

        function calculateSalary(amount, taxRate) {
            return (amount - (amount * taxRate));
        }

        function calculateMiddleBracketSalary(totalSalary, limit, taxRate, middleTaxRate) {
            var salaryAfterRegularTax = calculateSalary(limit, taxRate),
                taxableAmount = totalSalary - limit,
                taxableAmountResult = calculateSalary(taxableAmount, middleTaxRate);

            return salaryAfterRegularTax + taxableAmountResult;
        }

        function calculateUpperBracketSalary(info) {
            var salaryAfterRegularTax = calculateSalary(info.middleLimit, info.taxRate),
                taxableAmount = info.upperLimit - info.middleLimit,
                taxableAmountResult = calculateSalary(taxableAmount, info.middleTaxRate),
                secondTaxableAmount = info.totalSalary - info.upperLimit,
                secondTaxableAmountResult = calculateSalary(secondTaxableAmount, info.upperTaxRate);

            return salaryAfterRegularTax + taxableAmountResult + secondTaxableAmountResult;
        }

        function calculateFinalSalary(totalSalary, taxRate) {
            var SALARY_FIRST_LIMIT = 36000,
                SALARY_SECOND_LIMIT = 45000,
                SALARY_FIRST_LIMIT_RATE = 0.5,
                SALARY_SECOND_LIMIT_RATE = 0.7;

            if (totalSalary < SALARY_FIRST_LIMIT) {
                return totalSalary - (totalSalary * taxRate);
            }
            if (totalSalary >= SALARY_FIRST_LIMIT && totalSalary <= SALARY_SECOND_LIMIT) {
                return calculateMiddleBracketSalary(totalSalary, SALARY_FIRST_LIMIT, taxRate, SALARY_FIRST_LIMIT_RATE);
            }
            return calculateUpperBracketSalary({
                totalSalary: totalSalary,
                middleLimit: SALARY_FIRST_LIMIT,
                taxRate: taxRate,
                middleTaxRate: SALARY_FIRST_LIMIT_RATE,
                upperLimit: SALARY_SECOND_LIMIT,
                upperTaxRate: SALARY_SECOND_LIMIT_RATE
            });
        }

        var btn = document.getElementById('calculate');
        btn.addEventListener('click', function () {
            //VIEW INFO RETRIVAL
            var btnNodes = document.getElementsByName('role'),
                btns = Array.prototype.slice.call(btnNodes),
                role = btns.filter(function (b) {
                    return b.checked;
                })[0].value,
                city = document.getElementById('city').value.toLowerCase(),
                salaryYear = parseInt(document.getElementById('salaryYear').value, 0),
                experience = document.getElementById('experience').value,
                //GET BASIC INFO
                salary = getBaseSalary(role),
                taxRate = getTaxRate(city, salaryYear),
                raise = getRaise(experience),
                //CALCULATIONS
                totalSalary = getTotalSalary(salary, raise),
                finalSalary = calculateFinalSalary(totalSalary, taxRate),
                //VIEW INFO
                container = document.getElementById("salary-after-taxes"),
                content;

            container.innerHTML = '';
            content = document.createTextNode(finalSalary);
            container.appendChild(content);
        });

    }(document));
};
