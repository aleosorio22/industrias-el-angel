export default function ClientUserInfo({ client }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-text mb-4">Usuario Asociado</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-text-light">Email</p>
          <p className="text-text">{client.usuario_email}</p>
        </div>
        <div>
          <p className="text-sm text-text-light">Nombre</p>
          <p className="text-text">{client.usuario_nombre} {client.usuario_apellido}</p>
        </div>
        <div>
          <p className="text-sm text-text-light">Teléfono</p>
          <p className="text-text">{client.usuario_telefono}</p>
        </div>
      </div>
    </div>
  )
}