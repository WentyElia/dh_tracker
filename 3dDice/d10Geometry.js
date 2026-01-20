// Pentagonal Trapezohedron (D10) Geometry
// Based on: https://aqandrew.com/blog/10-sided-die-react/

function createD10Geometry(radius = 1) {
    const sides = 10;
    
    // Create vertices array
    // Start with top and bottom vertices
    const vertices = [
        0, 0, 1,      // vertex 0: top
        0, 0, -1,     // vertex 1: bottom
    ];
    
    // Create zigzag decagon for middle vertices
    // Going counterclockwise from the left (-1, 0)
    for (let i = 0; i < sides; i++) {
        const b = (i * Math.PI * 2) / sides;
        const x = -Math.cos(b);
        const y = -Math.sin(b);
        const z = 0.105 * (i % 2 ? 1 : -1); // Alternating height
        vertices.push(x, y, z);
    }
    
    // Scale vertices by radius
    for (let i = 0; i < vertices.length; i++) {
        vertices[i] *= radius;
    }
    
    // Create faces array (triangular faces)
    // Top 10 faces (connecting to top vertex 0)
    const faces = [
        0, 2, 3,
        0, 3, 4,
        0, 4, 5,
        0, 5, 6,
        0, 6, 7,
        0, 7, 8,
        0, 8, 9,
        0, 9, 10,
        0, 10, 11,
        0, 11, 2,
        // Bottom 10 faces (connecting to bottom vertex 1)
        1, 3, 2,
        1, 4, 3,
        1, 5, 4,
        1, 6, 5,
        1, 7, 6,
        1, 8, 7,
        1, 9, 8,
        1, 10, 9,
        1, 11, 10,
        1, 2, 11,
    ];
    
    return new THREE.PolyhedronGeometry(vertices, faces, radius, 0);
}
