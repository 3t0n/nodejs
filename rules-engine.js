// Used json-rules-engine library
// https://github.com/CacheControl/json-rules-engine
// npm install json-rules-engine

let Engine = require('json-rules-engine').Engine
let Rule = require('json-rules-engine').Rule

// Order data
let facts = {
    country: "russia",
    city: "moscow",
    products:[
        "product 1",
        "product 2"
    ],
    count: 2,
    cost: 17.2
}

// if country == "russia" and
// product cost >= 5
// then use EV warehouse
let rule1 = new Rule(
    {
        conditions: {
            priority: 1,
            any: [
                {
                    priority: 1,
                    all: [
                        {
                            operator: "equal",
                            value: "russia",
                            fact: "country"
                        },
                        {
                            operator: "greaterThanInclusive",
                            value: 20,
                            fact: "cost"
                        }
                    ]
                }
            ]
        },
        priority: 1,
        event: {
            type: "delivery",
            params: {
                message: "EV warehouse!"
            }
        }
    }
);

// if city == "moscow" and
// products contains "product 1" and
// product count <= 5
// then use KetKZ warehouse
let rule2 = new Rule(
    {
        conditions: {
            priority: 1,
            any: [
                {
                    priority: 1,
                    all: [
                        {
                            operator: "equal",
                            value: "moscow",
                            fact: "city"
                        },
                        {
                            operator: "contains",
                            value: "product 1",
                            fact: "products"
                        },
                        {
                            operator: "lessThanInclusive",
                            value: 5,
                            fact: "count"
                        }
                    ]
                }
            ]
        },
        priority: 1,
        event: {
            type: "delivery",
            params: {
                message: "KetKZ warehouse!"
            }
        }
    }
);

// Init rules engine
let engine = new Engine();

// Add to engine 2 rules above
engine.addRule(rule1);
engine.addRule(rule2);

// Run the engine to evaluate
engine
    .run(facts)
    .then(events => { // run() returns events with truthy conditions
        events.map(event => console.log(event.params.message))
    })
