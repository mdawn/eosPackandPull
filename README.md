# EOS Block Pack & Pull

A nodeJS app with a GraphQL endpoint. It pulls and stores EOS blocks in MongoDB through courtesy of a Docker image.

## Description

This app can answer two questions:

1. What was the last block ID we pulled into MongoDB, including timestamp and block number?

and

2. Given a specific block number, what is our block's ID and timestamp?



## Getting Set Up

**STEP 1**: Clone this repo. Cd in there.</br>


**STEP 2**: Start Docker and run `docker-compose up` in your terminal. </br> 


**STEP 3**: Open a browser and navigate to http://localhost:4000/ </br>


## Example Usage

1. We want to pull an EOS block and store it in our database.

* Click `Pull Most Recent Block`. Our click returns object info in a single line:

```
{"data":{"lastBlock":{"id":"000008f3080d4474105b3b76e0d4a28ac96ad2479bcdc4dcb136f6c5a759c64f","timestamp":"2019-02-18T00:59:48.000","txn_count":null,"block_num":"2291"}}}
```

In our case, we can see the last block pulled and stored is block number `2291`.  


2. Now we want to get info related to a specific block we've previously stored. 

* Let's check on that last block we just pulled to make sure it went into the database. We enter `2291` into the text field and click the `Pull by Block ID` button. It returns:

```
{"data":{"blocks":[{"id":"000008f3080d4474105b3b76e0d4a28ac96ad2479bcdc4dcb136f6c5a759c64f","timestamp":"2019-02-18T00:59:48.000","txn_count":null,"block_num":"2291"}]}}
```

Success! 

## Try the GraphQL endpoint!

We can also use a GraphQL endpoint to request a wider variation of information by accessing http://localhost:4000/graphQL.

On the left side of the GraphQL pane, let's enter a query on the last block pulled (a.k.a. our favorite block `2291`) by entering the following query into the left side of the GraphQL pane:


```
 {
   blocks(numbers: [2291]) {
     id
     block_num
     timestamp
     input_transactions {
       hex_data
     }
   }
   lastBlock{
     id
     block_num
   }
 }
```

We can then click the `Execute Query` button (or ^C + enter) and the right side of the GraphQL pane is populated like so:

```
{
  "data": {
    "blocks": [
      {
        "id": "000008f3080d4474105b3b76e0d4a28ac96ad2479bcdc4dcb136f6c5a759c64f",
        "block_num": "2291",
        "timestamp": "2019-02-18T00:59:48.000",
        "input_transactions": []
      }
    ],
    "lastBlock": {
      "id": "00000946ed91ee8931a32cf8f9e1bf2fdbe94dc6bf2805bfd6f80ab0f252f818",
      "block_num": "2374"
    }
  }
}
```

Our query returns information on block `2291` as well as information on the last pulled block, which is `2374`.


