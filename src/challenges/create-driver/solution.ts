// tag::import[]
// Import the driver
import neo4j, { Integer, Node, Relationship } from 'neo4j-driver'
import { getNeo4jCredentials } from '../utils'
// end::import[]

// tag::credentials[]
// Neo4j Credentials
const {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD
} = getNeo4jCredentials()
// end::credentials[]

async function main() {
  // tag::solution[]
  // Create a Driver Instance
  const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
  )

  // Open a new Session
  const session = driver.session()

  try {
    // Run a Cypher statement
    const res = await session.run(`
      MATCH (p:Person)-[:DIRECTED]->(:Movie {title: $title})
      RETURN p.name AS Director
    `, { title: 'Toy Story' })

    // Log the Director value of the first record
    console.log(res.records[0].get('Director'))
  }
  finally {
    // Close the session
    await session.close()
  }
  // end::solution[]
}

main()
