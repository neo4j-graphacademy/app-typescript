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
      MATCH (m:Movie {title: "Matrix, The"})
      CREATE (p:Person {name: $name})
      CREATE (p)-[:ACTED_IN]->(m)
      RETURN p
    `
    const params = { name: 'Your Name' }

    // TODO: Execute the `cypher` statement in a write transaction

  }
  finally {
    // Close the session
    await session.close()
  }
}

main()
