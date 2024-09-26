MATCH (p:Person)-[:DIRECTED]->(:Movie {title: $title})
RETURN p.name AS Director
