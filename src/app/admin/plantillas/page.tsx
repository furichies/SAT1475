
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Printer, FileText, Eye } from 'lucide-react'
import { toast } from 'sonner'
import {
    tiposEquipo,
    tiposMemoria,
    capacidadesMemoria,
    tiposAlmacenamiento,
    capacidadesAlmacenamiento,
    tiposImpresora,
    marcasImpresora
} from '@/lib/service-template-data'
import { generateTemplatePDF, TemplateType } from '@/lib/pdf-service-templates'

export default function PlantillasPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('intervencion')
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)

    // Reset form when template changes
    useEffect(() => {
        setFormData({
            fecha: new Date().toLocaleDateString('es-ES'),
            horaInicio: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            empresa: 'Micro1475' // Default based on prompt? Or customizable? Prompt says "en los imprimibles incluiras la información de la empresa Micro1475" which is done in PDF generator, but for filled data...
        })
        setPdfUrl(null)
    }, [selectedTemplate])

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleDownloadPDF = () => {
        try {
            const doc = generateTemplatePDF(selectedTemplate, formData)
            doc.save(`plantilla_${selectedTemplate}_${new Date().getTime()}.pdf`)
            toast.success('PDF descargado correctamente')
        } catch (error) {
            console.error(error)
            toast.error('Error al descargar el PDF')
        }
    }

    const handlePreviewPDF = () => {
        try {
            const doc = generateTemplatePDF(selectedTemplate, formData)
            const pdfBlob = doc.output('bloburl')
            window.open(pdfBlob, '_blank')
            toast.success('Vista previa generada')
        } catch (error) {
            console.error(error)
            toast.error('Error al generar vista previa')
        }
    }

    return (
        <div className="container mx-auto py-8 max-w-5xl space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Plantillas de Servicio</h1>
                    <p className="text-muted-foreground">
                        Generación de documentos y plantillas imprimibles para servicio técnico.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configuración</CardTitle>
                            <CardDescription>Seleccione el tipo de plantilla</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Tipo de Documento</Label>
                                <Select
                                    value={selectedTemplate}
                                    onValueChange={(val: TemplateType) => setSelectedTemplate(val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="intervencion">Intervención Genérica</SelectItem>
                                        <SelectItem value="reparacion_equipo">Reparación de Equipo</SelectItem>
                                        <SelectItem value="reparacion_impresora">Reparación de Impresora</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Button
                                    className="w-full mb-2"
                                    variant="outline"
                                    onClick={handlePreviewPDF}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    Vista Previa
                                </Button>
                                <Button
                                    className="w-full"
                                    onClick={handleDownloadPDF}
                                >
                                    <Printer className="mr-2 h-4 w-4" />
                                    Descargar PDF
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Instructions / Info */}
                    <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Información</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Complete los campos del formulario para generar el documento PDF.
                            Los campos dejados en blanco aparecerán como líneas para rellenar manualmente.
                        </CardContent>
                    </Card>
                </div>

                {/* Form Panel */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {selectedTemplate === 'intervencion' && 'Datos de Intervención'}
                                {selectedTemplate === 'reparacion_equipo' && 'Datos de Equipo'}
                                {selectedTemplate === 'reparacion_impresora' && 'Datos de Impresora'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Common Fields */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Fecha</Label>
                                    <Input
                                        value={formData.fecha || ''}
                                        onChange={(e) => handleInputChange('fecha', e.target.value)}
                                        placeholder="DD/MM/AAAA"
                                        pattern="^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$"
                                    />
                                </div>
                                {selectedTemplate === 'intervencion' ? (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Hora Inicio</Label>
                                            <Input
                                                value={formData.horaInicio || ''}
                                                onChange={(e) => handleInputChange('horaInicio', e.target.value)}
                                                placeholder="HH:MM"
                                                pattern="^[0-9]{2}:[0-9]{2}$"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Hora Fin</Label>
                                            <Input
                                                value={formData.horaFin || ''}
                                                onChange={(e) => handleInputChange('horaFin', e.target.value)}
                                                placeholder="HH:MM"
                                                pattern="^[0-9]{2}:[0-9]{2}$"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label>Fecha Salida</Label>
                                            <Input
                                                value={formData.fechaSalida || ''}
                                                onChange={(e) => handleInputChange('fechaSalida', e.target.value)}
                                                placeholder="DD/MM/AAAA"
                                                pattern="^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Nº Orden</Label>
                                            <Input
                                                value={formData.numeroOrden || ''}
                                                onChange={(e) => handleInputChange('numeroOrden', e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <Separator />

                            {/* Client Data */}
                            <div className="space-y-4">
                                <h3 className="font-medium">Datos del Cliente</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Cliente / Empresa</Label>
                                        <Input
                                            value={formData.cliente || ''}
                                            onChange={(e) => handleInputChange('cliente', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Teléfono</Label>
                                        <Input
                                            value={formData.telefono || ''}
                                            onChange={(e) => handleInputChange('telefono', e.target.value)}
                                            pattern="^[0-9]{9,15}$"
                                        />
                                    </div>
                                    {selectedTemplate === 'intervencion' && (
                                        <>
                                            <div className="col-span-2 space-y-2">
                                                <Label>Dirección</Label>
                                                <Input
                                                    value={formData.direccion || ''}
                                                    onChange={(e) => handleInputChange('direccion', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Email</Label>
                                                <Input
                                                    value={formData.email || ''}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    type="email"
                                                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Specific Fields */}
                            {selectedTemplate === 'reparacion_equipo' && (
                                <div className="space-y-4">
                                    <h3 className="font-medium">Especificaciones del Equipo</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Tipo de Equipo</Label>
                                            <Select onValueChange={(val) => handleInputChange('tipoEquipo', val)}>
                                                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                                <SelectContent>
                                                    {tiposEquipo.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Memoria RAM</Label>
                                            <div className="flex gap-2">
                                                <Select onValueChange={(val) => handleInputChange('tipoMemoria', val)}>
                                                    <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                                                    <SelectContent>
                                                        {tiposMemoria.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Select onValueChange={(val) => handleInputChange('capacidadMemoria', val)}>
                                                    <SelectTrigger><SelectValue placeholder="Cap." /></SelectTrigger>
                                                    <SelectContent>
                                                        {capacidadesMemoria.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Almacenamiento</Label>
                                            <div className="flex gap-2">
                                                <Select onValueChange={(val) => handleInputChange('tipoAlmacenamiento', val)}>
                                                    <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                                                    <SelectContent>
                                                        {tiposAlmacenamiento.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Select onValueChange={(val) => handleInputChange('capacidadAlmacenamiento', val)}>
                                                    <SelectTrigger><SelectValue placeholder="Cap." /></SelectTrigger>
                                                    <SelectContent>
                                                        {capacidadesAlmacenamiento.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedTemplate === 'reparacion_impresora' && (
                                <div className="space-y-4">
                                    <h3 className="font-medium">Especificaciones de Impresora</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Tipo</Label>
                                            <Select onValueChange={(val) => handleInputChange('tipoImpresora', val)}>
                                                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                                <SelectContent>
                                                    {tiposImpresora.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Marca</Label>
                                            <Select onValueChange={(val) => handleInputChange('marcaImpresora', val)}>
                                                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                                <SelectContent>
                                                    {marcasImpresora.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Modelo</Label>
                                            <Input
                                                value={formData.modelo || ''}
                                                onChange={(e) => handleInputChange('modelo', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Nº Serie</Label>
                                            <Input
                                                value={formData.numeroSerie || ''}
                                                onChange={(e) => handleInputChange('numeroSerie', e.target.value)}
                                                pattern="^[a-zA-Z0-9]{6,20}$"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <Label>Tareas a Realizar</Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {['Limpieza', 'Formateo', 'Instalación SW', 'Cambio Pieza', 'Backup', 'Otros'].map((task) => (
                                        <div key={task} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={task}
                                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={formData.tareas?.includes(task) || false}
                                                onChange={(e) => {
                                                    const currentTasks = formData.tareas || []
                                                    if (e.target.checked) {
                                                        handleInputChange('tareas', [...currentTasks, task])
                                                    } else {
                                                        handleInputChange('tareas', currentTasks.filter((t: string) => t !== task))
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={task} className="font-normal cursor-pointer">{task}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label>Observaciones / Detalles</Label>
                                <Textarea
                                    className="h-32"
                                    placeholder="Detalles adicionales, descripción de la avería, etc."
                                    value={formData.observaciones || ''}
                                    onChange={(e) => handleInputChange('observaciones', e.target.value)}
                                />
                            </div>

                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
