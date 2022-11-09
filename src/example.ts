// tag::import[]
// Import the driver
import neo4j from 'neo4j-driver'
// end::import[]

// Imports for Streaming API example
import { ManagedTransaction, ResultSummary, Record } from 'neo4j-driver'

// tag::driver[]
// Create a Driver Instance
const driver = neo4j.driver(
  'neo4j+s://dbhash.databases.neo4j.io', // <1>
  neo4j.auth.basic('neo4j', 'letmein!'), // <2>
  { disableLosslessIntegers: true } // <3>
)
// end::driver[]

async function close() {
  // tag::close[]
  await driver.close()
  // end::close[]
}

async function main() {

  // tag::verify[]
  // Verify Connectivity
  await driver.verifyConnectivity()
  // end::verify[]

  // Open a new Session
  const session = driver.session()

  try {
    // tag::oneoff[]
    // Execute a Cypher statement in an auto-commit transaction
    const res = await session.run(
      `
        MATCH (p:Person)-[:DIRECTED]->(:Movie {title: $title})
        RETURN p.name
      `, // <1>
      { title: 'The Matrix' }, // <2>
      { timeout: 3000 } // <3>
    )
    // end::oneoff[]

    res

    // tag::oneoffresult[]
    // Get all Person nodes
    const people = res.records.map(
      (record: Record) => record.get('p')
    )
      // end::oneoffresult[]
  }
  finally {
    // Close the Session
    await session.close()
  }
}

// Temporarily map record shapes to `any` to avoid ts errors
type T = any

async function readTransactionExample() {
  // Open a new Session
  const session = driver.session()

  try {
    const cypher = `
      MATCH (p:Person)-[:DIRECTED]->(:Movie {title: $title})
      RETURN p.name AS Director
    `
    const params = { title: 'Toy Story' }

    // tag::executeread[]
    // Execute cypher in a read transaction
    const res = await session.executeRead(
      (tx: ManagedTransaction) => tx.run<T>(cypher, params)
    )
    // end::executeread[]

    // tag::promise[]
    // res.records is type `Record[]`
    res.records.map((record: Record) => {
      // e.g. record.get('key')
    })
    // end::promise[]


    // Get first record
    const record = res.records[0]

    // tag::keys[]
    console.log(record.get('keys')) // ['p', 'r', 'm']
    console.log(record.has('x')) // false
    // end::keys[]

    // tag::forloop[]
    for (const [ key, value ] of record.entries()) {
      console.log(key);   //e.g. ['p']
      console.log(value); //e.g. a `Node` instance
    }
    // end::forloop[]

    // tag::value[]
    console.log(record.get('p')) // a (:Person) node
    console.log(record.get(0))   // `p` is the first value in the RETURN statement
    // end::value[]

    // tag::toobject[]
    console.log(record.toObject()) // {p: Node, r: Relationship, m: Node}
    // end::toobject[]
  }
  finally {
    // Close the session
    await session.close()
  }
}

async function writeTransactionExample() {
  // Open a new Session
  const session = driver.session()

  try {
    const cypher = `
      MATCH (m:Movie {title: $title})
      CREATE (p:Person {name: $name})
      CREATE (p)-[:ACTED_IN]->(m)
      RETURN p.name AS Name
    `
    const params = { title: 'Toy Story', name: 'Tom Hanks' }

    // tag::executewrite[]
    // Execute cypher in a write transaction
    const res = await session.executeWrite(
      (tx: ManagedTransaction) => tx.run<T>(cypher, params)
    )
    // end::executewrite[]
  }
  finally {
    // Close the session
    await session.close()
  }
}

async function streamingExample() {
  // Open a new Session
  const session = driver.session()

  try {
    const cypher = `
      MATCH (m:Movie {title: $title})
      CREATE (p:Person {name: $name})
      CREATE (p)-[:ACTED_IN]->(m)
      RETURN p.name AS Name
    `
    const params = { title: 'Toy Story', name: 'Tom Hanks' }

    // tag::streaming[]
    // Execute cypher in a write transaction
    session.executeWrite(
      (tx: ManagedTransaction) =>
        tx.run<T>(cypher, params)
          .subscribe({
            onKeys: (keys: string[]) => {
              console.log(keys) // ['p', 'r', 'm']
            },
            onNext: (record: Record) => {
              console.log(record.get('p')) // A Node with label `Person`
            },
            onCompleted: (summary: ResultSummary) => {
              // A `summary` of the query, including execution time and update counters

              // Close the Session
              session.close()
            },
            onError: (error: Error) => {
              console.log(error)
            }
          })
    )
    // end::streaming[]
  }
  finally {
    // Close the session
    await session.close()
  }
}

main()
