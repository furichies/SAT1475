'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  ArrowLeft,
  AlertTriangle,
  Package,
  Clock,
  Upload,
  FileText
} from 'lucide-react'

const tipos = [
  { value: 'incidencia', label: 'Incidencia', icon: AlertTriangle },
  { value: 'consulta', label: 'Consulta', icon: FileText },
  { value: 'reparacion', label: 'Reparación', icon: Package },
  { value: 'garantia', label: 'Garantía', icon: Clock },
  { value: 'devolucion', label: 'Devolución', icon: Package },
  { value: 'otro', label: 'Otro', icon: AlertTriangle }
]

const prioridades = [
  { value: 'baja', label: 'Baja (24h)', color: 'bg-green-100 text-green-800 border-green-200' },
  { value: 'media', label: 'Media (48h)', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { value: 'alta', label: 'Alta (24h)', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { value: 'urgente', label: 'Urgente (4h)', color: 'bg-red-100 text-red-800 border-red-200' }
]

export default function NuevoTicketPage() {
  const router = useRouter()
  const [tipo, setTipo] = useState('')
  const [prioridad, setPrioridad] = useState('media')
  const [asunto, setAsunto] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [pedidoId, setPedidoId] = useState('')
  const [productoId, setProductoId] = useState('')
  const [numeroSerie, setNumeroSerie] = useState('')
  const [adjuntos, setAdjuntos] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validaciones básicas
    if (!tipo) {
      setError('Debes seleccionar un tipo de ticket')
      setIsLoading(false)
      return
    }

    if (!asunto || asunto.trim().length < 5) {
      setError('El asunto debe tener al menos 5 caracteres')
      setIsLoading(false)
      return
    }

    if (!descripcion || descripcion.trim().length < 10) {
      setError('La descripción debe tener al menos 10 caracteres')
      setIsLoading(false)
      return
    }

    if ((tipo === 'reparacion' || tipo === 'garantia' || tipo === 'devolucion') && !numeroSerie) {
      setError('El número de serie es obligatorio para este tipo de ticket')
      setIsLoading(false)
      return
    }

    try {
      // Mock: Llamada a la API de tickets
      const res = await fetch('/api/sat/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tipo,
          prioridad,
          asunto,
          descripcion,
          pedidoId,
          productoId,
          numeroSerie,
          adjuntos: adjuntos.map(f => f.name)
        })
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Error al crear ticket')
        return
      }

      // Redirigir a la página de tickets
      router.push('/sat')
      router.refresh()
    } catch (err) {
      console.error('Error al crear ticket:', err)
      setError('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setAdjuntos(Array.from(files))
    }
  }

  const necesitaSerie = ['reparacion', 'garantia', 'devolucion'].includes(tipo)
  const necesitaProducto = ['reparacion', 'garantia', 'devolucion', 'incidencia'].includes(tipo)

  return (
    <div className="min-h-screen py-8 bg-muted/30">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/sat" className="inline-flex items-center gap-2 mb-4 text-sm hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver a Mis Tickets
          </Link>
          <h1 className="text-3xl font-bold mb-2">Crear Nuevo Ticket</h1>
          <p className="text-muted-foreground">
            Rellena el formulario para crear un nuevo ticket de soporte técnico.
          </p>
        </div>

        <Tabs defaultValue="ticket" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ticket">Ticket</TabsTrigger>
            <TabsTrigger value="producto" disabled={!necesitaProducto}>
              Producto
            </TabsTrigger>
          </TabsList>

          {/* Tab: Ticket */}
          <TabsContent value="ticket" className="space-y-4">
            <Card>
              <form onSubmit={handleSubmit}>
                <CardHeader>
                  <CardTitle>Información del Ticket</CardTitle>
                  <CardDescription>
                    Proporciona los detalles de tu solicitud de soporte.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                      {error}
                    </div>
                  )}

                  {/* Tipo de ticket */}
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Ticket *</Label>
                    <Select value={tipo} onValueChange={setTipo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipos.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            <div className="flex items-center gap-2">
                              {t.icon && <t.icon className="h-4 w-4" />}
                              {t.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Prioridad */}
                  <div className="space-y-2">
                    <Label htmlFor="prioridad">Prioridad *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {prioridades.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setPrioridad(p.value)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            prioridad === p.value
                              ? p.color + ' border-current'
                              : 'bg-white border-gray-200 hover:border-primary/50'
                          }`}
                        >
                          <div className="text-sm font-medium">{p.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Asunto */}
                  <div className="space-y-2">
                    <Label htmlFor="asunto">Asunto *</Label>
                    <Input
                      id="asunto"
                      type="text"
                      placeholder="Describe brevemente tu incidencia o consulta"
                      value={asunto}
                      onChange={(e) => setAsunto(e.target.value)}
                      required
                      disabled={isLoading}
                      maxLength={100}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {asunto.length}/100 caracteres
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción *</Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Proporciona todos los detalles relevantes para resolver tu ticket..."
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      required
                      disabled={isLoading}
                      rows={6}
                      maxLength={2000}
                    />
                    <div className="text-xs text-muted-foreground text-right">
                      {descripcion.length}/2000 caracteres
                    </div>
                  </div>

                  {/* Número de Serie */}
                  <div className="space-y-2">
                    <Label htmlFor="serie">
                      Número de Serie {necesitaSerie && '*'}
                    </Label>
                    <Input
                      id="serie"
                      type="text"
                      placeholder="SN123456789"
                      value={numeroSerie}
                      onChange={(e) => setNumeroSerie(e.target.value)}
                      disabled={isLoading || !necesitaSerie}
                      maxLength={50}
                    />
                    <p className="text-xs text-muted-foreground">
                      {necesitaSerie
                        ? 'Obligatorio para reparaciones, garantía y devoluciones'
                        : 'Opcional'}
                    </p>
                  </div>

                  {/* Adjuntos */}
                  <div className="space-y-2">
                    <Label htmlFor="adjuntos">Adjuntos</Label>
                    <div className="relative">
                      <Input
                        id="adjuntos"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('adjuntos')?.click()}
                        disabled={isLoading}
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {adjuntos.length > 0
                          ? `${adjuntos.length} archivo(s) seleccionado(s)`
                          : 'Subir archivos (imágenes, PDF, Word)'}
                      </Button>
                    </div>
                    {adjuntos.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {adjuntos.map((file, index) => (
                          <Badge key={index} variant="secondary" className="gap-1">
                            <FileText className="h-3 w-3" />
                            {file.name}
                            <button
                              type="button"
                              onClick={() => setAdjuntos(adjuntos.filter((_, i) => i !== index))}
                              className="ml-1 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-4">
                  <Button variant="outline" onClick={() => router.push('/sat')}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? 'Creando ticket...' : 'Crear Ticket'}
                  </Button>
                </CardFooter>
              </form>
            </Card>

            {/* Información de ayuda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tiempos de Respuesta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className={prioridades.find(p => p.value === 'urgente')?.color + ' mt-1'}>
                    Urgente
                  </Badge>
                  <div className="text-sm">
                    <p className="font-medium">4 horas</p>
                    <p className="text-muted-foreground">Para incidencias críticas que impiden el uso del producto</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Badge className={prioridades.find(p => p.value === 'alta')?.color + ' mt-1'}>
                    Alta
                  </Badge>
                  <div className="text-sm">
                    <p className="font-medium">24 horas</p>
                    <p className="text-muted-foreground">Para reparaciones urgentes o problemas importantes</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Badge className={prioridades.find(p => p.value === 'media')?.color + ' mt-1'}>
                    Media
                  </Badge>
                  <div className="text-sm">
                    <p className="font-medium">48 horas</p>
                    <p className="text-muted-foreground">Para consultas generales o problemas no críticos</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Badge className={prioridades.find(p => p.value === 'baja')?.color + ' mt-1'}>
                    Baja
                  </Badge>
                  <div className="text-sm">
                    <p className="font-medium">24-48 horas</p>
                    <p className="text-muted-foreground">Para consultas que no afectan al funcionamiento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Producto */}
          <TabsContent value="producto" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información del Producto (Opcional)</CardTitle>
                <CardDescription>
                  Asocia este ticket a un pedido o producto específico para agilizar el soporte.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pedidoId">ID de Pedido</Label>
                    <Input
                      id="pedidoId"
                      type="text"
                      placeholder="PED-2023-0001"
                      value={pedidoId}
                      onChange={(e) => setPedidoId(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productoId">ID de Producto</Label>
                    <Input
                      id="productoId"
                      type="text"
                      placeholder="ID del producto"
                      value={productoId}
                      onChange={(e) => setProductoId(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Nota:</strong> Si tienes un pedido activo, puedes asociar el ticket al pedido
                    proporcionando el número de pedido. Esto nos permitirá ver el historial de
                    la compra y proporcionar un mejor soporte.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
