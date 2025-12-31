import express from 'express'
import cors from 'cors'
import ZAI from 'z-ai-web-dev-sdk'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const app = express()
const PORT = 3002
let zai: any = null

// Directorio de imágenes generadas
const OUTPUT_DIR = join(process.cwd(), 'generated-images')

// Asegurar que el directorio existe
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Inicializar ZAI
async function initZAI() {
  try {
    zai = await ZAI.create()
    console.log('✓ ZAI SDK inicializado')
  } catch (error) {
    console.error('✗ Error inicializando ZAI:', error)
  }
}

// Prompts para imágenes
const IMAGE_PROMPTS = {
  // Hero Banner
  hero: "Modern technology store interior, bright lighting, sleek electronics displays, professional atmosphere, wide angle, high quality, photorealistic",
  
  // Categorías
  categorias: {
    ordenadores: "Modern laptop computers display, sleek design, technology store, bright lighting, high quality",
    componentes: "Computer components display, CPU, GPU, motherboard, organized shelves, tech store, professional",
    almacenamiento: "SSD and hard drive drives display, storage devices, tech store, clean background",
    ram: "RAM memory sticks display, colorful RGB lighting, tech components, professional photography",
    perifericos: "Computer peripherals display, keyboard, mouse, headphones, clean white background, product photography",
    audio: "High quality headphones display, premium audio equipment, professional photography, clean background"
  },
  
  // Productos destacados
  productos: {
    laptop_gaming: "High-end gaming laptop, RGB lighting, modern design, professional product photography, white background",
    ssd: "NVMe SSD drive, sleek design, tech product photography, clean white background",
    ram: "DDR5 RAM memory sticks, RGB lighting, colorful, professional product shot",
    monitor: "32-inch curved gaming monitor, 4K display, modern design, clean background",
    teclado: "Mechanical gaming keyboard, RGB lighting, professional product photography, clean background",
    raton: "Gaming mouse, ergonomic design, professional product photography, clean background",
    cpu: "Intel Core i9 processor, modern packaging, tech product photography",
    gpu: "NVIDIA RTX graphics card, premium design, professional product photography",
    auriculares: "High-end over-ear headphones, premium build, professional photography",
    hdd: "External hard drive, professional storage device, clean product photography",
    ram_basic: "DDR4 RAM memory, affordable option, product photography"
  }
}

// Generar imagen
async function generateImage(prompt: string, filename: string, size: string = '1024x1024') {
  try {
    if (!zai) {
      throw new Error('ZAI SDK no inicializado')
    }

    const response = await zai.images.generations.create({
      prompt: prompt,
      size: size
    })

    if (!response.data || !response.data[0] || !response.data[0].base64) {
      throw new Error('Respuesta inválida de la API')
    }

    const imageBase64 = response.data[0].base64
    const buffer = Buffer.from(imageBase64, 'base64')
    const outputPath = join(OUTPUT_DIR, filename)
    
    writeFileSync(outputPath, buffer)
    
    console.log(`✓ Imagen generada: ${filename}`)
    return { success: true, path: outputPath, filename }
  } catch (error) {
    console.error(`✗ Error generando ${filename}:`, error)
    return { success: false, error: error.message, filename }
  }
}

// API: Generar imagen específica
app.post('/api/generate', async (req, res) => {
  try {
    const { type, name, size = '1024x1024' } = req.body
    
    if (!type || !name) {
      return res.status(400).json({ error: 'Type y name son requeridos' })
    }

    let prompt = ''
    let filename = ''
    
    // Determinar prompt basado en el tipo
    if (type === 'categoria') {
      prompt = IMAGE_PROMPTS.categorias[name as keyof typeof IMAGE_PROMPTS.categorias] || ''
      filename = `categoria_${name}.png`
    } else if (type === 'producto') {
      prompt = IMAGE_PROMPTS.productos[name as keyof typeof IMAGE_PROMPTS.productos] || ''
      filename = `producto_${name}.png`
    } else if (type === 'hero') {
      prompt = IMAGE_PROMPTS.hero
      filename = 'hero_banner.png'
    } else {
      return res.status(400).json({ error: 'Tipo inválido' })
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Nombre inválido para el tipo' })
    }

    const result = await generateImage(prompt, filename, size)
    
    if (result.success) {
      res.json({
        success: true,
        imageUrl: `/images/${result.filename}`,
        filename: result.filename
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('Error en /api/generate:', error)
    res.status(500).json({ error: 'Error generando imagen' })
  }
})

// API: Generar todas las imágenes iniciales
app.post('/api/generate-all', async (req, res) => {
  try {
    console.log('🎨 Iniciando generación de todas las imágenes...')
    
    const results = {
      hero: null,
      categorias: {},
      productos: {}
    }
    
    // Generar hero banner
    results.hero = await generateImage(IMAGE_PROMPTS.hero, 'hero_banner.png', '1440x720')
    
    // Generar categorías
    for (const [key, prompt] of Object.entries(IMAGE_PROMPTS.categorias)) {
      const result = await generateImage(prompt, `categoria_${key}.png`, '1024x1024')
      if (result.success) {
        results.categorias[key] = `/images/${result.filename}`
      }
    }
    
    // Generar productos
    for (const [key, prompt] of Object.entries(IMAGE_PROMPTS.productos)) {
      const result = await generateImage(prompt, `producto_${key}.png`, '1024x1024')
      if (result.success) {
        results.productos[key] = `/images/${result.filename}`
      }
    }
    
    res.json({
      success: true,
      message: 'Generación de imágenes completada',
      results,
      generatedCount: Object.keys(results.categorias).length + Object.keys(results.productos).length + 1
    })
  } catch (error) {
    console.error('Error en /api/generate-all:', error)
    res.status(500).json({ error: 'Error generando imágenes' })
  }
})

// Servir imágenes estáticas
app.use('/images', express.static(OUTPUT_DIR))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'image-generation', port: PORT })
})

// Iniciar servidor
initZAI().then(() => {
  app.listen(PORT, () => {
    console.log(`🖼️  Servicio de generación de imágenes corriendo en puerto ${PORT}`)
    console.log(`📁 Directorio de salida: ${OUTPUT_DIR}`)
    console.log(`🌐 API: http://localhost:${PORT}/api/generate`)
    console.log(`🖼️  Imágenes: http://localhost:${PORT}/images/`)
  })
}).catch(error => {
  console.error('Error iniciando servidor:', error)
  process.exit(1)
})
