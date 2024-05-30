import { db } from "./db/db.server";

import * as bycrypt from "bcrypt";

const main = async () => {
  try {
    const secretPassword = process.env.ADMIN_PASSWORD as string;
    await db.categories.createMany({
      data: [
        {
          transaction_type: "EXPENSES",
          category: "Housing",
        },

        {
          transaction_type: "EXPENSES",
          category: "Transportation",
        },

        {
          transaction_type: "EXPENSES",
          category: "Food",
        },

        {
          transaction_type: "EXPENSES",
          category: "Utilities",
        },

        {
          transaction_type: "EXPENSES",
          category: "Healthcare",
        },

        {
          transaction_type: "EXPENSES",
          category: "Personal Care",
        },

        {
          transaction_type: "EXPENSES",
          category: "Entertainment",
        },

        {
          transaction_type: "EXPENSES",
          category: "Debt Repayment",
        },

        {
          transaction_type: "EXPENSES",
          category: "Savings",
        },

        {
          transaction_type: "EXPENSES",
          category: "Gift/Donations",
        },

        {
          transaction_type: "EXPENSES",
          category: "Education",
        },

        {
          transaction_type: "EXPENSES",
          category: "Travel",
        },

        {
          transaction_type: "EXPENSES",
          category: "Clothing",
        },

        {
          transaction_type: "EXPENSES",
          category: "Misc",
        },

        {
          transaction_type: "REVENUE",
          category: "Salary",
        },

        {
          transaction_type: "REVENUE",
          category: "Freelance/Contract Work",
        },

        {
          transaction_type: "REVENUE",
          category: "Business Income",
        },

        {
          transaction_type: "REVENUE",
          category: "Investment Income",
        },

        {
          transaction_type: "REVENUE",
          category: "Rental Income",
        },

        {
          transaction_type: "REVENUE",
          category: "Interest/Dividends",
        },

        {
          transaction_type: "REVENUE",
          category: "Pension",
        },

        {
          transaction_type: "REVENUE",
          category: "Gift/Inheritance",
        },

        {
          transaction_type: "REVENUE",
          category: "Other",
        },
      ],
    });

    await db.user.createMany({
      data: [
        {
          username: "johndoe123",
          email: "john@example.com",
          password: await bycrypt.hash("P@ssword123", 10),
          emailVerified: new Date().toISOString(),
          role: "USER",
        },
        {
          username: "marcel",
          email: "magbualmarcel@gmail.com",
          password: await bycrypt.hash(secretPassword, 10),
          emailVerified: new Date().toISOString(),
          role: "ADMIN",
        },
      ],
    });

    const user = await db.user.findFirst({
      where: {
        username: "johndoe123",
        email: "john@example.com",
      },
    });

    if (!user) return;

    await db.transactions.createMany({
      data: [
        {
          amount: "1200.50",
          category_id: "clw05grse000087kuressdlpr",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-30T08:15:30.000Z",
          note: "Rent for May",
        },
        {
          amount: "150.75",
          category_id: "clw05grse000187kujwi83igw",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-23T14:22:10.000Z",
          note: "Gas and maintenance",
        },
        {
          amount: "50.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-04-30T09:00:00.000Z",
          note: "Groceries",
        },
        {
          amount: "100.00",
          category_id: "clw05grse000487kulcjio99e",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-03-30T16:45:50.000Z",
          note: "Doctor's visit",
        },
        {
          amount: "200.00",
          category_id: "clw05grse000887kulqmvtode",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-30T12:34:20.000Z",
          note: "Monthly savings",
        },
        {
          amount: "5000.00",
          category_id: "clw05grse000e87ku37ev08fe",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-30T08:00:00.000Z",
          note: "Monthly salary",
        },
        {
          amount: "300.00",
          category_id: "clw05grse000f87ku8yirqgk3",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-23T11:15:30.000Z",
          note: "Freelance project",
        },
        {
          amount: "120.50",
          category_id: "clw05grse000j87kubvrv5fwh",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-04-30T14:45:10.000Z",
          note: "Dividend payout",
        },
        {
          amount: "75.00",
          category_id: "clw05grse000m87kus4g34sgq",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-03-30T10:30:45.000Z",
          note: "Gift from friend",
        },
        {
          amount: "60.00",
          category_id: "clw05grse000987kuycjnmn2b",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-23T12:10:20.000Z",
          note: "Charity donation",
        },
        {
          amount: "200.00",
          category_id: "clw05grse000c87ku1yonrkvf",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-04-30T15:50:00.000Z",
          note: "New clothes",
        },
        {
          amount: "350.00",
          category_id: "clw05grse000g87ku4j1gbdvz",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-03-30T17:25:40.000Z",
          note: "Business income",
        },
        {
          amount: "100.00",
          category_id: "clw05grse000h87ku5h1lkupt",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-30T10:10:10.000Z",
          note: "Investment return",
        },
        {
          amount: "150.00",
          category_id: "clw05grse000i87kuaw6bzbfp",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-23T09:35:00.000Z",
          note: "Rental income",
        },
        {
          amount: "80.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-04-30T08:20:20.000Z",
        },
        {
          amount: "40.00",
          category_id: "clw05grse000387kus82esx24",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-03-30T14:00:00.000Z",
          note: "Utility bill",
        },
        {
          amount: "90.00",
          category_id: "clw05grse000587ku952985fo",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-30T09:45:45.000Z",
          note: "Personal grooming",
        },
        {
          amount: "110.00",
          category_id: "clw05grse000687kuu7ytc2kt",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-23T18:00:00.000Z",
          note: "Movie tickets",
        },
        {
          amount: "250.00",
          category_id: "clw05grse000787kuktl97p4m",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-04-30T11:30:30.000Z",
          note: "Loan repayment",
        },
        {
          amount: "180.00",
          category_id: "clw05grse000a87kue4s0cy26",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-03-30T19:20:10.000Z",
          note: "Online course",
        },
        {
          amount: "250.00",
          category_id: "clw05grse000087kuressdlpr",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-29T10:45:30.000Z",
          note: "Rent",
        },
        {
          amount: "20.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-28T09:10:00.000Z",
          note: "Lunch",
        },
        {
          amount: "600.00",
          category_id: "clw05grse000e87ku37ev08fe",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-27T16:30:30.000Z",
          note: "Bonus",
        },
        {
          amount: "15.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-26T12:10:00.000Z",
          note: "Coffee",
        },
        {
          amount: "100.00",
          category_id: "clw05grse000087kuressdlpr",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-25T08:20:30.000Z",
          note: "Rent",
        },
        {
          amount: "35.00",
          category_id: "clw05grse000187kujwi83igw",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-24T14:30:00.000Z",
          note: "Bus fare",
        },
        {
          amount: "500.00",
          category_id: "clw05grse000e87ku37ev08fe",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-23T16:40:30.000Z",
          note: "Salary",
        },
        {
          amount: "250.00",
          category_id: "clw05grse000g87ku4j1gbdvz",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-22T09:30:10.000Z",
          note: "Consulting fee",
        },
        {
          amount: "200.00",
          category_id: "clw05grse000i87kuaw6bzbfp",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-21T17:45:30.000Z",
          note: "Rental payment",
        },
        {
          amount: "30.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-20T15:50:00.000Z",
          note: "Dinner",
        },
        {
          amount: "50.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-19T08:25:40.000Z",
          note: "Groceries",
        },
        {
          amount: "100.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-18T18:30:00.000Z",
          note: "Groceries",
        },
        {
          amount: "75.00",
          category_id: "clw05grse000087kuressdlpr",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-17T11:45:00.000Z",
          note: "Rent",
        },
        {
          amount: "15.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-16T07:10:20.000Z",
          note: "Breakfast",
        },
        {
          amount: "200.00",
          category_id: "clw05grse000a87kue4s0cy26",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-15T16:50:00.000Z",
          note: "Course fee",
        },
        {
          amount: "300.00",
          category_id: "clw05grse000e87ku37ev08fe",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-14T14:30:30.000Z",
          note: "Bonus",
        },
        {
          amount: "50.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-13T13:25:20.000Z",
          note: "Groceries",
        },
        {
          amount: "75.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-12T11:40:00.000Z",
          note: "Groceries",
        },
        {
          amount: "200.00",
          category_id: "clw05grse000087kuressdlpr",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-11T10:50:00.000Z",
          note: "Rent",
        },
        {
          amount: "300.00",
          category_id: "clw05grse000e87ku37ev08fe",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-10T09:35:00.000Z",
          note: "Consulting fee",
        },
        {
          amount: "400.00",
          category_id: "clw05grse000g87ku4j1gbdvz",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-09T17:40:00.000Z",
          note: "Business income",
        },
        {
          amount: "25.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-08T16:50:00.000Z",
          note: "Groceries",
        },
        {
          amount: "100.00",
          category_id: "clw05grse000087kuressdlpr",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-07T14:20:00.000Z",
          note: "Rent",
        },
        {
          amount: "150.00",
          category_id: "clw05grse000187kujwi83igw",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-06T13:45:30.000Z",
          note: "Car repair",
        },
        {
          amount: "75.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-05T12:50:10.000Z",
          note: "Groceries",
        },
        {
          amount: "500.00",
          category_id: "clw05grse000e87ku37ev08fe",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-05-04T11:35:20.000Z",
          note: "Salary",
        },
        {
          amount: "200.00",
          category_id: "clw05grse000087kuressdlpr",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-03T10:45:30.000Z",
          note: "Rent",
        },
        {
          amount: "20.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-02T09:30:00.000Z",
          note: "Lunch",
        },
        {
          amount: "30.00",
          category_id: "clw05grse000287kuybznfkwd",
          user_id: user.uid,
          type: "EXPENSES",
          created_at: "2024-05-01T08:25:00.000Z",
          note: "Groceries",
        },
        {
          amount: "400.00",
          category_id: "clw05grse000g87ku4j1gbdvz",
          user_id: user.uid,
          type: "REVENUE",
          created_at: "2024-04-30T17:30:30.000Z",
          note: "Business income",
        },
      ],
    });
  } catch (err) {
    throw new Error("Unexpected error when seeding, the errors: " + err);
  } finally {
    await db.$disconnect();
    process.exit();
  }
};

main();
