'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShoppingBag, User, MapPin, Phone, Mail } from 'lucide-react'

export default function MiCuentaPage() {
  const [datos, setDatos] = useState({
    nombre: 'Juan',
    apellidos: 'Pérez',
    email: 'juan.perez@email.com',
    telefono: '+34 600 123 456',
    direccion: 'Calle Mayor 123',
    codigoPostal: '28001',
    ciudad: 'Madrid',
    provincia: 'Madrid'
  })
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className="min-h-screen py-8 bg-muted/30">
      <div className="container max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Menú lateral */}
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <User className="h-4 w-4 mr-2" />
              Mis Datos
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Mis Pedidos
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Mis Tickets
            </Button>
            <Button variant="ghost" className="w-full justify-start text-destructive">
              Cerrar Sesión
            </Button>
          </div>

          {/* Columna Derecha: Datos personales */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Datos Personales</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? 'Cancelar' : 'Editar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={datos.nombre}
                      onChange={(e) => !isEditing && setDatos({...datos, nombre: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Apellidos</Label>
                    <Input
                      value={datos.apellidos}
                      onChange={(e) => !isEditing && setDatos({...datos, apellidos: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      value={datos.email}
                      onChange={(e) => !isEditing && setDatos({...datos, email: e.target.value})}
                      disabled
                      type="email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      value={datos.telefono}
                      onChange={(e) => !isEditing && setDatos({...datos, telefono: e.target.value})}
                      disabled={!isEditing}
                      type="tel"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dirección de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Dirección</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      value={datos.direccion}
                      onChange={(e) => !isEditing && setDatos({...datos, direccion: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Código Postal</Label>
                    <Input
                      value={datos.codigoPostal}
                      onChange={(e) => !isEditing && setDatos({...datos, codigoPostal: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ciudad</Label>
                    <Input
                      value={datos.ciudad}
                      onChange={(e) => !isEditing && setDatos({...datos, ciudad: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Provincia</Label>
                    <Input
                      value={datos.provincia}
                      onChange={(e) => !isEditing && setDatos({...datos, provincia: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {isEditing && (
              <div className="flex gap-4">
                <Button className="flex-1">Guardar Cambios</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
