import dotenv from 'dotenv'; 
dotenv.config({ path: '.env' });

// Import the driver
import neo4j from 'neo4j-driver'
import { getNeo4jCredentials } from '../utils'

// Neo4j Credentials
const {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD
} = getNeo4jCredentials()

async function main() {
  // Create a Driver Instance
  const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
  )

  // Open a new Session
  const session = driver.session()

  try {
    // Create the Cypher statement
    // tag::cypher[]
    const cypher = `
      MATCH (m:Movie {title: "Matrix, The"})
      CREATE (p:Person {name: $name})
      CREATE (p)-[:ACTED_IN]->(m)
      RETURN p
    `
    // end::cypher[]

    // Define the parameters
    // tag::params[]
    const params = { name: 'Your Name' }
    // end::params[]

    // Execute the `cypher` statement in a write transaction
    // tag::execute[]
    const res = await session.executeWrite(
      tx => tx.run(cypher, params)
    )
    // end::execute[]

    // tag::log_result[]
    console.log(res.records[0].get('p'))
    // end::log_result[]
  }
  finally {
    // Close the session
    await session.close()
  }
}

main()
