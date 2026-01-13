'use client'

import { useState, useEffect } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Ticket } from '@/types/sat'

interface TicketSelectorProps {
    value?: string
    onChange: (value: string) => void
    disabled?: boolean
}

export function TicketSelector({ value, onChange, disabled }: TicketSelectorProps) {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true)
            try {
                // Obtenemos los tickets (idealmente filtraríamos solo los abiertos/en progreso)
                const res = await fetch('/api/sat/tickets')
                if (!res.ok) throw new Error('Error al cargar tickets')
                const data = await res.json()
                // Asegurarnos de que data es un array
                if (Array.isArray(data)) {
                    setTickets(data)
                } else if (data.tickets && Array.isArray(data.tickets)) {
                    setTickets(data.tickets)
                } else {
                    setTickets([])
                }
            } catch (err) {
                console.error(err)
                setError('No se pudieron cargar los tickets')
            } finally {
                setLoading(false)
            }
        }

        fetchTickets()
    }, [])

    return (
        <div className="space-y-2">
            <Select
                value={value}
                onValueChange={onChange}
                disabled={disabled || loading || tickets.length === 0}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                        loading ? "Cargando tickets..." :
                            error ? "Error al cargar" :
                                tickets.length === 0 ? "No hay tickets disponibles" :
                                    "Selecciona un ticket abierto"
                    } />
                </SelectTrigger>
                <SelectContent>
                    {tickets.map((ticket) => (
                        <SelectItem key={ticket.id} value={ticket.id}>
                            <div className="flex items-center gap-2">
                                <span className="font-bold">{ticket.numeroTicket}</span>
                                <span className="text-gray-500 text-sm truncate max-w-[200px]">
                                    - {ticket.asunto}
                                </span>
                                <Badge variant="outline" className="text-xs ml-auto">
                                    {ticket.estado}
                                </Badge>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {value && (
                <p className="text-xs text-gray-500">
                    Ticket seleccionado: {tickets.find(t => t.id === value)?.numeroTicket}
                </p>
            )}
        </div>
    )
}
