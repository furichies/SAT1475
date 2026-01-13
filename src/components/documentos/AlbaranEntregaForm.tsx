'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, CalendarIcon, CheckCircle2 } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { MetadatosAlbaranEntrega } from '@/types/documentos'

interface AlbaranEntregaFormProps {
    ticketId?: string
    initialValues?: MetadatosAlbaranEntrega
    readOnly?: boolean
    onSubmit: (metadatos: MetadatosAlbaranEntrega) => void
    onCancel: () => void
    isSubmitting?: boolean
}

export function AlbaranEntregaForm({
    ticketId = '',
    initialValues,
    readOnly = false,
    onSubmit,
    onCancel,
    isSubmitting = false
}: AlbaranEntregaFormProps) {
    // Datos del Equipo
    const [equipo, setEquipo] = useState({
        tipo: initialValues?.equipoEntregado?.tipo || '',
        marca: initialValues?.equipoEntregado?.marca || '',
        modelo: initialValues?.equipoEntregado?.modelo || '',
        numeroSerie: initialValues?.equipoEntregado?.numeroSerie || '',
    })

    // Reparaciones y Repuestos
    const [reparaciones, setReparaciones] = useState<string[]>(initialValues?.reparacionesRealizadas || [''])
    const [repuestos, setRepuestos] = useState(initialValues?.repuestosUtilizados || [])

    // Garantía
    const [garantia, setGarantia] = useState({
        repuestos: initialValues?.garantiaProporcionada?.repuestos || 6,
        manoObra: initialValues?.garantiaProporcionada?.manoObra || 6,
        condiciones: initialValues?.garantiaProporcionada?.condiciones || 'La garantía cubre defectos de los componentes sustituidos y de la mano de obra realizada.',
    })

    // Estado Entrega
    const [verificado, setVerificado] = useState<boolean>(initialValues?.estadoEntrega?.funcionamientoVerificado ?? true)
    const [pruebas, setPruebas] = useState<string[]>(initialValues?.estadoEntrega?.pruebasRealizadas || ['Encendido correcto', 'Carga de batería', 'Prueba de pantalla'])
    const [observaciones, setObservaciones] = useState(initialValues?.estadoEntrega?.observaciones || '')

    // Pago
    const [pago, setPago] = useState({
        metodo: initialValues?.pagoRecibido?.metodo || 'tarjeta',
        monto: initialValues?.pagoRecibido?.monto || 0,
        referencia: initialValues?.pagoRecibido?.referencia || '',
    })

    // Entrega
    const [fechaEntrega, setFechaEntrega] = useState<Date>(initialValues?.fechaEntrega ? new Date(initialValues.fechaEntrega) : new Date())
    const [clienteRecibe, setClienteRecibe] = useState({
        nombre: initialValues?.clienteRecibe?.nombre || '',
        identificacion: initialValues?.clienteRecibe?.identificacion || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const metadatos: MetadatosAlbaranEntrega = {
            ticketId,
            numeroTicket: initialValues?.numeroTicket || '', // Se suele asignar en backend o por prop
            equipoEntregado: equipo,
            reparacionesRealizadas: reparaciones.filter(r => r.trim() !== ''),
            repuestosUtilizados: repuestos,
            garantiaProporcionada: garantia,
            estadoEntrega: {
                funcionamientoVerificado: verificado,
                pruebasRealizadas: pruebas,
                observaciones
            },
            pagoRecibido: pago,
            fechaEntrega,
            clienteRecibe
        }

        onSubmit(metadatos)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Albarán de Entrega / Certificado de Reparación</CardTitle>
                    <CardDescription>Documento final de entrega del equipo reparado al cliente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Información del Equipo */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Datos del Equipo Entregado</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Input value={equipo.tipo} onChange={e => setEquipo({ ...equipo, tipo: e.target.value })} disabled={readOnly} placeholder="Smartphone, Laptop..." required />
                            </div>
                            <div className="space-y-2">
                                <Label>Marca</Label>
                                <Input value={equipo.marca} onChange={e => setEquipo({ ...equipo, marca: e.target.value })} disabled={readOnly} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Modelo</Label>
                                <Input value={equipo.modelo} onChange={e => setEquipo({ ...equipo, modelo: e.target.value })} disabled={readOnly} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Nº Serie / IMEI</Label>
                                <Input value={equipo.numeroSerie} onChange={e => setEquipo({ ...equipo, numeroSerie: e.target.value })} disabled={readOnly} />
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* Trabajo Realizado */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Reparaciones Realizadas</h3>
                            {!readOnly && (
                                <Button type="button" variant="outline" size="sm" onClick={() => setReparaciones([...reparaciones, ''])}>
                                    <Plus className="h-4 w-4 mr-1" /> Añadir
                                </Button>
                            )}
                        </div>
                        <div className="space-y-2">
                            {reparaciones.map((rep, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Input
                                        value={rep}
                                        onChange={e => {
                                            const newR = [...reparaciones]
                                            newR[idx] = e.target.value
                                            setReparaciones(newR)
                                        }}
                                        disabled={readOnly}
                                        placeholder="Descripción del trabajo..."
                                    />
                                    {!readOnly && idx > 0 && (
                                        <Button type="button" variant="ghost" size="icon" onClick={() => setReparaciones(reparaciones.filter((_, i) => i !== idx))}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Repuestos */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Repuestos Sustituidos</h3>
                            {!readOnly && (
                                <Button type="button" variant="outline" size="sm" onClick={() => setRepuestos([...repuestos, { codigo: '', descripcion: '', cantidad: 1, garantiaMeses: 6 }])}>
                                    <Plus className="h-4 w-4 mr-1" /> Añadir Repuesto
                                </Button>
                            )}
                        </div>
                        {repuestos.length > 0 ? (
                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Código</th>
                                            <th className="px-4 py-2 text-left">Descripción</th>
                                            <th className="px-4 py-2 text-center w-20">Cant.</th>
                                            <th className="px-4 py-2 text-center w-32">Garantía (meses)</th>
                                            {!readOnly && <th className="px-4 py-2 w-10"></th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {repuestos.map((r, idx) => (
                                            <tr key={idx} className="border-b last:border-0">
                                                <td className="p-2"><Input className="h-8" value={r.codigo} onChange={e => {
                                                    const n = [...repuestos]; n[idx].codigo = e.target.value; setRepuestos(n)
                                                }} disabled={readOnly} /></td>
                                                <td className="p-2"><Input className="h-8" value={r.descripcion} onChange={e => {
                                                    const n = [...repuestos]; n[idx].descripcion = e.target.value; setRepuestos(n)
                                                }} disabled={readOnly} /></td>
                                                <td className="p-2"><Input type="number" className="h-8 text-center" value={r.cantidad} onChange={e => {
                                                    const n = [...repuestos]; n[idx].cantidad = parseInt(e.target.value); setRepuestos(n)
                                                }} disabled={readOnly} /></td>
                                                <td className="p-2"><Input type="number" className="h-8 text-center" value={r.garantiaMeses} onChange={e => {
                                                    const n = [...repuestos]; n[idx].garantiaMeses = parseInt(e.target.value); setRepuestos(n)
                                                }} disabled={readOnly} /></td>
                                                {!readOnly && (
                                                    <td className="p-2">
                                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setRepuestos(repuestos.filter((_, i) => i !== idx))}>
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400 italic text-center py-4 bg-gray-50 rounded-lg">No se han registrado repuestos específicos.</p>
                        )}
                    </div>

                    <hr />

                    {/* Estado de Entrega */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Verificación de Calidad</h3>
                            <div className="flex items-center space-x-2 bg-green-50 p-3 rounded-lg border border-green-100">
                                <Checkbox id="verificado" checked={verificado} onCheckedChange={c => setVerificado(!!c)} disabled={readOnly} />
                                <Label htmlFor="verificado" className="text-green-800 font-medium">Funcionamiento Correcto Verificado</Label>
                            </div>
                            <div className="space-y-2">
                                <Label>Observaciones de Entrega</Label>
                                <Textarea
                                    placeholder="Detalles sobre el estado final, recomendaciones al cliente..."
                                    value={observaciones}
                                    onChange={e => setObservaciones(e.target.value)}
                                    disabled={readOnly}
                                    rows={3}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Garantía Otorgada</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Meses Repuestos</Label>
                                    <Input type="number" value={garantia.repuestos} onChange={e => setGarantia({ ...garantia, repuestos: parseInt(e.target.value) })} disabled={readOnly} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Meses Mano Obra</Label>
                                    <Input type="number" value={garantia.manoObra} onChange={e => setGarantia({ ...garantia, manoObra: parseInt(e.target.value) })} disabled={readOnly} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Condiciones Especiales</Label>
                                <Textarea value={garantia.condiciones} onChange={e => setGarantia({ ...garantia, condiciones: e.target.value })} disabled={readOnly} rows={2} />
                            </div>
                        </div>
                    </div>

                    <hr />

                    {/* Pago y Recepción */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Liquidación y Pago</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Método</Label>
                                    <Select value={pago.metodo} onValueChange={(v: any) => setPago({ ...pago, metodo: v })} disabled={readOnly}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="efectivo">Efectivo</SelectItem>
                                            <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                            <SelectItem value="transferencia">Transferencia</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Monto Total (€)</Label>
                                    <Input type="number" value={pago.monto} onChange={e => setPago({ ...pago, monto: parseFloat(e.target.value) })} disabled={readOnly} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Recepción Cliente</h3>
                            <div className="space-y-2">
                                <Label>Nombre de quien recibe</Label>
                                <Input value={clienteRecibe.nombre} onChange={e => setClienteRecibe({ ...clienteRecibe, nombre: e.target.value })} disabled={readOnly} required />
                            </div>
                            <div className="space-y-2">
                                <Label>DNI / Identificación</Label>
                                <Input value={clienteRecibe.identificacion} onChange={e => setClienteRecibe({ ...clienteRecibe, identificacion: e.target.value })} disabled={readOnly} required />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                {!readOnly && (
                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Completar Entrega'}
                    </Button>
                )}
            </div>
        </form>
    )
}
