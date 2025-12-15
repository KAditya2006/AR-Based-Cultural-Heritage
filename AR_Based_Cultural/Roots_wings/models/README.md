# 3D Models Directory

This directory contains 3D models for the AR Cultural Heritage Platform.

## Required 3D Models

### Heritage Site Models (GLB Format)
- `taj-mahal.glb` - 3D model of Taj Mahal
- `konark-temple.glb` - 3D model of Konark Sun Temple
- `khajuraho.glb` - 3D model of Khajuraho Temples
- `ajanta-caves.glb` - 3D model of Ajanta Caves
- `sanchi-stupa.glb` - 3D model of Sanchi Stupa

## Model Specifications

### Technical Requirements
- **Format**: GLB (Binary glTF)
- **Maximum File Size**: 10MB per model
- **Polygon Count**: 10,000-50,000 triangles (optimized for web)
- **Textures**: 1024x1024px or 2048x2048px maximum
- **Materials**: PBR (Physically Based Rendering) materials preferred

### Quality Guidelines
- **Historical Accuracy**: Models should be historically accurate
- **Detail Level**: Balance between detail and performance
- **Optimization**: Use texture atlases and LOD (Level of Detail) when possible
- **Lighting**: Baked lighting for better performance

### Model Structure
```
model.glb
├── Geometry (Meshes)
├── Materials (PBR)
├── Textures
│   ├── Diffuse/Albedo
│   ├── Normal Maps
│   ├── Roughness/Metallic
│   └── Ambient Occlusion
└── Animations (if applicable)
```

## Creating 3D Models

### Recommended Software
- **Blender** (Free, open-source)
- **Autodesk Maya** (Professional)
- **3ds Max** (Professional)
- **SketchUp** (Architectural modeling)

### Workflow
1. **Reference Gathering**: Collect historical photos and architectural drawings
2. **Base Modeling**: Create the basic structure
3. **Detail Addition**: Add architectural details and decorations
4. **UV Mapping**: Create efficient UV layouts
5. **Texturing**: Apply historically accurate materials
6. **Optimization**: Reduce polygon count while maintaining quality
7. **Export**: Export as GLB format for web compatibility

### Export Settings (Blender)
```
Format: glTF 2.0 (.glb)
Include:
- Limit to Selected Objects
- Visible Objects
- Renderable Objects
- Active Collection

Transform:
- +Y Up

Geometry:
- Apply Modifiers
- UVs
- Normals
- Vertex Colors
- Materials: Export

Animation:
- Use Current Frame
```

## Performance Considerations

### Optimization Techniques
- **Texture Compression**: Use compressed texture formats
- **Mesh Optimization**: Remove unnecessary vertices and faces
- **Material Consolidation**: Combine similar materials
- **LOD Implementation**: Multiple detail levels for different distances

### Loading Strategies
- **Progressive Loading**: Load base model first, then details
- **Caching**: Cache models locally for offline use
- **Compression**: Use Draco compression for geometry

## Licensing & Attribution

### Model Sources
- **Archaeological Survey of India**: Official architectural data
- **3D Scanning**: Photogrammetry and LiDAR data
- **Historical Reconstructions**: Based on archaeological evidence
- **Community Contributions**: Open-source heritage models

### Usage Rights
- Ensure proper licensing for all 3D models
- Attribute original creators and sources
- Respect copyright and cultural heritage laws
- Follow UNESCO guidelines for digital heritage preservation

## Quality Assurance

### Testing Checklist
- [ ] Model loads correctly in A-Frame
- [ ] Textures display properly
- [ ] Performance is acceptable on mobile devices
- [ ] Historical accuracy verified
- [ ] File size is optimized
- [ ] No missing materials or textures

### Validation Tools
- **glTF Validator**: Validate GLB files
- **A-Frame Inspector**: Test in AR environment
- **Performance Monitor**: Check frame rates and memory usage

## Placeholder Models

For development purposes, you can use:
- Simple geometric shapes
- Low-poly placeholder models
- Free models from Sketchfab (with proper licensing)
- Procedurally generated models

## Future Enhancements

### Planned Features
- **Interactive Elements**: Clickable hotspots on models
- **Animation Support**: Animated reconstructions
- **Seasonal Variations**: Different time periods and conditions
- **Damage Visualization**: Show historical damage and restoration

### Advanced Techniques
- **Procedural Generation**: AI-assisted model creation
- **Real-time Reconstruction**: Dynamic model updates
- **Multi-resolution**: Adaptive quality based on device capabilities
- **Collaborative Modeling**: Community-contributed improvements

## Support

For questions about 3D models or technical issues:
- Email: models@rootsandwings.in
- Documentation: Check the main README.md
- Community: Join our Discord server for discussions

---

**Note**: This platform is designed to preserve and showcase India's cultural heritage. All models should be created with respect for historical accuracy and cultural sensitivity.
