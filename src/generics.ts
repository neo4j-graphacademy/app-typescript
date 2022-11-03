// Import the driver
import neo4j from 'neo4j-driver'
// tag::import[]
import { Integer, Node, Relationship } from 'neo4j-driver'
// end::import[]

// tag::person[]
interface PersonProperties {
  tmdbId: string;
  name: string;
  born: number;
}

type Person = Node<Integer, PersonProperties>
// end::person[]

// tag::movie[]
type Movie = Node<Integer, {
  tmdbId: string;
  title: string;
  rating: number;
}>
// end::movie[]

// tag::actedin[]
type ActedIn = Relationship<Integer, {
  roles: string[];
}>
// end::actedin[]

// tag::record[]
interface PersonActedInMovie {
  p: Person;
  r: ActedIn;
  m: Movie;
}
// end::record[]

// Create a Driver Instance
const driver = neo4j.driver(
  'bolt://3.239.245.197:7687',
  neo4j.auth.basic('neo4j', 'colleges-implantations-airspeed'),
  { maxConnectionPoolSize: 1000 }
)

async function before() {
  // Open a new Session
  const session = driver.session()

  try {
    // tag::before[]
    // Execute a Cypher statement in a Read Transaction
    const res = await session.executeRead(tx =>
      tx.run(`
      MATCH (p:Person)-[r:ACTED_IN]->(m:Movie {title: $title})
      RETURN p, r, m
  `, { title: 'Pulp Fiction' })
    )

    const people = res.records.map(
      // No type guarding or suggestions on record keys
      record => record.get('p')
    )

    const names = people.map(
      // No checks or suggestions on property keys
      person => person.properties.foo
    )
    // end::before[]

    console.log(names)
  }
  finally {
    // Close the Session
    await session.close()
  }
}

async function after() {
  // Open a new Session
  const session = driver.session()

  try {
    // tag::after[]
    // Execute a Cypher statement in a Read Transaction
    const res = await session.executeRead(tx =>
      tx.run<PersonActedInMovie>(`
        MATCH (p:Person)-[r:ACTED_IN]->(m:Movie {title: $title})
        RETURN p, r, m
      `,
      { title: 'Pulp Fiction' })
    )
    // end::after[]

    const people = res.records.map(
      record => record.get('p')
    )

    const names = people.map(
      person => person.properties.name
    )

    console.log(names)

  }
  finally {
    // Close the Session
    await session.close()
  }
}
