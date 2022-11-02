// tag::import[]
// Import the driver
import neo4j, { ManagedTransaction } from 'neo4j-driver'
// end::import[]

// Import types for TypeScript specific code
import { Integer, Node, QueryResult, Record, Relationship } from 'neo4j-driver'


// tag::driver[]
// Create a Driver Instance
const driver = neo4j.driver(
  'neo4j+s://dbhash.databases.neo4j.io', // <1>
  neo4j.auth.basic('neo4j', 'letmein!'), // <2>
  { disableLosslessIntegers: true } // <3>
)
// end::driver[]

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

    // Get all Person nodes
    const people = res.records.map(
      record => record.get('p')
    )
  }
  finally {
    // Close the Session
    await session.close()
  }
}

async function readTransactionExample() {
  // Open a new Session
  const session = driver.session()

  try {
    const cypher = `
      MATCH (p:Person)-[:DIRECTED]->(:Movie {title: $title})
      RETURN p.name AS Director
    `
    const params = { title: 'Toy Story' }

    // tag::
    // Execute cypher in a read transaction
    const res = await session.executeRead(
      (tx: ManagedTransaction) => tx.run(cypher, params)
    )

    // TODO: Log the Director value of the first record

  }
  finally {
    // Close the session
    await session.close()
  }

}

main()
