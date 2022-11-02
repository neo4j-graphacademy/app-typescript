MATCH (p:Person)-[:DIRECTED]->(:Movie {title: "Toy Story"})
RETURN p.name AS Director