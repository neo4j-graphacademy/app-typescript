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
    const cypher = `
      MATCH (m:Movie {title: "The Matrix"})
      CREATE (p:Person {name: "Some Person"})
      CREATE (p)-[:ACTED_IN]->(m)
      RETURN p
    `
    const params = { name: 'Your Name' }

    // Execute the `cypher` statement in a write transaction
    const res = await session.executeRead(
      tx => tx.run(cypher, params)
    )

    console.log(res.records[0].get('p'))
  }
  finally {
    // Close the session
    await session.close()
  }
}

main()
