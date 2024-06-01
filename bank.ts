#!/usr/bin/env node
import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
// Customer Class
class Customer {
    firstName:string
    lastName:string
    age:number
    mobNumber:number
    accNumber:number
    gender:string
    constructor(fName:string,lName:string,age:number,mobNumber:number,accNumber:number,gender:string){


        this.firstName = fName;

        this.lastName =lName;
        this.age =age;
        this.mobNumber = mobNumber;
        this.accNumber = accNumber;
        this.gender = gender;
    }
}
// Class Bank
interface bankAccount{
    accountNumber:number,
    balance:number,
}
class Bank {
    customer:Customer []=[]
    account:bankAccount []=[]
    addCustomer(obj:Customer){
        this.customer.push(obj);
    }
    addAccountNumber(obj:bankAccount){
        this.account.push(obj);
    };
    transection(accountObj: bankAccount) {
        let newAccount = this.account.filter(
            (acc) => acc.accountNumber !== accountObj.accountNumber);
        this.account = [...newAccount, accountObj]
    }
}
let myBank = new Bank();
//console.log(myBank);
// Customer Create
 for(let i: number = 1; i <= 3; i++) {
    let fName = faker.person.firstName("male")
    let lName = faker.person.lastName()
    let num = parseInt(faker.string.numeric("300121212"))
    const cus = new Customer(fName, lName, 19 * i, num, 1000 + i,"male");
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accountNumber: cus.accNumber, balance: 100 * i })
}
    // for check coding = console.log(cus);

// for check coding = console.log(myb


async function bankService(bank: Bank) {
    do{
        let service = await inquirer.prompt({
            type: "list",
            name: "select",
            message: "Please select the Option",
            choices: ["View Balance", "Cash Withdraw", "Cash Deposit","Exit"]
        });
        if (service.select == "View Balance") {
            let res = await inquirer.prompt({
                type: "input",
                name: "userAcc",
                message: "Please enter your Account Number(A/C 1001 or 1002 or 1003)"
            });
            let account = myBank.account.find((acc) => acc.accountNumber == res.userAcc);
            if (!account) {
                console.log("Invalid Account Number");
            }
            if (account) {
                let name = myBank.customer.find((item) => item.accNumber == account?.accountNumber);
                console.log(`Dear ${name?.firstName} ${name?.lastName} Your Account Balance is $${+account.balance}`)
            }
        }
        if (service.select == "Cash Withdraw") {
            let res = await inquirer.prompt({
                type: "input",
                name: "userAcc",
                message: "Please enter your Account Number"
            });
            let account = myBank.account.find((acc) => acc.accountNumber == res.userAcc);
            if (!account) {
                console.log("Invalid Account Number");
            };
            if (account) {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "money",
                    message: "Please enter the Amount."
                });
                if (ans.money > account.balance) {
                    console.log("Insufficient Balance")
                }
                let newBalance = account.balance - ans.money
                bank.transection({ accountNumber: account.accountNumber, balance: newBalance });
            }
        }
        if (service.select == "Cash Deposit") {
            let res = await inquirer.prompt({
                type: "input",
                name: "userAcc",
                message: "Please enter your Account Number"
            });
            let account = myBank.account.find((acc) => acc.accountNumber == res.userAcc);
            if (!account) {
                console.log("Invalid Account Number");
            };
            if (account) {
                let ans = await inquirer
                .prompt({
                    type: "number",
                    name: "money",
                    message: "Please enter the Amount."
                });
                let newBalance = account.balance + ans.money
                bank.transection({ accountNumber: account.accountNumber, balance: newBalance });
            }
        }
        // putting this (if) condition for to exit from this function 
        if (service.select == "Exit"){
            return;
        }
    }while(true)
}
bankService(myBank)